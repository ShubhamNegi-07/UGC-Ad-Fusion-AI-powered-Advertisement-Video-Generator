import express from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { createProject, createVideo, deleteProject, downloadPublishedMedia,
getAllPublishedProjects, regenerateImage, startImageGeneration } from '../controllers/projectController.js';
import { protect } from '../middlewares/auth.js';
import { uploadProjectImages } from '../configs/multer.js';

const projectRouter = express.Router()

const userOrIpKey = (req: express.Request) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : undefined;
        if (auth?.userId) return `user:${auth.userId}`;
    } catch {
        // Fallback to IP when auth context is unavailable
    }
    return ipKeyGenerator(req.ip || '127.0.0.1');
};

const createProjectLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    skipFailedRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: userOrIpKey,
    message: { message: 'Too many image generation requests. Please wait 15 minutes before trying again.' },
});

const createVideoLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    skipFailedRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: userOrIpKey,
    message: { message: 'Too many video generation requests. Please wait 15 minutes before trying again.' },
});

projectRouter.post('/create', protect, createProjectLimiter, createProject)
projectRouter.post('/:projectId/start-image', protect, createProjectLimiter, uploadProjectImages, startImageGeneration)
projectRouter.post('/regenerate-image', protect, createProjectLimiter, regenerateImage)
projectRouter.post('/video', protect, createVideoLimiter, createVideo)
const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: userOrIpKey,
    message: { message: 'Too many downloads. Please wait a few minutes.' },
});

projectRouter.get('/published', getAllPublishedProjects)
projectRouter.get('/download', downloadLimiter, downloadPublishedMedia)
projectRouter.delete('/:projectId', protect, deleteProject)

export default projectRouter