import { Request, Response } from 'express';
import { verifyWebhook } from '@clerk/express/webhooks'
import { prisma } from '../configs/prisma.js';
import * as Sentry from "@sentry/node"

const clerkWebhooks = async (req: Request, res: Response) =>{
    try {
        const evt: any = await verifyWebhook(req)

        //Getting Data from request
        const{ data, type} = evt;
        const svixId = req.header('svix-id')?.trim();
        const eventKey = svixId || (data?.id ? `${type}:${data.id}:${data?.status || ''}` : '');

        if (eventKey) {
            const alreadyProcessed = await prisma.processedWebhookEvent.findUnique({
                where: { id: eventKey },
            });
            if (alreadyProcessed) {
                return res.json({ message: "Webhook already processed : " + type });
            }
        }

        //Switch Cases for different Events
        switch (type){
            // Safe create + update
            case "user.created":
            case "user.updated": {
                const email = data?.email_addresses?.[0]?.email_address || `${data.id}@users.local`;
                const name = [data?.first_name, data?.last_name].filter(Boolean).join(" ") || email;
                const image = data?.image_url || "";

                await prisma.user.upsert({
                    where: { id: data.id },
                    update: { email, name, image },
                    create: { id: data.id, email, name, image },
                });
                break;
            }
            
            case "user.deleted": {
                await prisma.user.deleteMany({
                    where: {id: data.id}})
                break;
            }

            case "paymentAttempt.updated": {
                if((data.charge_type === "recurring" || data.charge_type ===
                "checkout") && data.status === "paid"){
                    const clerkUserId = data?.payer?.user_id;
                    if (!clerkUserId || typeof clerkUserId !== "string") {
                        return res.status(400).json({ message: "Missing payer user id" });
                    }

                    const paymentEventKey = eventKey || `payment:${data.id || clerkUserId}`;
                    await prisma.processedWebhookEvent.create({
                        data: { id: paymentEventKey, type },
                    });
                    return res.json({ message: "Paid credit packs are not enabled. Balance stays capped at 20." });
                }
                break;
            }

            default:
                break;
        }

        if (eventKey) {
            await prisma.processedWebhookEvent.upsert({
                where: { id: eventKey },
                update: {},
                create: { id: eventKey, type },
            });
        }

        res.json({message: "Webhook Received : " + type})

    } catch (error: any) {
        if (error?.code === 'P2002') {
            return res.json({ message: "Webhook already processed" });
        }
        console.error("WEBHOOK ERROR:", error);
        Sentry.captureException(error)
        res.status(400).json({ message: "Webhook processing failed" });
        
    }
}

export default clerkWebhooks