import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { ensureUser } from '../utils/ensureUser.js';
import { isValidProjectId } from './projectController.js';
import { sanitizeStoredMessage, sendError } from '../utils/errors.js';

//Get User Credits
export const getUserCredits = async (req: Request, res: Response) => {
    try{

        const {userId} = req.auth();
        if(!userId) {return res.status(401).json({message: 'Please sign in again to continue.'})}

        const user = await ensureUser(userId)
        res.json({credits: user.credits})

    } catch (error: unknown) {
        return sendError(res, error, '[userController Error]');
    }
}

// const get all user projects
export const getAllProjects = async (req: Request, res: Response) =>{
    try{

        const {userId} = req.auth();
        const projects = await prisma.project.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'}
        })
        res.json({
            projects: projects.map((item) => ({
                ...item,
                error: sanitizeStoredMessage(item.error),
                videoUrl: item.generatedVideo || '',
                uploadedImages: [],
            })),
        })

    } catch (error: unknown) {
        return sendError(res, error, '[userController Error]');
    }
}

// get project by id 
export const getProjectById = async (req: Request, res: Response) =>{
    try{

        const {userId} = req.auth();
        const {projectId} = req.params;
        if (!isValidProjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid project id' });
        }

        const project = await prisma.project.findFirst({
            where: {id: projectId, userId}
        })
        
        if (!project) { return res.status(404).json({message: 'Project not found' })}
        res.json({
            project: {
                ...project,
                error: sanitizeStoredMessage(project.error),
                videoUrl: project.generatedVideo || '',
                uploadedImages: [],
            },
        })

    } catch (error: unknown) {
        return sendError(res, error, '[userController Error]');
    }
}

// publish / unpublish project
export const toggleProjectPublic = async (req: Request, res: Response) =>{
    try{

        const {userId} = req.auth();
        const {projectId} = req.params;
        if (!isValidProjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid project id' });
        }

        const project = await prisma.project.findFirst({
            where: {id: projectId, userId}
        })

        if (!project) { return res.status(404).json({message: 'Project not found' })}

        if(!project?.generatedImage && !project?.generatedVideo){
            return res.status(400).json({message: 'Generate a still or video before publishing' })
        }

        const requested = req.body?.media === 'video' ? 'video' : req.body?.media === 'image' ? 'image' : undefined;
        const hasImage = Boolean(project.generatedImage);
        const hasVideo = Boolean(project.generatedVideo);
        const media = requested ?? (hasVideo && !hasImage ? 'video' : hasImage && !hasVideo ? 'image' : 'both');

        if (media === 'image' && !hasImage) {
            return res.status(400).json({ message: 'Generate a still first' });
        }
        if (media === 'video' && !hasVideo) {
            return res.status(400).json({ message: 'Generate a video first' });
        }

        let publishedImage = Boolean(project.publishedImage && hasImage);
        let publishedVideo = Boolean(project.publishedVideo && hasVideo);

        if (media === 'image') {
            publishedImage = !publishedImage;
        } else if (media === 'video') {
            publishedVideo = !publishedVideo;
        } else {
            const next = !(publishedImage || publishedVideo || project.isPublished);
            publishedImage = next && hasImage;
            publishedVideo = next && hasVideo;
        }

        const isPublished = publishedImage || publishedVideo;
        const updated = await prisma.project.updateMany({
            where: { id: projectId, userId },
            data: { publishedImage, publishedVideo, isPublished },
        })
        if (updated.count === 0) {
            return res.status(404).json({message: 'Project not found' })
        }
        res.json({ publishedImage, publishedVideo, isPublished })

    } catch (error: unknown) {
        return sendError(res, error, '[userController Error]');
    }
}