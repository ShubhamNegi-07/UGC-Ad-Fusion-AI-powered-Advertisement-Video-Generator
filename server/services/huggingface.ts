import axios from 'axios';

export function getHfToken(): string | undefined {
    return process.env.HF_TOKEN?.trim() || process.env.HUGGINGFACE_API_KEY?.trim() || undefined;
}

export function hasHfToken(): boolean {
    return Boolean(getHfToken());
}

const IMAGE_ROUTES = [
    {
        name: process.env.HF_IMAGE_MODEL?.trim() || 'black-forest-labs/FLUX.1-Kontext-dev',
        url: 'https://router.huggingface.co/fal-ai/fal-ai/flux-kontext/dev?_subdomain=queue',
    },
    {
        name: 'Qwen/Qwen-Image-Edit-2509',
        url: 'https://router.huggingface.co/fal-ai/fal-ai/qwen-image-edit-2509?_subdomain=queue',
    },
    {
        name: 'black-forest-labs/FLUX.2-klein-9B',
        url: 'https://router.huggingface.co/fal-ai/fal-ai/flux-2/klein/9b/edit?_subdomain=queue',
    },
];

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function falResolution(aspectRatio?: string): string {
    if (aspectRatio === '16:9' || aspectRatio === '1:1' || aspectRatio === '9:16') {
        return aspectRatio;
    }
    return 'match_input';
}

function authHeaders(token: string) {
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

function readError(data: unknown): string {
    if (!data) return '';
    if (typeof data === 'object') {
        const json = data as { error?: string | { message?: string }; message?: string; detail?: string };
        if (typeof json.error === 'string') return json.error;
        if (json.error && typeof json.error === 'object') return String(json.error.message || JSON.stringify(json.error));
        return String(json.message || json.detail || JSON.stringify(data)).slice(0, 400);
    }
    return String(data).slice(0, 400);
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60_000,
        maxContentLength: Infinity,
        validateStatus: () => true,
    });
    if (response.status >= 400) {
        throw new Error(`Could not download generated image (${response.status})`);
    }
    const header = String(response.headers['content-type'] || '');
    const mimeType = header.includes('png') ? 'image/png' : header.includes('webp') ? 'image/webp' : 'image/jpeg';
    return { buffer: Buffer.from(response.data), mimeType };
}

function rewriteFalUrl(url: string): string {
    try {
        const parsed = new URL(url);
        if (parsed.hostname === 'router.huggingface.co') {
            return url;
        }
        if (parsed.hostname.includes('fal.run') || parsed.hostname.includes('fal.ai')) {
            const path = parsed.pathname.replace(/^\//, '');
            return `https://router.huggingface.co/fal-ai/${path}?_subdomain=queue`;
        }
    } catch {
        // keep original
    }
    return url;
}

function isInferencePermissionError(status: number, message: string): boolean {
    return /sufficient permissions|Inference Providers/i.test(message) && status === 403;
}

function extractImageUrl(payload: unknown): string | null {
    const data = payload as {
        images?: Array<{ url?: string }>;
        image?: { url?: string };
        output?: { images?: Array<{ url?: string }>; image?: string };
        url?: string;
    };
    return (
        data?.images?.[0]?.url ||
        data?.image?.url ||
        data?.output?.images?.[0]?.url ||
        (typeof data?.output?.image === 'string' ? data.output.image : null) ||
        (typeof data?.url === 'string' && data.url.startsWith('http') ? data.url : null) ||
        null
    );
}

async function pollFalQueue(options: {
    token: string;
    submitted: Record<string, unknown>;
}): Promise<{ buffer: Buffer; mimeType: string }> {
    const immediate = extractImageUrl(options.submitted);
    if (immediate) {
        return downloadImage(immediate);
    }

    const statusUrl = rewriteFalUrl(String(options.submitted.status_url || ''));
    const responseUrl = rewriteFalUrl(String(options.submitted.response_url || ''));
    if (!statusUrl || !responseUrl) {
        throw new Error(readError(options.submitted) || 'Hugging Face queue did not return a result URL');
    }

    const started = Date.now();
    while (Date.now() - started < 180_000) {
        const statusRes = await axios.get(statusUrl, {
            headers: authHeaders(options.token),
            timeout: 30_000,
            validateStatus: () => true,
        });
        const status = String((statusRes.data as { status?: string })?.status || '');
        const statusMessage = readError(statusRes.data);
        if (isInferencePermissionError(statusRes.status, statusMessage)) {
            throw new Error(
                'Hugging Face token needs Inference permission. Create a Read token at https://huggingface.co/settings/tokens',
            );
        }
        if (status === 'COMPLETED' || status === 'OK') {
            const resultRes = await axios.get(responseUrl, {
                headers: authHeaders(options.token),
                timeout: 60_000,
                validateStatus: () => true,
            });
            const imageUrl = extractImageUrl(resultRes.data);
            if (!imageUrl) {
                throw new Error(readError(resultRes.data) || 'Hugging Face returned no image');
            }
            return downloadImage(imageUrl);
        }
        if (status === 'FAILED' || status === 'ERROR' || statusRes.status >= 400) {
            throw new Error(readError(statusRes.data) || `Hugging Face job failed (${status || statusRes.status})`);
        }
        await sleep(2500);
    }

    throw new Error('Hugging Face image generation timed out');
}

async function requestImageEdit(options: {
    token: string;
    routeUrl: string;
    imageUrl: string;
    prompt: string;
    aspectRatio?: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
    const response = await axios.post(
        options.routeUrl,
        {
            prompt: options.prompt,
            image_url: options.imageUrl,
            image_urls: [options.imageUrl],
            num_inference_steps: 28,
            guidance_scale: 2.5,
            num_images: 1,
            output_format: 'jpeg',
            resolution_mode: falResolution(options.aspectRatio),
        },
        {
            headers: authHeaders(options.token),
            timeout: 60_000,
            validateStatus: () => true,
        },
    );

    const submitMessage = readError(response.data);
    if (isInferencePermissionError(response.status, submitMessage)) {
        throw new Error(
            'Hugging Face token needs Inference permission. Create a Read token at https://huggingface.co/settings/tokens',
        );
    }
    if (response.status >= 400) {
        console.warn('[huggingface] submit failed', response.status, submitMessage);
        throw new Error(submitMessage || `Hugging Face image edit failed (${response.status})`);
    }

    return pollFalQueue({ token: options.token, submitted: response.data as Record<string, unknown> });
}

export async function generateCombinedImageWithHf(options: {
    modelImageUrl: string;
    prompt: string;
    aspectRatio?: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
    const token = getHfToken();
    if (!token) {
        throw new Error(
            'HF_TOKEN is missing. Create a free token at https://huggingface.co/settings/tokens (no billing) and add it to server/.env',
        );
    }

    const seen = new Set<string>();
    let lastError: Error | null = null;

    for (const route of IMAGE_ROUTES) {
        if (seen.has(route.url)) continue;
        seen.add(route.url);
        try {
            return await requestImageEdit({
                token,
                routeUrl: route.url,
                imageUrl: options.modelImageUrl,
                prompt: options.prompt,
                aspectRatio: options.aspectRatio,
            });
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.warn(`[huggingface] image model ${route.name} failed:`, lastError.message);
            if (/Inference permission|sufficient permissions/i.test(lastError.message)) {
                throw lastError;
            }
        }
    }

    throw lastError || new Error('Hugging Face image generation failed');
}
