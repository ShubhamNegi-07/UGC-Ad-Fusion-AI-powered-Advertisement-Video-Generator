import { assets } from "@/assets/assets";
import type { Project } from "@/Types";

export const sampleOutputTiles = [
  {
    type: "video" as const,
    src: assets.generatedVideo1,
    poster: assets.generated1,
    name: "Talking",
    blurb: "Creator talks to camera and shows the product.",
  },
  {
    type: "image" as const,
    src: assets.generated2,
    name: "Fusion",
    blurb: "Product and model fused into one still.",
  },
  {
    type: "image" as const,
    src: assets.generated3,
    name: "Sneakers",
    blurb: "Street-style still with the product in hand.",
  },
  {
    type: "image" as const,
    src: assets.generated4,
    name: "Studio",
    blurb: "Clean fused frame, ready to animate.",
  },
  {
    type: "video" as const,
    src: assets.generatedVideo2,
    poster: assets.headphonesPoster,
    name: "Headphones",
    blurb: "Creator-style clip showing the product to camera.",
  },
  {
    type: "image" as const,
    src: assets.generated1,
    name: "Creator",
    blurb: "Sample product-and-model still from the generator.",
  },
];

const SAMPLE_AUTHOR = { id: "ugc-ai", name: "UGC.AI", image: "" };

export function isSampleProjectId(id: string) {
  return id.startsWith("sample-");
}

export function sampleCommunityProjects(): Project[] {
  return sampleOutputTiles.map((tile, index) => {
    const slug = tile.name.toLowerCase();
    const isVideo = tile.type === "video";
    return {
      id: `sample-${slug}`,
      feedId: `sample-${slug}-${tile.type}`,
      feedKind: isVideo ? "video" : "image",
      name: tile.name,
      productName: tile.name,
      productDescription: tile.blurb,
      aspectRatio: "9:16",
      generatedImage: isVideo ? tile.poster : tile.src,
      generatedVideo: isVideo ? tile.src : "",
      videoUrl: isVideo ? tile.src : "",
      isGenerating: false,
      isPublished: true,
      publishedImage: !isVideo,
      publishedVideo: isVideo,
      uploadedImages: [],
      createdAt: new Date(Date.UTC(2026, 9, 1, 12, index)).toISOString(),
      user: SAMPLE_AUTHOR,
    };
  });
}

export function withSampleCommunityProjects(projects: Project[]) {
  const samples = sampleCommunityProjects();
  const sampleIds = new Set(samples.map((item) => item.id));
  return [...samples, ...projects.filter((item) => !sampleIds.has(item.id) && !isSampleProjectId(item.id))];
}
