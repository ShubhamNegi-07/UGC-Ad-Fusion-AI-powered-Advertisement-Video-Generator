import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

export function getGeminiKey(): string | undefined {
    return process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim() || undefined;
}

export function hasGeminiKey(): boolean {
    return Boolean(getGeminiKey());
}

function getClient() {
    const apiKey = getGeminiKey();
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing. Create a free key at https://aistudio.google.com/apikey and add it to server/.env');
    }
    return new GoogleGenAI({ apiKey });
}

async function fetchImageAsInline(url: string): Promise<{ mimeType: string; data: string }> {
    if (url.startsWith('data:')) {
        const match = url.match(/^data:([^;]+);base64,(.+)$/);
        if (!match?.[1] || !match[2]) {
            throw new Error('Invalid reference image data');
        }
        return { mimeType: match[1], data: match[2] };
    }
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 45_000,
        maxContentLength: 12 * 1024 * 1024,
        validateStatus: () => true,
    });
    if (response.status >= 400) {
        throw new Error(`Could not fetch reference image (${response.status})`);
    }
    const header = String(response.headers['content-type'] || '');
    const mimeType = header.startsWith('image/')
        ? header.split(';')[0]!.trim()
        : 'image/jpeg';
    return {
        mimeType,
        data: Buffer.from(response.data).toString('base64'),
    };
}

function geminiAspect(aspectRatio?: string): string {
    if (aspectRatio === '16:9') return '16:9';
    if (aspectRatio === '1:1') return '1:1';
    return '9:16';
}

const IMAGE_MODELS = [
    process.env.GEMINI_IMAGE_MODEL?.trim(),
    'gemini-3.8-flash',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite-image',
    'gemini-nano-banana-2.1',
    'gemini-3.1-flash-image',
].filter(Boolean) as string[];

function isQuotaExhausted(message: string): boolean {
    return /RESOURCE_EXHAUSTED|"code":429|quota exceeded|limit: 0/i.test(message);
}

const VISION_MODELS = [
    process.env.GEMINI_VISION_MODEL?.trim(),
    'gemini-3.8-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
].filter(Boolean) as string[];

