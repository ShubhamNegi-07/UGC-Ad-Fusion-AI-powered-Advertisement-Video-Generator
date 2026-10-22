import type { Project } from "@/Types";

export type PublishMedia = "image" | "video";

export function isStillPublished(project: Project) {
  if (typeof project.publishedImage === "boolean") return project.publishedImage;
  return Boolean(project.isPublished && project.generatedImage && !project.generatedVideo && !project.videoUrl);
}

export function isVideoPublished(project: Project) {
  if (typeof project.publishedVideo === "boolean") return project.publishedVideo;
  return Boolean(project.isPublished && (project.generatedVideo || project.videoUrl));
}

export function applyPublishFlags(
  project: Project,
  flags: { publishedImage?: boolean; publishedVideo?: boolean; isPublished?: boolean },
) {
  const publishedImage = flags.publishedImage ?? project.publishedImage ?? false;
  const publishedVideo = flags.publishedVideo ?? project.publishedVideo ?? false;
  return {
    ...project,
    publishedImage,
    publishedVideo,
    isPublished: flags.isPublished ?? (publishedImage || publishedVideo),
  };
}
