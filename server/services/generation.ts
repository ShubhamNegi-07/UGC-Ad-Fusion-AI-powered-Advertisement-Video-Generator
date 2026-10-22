import axios from 'axios';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import ffmpegStatic from 'ffmpeg-static';
import { describeReferencesWithGemini, generateAdVideoWithGemini, generateCombinedImageWithGemini, getGeminiKey, hasGeminiKey } from './gemini.js';
import { generateCombinedImageWithHf, getHfToken, hasHfToken } from './huggingface.js';

const execFileAsync = promisify(execFile);

export const DUAL_IMAGE_BLENDING_PROMPT =
    'Photorealistic advertisement still. Keep the exact person from the model photo. Place the exact product into their hands so it is large and fully visible. Never generate a face-only crop. Preserve face, hair, outfit, and product branding.';

export function assertGenerationKey() {
    const geminiKey = getGeminiKey();
    if (geminiKey) return geminiKey;
    const hfToken = getHfToken();
    if (hfToken) return hfToken;
    throw new Error(
        'Add GEMINI_API_KEY or HF_TOKEN to server/.env. Gemini: https://aistudio.google.com/apikey',
    );
}

export async function generateCombinedImage(options: {
    productImageUrl: string;
    modelImageUrl: string;
    prompt: string;
    aspectRatio?: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
    let visionPrompt = '';
    try {
        visionPrompt = (await describeReferencesWithGemini(options)) || '';
        if (visionPrompt) {
            console.log('[generateCombinedImage] Using Gemini vision prompt for identity match');
        }
    } catch (visionError) {
        console.warn('[generateCombinedImage] Gemini vision describe failed:', visionError);
    }

    const ratioFraming =
        options.aspectRatio === '16:9'
            ? 'Framing: 16:9 horizontal widescreen, product fully visible.'
            : options.aspectRatio === '1:1'
                ? 'Framing: 1:1 square, product fully visible.'
                : 'Framing: 9:16 vertical portrait, product fully visible.';

    const editPrompt = [
        'Edit this photo of the person. Keep the exact face, hair, skin tone, body, and clothing.',
        'Add the exact product into their hands so the product is large, sharp, and fully visible.',
        'Do not replace the person. Do not invent a different product. No text overlay.',
        visionPrompt,
        options.prompt,
        DUAL_IMAGE_BLENDING_PROMPT,
        ratioFraming,
    ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    let lastError: Error | null = null;

    if (hasGeminiKey()) {
        try {
            return await generateCombinedImageWithGemini({
                ...options,
                prompt: editPrompt,
            });
        } catch (geminiError) {
            lastError = geminiError instanceof Error ? geminiError : new Error(String(geminiError));
            console.warn('[generateCombinedImage] Gemini image failed:', lastError.message);
        }
    }

    if (hasHfToken()) {
        try {
            return await generateCombinedImageWithHf({
                modelImageUrl: options.modelImageUrl,
                prompt: editPrompt,
                aspectRatio: options.aspectRatio,
            });
        } catch (hfError) {
            lastError = hfError instanceof Error ? hfError : new Error(String(hfError));
            console.warn('[generateCombinedImage] Hugging Face image failed:', lastError.message);
            if (/no remaining credits|Purchase pre-paid credits/i.test(lastError.message)) {
                throw new Error(
                    'Hugging Face image credits are empty. Gemini image is also unavailable, so the still could not be created. Try Generate again in a minute.',
                );
            }
        }
    }

    throw lastError || new Error('Image generation failed. Please try again.');
}

async function synthesizeFallbackAdVideo(options: {
    imageUrl: string;
    aspectRatio: string;
    durationSeconds: number;
}): Promise<{ buffer: Buffer; message: string }> {
    const ffmpegPath = typeof ffmpegStatic === 'string' ? ffmpegStatic : (ffmpegStatic as unknown as { default?: string })?.default;
    if (!ffmpegPath) {
        throw new Error('FFmpeg binary is not available for video synthesis');
    }

    const duration = Math.min(Math.max(Number(options.durationSeconds) || 6, 4), 8);
    const dims =
        options.aspectRatio === '16:9'
            ? { width: 1024, height: 576 }
            : options.aspectRatio === '1:1'
                ? { width: 768, height: 768 }
                : { width: 576, height: 1024 };

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'ugc-video-'));
    const imgPath = path.join(tmpDir, 'input.png');
    const outPath = path.join(tmpDir, 'output.mp4');

    try {
        const imgRes = await axios.get(options.imageUrl, { responseType: 'arraybuffer', timeout: 45_000 });
        await fs.promises.writeFile(imgPath, Buffer.from(imgRes.data));

        const fps = 25;
        const totalFrames = duration * fps;
        const filter = [
            `scale=${dims.width * 2}:${dims.height * 2}:force_original_aspect_ratio=increase`,
            `crop=${dims.width * 2}:${dims.height * 2}`,
            `zoompan=z='1+0.18*(on/${totalFrames})':x='iw/2-(iw/zoom/2)+sin(on/9)*22':y='ih/2-(ih/zoom/2)+cos(on/12)*14':d=${totalFrames}:s=${dims.width}x${dims.height}:fps=${fps}`,
            'format=yuv420p',
        ].join(',');

        await execFileAsync(
            ffmpegPath,
            [
                '-y',
                '-i',
                imgPath,
                '-f',
                'lavfi',
                '-i',
                'anullsrc=channel_layout=stereo:sample_rate=44100',
                '-vf',
                filter,
                '-af',
                'aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo,apad',
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
            ],
            { timeout: 90_000 },
        );

        const buffer = await fs.promises.readFile(outPath);
        if (buffer.length < 64) {
            throw new Error('Video synthesis produced an empty file');
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
    if (hasGeminiKey()) {
        try {
            return await generateAdVideoWithGemini({
                imageUrl: options.imageUrl,
                prompt: options.prompt,
                aspectRatio: options.aspectRatio,
            });
        } catch (geminiError) {
            console.warn('[generateAdVideo] Gemini video failed, using local video synthesis:', geminiError);
        }
    }

    return synthesizeFallbackAdVideo(options);
}
