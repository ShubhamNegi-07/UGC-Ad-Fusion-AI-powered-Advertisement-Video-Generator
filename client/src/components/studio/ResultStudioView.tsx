import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiVideoIcon,
  Alert02Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Coins01Icon,
  Image02Icon,
  Mic01Icon,
  PlusSignIcon,
  Share08Icon,
  Video02Icon,
} from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studioReveal, studioStagger } from "@/components/ui/motion";
import { useVisualViewportInset } from "@/hooks/useVisualViewportInset";
import { cn, formatDate } from "@/lib/utils";

export function ResultStudioSkeleton() {
  return (
    <div className="grid max-w-full gap-5 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <Skeleton className="aspect-[9/16] max-h-[min(52dvh,520px)] w-full rounded-[var(--radius-lg)] sm:aspect-video" />
      <div className="space-y-3">
        <Skeleton className="h-36 rounded-[var(--radius-lg)]" />
        <Skeleton className="h-44 rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}

export type ResultStudioViewProps = {
  loading: boolean;
  project: Project | null;
  isGenerating: boolean;
  mediaReady: boolean;
  onMediaReady: () => void;
  onGenerateVideo: () => void;
  onShare: () => void;
  rootId?: string;
  className?: string;
  /** Hide mobile sticky CTA (dev layout). */
  hideStickyVideoBar?: boolean;
};

function mediaFrameClass(aspectRatio: string) {
  return cn(
    "relative mx-auto w-full max-w-full overflow-hidden rounded-[var(--radius-md)] bg-black",
    aspectRatio === "16:9" && "aspect-video max-h-[min(52dvh,520px)]",
    aspectRatio === "1:1" && "aspect-square max-h-[min(52dvh,480px)]",
    aspectRatio !== "16:9" && aspectRatio !== "1:1" && "aspect-[9/16] max-h-[min(52dvh,520px)]",
  );
}

function VideoGenerateBlock({
  hasVideo,
  hasImage,
  isGenerating,
  projectError,
  onGenerateVideo,
  layout,
}: {
  hasVideo: boolean;
  hasImage: boolean;
  isGenerating: boolean;
  projectError?: string;
  onGenerateVideo: () => void;
  layout: "sidebar" | "sticky";
}) {
  if (hasVideo) {
    return (
      <div
        className="flex items-center gap-3 rounded-[var(--radius-md)] border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
        role="status"
        aria-live="polite"
      >
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} aria-hidden />
        Video generated successfully
      </div>
    );
  }

  return (
    <div className={cn(layout === "sticky" && "flex flex-col gap-2")}>
      {layout === "sidebar" && (
        <ul className="mb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-muted px-2.5 py-2">
            <HugeiconsIcon icon={Mic01Icon} size={14} className="text-foreground" aria-hidden />
            Speech included
          </li>
          <li className="flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-muted px-2.5 py-2">
            <HugeiconsIcon icon={Coins01Icon} size={14} className="text-brand" aria-hidden />
            10 credits
          </li>
        </ul>
      )}

      <Button
        variant="gradient"
        size="lg"
        className={cn(
          "min-h-11 w-full",
          layout === "sidebar" && "hidden lg:inline-flex",
        )}
        onClick={onGenerateVideo}
        loading={isGenerating}
        loadingText="Generating video…"
        disabled={!hasImage}
        aria-describedby={layout === "sticky" ? "result-video-credits-sticky" : undefined}
      >
        <HugeiconsIcon icon={AiVideoIcon} size={18} strokeWidth={2} aria-hidden />
        Generate video
      </Button>

      {layout === "sticky" && (
        <p id="result-video-credits-sticky" className="text-center text-xs text-muted-foreground">
          Costs 10 credits · speech included
        </p>
      )}

      {projectError && !isGenerating && hasImage && !hasVideo && layout === "sidebar" && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-4 space-y-3 rounded-[var(--radius-md)] border border-destructive/35 bg-destructive/10 px-3.5 py-3 text-xs leading-relaxed text-destructive"
        >
          <div className="flex gap-2.5">
            <HugeiconsIcon icon={Alert02Icon} size={16} className="mt-0.5 shrink-0" aria-hidden />
            <span className="break-words">{projectError}</span>
          </div>
          {/pollen|top-up/i.test(projectError) && (
            <a
              href="https://enter.pollinations.ai/top-up"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/15 px-3 font-medium transition-colors hover:bg-destructive/25"
            >
              Add Pollen
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultStudioView({
  loading,
  project,
  isGenerating,
  mediaReady,
  onMediaReady,
  onGenerateVideo,
  onShare,
  rootId,
  className,
  hideStickyVideoBar,
}: ResultStudioViewProps) {
  useVisualViewportInset();
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.03, 0.05);

  if (loading) {
    return (
      <div id={rootId} className={cn("studio-shell pt-nav", className)}>
        <header className="mb-5">
          <Skeleton className="mb-2 h-8 w-32" />
          <Skeleton className="h-8 w-56" />
        </header>
        <ResultStudioSkeleton />
      </div>
    );
  }

  if (!project) {
    return (
      <div id={rootId} className={cn("studio-shell studio-shell-bottom studio-scroll-pad pt-nav", className)}>
        <Card className="items-center border-border py-16 text-center shadow-none">
          <CardContent>
            <HugeiconsIcon icon={Alert02Icon} size={28} className="mx-auto text-amber-400" aria-hidden />
            <p className="mt-4 font-medium">Project not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may have been deleted or belongs to another account.</p>
            <Button asChild variant="outline" className="mt-6 min-h-11">
              <Link to="/my-generations">Back to my generations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasVideo = Boolean(project.generatedVideo);
  const hasImage = Boolean(project.generatedImage);
  const mediaSrc = project.generatedVideo || project.generatedImage;
  const showStickyVideo = !hideStickyVideoBar && hasImage && !hasVideo;

  return (
    <div id={rootId} className={cn("studio-shell studio-shell-bottom studio-scroll-pad pt-nav", className)}>
      <motion.header
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mb-5 flex max-w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <motion.div variants={enter}>
            <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1 h-11 min-h-[44px] text-muted-foreground">
              <Link to="/my-generations">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
                My generations
              </Link>
            </Button>
          </motion.div>
          <motion.h1
            variants={enter}
            className="studio-page-title truncate text-xl font-semibold tracking-tight text-foreground md:text-2xl"
          >
            {project.productName || project.name || "Generation result"}
          </motion.h1>
          <motion.div variants={enter} className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDate(project.createdAt)}</span>
            <span aria-hidden>·</span>
            <Badge variant="outline" className="font-mono">
              {project.aspectRatio}
            </Badge>
            {project.isPublished && <Badge variant="success">Published</Badge>}
          </motion.div>
        </div>
        <motion.div variants={enter} className="shrink-0">
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/generate">
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} aria-hidden />
              New generation
            </Link>
          </Button>
        </motion.div>
      </motion.header>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid max-w-full gap-5 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
      >
        <motion.div variants={enter} className="surface-panel min-w-0 rounded-[var(--radius-lg)] p-2">
          <div className={mediaFrameClass(project.aspectRatio)}>
            {!mediaReady && mediaSrc && <Skeleton className="absolute inset-0 rounded-none" aria-hidden />}

            {hasVideo ? (
              <video
                key="video"
                src={project.generatedVideo}
                poster={project.generatedImage}
                controls
                autoPlay
                loop
                playsInline
                onLoadedData={onMediaReady}
                className="h-full w-full object-contain"
              />
            ) : hasImage ? (
              <img
                key="image"
                src={project.generatedImage}
                alt="Generated result"
                onLoad={onMediaReady}
                className="h-full w-full object-contain"
              />
            ) : (
              <div
                className="flex h-full min-h-48 flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                <span
                  className={cn(
                    "flex size-14 items-center justify-center rounded-[var(--radius-lg)] border border-border bg-muted",
                    project.isGenerating && "animate-pulse-ring",
                  )}
                >
                  <HugeiconsIcon icon={Image02Icon} size={24} aria-hidden />
                </span>
                <p className="text-sm">
                  {project.isGenerating || isGenerating
                    ? "Generation is still running…"
                    : project.error || "No media generated yet"}
                </p>
              </div>
            )}

            {isGenerating && hasImage && !hasVideo && (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-border bg-card/95 p-4"
                role="status"
                aria-live="polite"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-border bg-muted">
                  <HugeiconsIcon icon={AiVideoIcon} size={16} className="animate-pulse" aria-hidden />
                </span>
                <div className="text-xs">
                  <p className="font-medium text-foreground">Animating with speech…</p>
                  <p className="text-muted-foreground">Usually 1–3 minutes. You can stay on this page.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex min-w-0 flex-col gap-3 lg:max-h-[calc(100dvh-var(--nav-offset)-5.5rem)] lg:overflow-y-auto lg:pr-1">
          <motion.div variants={enter}>
            <Card className="gap-3 border-border shadow-none">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Downloads</CardTitle>
                <CardDescription>Full-resolution files, ready to post.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 px-5 pb-5">
                <Button asChild variant="outline" className="min-h-11 justify-start" disabled={!hasImage}>
                  <a href={project.generatedImage || undefined} download target="_blank" rel="noreferrer">
                    <HugeiconsIcon icon={Image02Icon} size={16} aria-hidden />
                    Download image
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">PNG</span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="min-h-11 justify-start" disabled={!hasVideo}>
                  <a href={project.generatedVideo || undefined} download target="_blank" rel="noreferrer">
                    <HugeiconsIcon icon={Video02Icon} size={16} aria-hidden />
                    Download video
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">MP4</span>
                  </a>
                </Button>
                <Button variant="ghost" className="min-h-11 justify-start" onClick={onShare} disabled={!mediaSrc}>
                  <HugeiconsIcon icon={Share08Icon} size={16} aria-hidden />
                  Share link
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={enter}>
            <Card className="relative gap-3 overflow-hidden border-border shadow-none">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Talking video</CardTitle>
                <CardDescription>
                  Animate this frame into an 8-second clip where the creator speaks to camera and shows the product.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <VideoGenerateBlock
                  hasVideo={hasVideo}
                  hasImage={hasImage}
                  isGenerating={isGenerating}
                  projectError={project.error}
                  onGenerateVideo={onGenerateVideo}
                  layout="sidebar"
                />
              </CardContent>
            </Card>
          </motion.div>

          {(project.productDescription || project.userPrompt) && (
            <motion.div variants={enter}>
              <Card className="gap-3 border-border shadow-none">
                <CardHeader className="px-5 pt-5">
                  <CardTitle className="text-base">Brief</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5 text-sm">
                  {project.productDescription && (
                    <div>
                      <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Description</p>
                      <p className="leading-relaxed text-foreground/90">{project.productDescription}</p>
                    </div>
                  )}
                  {project.userPrompt && (
                    <div>
                      <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Direction</p>
                      <p className="leading-relaxed text-foreground/90">{project.userPrompt}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>

      {showStickyVideo && (
        <div
          className="surface-panel studio-sticky-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border px-4 py-3 lg:hidden"
          data-lenis-prevent
        >
          <VideoGenerateBlock
            hasVideo={hasVideo}
            hasImage={hasImage}
            isGenerating={isGenerating}
            onGenerateVideo={onGenerateVideo}
            layout="sticky"
          />
        </div>
      )}
    </div>
  );
}
