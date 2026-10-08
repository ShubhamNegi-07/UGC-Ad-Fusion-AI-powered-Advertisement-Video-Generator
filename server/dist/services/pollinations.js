import axios from 'axios';
const BASE_URL = 'https://gen.pollinations.ai';
export function assertPollinationsKey() {
    const key = process.env.POLLINATIONS_API_KEY?.trim();
    if (!key) {
        throw new Error('POLLINATIONS_API_KEY is missing. Create a free key at https://enter.pollinations.ai/keys and add it to server/.env');
    }
    return key;
}
function readBody(data) {
    if (!data)
        return '';
    if (Buffer.isBuffer(data))
        return data.toString('utf8');
    if (data instanceof ArrayBuffer)
        return Buffer.from(data).toString('utf8');
    if (ArrayBuffer.isView(data)) {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString('utf8');
    }
    return String(data);
}
function providerMessage(status, data) {
    const raw = readBody(data).trim();
    let message = raw;
    try {
        const json = JSON.parse(raw);
        message =
            json?.error?.message ||
                (typeof json?.error === 'string' ? json.error : '') ||
                json?.message ||
                raw;
    }
    catch {
        message = raw;
    }
    if (status === 401 || status === 403) {
        return 'Pollinations rejected the API key. Check POLLINATIONS_API_KEY in server/.env.';
    }
    if (status === 402) {
        const cost = message.match(/~[0-9.]+ pollen/i)?.[0];
        const price = cost ? ` (~${cost.replace("~", "")})` : " (~0.60 pollen)";
        return `Talking video needs a Pollen top-up${price}. Add funds at https://enter.pollinations.ai/top-up, then generate again. Your app credits were refunded.`;
    }
    const text = (message || `Pollinations request failed (${status})`).replace(/\s+/g, ' ').trim();
    return text.slice(0, 400);
}
function aspectSize(aspectRatio) {
    if (aspectRatio === '16:9')
        return { width: 1024, height: 576 };
    return { width: 576, height: 1024 };
}
async function requestMedia(url, params, timeout) {
    return axios.get(url, {
        params,
        headers: { Authorization: `Bearer ${assertPollinationsKey()}` },
        responseType: 'arraybuffer',
        timeout,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true,
    });
}
export async function uploadPublicMedia(buffer, contentType, name) {
    const response = await axios.post('https://media.pollinations.ai/upload', {
        data: buffer.toString('base64'),
        contentType,
        name,
    }, {
        headers: {
            Authorization: `Bearer ${assertPollinationsKey()}`,
            'Content-Type': 'application/json',
        },
        timeout: 60000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        validateStatus: () => true,
    });
    const url = response.data?.url;
    if (response.status >= 400 || typeof url !== 'string') {
        const body = Buffer.from(typeof response.data === 'string' ? response.data : JSON.stringify(response.data ?? ''));
        throw new Error(providerMessage(response.status, body) || 'Could not store the uploaded image');
    }
    return url;
}
export async function generateCombinedImage(options) {
    const { width, height } = aspectSize(options.aspectRatio);
    const model = process.env.POLLINATIONS_IMAGE_MODEL?.trim() || 'klein';
    const url = `${BASE_URL}/image/${encodeURIComponent(options.prompt)}`;
    const response = await requestMedia(url, {
        model,
        width,
        height,
        seed: -1,
        image: `${options.productImageUrl}|${options.modelImageUrl}`,
    }, 150000);
    const buffer = Buffer.from(response.data);
    const header = String(response.headers['content-type'] || '');
    if (response.status >= 400 || header.includes('application/json') || header.startsWith('text/')) {
        throw new Error(providerMessage(response.status, buffer));
    }
    if (buffer.length < 32) {
        throw new Error('Image provider returned an empty file');
    }
    const mimeType = header.includes('image/png')
        ? 'image/png'
        : header.includes('image/webp')
            ? 'image/webp'
            : 'image/jpeg';
    return { buffer, mimeType };
}
export async function generateAdVideo(options) {
    const model = process.env.POLLINATIONS_VIDEO_MODEL?.trim() || 'veo';
    const requested = Number(options.durationSeconds) || 8;
    const duration = requested <= 4 ? 4 : requested <= 6 ? 6 : 8;
    const aspectRatio = options.aspectRatio === '16:9' ? '16:9' : '9:16';
    const params = {
        model,
        duration,
        aspectRatio,
        audio: true,
        image: options.imageUrl,
    };
    const encodedPrompt = encodeURIComponent(options.prompt);
    let response = await requestMedia(`${BASE_URL}/video/${encodedPrompt}`, params, 300000);
    if (response.status === 404) {
        response = await requestMedia(`${BASE_URL}/image/${encodedPrompt}`, params, 300000);
    }
    const buffer = Buffer.from(response.data);
    const header = String(response.headers['content-type'] || '');
    const looksLikeMp4 = buffer.length > 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp';
    if (response.status >= 400 || header.includes('application/json') || header.startsWith('text/')) {
        throw new Error(providerMessage(response.status, buffer));
    }
    if (!header.includes('video') && !looksLikeMp4) {
        throw new Error('Video provider did not return an MP4');
    }
    return { buffer, message: 'Video generation completed' };
}
