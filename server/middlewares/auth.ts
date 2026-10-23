import { Request, Response, NextFunction } from 'express';
import * as Sentry from "@sentry/node"

export const protect = async (req: Request, res: Response, next:
NextFunction)=>{
    try{
        const {userId} = req.auth()

        if(!userId) {
            return res.status(401).json({ message: 'Please sign in again to continue.' })
        }
        next()
        } catch (error: unknown) {
            console.error('[auth Error]', error);
            Sentry.captureException(error)
            res.status(401).json({ message: 'Please sign in again to continue.' })
        }
    }