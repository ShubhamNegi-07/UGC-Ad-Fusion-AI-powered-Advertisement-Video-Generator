import {Request, Response } from 'express'
import * as Sentry from "@sentry/node";
import { prisma } from '../configs/prisma.js';
import fs from 'fs';
import { detectImageMime } from '../configs/multer.js';
import { assertPollinationsKey, DUAL_IMAGE_BLENDING_PROMPT, generateAdVideo, generateCombinedImage, uploadPublicMedia } from '../services/pollinations.js';
import { ensureUser } from '../utils/ensureUser.js';

const clipPrompt = (text: string, max = 700) => {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > max ? clean.slice(0, max) : clean;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_ASPECT_RATIOS = new Set(['9:16', '16:9', '1:1']);
const DAILY_GENERATION_CAP = Number.parseInt(process.env.DAILY_GENERATION_CAP || '15', 10) || 15;

class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export const isValidProjectId = (value: unknown): value is string =>
    typeof value === 'string' && UUID_REGEX.test(value.trim());

export const createProject = async (req:Request, res: Response) => {
    let tempProjectId: string | undefined;
    const { userId } = req.auth();
    let isCreditDeducted = false;

    const rawBody = (req.body ?? {}) as Record<string, unknown>;
    const name = typeof rawBody.name === 'string' && rawBody.name.trim() ? rawBody.name.trim() : 'New Project';
    const productName = typeof rawBody.productName === 'string' ? rawBody.productName.trim() : '';
    const productDescription = typeof rawBody.productDescription === 'string' ? rawBody.productDescription.trim() : '';
    const userPrompt = typeof rawBody.userPrompt === 'string' ? rawBody.userPrompt.trim() : '';
    const aspectRatio = typeof rawBody.aspectRatio === 'string' && rawBody.aspectRatio.trim() ? rawBody.aspectRatio.trim() : '9:16';
    const parsedTargetLength = rawBody.targetLength !== undefined && rawBody.targetLength !== ''
        ? Number.parseInt(String(rawBody.targetLength), 10)
        : 5;

    const images = (req.files as Express.Multer.File[] | undefined) ?? [];

    try {
        if(images.length !== 2 || !productName){
            return res.status(400).json({message: 'Please upload a product image and a model image' })
        }
        if (name.length > 120 || productName.length > 120) {
            return res.status(400).json({ message: 'Project name and product name must be 120 characters or fewer' });
        }
        if (productDescription.length > 500 || userPrompt.length > 500) {
            return res.status(400).json({ message: 'Product description and prompt must be 500 characters or fewer' });
        }
        if (!ALLOWED_ASPECT_RATIOS.has(aspectRatio)) {
            return res.status(400).json({ message: 'Invalid aspect ratio. Allowed: 9:16, 16:9, 1:1' });
        }
        if (!Number.isInteger(parsedTargetLength) || parsedTargetLength < 1 || parsedTargetLength > 15) {
            return res.status(400).json({ message: 'Target length must be an integer between 1 and 15 seconds' });
        }

        const verifiedFiles = images.map((item, index) => {
            const bytes = fs.readFileSync(item.path);
            const detectedMime = detectImageMime(bytes);
            if (!detectedMime) {
                return null;
            }
            const ext = detectedMime === 'image/png' ? 'png' : detectedMime === 'image/webp' ? 'webp' : 'jpg';
            return {
                bytes,
                mimeType: detectedMime,
                filename: `upload-${index}.${ext}`,
            };
        });

        if (verifiedFiles.some((item) => item === null)) {
            return res.status(400).json({ message: 'Invalid image content. Only valid JPEG, PNG, and WebP files are allowed.' });
        }

        assertPollinationsKey();

        await ensureUser(userId);

        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyCount = await prisma.project.count({
            where: { userId, createdAt: { gte: since24h } },
        });
        if (dailyCount >= DAILY_GENERATION_CAP) {
            return res.status(429).json({
                message: `Daily generation limit (${DAILY_GENERATION_CAP}) reached. Please try again tomorrow.`,
            });
        }

        const activeCount = await prisma.project.count({
            where: { userId, isGenerating: true },
        });
        if (activeCount > 0) {
            return res.status(409).json({ message: 'Another generation is already in progress.' });
        }

        let uploadedImages = await Promise.all(
            verifiedFiles.map(async (item) => {
                return uploadPublicMedia(item!.bytes, item!.mimeType, item!.filename);
            })
        )

        const project = await prisma.$transaction(async (tx) => {
            const concurrentActive = await tx.project.count({
                where: { userId, isGenerating: true },
            });
            if (concurrentActive > 0) {
                throw new HttpError(409, 'Another generation is already in progress.');
            }

            const deducted = await tx.user.updateMany({
                where: { id: userId, credits: { gte: 5 } },
                data: { credits: { decrement: 5 } },
            });
            if (deducted.count === 0) {
                throw new HttpError(401, 'Insufficient credits');
            }

            return tx.project.create({
                data: {
                    name,
                    userId,
                    productName,
                    productDescription,
                    userPrompt,
                    aspectRatio,
                    targetLength: parsedTargetLength,
                    uploadedImages,
                    isGenerating: true,
                },
            });
        });
        isCreditDeducted = true;

        tempProjectId = project.id;
        const prompt = clipPrompt([
            DUAL_IMAGE_BLENDING_PROMPT,
            `Product name: ${productName}.`,
            productDescription ? `Product description: ${productDescription}.` : '',
            userPrompt || '',
        ].filter(Boolean).join(' '));

        const generated = await generateCombinedImage({
            productImageUrl: uploadedImages[0],
            modelImageUrl: uploadedImages[1],
            prompt,
            aspectRatio: aspectRatio || '9:16',
        });

        const generatedImage = await uploadPublicMedia(generated.buffer, generated.mimeType, 'generated.png');

            await prisma.project.updateMany({
                where: {id: project.id, userId},
                data: {
                    generatedImage,
                    isGenerating: false
                }
            })

            res.json({projectId: project.id, message: 'Image generated'})

    } catch (error:any) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ message: error.message });
        }
        const rawMessage = error?.message || 'Image generation failed';
        const clientMessage = 'Image generation failed. Please try again.';
        if(tempProjectId){
            // update project status and error message
            await prisma.project.updateMany({
                where: {id: tempProjectId, userId},
                data: {isGenerating: false, error: clientMessage}
            })
        }
        if(isCreditDeducted){
            // add credits back
            await prisma.user.updateMany({
                where: {id: userId},
                data: {credits: {increment: 5}}
            })
        }
        console.error('[createProject Error]', rawMessage, error);
        Sentry.captureException(error);
        if (!res.headersSent) {
            res.status(500).json({ message: clientMessage });
        }
    } finally {
        for (const file of images) {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    }
}

