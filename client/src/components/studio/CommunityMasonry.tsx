import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, PlayIcon, Share08Icon } from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import { StudioMediaBackdrop } from "@/components/studio/StudioMediaFill";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMasonryColumns } from "@/hooks/useMasonryColumns";
import { cn } from "@/lib/utils";

function aspectClass(ratio: string) {
  if (ratio === "9:16") return "aspect-[9/16]";
  if (ratio === "1:1") return "aspect-square";
  return "aspect-video";
}

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

function MasonryTile({ project }: { project: Project }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const mediaSrc = project.generatedVideo || project.generatedImage;
  const hasVideo = Boolean(project.generatedVideo);

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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1018] shadow-[0_12px_40px_rgb(0_0_0_/_0.35)]"
    >
      <div className={cn("relative w-full", aspectClass(project.aspectRatio))}>
        <StudioMediaBackdrop src={project.generatedImage || mediaSrc} />
        {hasVideo ? (
          <video
            ref={videoRef}
            src={project.generatedVideo}
            poster={project.generatedImage}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            className={cn(
              "relative z-[1] h-full w-full object-contain transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
        ) : (
          <img
            src={project.generatedImage}
            alt={project.productName || "Community ad"}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={cn(
              "relative z-[1] h-full w-full object-contain transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 pt-10">
          <p className="line-clamp-2 text-sm font-semibold text-white">{project.productName || "Untitled"}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-white/20 bg-black/30 font-mono text-[10px] text-white/90">
              {project.aspectRatio}
            </Badge>
            {hasVideo && (
              <Badge className="border-0 bg-brand/90 text-[10px] text-white">
                <HugeiconsIcon icon={PlayIcon} size={10} aria-hidden />
                Video
              </Badge>
            )}
          </div>
        </div>
        <div className="absolute right-3 top-3 z-[3] flex gap-1.5 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Button
            framer={false}
            variant="secondary"
            size="icon-sm"
            className="size-9 border-white/15 bg-black/50 backdrop-blur-md"
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
            className="size-9 border-white/15 bg-black/50 backdrop-blur-md"
          >
            <a href={mediaSrc} download target="_blank" rel="noreferrer" aria-label="Download">
              <HugeiconsIcon icon={Download01Icon} size={15} />
            </a>
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
  const columnCount = projects.length >= 8 ? 5 : projects.length >= 4 ? 4 : projects.length >= 2 ? 3 : 2;
  const columns = useMasonryColumns(projects, columnCount);

  const wall = (
    <div className="inline-flex items-start gap-4 p-2 sm:gap-5 sm:p-4">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex w-[min(17.5rem,78vw)] shrink-0 flex-col gap-4 sm:w-72 sm:gap-5">
          {col.map((project) => (
            <MasonryTile key={project.id} project={project} />
          ))}
        </div>
      ))}
    </div>
  );

  if (reduceMotion) {
    return (
      <div className={cn("overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]", className)}>
        {wall}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Drag to explore the wall
      </p>
      <div className="relative h-[min(72vh,720px)] overflow-hidden rounded-2xl border border-white/10 bg-[#080c14]/80 shadow-inner">
        <div className="monex-backdrop-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <motion.div
          drag
          dragConstraints={{ left: -1400, right: 48, top: -900, bottom: 48 }}
          dragElastic={0.06}
          dragTransition={{ bounceStiffness: 280, bounceDamping: 32 }}
          whileDrag={{ cursor: "grabbing" }}
          className="absolute left-0 top-0 cursor-grab touch-none select-none active:cursor-grabbing"
        >
          {wall}
        </motion.div>
      </div>
    </div>
  );
}
