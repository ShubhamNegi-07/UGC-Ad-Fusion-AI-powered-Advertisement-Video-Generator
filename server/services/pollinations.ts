import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import ffmpegStatic from 'ffmpeg-static';

const execFileAsync = promisify(execFile);
const BASE_URL = 'https://gen.pollinations.ai';

export const DUAL_IMAGE_BLENDING_PROMPT =
    'Photorealistic UGC studio commercial photo. The exact person from the second reference image is naturally holding and showcasing the exact product from the first reference image at realistic handheld scale. Preserve the person exact face, hairstyle, outfit, natural 5-finger hand anatomy, and the exact product packaging, colors, and legible label text. Clean lighting, sharp focus, authentic creator ad framing.';

export const IMAGE_CANDIDATE_MODELS = [
    'gpt-image',
    'klein',
    'flux',
] as const;

export function getDimensionsForAspectRatio(aspectRatio?: string): { width: number; height: number } {
    if (aspectRatio === '16:9') return { width: 1344, height: 768 };
    if (aspectRatio === '1:1') return { width: 1024, height: 1024 };
    return { width: 768, height: 1344 };
}

export const VIDEO_CANDIDATE_MODELS = [
    'veo',
    'pika',
    'luma',
    'wan-fast',
    'seedance-pro',
    'p-video',
] as const;

export function assertPollinationsKey() {
    const key = process.env.POLLINATIONS_API_KEY?.trim();
    if (!key) {
        throw new Error(
            'POLLINATIONS_API_KEY is missing. Create a free key at https://enter.pollinations.ai/keys and add it to server/.env'
        );
    }
    return key;
}

function readBody(data: unknown): string {
    if (!data) return '';
    if (Buffer.isBuffer(data)) return data.toString('utf8');
    if (data instanceof ArrayBuffer) return Buffer.from(data).toString('utf8');
    if (ArrayBuffer.isView(data)) {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString('utf8');
    }
    return String(data);
}

function providerMessage(status: number, data: unknown): string {
    const raw = readBody(data).trim();
    let message = raw;
    try {
        const json = JSON.parse(raw);
        message =
            json?.error?.message ||
            (typeof json?.error === 'string' ? json.error : '') ||
            json?.message ||
            raw;
    } catch {
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

const FREE_VISION_MODELS = [
    'community/YoannDev90/vercel-minimax-m3.1-flash:free',
    'community/YoannDev90/muse-glimmer-30b:free',
    'community/YoannDev90/chimera-70b-kl:free',
] as const;

async function describeReferenceImagesForFreeFallback(options: {
    productImageUrl: string;
    modelImageUrl: string;
    prompt: string;
    ratioFraming: string;
}): Promise<string> {
    const fallbackPrompt = `${DUAL_IMAGE_BLENDING_PROMPT} ${options.prompt} ${options.ratioFraming}`.trim();

    for (const model of FREE_VISION_MODELS) {
        try {
            const response = await axios.post(
                `${BASE_URL}/v1/chat/completions`,
                {
                    model,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `Analyze both images carefully. First image = product. Second image = creator/model. Write a concise, 2-sentence photorealistic commercial photography prompt showing the exact person from the second image (include their gender, hair, facial features, skin tone, and exact clothing colors/style) naturally holding and showcasing the exact product from the first image (include product type, brand/label text if visible, shape, and colors). Output ONLY the prompt text, no intro or markdown. Context: ${options.prompt}. ${options.ratioFraming}`,
                                },
                                {
                                    type: 'image_url',
                                    image_url: { url: options.productImageUrl },
                                },
                                {
                                    type: 'image_url',
                                    image_url: { url: options.modelImageUrl },
                                },
                            ],
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${assertPollinationsKey()}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 22_000,
                    validateStatus: () => true,
                },
            );

            const content = String(response.data?.choices?.[0]?.message?.content || '').trim();
            if (
                response.status === 200 &&
                content.length > 40 &&
                !/doesn't have enough credits|insufficient_balance|top up/i.test(content)
            ) {
                return `${content} ${options.ratioFraming}`.replace(/\s+/g, ' ').trim().slice(0, 900);
            }
        } catch {
            // Try next free vision model
        }
    }

    return fallbackPrompt.slice(0, 900);
}

