import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, PlayIcon, Share08Icon } from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { studioReveal, studioStagger } from "@/components/ui/motion";
import { cn, formatDate } from "@/lib/utils";

const COMMUNITY_MEDIA_HEIGHT = "h-[min(17.5rem,34dvh)] w-full sm:h-[min(19rem,36dvh)]";

async function shareProject(gen: Project) {
  const url = gen.generatedVideo || gen.generatedImage;
  if (!url) return;
  try {
    if (typeof navigator.share === "function") {
      await navigator.share({ url, title: gen.productName, text: gen.productDescription });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  } catch (error) {
    if ((error as DOMException)?.name !== "AbortError") toast.error("Could not share this project");
  }
}

function aspectBoxClass(ratio?: string) {
  if (ratio === "16:9") return "aspect-video w-full max-h-full";
  if (ratio === "1:1") return "aspect-square h-full max-w-full";
  return "aspect-[9/16] h-full max-w-full";
}

function CommunityTile({ project }: { project: Project }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const videoSrc = project.videoUrl || project.generatedVideo;
  const mediaSrc = videoSrc || project.generatedImage;
  const hasVideo = Boolean(videoSrc);

  useEffect(() => {
    if (!hasVideo) return;
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [hasVideo]);

  if (!mediaSrc) return null;

  return (
    <article
      ref={wrapRef}
      className="surface-panel group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border transition-colors duration-200 hover:border-white/15"
    >
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-[var(--studio-media-bg,#020617)] p-2.5",
          COMMUNITY_MEDIA_HEIGHT,
        )}
      >
        {hasVideo && (
          <div className="pointer-events-none absolute left-3 top-3 z-[4] flex max-w-[calc(100%-6.5rem)] flex-wrap items-center gap-1.5">
            <Badge className="border-0 bg-brand/90 text-[10px] text-white shadow-sm">
              <HugeiconsIcon icon={PlayIcon} size={10} aria-hidden />
              Video
            </Badge>
          </div>
        )}

        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden rounded-[var(--radius-md)] ring-1 ring-white/10 bg-black/40",
            aspectBoxClass(project.aspectRatio),
          )}
        >
          {!loaded && <Skeleton className="absolute inset-0 z-[2] rounded-[var(--radius-md)]" />}

          {hasVideo ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={project.generatedImage}
              muted
              loop
              playsInline
              preload="auto"
              onLoadedMetadata={() => setLoaded(true)}
              onLoadedData={() => setLoaded(true)}
              className={cn(
                "relative z-[1] h-full w-full object-cover object-center transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />
          ) : (
            <img
              src={project.generatedImage}
              alt={project.productName || "Community ad"}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              className={cn(
                "relative z-[1] h-full w-full object-cover object-center transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </div>

        <div className="absolute right-2.5 top-2.5 z-[4] flex gap-1.5 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Button
            framer={false}
            variant="secondary"
            size="icon-sm"
            className="size-9 border-white/15 bg-black/55 backdrop-blur-md hover:bg-black/70"
            aria-label="Share"
            onClick={() => void shareProject(project)}
          >
            <HugeiconsIcon icon={Share08Icon} size={15} />
          </Button>
          <Button
            framer={false}
            asChild
            variant="secondary"
            size="icon-sm"
            className="size-9 border-white/15 bg-black/55 backdrop-blur-md hover:bg-black/70"
          >
            <a href={mediaSrc} download target="_blank" rel="noreferrer" aria-label="Download">
              <HugeiconsIcon icon={Download01Icon} size={15} />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-auto flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                {project.productName || project.name || "Untitled"}
              </h3>
              {project.createdAt && (
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(project.createdAt)}</p>
              )}
            </div>
            <Badge variant="outline" className="shrink-0 font-mono text-[11px]">
              {project.aspectRatio || "9:16"}
            </Badge>
          </div>

          {(project.productDescription || project.userPrompt) && (
            <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
              {project.productDescription || project.userPrompt}
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button asChild framer={false} variant="outline" size="sm" className="min-h-9 flex-1">
            <a href={mediaSrc} download target="_blank" rel="noreferrer">
              <HugeiconsIcon icon={Download01Icon} size={14} />
              Download
            </a>
          </Button>
          <Button
            framer={false}
            variant="outline"
            size="sm"
            className="min-h-9 flex-1"
            onClick={() => void shareProject(project)}
          >
            <HugeiconsIcon icon={Share08Icon} size={14} />
            Share
          </Button>
        </div>
      </div>
    </article>
  );
}

export type CommunityMasonryProps = {
  projects: Project[];
  className?: string;
};

export default function CommunityMasonry({ projects, className }: CommunityMasonryProps) {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.03, 0.04);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className={cn(
        "grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={enter} className="flex min-w-0">
          <CommunityTile project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
