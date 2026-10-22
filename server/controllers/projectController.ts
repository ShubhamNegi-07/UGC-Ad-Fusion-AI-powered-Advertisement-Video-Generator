import {Request, Response } from 'express'
import * as Sentry from "@sentry/node";
import axios from 'axios';
import { prisma } from '../configs/prisma.js';
import fs from 'fs';
import { detectImageMime } from '../configs/multer.js';
import { assertGenerationKey, DUAL_IMAGE_BLENDING_PROMPT, generateAdVideo, generateCombinedImage } from '../services/generation.js';
import { toDataUrl, uploadPublicMedia } from '../services/media.js';
import { ensureUser } from '../utils/ensureUser.js';
import { deductCredits, refundCredits } from '../utils/credits.js';

const clipPrompt = (text: string, max = 1800) => {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > max ? clean.slice(0, max) : clean;
}

const publicAuthorName = (name?: string) => {
    const clean = (name || '').replace(/\s+/g, ' ').trim();
    if (!clean) return 'Creator';
    if (clean.includes('@')) return clean.split('@')[0] || 'Creator';
    return clean;
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

    try {
        if(!productName){
            return res.status(400).json({message: 'Please add a product name' })
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

        assertGenerationKey();

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

        const staleBefore = new Date(Date.now() - 3 * 60 * 1000);
        await prisma.project.updateMany({
            where: { userId, isGenerating: true, updatedAt: { lt: staleBefore } },
            data: { isGenerating: false, error: 'Generation timed out. Please try again.' },
        });

        const activeCount = await prisma.project.count({
            where: { userId, isGenerating: true },
        });
        if (activeCount > 0) {
            return res.status(409).json({ message: 'Another generation is already in progress. Wait a moment, then try again.' });
        }

        const project = await prisma.$transaction(async (tx) => {
            const concurrentActive = await tx.project.count({
                where: { userId, isGenerating: true },
            });
            if (concurrentActive > 0) {
                throw new HttpError(409, 'Another generation is already in progress.');
            }

            const deducted = await deductCredits(tx, userId, 5);
            if (!deducted) {
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
                    uploadedImages: [],
                    isGenerating: true,
                },
            });
        });
        isCreditDeducted = true;

        tempProjectId = project.id;
        res.json({ projectId: project.id, message: 'Creating your still image' });

    } catch (error:any) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ message: error.message });
        }
        const rawMessage = error?.message || 'Image generation failed';
        const clientMessage = /HF_TOKEN|Hugging Face|Inference permission|credits|quota|Gemini/i.test(rawMessage)
            ? rawMessage
            : 'Image generation failed. Please try again.';
        if(tempProjectId){
            // update project status and error message
            await prisma.project.updateMany({
                where: {id: tempProjectId, userId},
                data: {isGenerating: false, error: clientMessage}
            })
        }
        if(isCreditDeducted){
            await refundCredits(prisma, userId, 5)
        }
        console.error('[createProject Error]', rawMessage, error);
        Sentry.captureException(error);
        if (!res.headersSent) {
            res.status(500).json({ message: clientMessage });
        }
    }
}

type SourceFile = { bytes: Buffer; mimeType: string; filename: string };

function readSourceFiles(images: Express.Multer.File[]): SourceFile[] | null {
    const verified = images.map((item, index) => {
        const bytes = fs.readFileSync(item.path);
        const detectedMime = detectImageMime(bytes);
        if (!detectedMime) return null;
        const ext = detectedMime === 'image/png' ? 'png' : detectedMime === 'image/webp' ? 'webp' : 'jpg';
        return { bytes, mimeType: detectedMime, filename: `upload-${index}.${ext}` };
    });
    if (verified.some((item) => item === null) || verified.length !== 2) return null;
    return verified.filter((item): item is SourceFile => item !== null);
}

function generationPrompt(project: { userPrompt: string; productName: string; productDescription: string }) {
    return clipPrompt([
        project.userPrompt || '',
        `Product name: ${project.productName}. The person must hold this exact product so it is clearly visible.`,
        project.productDescription ? `Product details: ${project.productDescription}.` : '',
        DUAL_IMAGE_BLENDING_PROMPT,
    ].filter(Boolean).join(' '));
}

