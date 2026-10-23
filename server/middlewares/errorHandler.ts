import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/errors.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    sendError(res, err, '[Unhandled Server Error]');
}