export const regenerateImage = async (req: Request, res: Response) => {
    const { userId } = req.auth();
    const rawProjectId = req.body?.projectId || req.params.projectId;
    let isCreditDeducted = false;

    if (!isValidProjectId(rawProjectId)) {
        return res.status(400).json({ message: 'Valid project id is required' });
    }
    const projectId = rawProjectId.trim();

    try {
        assertPollinationsKey();
        await ensureUser(userId);

        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyCount = await prisma.project.count({
            where: { userId, createdAt: { gte: since24h } },
        });
        if (dailyCount > DAILY_GENERATION_CAP) {
            return res.status(429).json({
                message: `Daily generation limit (${DAILY_GENERATION_CAP}) reached. Please try again tomorrow.`,
            });
        }

        const project = await prisma.project.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.isGenerating) {
            return res.status(409).json({ message: 'Generation in progress' });
        }
        if (!Array.isArray(project.uploadedImages) || project.uploadedImages.length < 2) {
            return res.status(400).json({ message: 'Source product and model images are missing for this project' });
        }

        await prisma.$transaction(async (tx) => {
            const locked = await tx.project.updateMany({
                where: {
                    id: projectId,
                    userId,
                    isGenerating: false,
                },
                data: { isGenerating: true, error: '' },
            });
            if (locked.count === 0) {
                throw new HttpError(409, 'Generation in progress');
            }

            const deducted = await tx.user.updateMany({
                where: { id: userId, credits: { gte: 5 } },
                data: { credits: { decrement: 5 } },
            });
            if (deducted.count === 0) {
                throw new HttpError(401, 'Insufficient credits');
            }
        });
        isCreditDeducted = true;

        const prompt = clipPrompt(
            [
                DUAL_IMAGE_BLENDING_PROMPT,
                `Product name: ${project.productName}.`,
                project.productDescription ? `Product description: ${project.productDescription}.` : '',
                project.userPrompt || '',
            ]
                .filter(Boolean)
                .join(' '),
        );

        const generated = await generateCombinedImage({
            productImageUrl: project.uploadedImages[0]!,
            modelImageUrl: project.uploadedImages[1]!,
            prompt,
            aspectRatio: project.aspectRatio || '9:16',
        });

        const ext = generated.mimeType === 'image/png' ? 'png' : generated.mimeType === 'image/webp' ? 'webp' : 'jpg';
        const generatedImage = await uploadPublicMedia(
            generated.buffer,
            generated.mimeType,
            `regenerated-${Date.now()}.${ext}`,
        );

        await prisma.project.updateMany({
            where: { id: project.id, userId },
            data: {
                generatedImage,
                isGenerating: false,
                error: '',
            },
        });

        const updatedProject = await prisma.project.findFirst({
            where: { id: project.id, userId },
        });

        const resolvedVideo = updatedProject?.generatedVideo || '';
        const serializedProject = updatedProject
            ? { ...updatedProject, generatedImage, videoUrl: resolvedVideo }
            : { ...project, generatedImage, isGenerating: false, error: '', videoUrl: project.generatedVideo || '' };

        res.json({
            success: true,
            message: 'Image regenerated',
            generatedImage,
            project: serializedProject,
        });
    } catch (error: any) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ message: error.message });
        }
        const rawMessage = error?.message || 'Image regeneration failed';
        const clientMessage = 'Image regeneration failed. Your credits were refunded.';

        try {
            await prisma.project.updateMany({
                where: { id: projectId, userId },
                data: { isGenerating: false, error: clientMessage },
            });
        } catch (updateError) {
            console.error('[regenerateImage] failed to persist error', updateError);
        }

        if (isCreditDeducted) {
            try {
                await prisma.user.updateMany({
                    where: { id: userId },
                    data: { credits: { increment: 5 } },
                });
            } catch (refundError) {
                console.error('[regenerateImage] failed to refund credits', refundError);
            }
        }

        console.error('[regenerateImage Error]', rawMessage, error);
        Sentry.captureException(error);
        if (!res.headersSent) {
            res.status(500).json({ message: clientMessage });
        }
    }
};

