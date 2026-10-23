import type { Response } from 'express';
import * as Sentry from '@sentry/node';

export const CLIENT_MESSAGES = {
    GENERIC: 'Something went wrong. Please check your connection and try again.',
    AI_BUSY:
        'AI Generation service is currently busy. Please try again in a few minutes or try with a different prompt.',
    AUTH: 'Please sign in again to continue.',
    DATABASE: 'We could not reach the database. Please try again in a moment.',
    CLOUDINARY: 'Could not save your media. Try a smaller file or try again shortly.',
    RATE_LIMIT: 'Too many requests. Please wait a few minutes and try again.',
    CORS: 'This request is not allowed from your browser.',
    UPLOAD: 'Upload failed. Use a JPG, PNG, or WEBP image under 10 MB.',
} as const;

export class HttpError extends Error {
    status: number;
    expose: boolean;

    constructor(status: number, message: string, expose = true) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.expose = expose;
    }
}

function flattenError(error: unknown): string {
    if (!error) return '';
    if (typeof error === 'string') return error;
    const err = error as {
        message?: string;
        name?: string;
        code?: string | number;
        status?: number;
        statusCode?: number;
        http_code?: number;
        cause?: { message?: string };
        response?: { status?: number; data?: unknown };
    };
    const data = err.response?.data;
    const dataText =
        typeof data === 'string'
            ? data
            : data && typeof data === 'object'
              ? JSON.stringify(data)
              : '';
    return [err.name, err.code, err.status, err.statusCode, err.http_code, err.message, err.cause?.message, dataText]
        .filter(Boolean)
        .join(' ');
}

function isAiProviderError(text: string): boolean {
    return /huggingface|hugging face|hf_token|gemini|google\.rpc|google genai|resource_exhausted|veo-|fal\.ai|fal\.run|flux|pollinations|inference permission|no remaining credits|pre-paid credits|quota|billing|limit:\s*0|"code":\s*429|status(?: code)? 402|status(?: code)? 429|nano.?banana/i.test(
        text,
    );
}

function isCloudinaryError(text: string): boolean {
    return /cloudinary|file size too large|maximum image|upload limit|rate.?limit reached|api\.cloudinary/i.test(text);
}

function isDatabaseError(error: unknown, text: string): boolean {
    const code = String((error as { code?: string })?.code || '');
    if (/^P10(00|01|02|03|08|17)$/.test(code) || code === 'P2024') return true;
    return /prisma|can't reach database|connection timed out|econnrefused|enotfound.*neon|postgres/i.test(text);
}

function isClerkAuthError(text: string): boolean {
    return /clerk|unauthenticated|unauthorized|jwt expired|invalid token|session.*expired|not authorized/i.test(text);
}

export function toClientError(error: unknown): { status: number; message: string } {
    if (error instanceof HttpError && error.expose && error.message) {
        return { status: error.status, message: error.message };
    }

    const text = flattenError(error);
    const statusHint = Number(
        (error as { status?: number; statusCode?: number; http_code?: number })?.status ||
            (error as { response?: { status?: number } })?.response?.status ||
            0,
    );

    if (error instanceof Error && error.message === 'Origin not allowed by CORS') {
        return { status: 403, message: CLIENT_MESSAGES.CORS };
    }

    if (isAiProviderError(text)) {
        return { status: statusHint === 429 || statusHint === 402 ? statusHint : 503, message: CLIENT_MESSAGES.AI_BUSY };
    }

    if (isCloudinaryError(text)) {
        return { status: statusHint === 413 ? 413 : 502, message: CLIENT_MESSAGES.CLOUDINARY };
    }

    if (isDatabaseError(error, text)) {
        return { status: 503, message: CLIENT_MESSAGES.DATABASE };
    }

    if (isClerkAuthError(text) && statusHint !== 0 && statusHint < 500) {
        return { status: 401, message: CLIENT_MESSAGES.AUTH };
    }

    if (/too many requests|rate limit/i.test(text)) {
        return { status: 429, message: CLIENT_MESSAGES.RATE_LIMIT };
    }

    if (/multer|file too large|unsupported file type|limit_file_size/i.test(text)) {
        return { status: statusHint === 413 ? 413 : 400, message: CLIENT_MESSAGES.UPLOAD };
    }

    return { status: statusHint >= 400 && statusHint < 600 ? statusHint : 500, message: CLIENT_MESSAGES.GENERIC };
}

export function clientErrorMessage(error: unknown): string {
    return toClientError(error).message;
}

/** Persist / re-send stored project.error without leaking provider or stack text. */
export function sanitizeStoredMessage(text: unknown): string {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    const mapped = toClientError(new Error(clean));
    if (mapped.message !== CLIENT_MESSAGES.GENERIC) return mapped.message;
    if (clean.length <= 220 && !/huggingface|hugging face|gemini|prisma|hf_token|stack|node_modules/i.test(clean)) {
        return clean;
    }
    return CLIENT_MESSAGES.GENERIC;
}

export function sendError(res: Response, error: unknown, label = '[API Error]') {
    const mapped = toClientError(error);
    const unexpected = !(error instanceof HttpError) || error.status >= 500;
    if (unexpected) {
        console.error(label, error);
        Sentry.captureException(error);
    } else {
        console.warn(label, mapped.status, mapped.message);
    }
    if (!res.headersSent) {
        res.status(mapped.status).json({ message: mapped.message });
    }
    return mapped;
}
