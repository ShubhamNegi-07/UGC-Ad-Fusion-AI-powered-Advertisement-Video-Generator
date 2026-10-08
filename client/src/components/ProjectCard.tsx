import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  Download01Icon,
  GlobalIcon,
  Image02Icon,
  Link01Icon,
  LockIcon,
  MoreHorizontalIcon,
  PlayIcon,
  Share08Icon,
  Video02Icon,
} from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp, studioReveal } from "@/components/ui/motion";
import { StudioMediaBackdrop } from "@/components/studio/StudioMediaFill";
import { writeCachedProject } from "@/lib/studio-cache";
import { cn, formatDate } from "@/lib/utils";

interface ProjectCardProps {
  gen: Project;
  setGenerations: Dispatch<SetStateAction<Project[]>>;
  forCommunity?: boolean;
  studio?: boolean;
  /** Community feed row layout (studio). */
  feed?: boolean;
}

function aspectClass(ratio: string, studioGrid?: boolean) {
  if (studioGrid) {
    if (ratio === "9:16") return "aspect-[9/16] max-h-[min(480px,52vh)] w-full";
    if (ratio === "1:1") return "aspect-square max-h-[min(400px,44vh)] w-full";
    return "aspect-video max-h-[min(320px,36vh)] w-full";
  }
  if (ratio === "9:16") return "aspect-[9/16]";
  if (ratio === "1:1") return "aspect-square";
  return "aspect-video";
}


