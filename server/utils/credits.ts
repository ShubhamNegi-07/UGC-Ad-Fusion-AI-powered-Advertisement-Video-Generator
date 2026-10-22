import { prisma } from "../configs/prisma.js";

/** Hard ceiling. No refund, webhook, or upsert may store more than this. */
export const CREDIT_CAP = 20;

type CreditDb = {
  user: {
    updateMany: (typeof prisma)["user"]["updateMany"];
  };
  $executeRaw: (typeof prisma)["$executeRaw"];
};

export async function deductCredits(db: CreditDb, userId: string, amount: number) {
  if (!userId || amount <= 0) return false;
  const deducted = await db.user.updateMany({
    where: { id: userId, credits: { gte: amount } },
    data: { credits: { decrement: amount } },
  });
  return deducted.count > 0;
}

/** Refund a spend. Never raises the balance above CREDIT_CAP. */
export async function refundCredits(db: CreditDb, userId: string, amount: number) {
  if (!userId || amount <= 0) return;
  await db.$executeRaw`
    UPDATE "User"
    SET credits = LEAST(${CREDIT_CAP}, GREATEST(0, credits + ${amount}))
    WHERE id = ${userId}
  `;
}

export async function clampUserCredits<T extends { id: string; credits: number }>(user: T): Promise<T> {
  if (user.credits <= CREDIT_CAP && user.credits >= 0) return user;
  const credits = Math.max(0, Math.min(CREDIT_CAP, user.credits));
  await prisma.user.update({
    where: { id: user.id },
    data: { credits },
  });
  return { ...user, credits };
}
