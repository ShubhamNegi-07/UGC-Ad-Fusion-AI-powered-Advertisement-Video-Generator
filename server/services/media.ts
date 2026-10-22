import { createHash } from 'node:crypto';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

export function getDimensionsForAspectRatio(aspectRatio?: string): { width: number; height: number } {
    if (aspectRatio === '16:9') return { width: 1344, height: 768 };
    if (aspectRatio === '1:1') return { width: 1024, height: 1024 };
    return { width: 768, height: 1344 };
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

async function existingCloudinaryUrl(publicId: string, resourceType: 'image' | 'video'): Promise<string | null> {
    try {
        const existing = await cloudinary.api.resource(publicId, { resource_type: resourceType });
        return typeof existing.secure_url === 'string' ? existing.secure_url : null;
    } catch {
        return null;
    }
}

async function uploadBufferToCloudinary(buffer: Buffer, contentType: string, name: string): Promise<string> {
    const resourceType = contentType.startsWith('video/') ? 'video' : 'image';
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 20);
    const kind = resourceType === 'video' ? 'vid' : 'out';
    const publicId = `ugc-ad-fusion/${kind}-${hash}`;
    const reuse = await existingCloudinaryUrl(publicId, resourceType);
    if (reuse) {
        return reuse;
    }

    const baseName = path.parse(name).name.replace(/[^a-zA-Z0-9_-]/g, '_');

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: resourceType,
                overwrite: false,
                unique_filename: false,
                use_filename: false,
                context: { original_name: baseName },
            },
            async (error, result) => {
                if (result?.secure_url) {
                    resolve(result.secure_url);
                    return;
                }
                const existing = await existingCloudinaryUrl(publicId, resourceType);
                if (existing) {
                    resolve(existing);
                    return;
                }
                reject(error || new Error('Cloudinary upload did not return a secure_url'));
            },
        );
        stream.end(buffer);
    });
}

export function toDataUrl(buffer: Buffer, mimeType: string) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function uploadPublicMedia(buffer: Buffer, contentType: string, name: string) {
    if (!isCloudinaryConfigured()) {
        throw new Error('Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env');
    }
    return uploadBufferToCloudinary(buffer, contentType, name);
}