export async function describeReferencesWithGemini(options: {
    productImageUrl: string;
    modelImageUrl: string;
    prompt: string;
}): Promise<string | null> {
    if (!hasGeminiKey()) return null;

    const [product, model] = await Promise.all([
        fetchImageAsInline(options.productImageUrl),
        fetchImageAsInline(options.modelImageUrl),
    ]);

    const instruction = [
        'Look at both photos. IMAGE 1 is the product. IMAGE 2 is the person.',
        'Write one dense photorealistic advertising prompt, 80-140 words, no markdown.',
        'Describe the exact person (gender, age look, face, hair, skin, clothing) holding the exact product (type, color, brand text, shape) in both hands.',
        'The product must stay large and fully visible. Do not invent a different face or product.',
        'Keep this scene direction:',
        options.prompt,
    ].join(' ');

    const ai = getClient();
    for (const modelName of Array.from(new Set(VISION_MODELS))) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: 'IMAGE 1 — PRODUCT:' },
                            { inlineData: { mimeType: product.mimeType, data: product.data } },
                            { text: 'IMAGE 2 — PERSON:' },
                            { inlineData: { mimeType: model.mimeType, data: model.data } },
                            { text: instruction },
                        ],
                    },
                ],
            });
            const partText = (response.candidates?.[0]?.content?.parts ?? [])
                .map((part) => ('text' in part && part.text ? part.text : ''))
                .join(' ');
            const text = String(response.text || partText || '').replace(/\s+/g, ' ').trim();
            if (text.length > 60) {
                return text.slice(0, 1200);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[gemini] vision model ${modelName} failed:`, message);
            if (isQuotaExhausted(message)) {
                return null;
            }
        }
    }

    return null;
}

export async function generateCombinedImageWithGemini(options: {
    productImageUrl: string;
    modelImageUrl: string;
    prompt: string;
    aspectRatio?: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
    const [product, model] = await Promise.all([
        fetchImageAsInline(options.productImageUrl),
        fetchImageAsInline(options.modelImageUrl),
    ]);

    const prompt = [
        'Create one photorealistic advertisement still from the two reference photos.',
        'The generated photo MUST show the exact person from IMAGE 2 holding the exact product from IMAGE 1.',
        'The product must be large, fully visible, and in the person hands — never a face-only crop, never omit the product.',
        'Keep the person face, skin tone, hair, body, and clothing. Keep the product shape, colors, branding, and label text.',
        'Natural handheld scale. Clean lighting. No extra people, no invented brand, no text overlay.',
        options.prompt,
    ]
        .filter(Boolean)
        .join(' ');

    const ai = getClient();
    let lastError: Error | null = null;

    for (const modelName of Array.from(new Set(IMAGE_MODELS))) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: 'IMAGE 1 — PRODUCT. Keep this exact product in the generated photo:' },
                            { inlineData: { mimeType: product.mimeType, data: product.data } },
                            { text: 'IMAGE 2 — PERSON/MODEL. Keep this exact face, body, and clothing:' },
                            { inlineData: { mimeType: model.mimeType, data: model.data } },
                            { text: prompt },
                        ],
                    },
                ],
                config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                    imageConfig: {
                        aspectRatio: geminiAspect(options.aspectRatio),
                    },
                },
            });

            const parts = response.candidates?.[0]?.content?.parts ?? [];
            for (const part of parts) {
                const data = part.inlineData?.data;
                if (!data) continue;
                const mimeType = part.inlineData?.mimeType?.startsWith('image/')
                    ? part.inlineData.mimeType
                    : 'image/png';
                return { buffer: Buffer.from(data, 'base64'), mimeType };
            }
            lastError = new Error(`Gemini model ${modelName} returned no image`);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.warn(`[gemini] image model ${modelName} failed:`, lastError.message);
        }
    }

    throw lastError || new Error('Gemini image generation failed');
}

const VIDEO_MODELS = [
    process.env.GEMINI_VIDEO_MODEL?.trim(),
    'veo-3.1-fast-generate-preview',
    'veo-3.0-fast-generate-001',
    'veo-3.1-generate-preview',
].filter(Boolean) as string[];

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateAdVideoWithGemini(options: {
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
}): Promise<{ buffer: Buffer; message: string }> {
    const still = await fetchImageAsInline(options.imageUrl);
    const aspectRatio = options.aspectRatio === '16:9' ? '16:9' : '9:16';
    const ai = getClient();
    const apiKey = getGeminiKey()!;
    let lastError: Error | null = null;

    for (const modelName of Array.from(new Set(VIDEO_MODELS))) {
        try {
            let operation = await ai.models.generateVideos({
                model: modelName,
                prompt: options.prompt,
                image: {
                    imageBytes: still.data,
                    mimeType: still.mimeType,
                },
                config: {
                    numberOfVideos: 1,
                    aspectRatio,
                    personGeneration: 'allow_adult',
                },
            });

            const started = Date.now();
            while (!operation.done) {
                if (Date.now() - started > 6 * 60_000) {
                    throw new Error('Gemini video generation timed out');
                }
                await sleep(8000);
                operation = await ai.operations.getVideosOperation({ operation });
            }

            const generated = operation.response?.generatedVideos?.[0]?.video;
            if (!generated) {
                throw new Error(`Gemini model ${modelName} returned no video`);
            }

            if (generated.videoBytes) {
                return {
                    buffer: Buffer.from(generated.videoBytes, 'base64'),
                    message: 'Video generation completed',
                };
            }

            const uri = generated.uri;
            if (!uri) {
                throw new Error(`Gemini model ${modelName} returned no video URI`);
            }
            const downloadUrl = uri.includes('key=') ? uri : `${uri}${uri.includes('?') ? '&' : '?'}key=${apiKey}`;
            const videoRes = await axios.get(downloadUrl, {
                responseType: 'arraybuffer',
                timeout: 120_000,
                maxContentLength: Infinity,
                validateStatus: () => true,
            });
            if (videoRes.status >= 400) {
                throw new Error(`Could not download Gemini video (${videoRes.status})`);
            }
            return {
                buffer: Buffer.from(videoRes.data),
                message: 'Video generation completed',
            };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.warn(`[gemini] video model ${modelName} failed:`, lastError.message);
        }
    }

    throw lastError || new Error('Gemini video generation failed');
}