async function runStillGeneration(options: {
    projectId: string;
    userId: string;
    sourceFiles: SourceFile[];
    prompt: string;
    aspectRatio: string;
}) {
    try {
        const uploadedImages = options.sourceFiles.map((item) => toDataUrl(item.bytes, item.mimeType));
        await prisma.project.updateMany({
            where: { id: options.projectId, userId: options.userId },
            data: { uploadedImages },
        });
        const generated = await generateCombinedImage({
            productImageUrl: uploadedImages[0]!,
            modelImageUrl: uploadedImages[1]!,
            prompt: options.prompt,
            aspectRatio: options.aspectRatio || '9:16',
        });
        const generatedImage = await uploadPublicMedia(generated.buffer, generated.mimeType, 'generated.png');
        await prisma.project.updateMany({
            where: { id: options.projectId, userId: options.userId },
            data: {
                generatedImage,
                isGenerating: false,
                error: '',
            },
        });
    } catch (genError: unknown) {
        const rawMessage = genError instanceof Error ? genError.message : 'Image generation failed';
        const clientMessage = /HF_TOKEN|Hugging Face|Inference permission|credits|quota|Gemini/i.test(rawMessage)
            ? rawMessage
            : 'Image generation failed. Please try again.';
        console.error('[startImageGeneration background]', rawMessage, genError);
        await prisma.project.updateMany({
            where: { id: options.projectId, userId: options.userId },
            data: { isGenerating: false, error: clientMessage },
        });
        await refundCredits(prisma, options.userId, 5);
    }
}

export const startImageGeneration = async (req: Request, res: Response) => {
    const { userId } = req.auth();
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId.trim() : '';
    const images = (req.files as Express.Multer.File[] | undefined) ?? [];

    try {
        if (!isValidProjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid project id' });
        }
        if (images.length !== 2) {
            return res.status(400).json({ message: 'Please upload a product image and a model image' });
        }

        const sourceFiles = readSourceFiles(images);
        if (!sourceFiles) {
            return res.status(400).json({ message: 'Invalid image content. Only valid JPEG, PNG, and WebP files are allowed.' });
        }

        assertGenerationKey();

        const project = await prisma.project.findFirst({
            where: { id: projectId, userId },
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.generatedImage) {
            return res.status(409).json({ message: 'This project already has a generated image' });
        }

        await prisma.project.updateMany({
            where: { id: projectId, userId },
            data: { isGenerating: true, error: '' },
        });

        res.json({ projectId, message: 'Creating your still image' });

        void runStillGeneration({
            projectId,
            userId,
            sourceFiles,
            prompt: generationPrompt(project),
            aspectRatio: project.aspectRatio || '9:16',
        });
    } catch (error: unknown) {
        const rawMessage = error instanceof Error ? error.message : 'Image generation failed';
        const clientMessage = /HF_TOKEN|Hugging Face|Inference permission|credits|quota|Gemini/i.test(rawMessage)
            ? rawMessage
            : 'Image generation failed. Please try again.';
        console.error('[startImageGeneration]', rawMessage, error);
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
        assertGenerationKey();
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

            const deducted = await deductCredits(tx, userId, 5);
            if (!deducted) {
                throw new HttpError(401, 'Insufficient credits');
            }
        });
        isCreditDeducted = true;

        const prompt = clipPrompt(
            [
                project.userPrompt || '',
                `Product name: ${project.productName}. The person must hold this exact product so it is clearly visible.`,
                project.productDescription ? `Product details: ${project.productDescription}.` : '',
                DUAL_IMAGE_BLENDING_PROMPT,
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
        const clientMessage = /HF_TOKEN|Hugging Face|Inference permission|credits|quota|Gemini/i.test(rawMessage)
            ? rawMessage
            : 'Image regeneration failed. Your credits were refunded.';

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
                await refundCredits(prisma, userId, 5);
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
        assertGenerationKey();

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

            const deducted = await deductCredits(tx, userId, 10);
            if (!deducted) {
                throw new HttpError(401, 'Insufficient credits');
            }
        });
        isCreditDeducted = true;

        const prompt = clipPrompt([
            `Photorealistic talking UGC ad video starting from this exact still.`,
            `The same person from the still sells ${project.productName}.`,
            project.productDescription ? `Product details: ${project.productDescription}.` : '',
            'Keep the exact face, hair, outfit, product, lighting, and background from the still.',
            'The creator looks into the camera, speaks naturally for a few seconds, slightly moves, and lifts the product closer to the lens.',
            'Do not invent a different person, product, or location. No text overlays.',
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
        const clientMessage = 'Video generation failed. Your credits were refunded.';

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
                await refundCredits(prisma, userId, 10)
            } catch (refundError) {
                console.error('[createVideo] failed to refund credits', refundError);
            }
        }

        console.error('[createVideo Error]', rawMessage, error);
        Sentry.captureException(error);
        if (!res.headersSent) {
            res.status(500).json({ message: clientMessage });
        }
    }
}