export const createVideo = async (req:Request, res: Response) => {
    const {userId} = req.auth()
    const rawProjectId = req.body?.projectId || req.params.projectId;
    let isCreditDeducted = false;

    if(!isValidProjectId(rawProjectId)){
        return res.status(400).json({ message: 'Valid project id is required' });
    }
    const projectId = rawProjectId.trim();

    try {
        assertPollinationsKey();

        await ensureUser(userId);

        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyCount = await prisma.project.count({
            where: { userId, createdAt: { gte: since24h } },
        });
        if (dailyCount > DAILY_GENERATION_CAP) {
            return res.status(429).json({
                message: `Daily generation limit (${DAILY_GENERATION_CAP}) reached. Please try again tomorrow.`,
            });
        }

        const project = await prisma.project.findFirst({
            where: {id: projectId, userId}
        })

        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if(project.isGenerating){
            return res.status(409).json({ message: 'Generation in progress' });
        }
        if(!project.generatedImage){
            return res.status(400).json({ message: 'Generated image not found' });
        }

        await prisma.$transaction(async (tx) => {
            const locked = await tx.project.updateMany({
                where: {
                    id: projectId,
                    userId,
                    isGenerating: false,
                },
                data: { isGenerating: true, error: '' },
            });
            if (locked.count === 0) {
                throw new HttpError(409, 'Generation in progress');
            }

            const deducted = await tx.user.updateMany({
                where: { id: userId, credits: { gte: 10 } },
                data: { credits: { decrement: 10 } },
            });
            if (deducted.count === 0) {
                throw new HttpError(401, 'Insufficient credits');
            }
        });
        isCreditDeducted = true;

        const prompt = clipPrompt([
            `Vertical UGC ad of the same person selling ${project.productName}.`,
            project.productDescription ? `Product: ${project.productDescription}.` : '',
            'He talks to the camera and smiles, lifts the pack close to the lens, eats one piece, then gives a thumbs up. Keep the same face, clothes, product, and background.',
            project.userPrompt || '',
        ].filter(Boolean).join(' '));

        const video = await generateAdVideo({
            imageUrl: project.generatedImage,
            prompt,
            aspectRatio: project.aspectRatio || '9:16',
            durationSeconds: project.targetLength || 5,
        });

        const videoUrl = await uploadPublicMedia(video.buffer, 'video/mp4', `${userId}-${Date.now()}.mp4`);

        await prisma.project.updateMany({
            where: {id: project.id, userId},
            data: {
                generatedVideo: videoUrl,
                isGenerating: false,
                error: ''
            }
        })

        const updatedProject = await prisma.project.findFirst({
            where: { id: project.id, userId },
        });

        const serializedProject = updatedProject
            ? { ...updatedProject, generatedVideo: videoUrl, videoUrl }
            : { ...project, generatedVideo: videoUrl, videoUrl, isGenerating: false, error: '' };

        res.json({
            success: true,
            message: video.message,
            videoUrl,
            project: serializedProject,
        })

    } catch (error:any) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ message: error.message });
        }
        const rawMessage = error?.message || 'Video generation failed';
        const paymentRequired = /pollen|top-up/i.test(rawMessage);
        const clientMessage = paymentRequired
            ? 'Video generation is temporarily unavailable due to provider quota. Your credits were refunded.'
            : 'Video generation failed. Your credits were refunded.';

        try {
            await prisma.project.updateMany({
                where: {id: projectId, userId},
                data: {isGenerating: false, error: clientMessage}
            })
        } catch (updateError) {
            console.error('[createVideo] failed to persist error', updateError);
        }

        if(isCreditDeducted){
            try {
                await prisma.user.update({
                    where: {id: userId},
                    data: {credits: {increment: 10}}
                })
            } catch (refundError) {
                console.error('[createVideo] failed to refund credits', refundError);
            }
        }

        console.error('[createVideo Error]', rawMessage, error);
        Sentry.captureException(error);
        if (!res.headersSent) {
            res.status(paymentRequired ? 402 : 500).json({ message: clientMessage });
        }
    }
}

export const getAllPublishedProjects = async (req:Request, res: Response) => {
    try {

        const rows = await prisma.project.findMany({
            where: {isPublished: true},
            orderBy: {createdAt: 'desc'},
            select: {
                id: true,
                name: true,
                productName: true,
                productDescription: true,
                aspectRatio: true,
                targetLength: true,
                generatedImage: true,
                generatedVideo: true,
                isGenerating: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        const projects = rows.map((row) => ({
            ...row,
            videoUrl: row.generatedVideo || '',
            uploadedImages: [] as string[],
        }))
        res.json({projects})

    } catch (error:any) {
        console.error('[getAllPublishedProjects Error]', error);
        Sentry.captureException(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteProject = async (req:Request, res: Response) => {
    try {

        const { userId } = req.auth();
        const { projectId } = req.params;
        if (!isValidProjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid project id' });
        }
        
        const deleted = await prisma.project.deleteMany({
            where: {id: projectId, userId}
        })
        if (deleted.count === 0){
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted' });

    } catch (error:any) {
        console.error('[deleteProject Error]', error);
        Sentry.captureException(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}