import { clerkClient } from '@clerk/express';
import { prisma } from '../configs/prisma.js';

export async function ensureUser(userId: string) {
    const existing = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (existing) return existing;

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses.find((item) => item.id === clerkUser.primaryEmailAddressId)?.emailAddress
        || clerkUser.emailAddresses[0]?.emailAddress
        || `${userId}@users.local`;
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || email;

    return prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email,
            name,
            image: clerkUser.imageUrl || '',
        },
    });
}
