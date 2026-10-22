import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, PlayIcon, Share08Icon } from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadMediaFile, fileSlug } from "@/lib/download";
import { cn, formatDate } from "@/lib/utils";

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

function authorName(project: Project) {
  const name = project.user?.name?.replace(/\s+/g, " ").trim();
  if (!name) return "Creator";
  if (name.includes("@")) return name.split("@")[0] || "Creator";
  return name;
}

function displayTitle(project: Project) {
  const title = (project.productName || project.name || "").replace(/\s+/g, " ").trim();
  return title.length >= 3 ? title : "";
}

async function downloadProject(project: Project, url: string, hasVideo: boolean) {
  try {
    await downloadMediaFile(url, `${fileSlug(project.productName || project.name || "ad")}${hasVideo ? ".mp4" : ".jpg"}`);
  } catch {
    toast.error("Could not download this file");
  }
}

function mediaFrameClass(ratio: string) {
  if (ratio === "16:9") return "aspect-video w-full";
  if (ratio === "1:1") return "aspect-square w-full";
  return "mx-auto aspect-[9/16] w-full max-w-[min(100%,18rem)]";
}

function CommunityTile({ project }: { project: Project }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sawObserver = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const videoSrc = project.feedKind === "image" ? "" : project.videoUrl || project.generatedVideo || "";
  const mediaSrc = project.feedKind === "image" ? project.generatedImage : videoSrc || project.generatedImage;
  const hasVideo = Boolean(videoSrc);
  const name = authorName(project);
  const avatar = project.user?.image?.trim();
  const initial = name.charAt(0).toUpperCase() || "C";
  const title = displayTitle(project);
  const date = formatDate(project.createdAt);
  const ratio = project.aspectRatio || "9:16";
  const mediaAlt = title || name;

  const [videoActive, setVideoActive] = useState(false);

  useEffect(() => {
    if (!hasVideo) return;
    const target = mediaRef.current || wrapRef.current;
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        sawObserver.current = true;
        setVideoActive(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: "240px 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [hasVideo, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    const markReady = () => {
      if (video.readyState >= 1) setLoaded(true);
    };
    markReady();

    const tryPlay = () => {
      markReady();
      if (!videoActive) return;
      void video.play().catch(() => undefined);
    };

    if (videoActive) tryPlay();
    else if (sawObserver.current) video.pause();

    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("playing", markReady);
    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("playing", markReady);
    };
  }, [hasVideo, videoActive, videoSrc]);

  if (!mediaSrc) return null;

  return (
    <article
      ref={wrapRef}
      className="surface-panel group relative flex w-full min-w-0 flex-col overflow-hidden rounded-[1.1rem] border border-white/8 transition-colors duration-200 hover:border-white/16"
    >
      <div
        className={cn(
          "relative flex items-center justify-center bg-[var(--studio-media-bg,#070b12)]",
          ratio === "9:16" ? "px-3 py-3" : "",
        )}
      >
        <div
          ref={mediaRef}
          className={cn("relative overflow-hidden", mediaFrameClass(ratio), ratio === "9:16" && "rounded-lg ring-1 ring-white/10")}
        >
          {!loaded && <Skeleton className="absolute inset-0 z-[2] rounded-none" />}

          {hasVideo ? (
            <video
              ref={videoRef}
              key={videoSrc}
              src={videoSrc}
              poster={project.generatedImage}
              muted
              loop
              playsInline
              autoPlay
              preload={videoActive ? "auto" : "metadata"}
              onLoadedMetadata={() => setLoaded(true)}
              onLoadedData={() => setLoaded(true)}
              onPlaying={() => setLoaded(true)}
              className="absolute inset-0 z-[1] h-full w-full object-cover object-center"
            />
          ) : (
            <img
              src={project.generatedImage}
              alt={mediaAlt}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />
          )}

          {hasVideo ? (
            <div className="pointer-events-none absolute left-2 top-2 z-[3]">
              <Badge className="border-0 bg-black/55 text-[10px] text-white shadow-sm backdrop-blur-md">
                <HugeiconsIcon icon={PlayIcon} size={10} aria-hidden />
                Video
              </Badge>
            </div>
          ) : (
            <div className="pointer-events-none absolute left-2 top-2 z-[3]">
              <Badge className="border-0 bg-black/55 text-[10px] text-white shadow-sm backdrop-blur-md">
                Image
              </Badge>
            </div>
          )}

          {ratio !== "9:16" ? (
            <div className="absolute right-1.5 top-1.5 z-[3] flex gap-1">
              <Button
                framer={false}
                variant="secondary"
                size="icon-sm"
                className="!size-6 !min-h-6 !min-w-6 border-white/15 bg-black/55 p-0 backdrop-blur-md hover:bg-black/70"
                aria-label="Share"
                onClick={() => void shareProject(project)}
              >
                <HugeiconsIcon icon={Share08Icon} size={11} />
              </Button>
              <Button
                framer={false}
                variant="secondary"
                size="icon-sm"
                className="!size-6 !min-h-6 !min-w-6 border-white/15 bg-black/55 p-0 backdrop-blur-md hover:bg-black/70"
                aria-label="Download"
                onClick={() => void downloadProject(project, mediaSrc, hasVideo)}
              >
                <HugeiconsIcon icon={Download01Icon} size={11} />
              </Button>
            </div>
          ) : null}
        </div>

        {ratio === "9:16" ? (
          <div className="absolute right-1.5 top-2 z-[3] flex flex-col gap-1">
            <Button
              framer={false}
              variant="secondary"
              size="icon-sm"
              className="!size-6 !min-h-6 !min-w-6 border-white/15 bg-black/45 p-0 backdrop-blur-md hover:bg-black/70"
              aria-label="Share"
              onClick={() => void shareProject(project)}
            >
              <HugeiconsIcon icon={Share08Icon} size={11} />
            </Button>
            <Button
              framer={false}
              variant="secondary"
              size="icon-sm"
              className="!size-6 !min-h-6 !min-w-6 border-white/15 bg-black/45 p-0 backdrop-blur-md hover:bg-black/70"
              aria-label="Download"
              onClick={() => void downloadProject(project, mediaSrc, hasVideo)}
            >
              <HugeiconsIcon icon={Download01Icon} size={11} />
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex items-start gap-2 px-3.5 py-3">
        {avatar && !avatarFailed ? (
          <img
            src={avatar}
            alt=""
            onError={() => setAvatarFailed(true)}
            className="mt-0.5 size-6 shrink-0 rounded-full object-cover ring-1 ring-white/12"
          />
        ) : (
          <span
            aria-hidden
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[10px] font-semibold text-brand-muted"
          >
            {initial}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight text-foreground">{name}</p>
          {title ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{title}</p> : null}
          <div className="mt-1 flex items-end justify-between gap-2">
            {date ? <p className="truncate text-[11px] text-muted-foreground">{date}</p> : <span />}
            <p className="shrink-0 font-mono text-[11px] text-muted-foreground">{ratio}</p>
          </div>
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
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(16.5rem,1fr))] sm:gap-5",
        className,
      )}
    >
      {projects.map((project) => (
        <div key={project.feedId || project.id} className="min-w-0">
          <CommunityTile project={project} />
        </div>
      ))}
    </div>
  );
}
