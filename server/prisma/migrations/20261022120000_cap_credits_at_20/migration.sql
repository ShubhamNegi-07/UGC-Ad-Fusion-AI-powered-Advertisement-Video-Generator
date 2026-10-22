UPDATE "User" SET credits = 20 WHERE credits > 20;
UPDATE "User" SET credits = 0 WHERE credits < 0;

ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_credits_range";
ALTER TABLE "User" ADD CONSTRAINT "User_credits_range" CHECK (credits >= 0 AND credits <= 20);