async function generateFreeFallbackImage(options: {
    productImageUrl: string;
    modelImageUrl: string;
    prompt: string;
    width: number;
    height: number;
    ratioFraming: string;
    seed: number;
}): Promise<{ buffer: Buffer; mimeType: string }> {
    const detailedPrompt = await describeReferenceImagesForFreeFallback({
        productImageUrl: options.productImageUrl,
        modelImageUrl: options.modelImageUrl,
        prompt: options.prompt,
        ratioFraming: options.ratioFraming,
    });

    const freeUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(detailedPrompt)}`;
    const response = await axios.get(freeUrl, {
        params: {
            width: options.width,
            height: options.height,
            seed: options.seed,
            nologo: true,
        },
        responseType: 'arraybuffer',
        timeout: 60_000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true,
    });

    const buffer = Buffer.from(response.data);
    const header = String(response.headers['content-type'] || '');

    if (response.status >= 400 || !header.startsWith('image/') || buffer.length < 1024) {
        throw new Error(`Free image fallback failed (${response.status})`);
    }

    const mimeType = header.includes('image/png')
        ? 'image/png'
        : header.includes('image/webp')
            ? 'image/webp'
            : 'image/jpeg';

    return { buffer, mimeType };
}

async function requestMedia(url: string, params: Record<string, string | number | boolean>, timeout: number) {
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

function isTimeoutOrTransientError(error: unknown, status?: number): boolean {
    if (status !== undefined) {
        return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
    }
    if (axios.isAxiosError(error)) {
        const code = error.code || '';
        return (
            code === 'ECONNABORTED' ||
            code === 'ETIMEDOUT' ||
            code === 'ECONNRESET' ||
            /timeout/i.test(error.message)
        );
    }
    return error instanceof Error && /timeout/i.test(error.message);
}

function isRetryableVideoError(error: unknown, status?: number, bodyText?: string): boolean {
    if (status !== undefined) {
        if (
            status === 400 ||
            status === 402 ||
            status === 404 ||
            status === 408 ||
            status === 429 ||
            status === 500 ||
            status === 502 ||
            status === 503 ||
            status === 504
        ) {
            return true;
        }
    }
    if (bodyText && /quota|pollen|top-up|insufficient_balance|rate.?limit|unavailable|overloaded|timeout/i.test(bodyText)) {
        return true;
    }
    if (error instanceof Error && /quota|pollen|top-up|insufficient_balance|rate.?limit|unavailable|overloaded|timeout/i.test(error.message)) {
        return true;
    }
    return isTimeoutOrTransientError(error, status);
}

function isCloudinaryConfigured(): boolean {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    if (!cloudName || !apiKey || !apiSecret) {
        return false;
    }
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
    return true;
}

function uploadBufferToCloudinary(buffer: Buffer, contentType: string, name: string): Promise<string> {
    const resourceType = contentType.startsWith('video/') ? 'video' : 'image';
    const baseName = path.parse(name).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'ugc-ad-fusion',
                resource_type: resourceType,
                public_id: `${baseName}-${Date.now()}`,
                ...(uploadPreset ? { upload_preset: uploadPreset } : {}),
            },
            (error, result) => {
                if (error || !result?.secure_url) {
                    reject(error || new Error('Cloudinary upload did not return a secure_url'));
                    return;
                }
                resolve(result.secure_url);
            },
        );
        stream.end(buffer);
    });
}

export async function uploadPublicMedia(buffer: Buffer, contentType: string, name: string) {
    if (isCloudinaryConfigured()) {
        try {
            return await uploadBufferToCloudinary(buffer, contentType, name);
        } catch (cloudinaryError) {
            console.warn('[uploadPublicMedia] Cloudinary upload failed, falling back to Pollinations media host:', cloudinaryError);
        }
    }

    const response = await axios.post('https://media.pollinations.ai/upload', {
        data: buffer.toString('base64'),
        contentType,
        name,
    }, {
        headers: {
            Authorization: `Bearer ${assertPollinationsKey()}`,
            'Content-Type': 'application/json',
        },
        timeout: 60_000,
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

export async function generateCombinedImage(options: {
    productImageUrl: string;
    modelImageUrl: string;
    prompt: string;
    aspectRatio?: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
    const primaryModel = process.env.POLLINATIONS_IMAGE_MODEL?.trim() || 'gpt-image';
    const candidateModels = Array.from(new Set([primaryModel, ...IMAGE_CANDIDATE_MODELS]));
    const { width, height } = getDimensionsForAspectRatio(options.aspectRatio);
    const ratioFraming =
        options.aspectRatio === '16:9'
            ? 'Framing: 16:9 horizontal widescreen composition.'
            : options.aspectRatio === '1:1'
                ? 'Framing: 1:1 square centered composition.'
                : 'Framing: 9:16 vertical portrait reel composition.';

    const basePrompt = options.prompt.includes(DUAL_IMAGE_BLENDING_PROMPT)
        ? options.prompt
        : `${DUAL_IMAGE_BLENDING_PROMPT} ${options.prompt}`.trim();
    const structuredPrompt = `${basePrompt} ${ratioFraming}`.trim();

    const url = `${BASE_URL}/image/${encodeURIComponent(structuredPrompt)}`;
    const randomSeed = Math.floor(Math.random() * 1_000_000_000);
    let lastError: Error | null = null;

    for (let i = 0; i < candidateModels.length; i++) {
        const model = candidateModels[i]!;
        const isLastAttempt = i === candidateModels.length - 1;

        try {
            const response = await requestMedia(
                url,
                {
                    model,
                    width,
                    height,
                    enhance: false,
                    seed: randomSeed + i,
                    image: `${options.productImageUrl},${options.modelImageUrl}`,
                },
                90_000,
            );

            const buffer = Buffer.from(response.data);
            const header = String(response.headers['content-type'] || '');

            if (response.status >= 400 || header.includes('application/json') || header.startsWith('text/')) {
                const bodyText = readBody(buffer);
                const err = new Error(providerMessage(response.status, buffer));
                lastError = err;
                if (!isLastAttempt && isRetryableVideoError(err, response.status, bodyText)) {
                    continue;
                }
                break;
            }

            if (buffer.length < 32) {
                const err = new Error('Image provider returned an empty file');
                lastError = err;
                if (!isLastAttempt) {
                    continue;
                }
                break;
            }

            const mimeType = header.includes('image/png')
                ? 'image/png'
                : header.includes('image/webp')
                    ? 'image/webp'
                    : 'image/jpeg';

            return { buffer, mimeType };
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            lastError = err;
            if (!isLastAttempt && isRetryableVideoError(err)) {
                continue;
            }
            break;
        }
    }

    if (lastError && isRetryableVideoError(lastError)) {
        console.warn('[generateCombinedImage] Paid Pollinations image models hit quota/availability limits; falling back to free vision + image synthesis...');
        try {
            return await generateFreeFallbackImage({
                productImageUrl: options.productImageUrl,
                modelImageUrl: options.modelImageUrl,
                prompt: options.prompt,
                width,
                height,
                ratioFraming,
                seed: randomSeed,
            });
        } catch (fallbackError) {
            console.warn('[generateCombinedImage] Free image fallback also failed:', fallbackError);
        }
    }

    throw lastError || new Error('Image generation failed across all fallback models');
}

async function generateVoiceoverAudio(prompt: string): Promise<Buffer | null> {
    try {
        const response = await axios.post(
            `${BASE_URL}/v1/chat/completions`,
            {
                model: 'openai-audio',
                modalities: ['text', 'audio'],
                audio: { voice: 'nova', format: 'mp3' },
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an upbeat UGC creator recording a 5-second vertical video ad voiceover. Speak only a natural, enthusiastic 1-2 sentence pitch for the product described. No stage directions or hashtags.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${assertPollinationsKey()}`,
                    'Content-Type': 'application/json',
                },
                timeout: 45_000,
                validateStatus: () => true,
            },
        );

        const base64Audio = response.data?.choices?.[0]?.message?.audio?.data;
        if (response.status === 200 && typeof base64Audio === 'string' && base64Audio.length > 64) {
            return Buffer.from(base64Audio, 'base64');
        }
    } catch {
        // Ignore TTS errors; video synthesis will proceed with silent audio track
    }
    return null;
}