async function shareProject(gen: Project) {
  const url = gen.generatedVideo || gen.generatedImage;
  if (!url) return;
  const payload = { url, title: gen.productName, text: gen.productDescription };
  try {
    if (typeof navigator.share === "function") {
      await navigator.share(payload);
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  } catch (error) {
    if ((error as DOMException)?.name !== "AbortError") toast.error("Could not share this project");
  }
}

export default function ProjectCard({ gen, setGenerations, forCommunity = false, studio = false, feed = false }: ProjectCardProps) {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaInView, setMediaInView] = useState(false);
  const mediaWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasMedia = Boolean(gen.generatedImage || gen.generatedVideo);

  useEffect(() => {
    if (!studio || !gen.generatedVideo) return;
    const wrap = mediaWrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setMediaInView(visible);
        if (visible) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [studio, gen.generatedVideo]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const token = await getToken();
      await api.delete(`/api/project/${gen.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setGenerations((prev) => prev.filter((item) => item.id !== gen.id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete project");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const togglePublish = async () => {
    try {
      setPublishing(true);
      const token = await getToken();
      const { data } = await api.get(`/api/user/publish/${gen.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenerations((prev) =>
        prev.map((item) => {
          if (item.id !== gen.id) return item;
          const next = { ...item, isPublished: data.isPublished };
          writeCachedProject(next);
          return next;
        }),
      );
      toast.success(data.isPublished ? "Published to community" : "Removed from community");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update project");
    } finally {
      setPublishing(false);
    }
  };

  const motionVariants = studio ? studioReveal : fadeUp;

  return (
    <motion.article
      layout={!studio}
      variants={motionVariants}
      initial="hidden"
      animate="show"
      exit={studio ? { opacity: 1, y: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      whileHover={studio ? undefined : { y: -3 }}
      transition={studio ? undefined : { type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "group overflow-hidden rounded-[var(--radius-lg)] border border-border transition-colors duration-200",
        studio ? "surface-panel mb-0 break-inside-auto" : "glass mb-4 break-inside-avoid hover:border-white/15",
        feed && "flex flex-col sm:flex-row sm:items-stretch",
      )}
    >
      <div
        ref={mediaWrapRef}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-[var(--studio-media-bg,#020617)]",
          aspectClass(gen.aspectRatio, studio && !feed),
          feed ? "w-full sm:w-44 md:w-52" : "w-full",
        )}
      >
        {!mediaLoaded && hasMedia && <Skeleton className="absolute inset-0 z-0 rounded-none" />}

        {gen.generatedImage && studio && (
          <>
            <StudioMediaBackdrop src={gen.generatedImage} />
            <img
              src={gen.generatedImage}
              alt={gen.productName || "Generated image"}
              loading="lazy"
              width={768}
              height={1376}
              onLoad={() => setMediaLoaded(true)}
              className={cn(
                "absolute inset-0 z-[1] h-full w-full object-contain",
                mediaLoaded ? "opacity-100" : "opacity-0",
                gen.generatedVideo &&
                  studio &&
                  mediaInView &&
                  "opacity-0 transition-opacity duration-300",
                gen.generatedVideo && !studio && "transition-opacity duration-300 group-hover:opacity-0",
              )}
            />
          </>
        )}

        {gen.generatedImage && !studio && (
          <img
            src={gen.generatedImage}
            alt={gen.productName || "Generated image"}
            loading="lazy"
            width={768}
            height={1376}
            onLoad={() => setMediaLoaded(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              "transition-[opacity,transform] duration-500",
              mediaLoaded ? "opacity-100" : "opacity-0",
              gen.generatedVideo ? "group-hover:opacity-0" : "group-hover:scale-[1.03]",
            )}
          />
        )}

        {gen.generatedVideo && (
          <video
            ref={videoRef}
            src={gen.generatedVideo}
            poster={gen.generatedImage}
            muted
            loop
            playsInline
            preload="metadata"
            width={768}
            height={1376}
            onLoadedData={() => setMediaLoaded(true)}
            className={cn(
              "absolute inset-0 z-[2] h-full w-full transition-opacity duration-300",
              studio
                ? cn("object-contain", mediaInView ? "opacity-100" : "opacity-0")
                : "object-cover opacity-0 group-hover:opacity-100",
            )}
            onMouseEnter={studio ? undefined : (e) => void e.currentTarget.play().catch(() => undefined)}
            onMouseLeave={studio ? undefined : (e) => e.currentTarget.pause()}
          />
        )}

        {!hasMedia && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <span
              className={cn(
                "animate-pulse-ring flex size-12 items-center justify-center rounded-full border",
                studio ? "border-border bg-muted" : "border-white/10 bg-white/[0.05]",
              )}
            >
              <HugeiconsIcon icon={Image02Icon} size={20} aria-hidden />
            </span>
            <p className="text-xs">{gen.isGenerating ? "Generating…" : "No media yet"}</p>
          </div>
        )}

        {!studio && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />}
        {studio && hasMedia && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-border/80 bg-card/90 px-2 py-1 sm:hidden" aria-hidden />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          {gen.isGenerating && (
            <Badge variant="warning">
              <span className="size-1.5 animate-pulse rounded-full bg-amber-300" />
              Generating
            </Badge>
          )}
          {gen.isPublished && (
            <Badge variant="success">
              <HugeiconsIcon icon={GlobalIcon} />
              Published
            </Badge>
          )}
          {gen.generatedVideo && (
            <Badge>
              <HugeiconsIcon icon={PlayIcon} />
              Video
            </Badge>
          )}
        </div>

        {!forCommunity && (
          <div className="absolute right-3 top-3 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  framer={false}
                  variant="secondary"
                  size="icon-sm"
                  aria-label="Project actions"
                  className={cn(
                    "size-11 min-h-[44px] min-w-[44px]",
                    studio ? "border border-border bg-card hover:bg-muted" : "bg-black/50 backdrop-blur-md hover:bg-black/70",
                  )}
                >
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={16} strokeWidth={2.2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {gen.generatedImage && (
                  <DropdownMenuItem asChild>
                    <a href={gen.generatedImage} download target="_blank" rel="noreferrer">
                      <HugeiconsIcon icon={Image02Icon} />
                      Download image
                    </a>
                  </DropdownMenuItem>
                )}
                {gen.generatedVideo && (
                  <DropdownMenuItem asChild>
                    <a href={gen.generatedVideo} download target="_blank" rel="noreferrer">
                      <HugeiconsIcon icon={Video02Icon} />
                      Download video
                    </a>
                  </DropdownMenuItem>
                )}
                {hasMedia && (
                  <DropdownMenuItem onSelect={() => void shareProject(gen)}>
                    <HugeiconsIcon icon={Share08Icon} />
                    Share
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
                  <HugeiconsIcon icon={Delete02Icon} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {!studio && gen.uploadedImages?.length > 0 && (
          <div className="absolute bottom-3 right-3 flex -space-x-3">
            {gen.uploadedImages.slice(0, 2).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={i === 0 ? "Product source" : "Model source"}
                loading="lazy"
                className="size-11 rounded-full border-2 border-background/80 object-cover shadow-lg transition-transform duration-300 group-hover:-translate-y-1"
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className={cn("min-w-0 flex-1 p-4", feed && "flex flex-col justify-center")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "text-[15px] font-semibold tracking-tight",
                feed || (studio && forCommunity) ? "line-clamp-2 text-pretty" : "truncate",
              )}
            >
              {gen.productName || gen.name || "Untitled"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(gen.createdAt)}</p>
          </div>
          <Badge variant="outline" className="shrink-0 font-mono">
            {gen.aspectRatio}
          </Badge>
        </div>

        {(gen.productDescription || gen.userPrompt) && (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {gen.productDescription || gen.userPrompt}
          </p>
        )}

        {!forCommunity && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              framer={false}
              variant="outline"
              size="sm"
              className="min-h-11"
              onClick={() => navigate(`/result/${gen.id}`)}
            >
              <HugeiconsIcon icon={Link01Icon} size={14} />
              Open
            </Button>
            <Button
              framer={false}
              variant={gen.isPublished ? "secondary" : "gradient"}
              size="sm"
              className="min-h-11"
              loading={publishing}
              loadingText={gen.isPublished ? "Unpublishing" : "Publishing"}
              disabled={!hasMedia}
              onClick={togglePublish}
            >
              <HugeiconsIcon icon={gen.isPublished ? LockIcon : GlobalIcon} size={14} />
              {gen.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
        )}

        {forCommunity && hasMedia && (
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline" size="sm" className="min-h-11 flex-1">
              <a href={gen.generatedVideo || gen.generatedImage} download target="_blank" rel="noreferrer">
                <HugeiconsIcon icon={Download01Icon} size={14} />
                Download
              </a>
            </Button>
            <Button variant="ghost" size="icon-sm" className="size-11 min-h-[44px] min-w-[44px]" aria-label="Share" onClick={() => void shareProject(gen)}>
              <HugeiconsIcon icon={Share08Icon} size={15} />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              “{gen.productName || "This project"}” and its generated media will be removed permanently. Credits are not refunded.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={deleting} loadingText="Deleting">
              <HugeiconsIcon icon={Delete02Icon} size={15} />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}
