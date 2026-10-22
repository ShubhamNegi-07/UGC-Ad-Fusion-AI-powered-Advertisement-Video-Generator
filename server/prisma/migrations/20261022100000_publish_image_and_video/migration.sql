-- AlterTable
ALTER TABLE "Project" ADD COLUMN "publishedImage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Project" ADD COLUMN "publishedVideo" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: keep already-published stills visible even after a video exists
UPDATE "Project"
SET "publishedImage" = true
WHERE "isPublished" = true AND "generatedImage" <> '';

UPDATE "Project"
SET "publishedVideo" = true
WHERE "isPublished" = true AND "generatedVideo" <> '';