async function generateActionKeyframe(imageUrl: string, prompt: string, width: number, height: number): Promise<Buffer | null> {
    try {
        const actionPrompt = encodeURIComponent(
            `Keep the exact same person, face, outfit, product, and background. Change the pose so the person smiles warmly, speaks directly to the camera, and lifts the product closer toward the lens in a natural commercial action shot. ${prompt}`.slice(
                0,
                500,
            ),
        );
        const response = await requestMedia(
            `${BASE_URL}/image/${actionPrompt}`,
            {
                model: 'kontext',
                width,
                height,
                seed: -1,
                image: imageUrl,
            },
            25_000,
        );
        const buffer = Buffer.from(response.data);
        const header = String(response.headers['content-type'] || '');
        if (response.status === 200 && header.startsWith('image/') && buffer.length > 1024) {
            return buffer;
        }
    } catch {
        // Ignore action keyframe errors; fallback will animate primary frame
    }
    return null;
}

async function synthesizeFallbackAdVideo(options: {
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    durationSeconds: number;
}): Promise<{ buffer: Buffer; message: string }> {
    const ffmpegPath = typeof ffmpegStatic === 'string' ? ffmpegStatic : (ffmpegStatic as unknown as { default?: string })?.default;
    if (!ffmpegPath) {
        throw new Error('FFmpeg binary is not available for fallback video synthesis');
    }

    const duration = Math.min(Math.max(Number(options.durationSeconds) || 6, 4), 8);
    const dims =
        options.aspectRatio === '16:9'
            ? { width: 1024, height: 576 }
            : options.aspectRatio === '1:1'
                ? { width: 768, height: 768 }
                : { width: 576, height: 1024 };

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'ugc-video-'));
    const imgPath = path.join(tmpDir, 'input1.png');
    const img2Path = path.join(tmpDir, 'input2.png');
    const audioPath = path.join(tmpDir, 'voiceover.mp3');
    const outPath = path.join(tmpDir, 'output.mp4');

    try {
        const [imgRes, actionFrameBuffer, ttsBuffer] = await Promise.all([
            axios.get(options.imageUrl, { responseType: 'arraybuffer', timeout: 45_000 }),
            generateActionKeyframe(options.imageUrl, options.prompt, dims.width, dims.height),
            generateVoiceoverAudio(options.prompt),
        ]);

        await fs.promises.writeFile(imgPath, Buffer.from(imgRes.data));

        const fps = 25;
        const totalFrames = duration * fps;
        const args: string[] = ['-y', '-i', imgPath];

        let useDualKeyframe = false;
        if (actionFrameBuffer) {
            await fs.promises.writeFile(img2Path, actionFrameBuffer);
            args.push('-i', img2Path);
            useDualKeyframe = true;
        }

        if (ttsBuffer) {
            await fs.promises.writeFile(audioPath, ttsBuffer);
            args.push('-i', audioPath);
        } else {
            args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
        }

        if (useDualKeyframe) {
            const halfDuration = Math.max(duration / 2 + 0.4, 2.8);
            const halfFrames = Math.round(halfDuration * fps);
            const fadeDuration = 0.6;
            const fadeOffset = Math.max(halfDuration - fadeDuration, 1.5).toFixed(2);
            const filterComplex = [
                `[0:v]scale=${dims.width * 2}:${dims.height * 2}:force_original_aspect_ratio=increase,crop=${dims.width * 2}:${dims.height * 2},zoompan=z='1+0.14*(on/${halfFrames})':x='iw/2-(iw/zoom/2)+sin(on/8)*20':y='ih/2-(ih/zoom/2)':d=${halfFrames}:s=${dims.width}x${dims.height}:fps=${fps},format=yuv420p[v0]`,
                `[1:v]scale=${dims.width * 2}:${dims.height * 2}:force_original_aspect_ratio=increase,crop=${dims.width * 2}:${dims.height * 2},zoompan=z='1.14-0.12*(on/${halfFrames})':x='iw/2-(iw/zoom/2)-sin(on/8)*20':y='ih/2-(ih/zoom/2)':d=${halfFrames}:s=${dims.width}x${dims.height}:fps=${fps},format=yuv420p[v1]`,
                `[v0][v1]xfade=transition=fade:duration=${fadeDuration}:offset=${fadeOffset},format=yuv420p[vout]`,
                `[2:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo,apad[aout]`,
            ].join(';');

            args.push(
                '-filter_complex',
                filterComplex,
                '-map',
                '[vout]',
                '-map',
                '[aout]',
            );
        } else {
            const filter = [
                `scale=${dims.width * 2}:${dims.height * 2}:force_original_aspect_ratio=increase`,
                `crop=${dims.width * 2}:${dims.height * 2}`,
                `zoompan=z='1+0.18*(on/${totalFrames})':x='iw/2-(iw/zoom/2)+sin(on/9)*22':y='ih/2-(ih/zoom/2)+cos(on/12)*14':d=${totalFrames}:s=${dims.width}x${dims.height}:fps=${fps}`,
                'format=yuv420p',
            ].join(',');

            args.push(
                '-vf',
                filter,
                '-af',
                'aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo,apad',
            );
        }

        args.push(
            '-c:v',
            'libx264',
            '-profile:v',
            'main',
            '-preset',
            'ultrafast',
            '-pix_fmt',
            'yuv420p',
            '-c:a',
            'aac',
            '-b:a',
            '128k',
            '-movflags',
            '+faststart',
            '-t',
            String(duration),
            outPath,
        );

        await execFileAsync(ffmpegPath, args, { timeout: 90_000 });
        const buffer = await fs.promises.readFile(outPath);

        if (buffer.length < 64) {
            throw new Error('Fallback video synthesis produced an empty file');
        }

        return { buffer, message: 'Video generation completed' };
    } finally {
        await fs.promises.rm(tmpDir, { recursive: true, force: true }).catch(() => undefined);
    }
}

