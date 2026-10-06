import {Request, Response } from 'express'
import * as Sentry from "@sentry/node";
import { prisma } from '../configs/prisma.js';
import fs from 'fs';
import { assertPollinationsKey, generateAdVideo, generateCombinedImage, uploadPublicMedia } from '../services/pollinations.js';
import { ensureUser } from '../utils/ensureUser.js';

const clipPrompt = (text: string, max = 700) => {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > max ? clean.slice(0, max) : clean;
}

export const createProject = async (req:Request, res: Response) => {
    let tempProjectId: string | undefined;
    const { userId } = req.auth();
    let isCreditDeducted = false;

    const {name = 'New Project', aspectRatio, userPrompt, productName,
    productDescription, targetLength = 5} = req.body;
    const images = (req.files as Express.Multer.File[] | undefined) ?? [];

    try {
        if(images.length < 2 || !productName){
            return res.status(400).json({message: 'Please upload a product image and a model image' })
        }

        assertPollinationsKey();

        const user = await ensureUser(userId)

        if(user.credits < 5){
            return res.status(401).json({message: 'Insufficient credits'})
        }

        await prisma.user.update({
            where: {id: userId},
            data: {credits: {decrement: 5}}
        });
        isCreditDeducted = true;

        let uploadedImages = await Promise.all(
            images.map(async(item, index)=>{
                const bytes = fs.readFileSync(item.path);
                return uploadPublicMedia(bytes, item.mimetype || 'image/jpeg', item.originalname || `upload-${index}.jpg`);
            })
        )

        const project = await prisma.project.create({ 
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,aspectRatio,
                targetLength: parseInt(targetLength),
                uploadedImages,
                isGenerating: true
            }
        })

        tempProjectId = project.id;
        const prompt = clipPrompt([
            'Image 1 is the product. Image 2 is the person.',
            'Create one photorealistic photo where the person naturally holds or uses the product.',
            'Match lighting, shadows, scale, and perspective. Professional studio lighting. E-commerce quality.',
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

            await prisma.project.update({
                where: {id: project.id},
                data: {
                    generatedImage,
                    isGenerating: false
                }
            })

            res.json({projectId: project.id, message: 'Image generated'})

    } catch (error:any) {
        const message = error?.message || 'Image generation failed';
        if(tempProjectId){
            // update project status and error message
            await prisma.project.update({
                where: {id: tempProjectId},
                data: {isGenerating: false, error: message}
            })
        }
        if(isCreditDeducted){
            // add credits back
            await prisma.user.update({
                where: {id: userId},
                data: {credits: {increment: 5}}
            })
        }
        console.error('[createProject Error]', message);
        Sentry.captureException(error);
        if (!res.headersSent) {
            res.status(500).json({ message });
        }
    } finally {
        for (const file of images) {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    }
}

export const createVideo = async (req:Request, res: Response) => {
    const {userId} = req.auth()
    const projectId = req.body?.projectId || req.params.projectId;
    let isCreditDeducted = false;

    if(!projectId){
        return res.status(400).json({ message: 'Project id is required' });
    }

    try {
        assertPollinationsKey();

        const user = await ensureUser(userId)
        if(user.credits < 10){
            return res.status(401).json({ message: 'Insufficient credits' });
        }

        const project = await prisma.project.findUnique({
            where: {id: projectId, userId}
        })

        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if(project.isGenerating){
            return res.status(409).json({ message: 'Generation in progress' });
        }
        if(project.generatedVideo){
            return res.status(409).json({ message: 'Video already generated' });
        }
        if(!project.generatedImage){
            return res.status(400).json({ message: 'Generated image not found' });
        }

        await prisma.user.update({
            where: {id: userId},
            data: {credits: {decrement: 10}}
        });
        isCreditDeducted = true;

        await prisma.project.update({
            where: {id: projectId},
            data: {isGenerating: true, error: ''}
        })

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
            durationSeconds: Math.max(project.targetLength || 0, 12),
        });

        const videoUrl = await uploadPublicMedia(video.buffer, 'video/mp4', `${userId}-${Date.now()}.mp4`);

        await prisma.project.update({
            where: {id: project.id},
            data: {
                generatedVideo: videoUrl,
                isGenerating: false,
                error: ''
            }
        })

        res.json({message: video.message, videoUrl})

    } catch (error:any) {
        const message = error?.message || 'Video generation failed';

        try {
            await prisma.project.update({
                where: {id: projectId, userId},
                data: {isGenerating: false, error: message}
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

        Sentry.captureException(error);
        if (!res.headersSent) {
            const paymentRequired = /pollen|top-up/i.test(message);
            res.status(paymentRequired ? 402 : 500).json({ message });
        }
    }
}

export const getAllPublishedProjects = async (req:Request, res: Response) => {
    try {

        const projects = await prisma.project.findMany({
            where: {isPublished: true}
        })
        res.json({projects})

    } catch (error:any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteProject = async (req:Request, res: Response) => {
    try {

        const { userId } = req.auth();
        const { projectId } = req.params;
        
        const project = await prisma.project.findUnique({
            where: {id: projectId, userId}
        })
        if (!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        await prisma.project.delete({
            where: {id: projectId}
        })
        res.json({ message: 'Project deleted' });

    } catch (error:any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}