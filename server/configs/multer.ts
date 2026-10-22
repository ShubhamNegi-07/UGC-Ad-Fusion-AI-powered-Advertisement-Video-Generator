import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB per image

export function detectImageMime(buffer: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
    if (buffer.length < 12) return null;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return 'image/jpeg';
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
    ) {
        return 'image/png';
    }

    // WEBP: "RIFF"...."WEBP"
    if (
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
        return 'image/webp';
    }

    return null;
}

const storage = multer.diskStorage({});

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_UPLOAD_BYTES,
        files: 2,
        fields: 10,
        fieldSize: 32 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            return cb(new Error('Unsupported file type. Only JPEG, PNG, and WebP images are allowed.'));
        }
        cb(null, true);
    },
});

export function uploadProjectImages(req: Request, res: Response, next: NextFunction) {
    upload.array('images', 2)(req, res, (err: any) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'Each uploaded image must be 10 MB or smaller.' });
            }
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        }
        return res.status(400).json({ message: err?.message || 'Invalid image upload.' });
    });
}

export default upload;