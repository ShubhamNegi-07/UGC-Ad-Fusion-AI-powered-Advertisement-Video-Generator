import { Request, Response } from 'express';
import * as Sentry from "@sentry/node"
import { prisma } from '../configs/prisma.js';
import { ensureUser } from '../utils/ensureUser.js';
import { isValidProjectId } from './projectController.js';

//Get User Credits
export const getUserCredits = async (req: Request, res: Response) => {
    try{

        const {userId} = req.auth();
        if(!userId) {return res.status(401).json({message: 'Unauthorized'})}

        const user = await ensureUser(userId)
        res.json({credits: user.credits})

    } catch (error: any) {
            console.error('[userController Error]', error);
            Sentry.captureException(error)
            res.status(500).json({ message: 'Internal server error' });           
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
                videoUrl: item.generatedVideo || '',
            })),
        })

    } catch (error: any) {
            console.error('[userController Error]', error);
            Sentry.captureException(error)
            res.status(500).json({ message: 'Internal server error' });           
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
                videoUrl: project.generatedVideo || '',
            },
        })

    } catch (error: any) {
            console.error('[userController Error]', error);
            Sentry.captureException(error)
            res.status(500).json({ message: 'Internal server error' });           
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
            return res.status(404).json({message: 'image or video not generated' })
        }
        
        const nextPublished = !project.isPublished;
        const updated = await prisma.project.updateMany({
            where: { id: projectId, userId },
            data: {isPublished: nextPublished}
        })
        if (updated.count === 0) {
            return res.status(404).json({message: 'Project not found' })
        }
        res.json({isPublished: nextPublished})

    } catch (error: any) {
            console.error('[userController Error]', error);
            Sentry.captureException(error)
            res.status(500).json({ message: 'Internal server error' });           
    }
}