export const getAllPublishedProjects = async (req:Request, res: Response) => {
    try {

        const rows = await prisma.project.findMany({
            where: {
                OR: [
                    { publishedImage: true },
                    { publishedVideo: true },
                    { isPublished: true },
                ],
            },
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
                publishedImage: true,
                publishedVideo: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            }
        })
        const projects = rows.flatMap((row) => {
            const user = row.user
                ? {
                    id: row.user.id,
                    name: publicAuthorName(row.user.name),
                    image: row.user.image || '',
                }
                : { id: '', name: 'Creator', image: '' };
            const base = {
                ...row,
                videoUrl: row.generatedVideo || '',
                uploadedImages: [] as string[],
                user,
            };
            const showImage = Boolean((row.publishedImage || (row.isPublished && !row.publishedVideo)) && row.generatedImage);
            const showVideo = Boolean((row.publishedVideo || (row.isPublished && !row.publishedImage)) && row.generatedVideo);
            const tiles = [];
            if (showImage) {
                tiles.push({
                    ...base,
                    feedId: `${row.id}-image`,
                    feedKind: 'image' as const,
                    generatedVideo: '',
                    videoUrl: '',
                });
            }
            if (showVideo) {
                tiles.push({
                    ...base,
                    feedId: `${row.id}-video`,
                    feedKind: 'video' as const,
                });
            }
            return tiles;
        })
        res.json({projects})

    } catch (error:any) {
        console.error('[getAllPublishedProjects Error]', error);
        Sentry.captureException(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const DOWNLOAD_HOSTS = [
    /(^|\.)cloudinary\.com$/i,
    /(^|\.)pollinations\.ai$/i,
    /(^|\.)fal\.ai$/i,
    /(^|\.)fal\.run$/i,
    /(^|\.)huggingface\.co$/i,
];

export const downloadPublishedMedia = async (req: Request, res: Response) => {
    try {
        const raw = typeof req.query.url === 'string' ? req.query.url.trim() : '';
        let parsed: URL;
        try {
            parsed = new URL(raw);
        } catch {
            return res.status(400).json({ message: 'Invalid media url' });
        }
        if (parsed.protocol !== 'https:' || !DOWNLOAD_HOSTS.some((re) => re.test(parsed.hostname))) {
            return res.status(400).json({ message: 'Media host is not allowed' });
        }

        const upstream = await axios.get(parsed.toString(), {
            responseType: 'stream',
            timeout: 60_000,
            maxContentLength: 80 * 1024 * 1024,
            validateStatus: () => true,
        });
        if (upstream.status >= 400) {
            return res.status(502).json({ message: 'Could not download this file' });
        }

        res.setHeader('Content-Type', String(upstream.headers['content-type'] || 'application/octet-stream'));
        res.setHeader('Content-Disposition', 'attachment');
        upstream.data.pipe(res);
    } catch (error) {
        console.error('[downloadPublishedMedia]', error);
        Sentry.captureException(error);
        if (!res.headersSent) {
            res.status(502).json({ message: 'Could not download this file' });
        }
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