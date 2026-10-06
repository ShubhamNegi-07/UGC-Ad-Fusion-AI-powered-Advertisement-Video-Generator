import { useState, type Dispatch, type SetStateAction } from "react";
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
import { fadeUp } from "@/components/ui/motion";
import { cn, formatDate } from "@/lib/utils";

interface ProjectCardProps {
  gen: Project;
  setGenerations: Dispatch<SetStateAction<Project[]>>;
  forCommunity?: boolean;
}

function aspectClass(ratio: string) {
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

export default function ProjectCard({ gen, setGenerations, forCommunity = false }: ProjectCardProps) {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const hasMedia = Boolean(gen.generatedImage || gen.generatedVideo);

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
        prev.map((item) => (item.id === gen.id ? { ...item, isPublished: data.isPublished } : item)),
      );
      toast.success(data.isPublished ? "Published to community" : "Removed from community");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update project");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <motion.article
      layout
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group glass mb-4 break-inside-avoid overflow-hidden rounded-2xl transition-colors duration-300 hover:border-white/15"
    >
      <div className={cn("relative overflow-hidden bg-black/40", aspectClass(gen.aspectRatio))}>
        {!mediaLoaded && hasMedia && <Skeleton className="absolute inset-0 rounded-none" />}

        {gen.generatedImage && (
          <img
            src={gen.generatedImage}
            alt={gen.productName || "Generated image"}
            loading="lazy"
            onLoad={() => setMediaLoaded(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500",
              mediaLoaded ? "opacity-100" : "opacity-0",
              gen.generatedVideo ? "group-hover:opacity-0" : "group-hover:scale-[1.03]",
            )}
          />
        )}

        {gen.generatedVideo && (
          <video
            src={gen.generatedVideo}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setMediaLoaded(true)}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            onMouseEnter={(e) => void e.currentTarget.play().catch(() => undefined)}
            onMouseLeave={(e) => e.currentTarget.pause()}
          />
        )}

        {!hasMedia && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <span className="animate-pulse-ring flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              <HugeiconsIcon icon={Image02Icon} size={20} />
            </span>
            <p className="text-xs">{gen.isGenerating ? "Generating…" : "No media yet"}</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

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
                  variant="secondary"
                  size="icon-sm"
                  aria-label="Project actions"
                  className="bg-black/50 backdrop-blur-md hover:bg-black/70"
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

        {gen.uploadedImages?.length > 0 && (
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

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">{gen.productName || gen.name || "Untitled"}</h3>
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
            <Button variant="outline" size="sm" className="h-9" onClick={() => navigate(`/result/${gen.id}`)}>
              <HugeiconsIcon icon={Link01Icon} size={14} />
              Open
            </Button>
            <Button
              variant={gen.isPublished ? "secondary" : "default"}
              size="sm"
              className="h-9"
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
            <Button asChild variant="outline" size="sm" className="h-9 flex-1">
              <a href={gen.generatedVideo || gen.generatedImage} download target="_blank" rel="noreferrer">
                <HugeiconsIcon icon={Download01Icon} size={14} />
                Download
              </a>
            </Button>
            <Button variant="ghost" size="icon-sm" className="size-9" aria-label="Share" onClick={() => void shareProject(gen)}>
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