export async function generateAdVideo(options: {
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    durationSeconds: number;
}): Promise<{ buffer: Buffer; message: string }> {
    const primaryModel = process.env.POLLINATIONS_VIDEO_MODEL?.trim() || 'veo';
    const candidateModels = Array.from(new Set([primaryModel, ...VIDEO_CANDIDATE_MODELS]));

    const requested = Number(options.durationSeconds) || 5;
    const veoDuration = requested <= 4 ? 4 : requested <= 6 ? 6 : 8;
    const aspectRatio = options.aspectRatio === '16:9' ? '16:9' : '9:16';
    const encodedPrompt = encodeURIComponent(options.prompt);

    let lastError: Error | null = null;

    for (let i = 0; i < candidateModels.length; i++) {
        const model = candidateModels[i]!;
        const isLastAttempt = i === candidateModels.length - 1;
        const duration = model === 'veo' ? veoDuration : 5;
        const params: Record<string, string | number | boolean> = {
            model,
            duration,
            aspectRatio,
            image: options.imageUrl,
            ...(model === 'veo' ? { audio: true } : {}),
        };

        try {
            let response = await requestMedia(`${BASE_URL}/video/${encodedPrompt}`, params, 180_000);
            if (response.status === 404) {
                response = await requestMedia(`${BASE_URL}/image/${encodedPrompt}`, params, 180_000);
            }

            const buffer = Buffer.from(response.data);
            const header = String(response.headers['content-type'] || '');
            const looksLikeMp4 = buffer.length > 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp';

            if (response.status >= 400 || header.includes('application/json') || header.startsWith('text/')) {
                const bodyText = readBody(buffer);
                const err = new Error(providerMessage(response.status, buffer));
                lastError = err;

                if (!isLastAttempt && isRetryableVideoError(err, response.status, bodyText)) {
                    console.warn(`[generateAdVideo] Model "${model}" failed (${response.status}), trying next fallback model...`);
                    continue;
                }
                throw err;
            }

            if (!header.includes('video') && !looksLikeMp4) {
                const err = new Error('Video provider did not return an MP4');
                lastError = err;
                if (!isLastAttempt) {
                    continue;
                }
                throw err;
            }

            return { buffer, message: 'Video generation completed' };
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            lastError = err;
            if (!isLastAttempt && isRetryableVideoError(err)) {
                console.warn(`[generateAdVideo] Model "${model}" error (${err.message}), trying next fallback model...`);
                continue;
            }
        }
    }

    if (lastError && isRetryableVideoError(lastError)) {
        console.warn('[generateAdVideo] Remote video models hit quota/availability limits; synthesizing fallback video with audio...');
        return synthesizeFallbackAdVideo(options);
    }

    throw lastError || new Error('Video generation failed across all candidate models');
}
