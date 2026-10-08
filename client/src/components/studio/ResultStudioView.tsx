import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiVideoIcon,
  Alert02Icon,
  CheckmarkCircle02Icon,
  Coins01Icon,
  GlobalIcon,
  Image02Icon,
  LockIcon,
  Mic01Icon,
  Share08Icon,
  Video02Icon,
} from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import StudioPageHero from "@/components/studio/StudioPageHero";
import { StudioMediaFrame } from "@/components/studio/StudioMediaFill";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { studioReveal, studioStagger } from "@/components/ui/motion";
import { useVisualViewportInset } from "@/hooks/useVisualViewportInset";
import { cn, formatDate } from "@/lib/utils";

export function ResultStudioSkeleton() {
  return (
    <div className="grid max-w-full gap-5 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
      <Skeleton className="aspect-[9/16] max-h-[min(56dvh,540px)] w-full rounded-[var(--radius-lg)] sm:aspect-video lg:sticky lg:top-[calc(var(--nav-offset)+1.25rem)]" />
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-[var(--radius-lg)]" />
        <Skeleton className="h-48 rounded-[var(--radius-lg)]" />
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
  isPublishing?: boolean;
  onTogglePublish?: () => void;
  rootId?: string;
  className?: string;
  /** Hide mobile sticky CTA (dev layout). */
  hideStickyVideoBar?: boolean;
};

function mediaMaxHeightClass(aspectRatio: string) {
  if (aspectRatio === "16:9") return "max-h-[min(56dvh,540px)]";
  if (aspectRatio === "1:1") return "max-h-[min(52dvh,500px)]";
  return "max-h-[min(56dvh,540px)]";
}

function resultHeroDescription(project: Project) {
  const parts = [formatDate(project.createdAt), project.aspectRatio];
  if (project.isPublished) parts.push("Published to Community");
  return parts.join(" · ");
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
        className="flex items-center gap-3 rounded-[var(--radius-md)] border border-brand/35 bg-brand/10 px-4 py-3 text-sm text-brand-muted"
        role="status"
        aria-live="polite"
      >
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} aria-hidden />
        Video ready — download or share below.
      </div>
    );
  }

  return (
    <div className={cn(layout === "sticky" && "flex flex-col gap-2")}>
      {layout === "sidebar" && (
        <ul className="mb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-muted/60 px-2.5 py-2">
            <HugeiconsIcon icon={Mic01Icon} size={14} className="text-foreground" aria-hidden />
            Speech included
          </li>
          <li className="flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-muted/60 px-2.5 py-2">
            <HugeiconsIcon icon={Coins01Icon} size={14} className="text-brand" aria-hidden />
            10 credits
          </li>
        </ul>
      )}

      <Button
        variant="gradient"
        size="lg"
        className={cn("min-h-11 w-full", layout === "sidebar" && "hidden lg:inline-flex")}
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

      {projectError && !isGenerating && hasImage && !hasVideo && (
        <div
          role="alert"
          aria-live="assertive"
          className={cn(
            "space-y-3 rounded-[var(--radius-md)] border border-destructive/35 bg-destructive/10 px-3.5 py-3 text-xs leading-relaxed text-destructive",
            layout === "sidebar" ? "mt-4" : "mt-1",
          )}
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
  isPublishing = false,
  onTogglePublish,
  rootId,
  className,
  hideStickyVideoBar,
}: ResultStudioViewProps) {
  useVisualViewportInset();
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.04, 0.05);

  const shellClass = cn("studio-shell studio-shell-bottom studio-scroll-pad relative pt-nav", className);

  if (loading) {
    return (
      <div id={rootId} className={shellClass}>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand/[0.08] to-transparent"
          aria-hidden
        />
        <div className="monex-backdrop-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-40" aria-hidden />
        <header className="surface-panel relative mb-8 overflow-hidden rounded-2xl border border-white/10 p-6 md:p-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-9 w-full max-w-md" />
          <Skeleton className="mt-3 h-4 w-56" />
        </header>
        <ResultStudioSkeleton />
      </div>
    );
  }

  if (!project) {
    return (
      <div id={rootId} className={shellClass}>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand/[0.08] to-transparent"
          aria-hidden
        />
        <EmptyState
          icon={Alert02Icon}
          title="Project not found"
          description="It may have been deleted or belongs to another account."
          action={
            <Button asChild variant="gradient" className="min-h-11 w-auto">
              <Link to="/my-generations">Back to My generations</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const hasVideo = Boolean(project.generatedVideo);
  const hasImage = Boolean(project.generatedImage);
  const hasMedia = hasImage || hasVideo;
  const mediaSrc = project.generatedVideo || project.generatedImage;
  const showStickyVideo = !hideStickyVideoBar && hasImage && !hasVideo;

  return (
    <div id={rootId} className={shellClass}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand/[0.08] to-transparent"
        aria-hidden
      />
      <div className="monex-backdrop-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-40" aria-hidden />

      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={enter}>
          <StudioPageHero
            eyebrow="Result"
            title={project.productName || project.name || "Generation result"}
            description={resultHeroDescription(project)}
            actions={
              <>
                <Button asChild framer={false} variant="outline" size="default" className="min-h-11 w-auto">
                  <Link to="/my-generations">My generations</Link>
                </Button>
                {onTogglePublish && (
                  <Button
                    framer={false}
                    variant={project.isPublished ? "secondary" : "gradient"}
                    className="min-h-11 w-auto"
                    loading={isPublishing}
                    loadingText={project.isPublished ? "Unpublishing…" : "Publishing…"}
                    disabled={!hasMedia}
                    onClick={onTogglePublish}
                  >
                    <HugeiconsIcon icon={project.isPublished ? LockIcon : GlobalIcon} size={16} aria-hidden />
                    {project.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                )}
                <Button asChild variant="gradient" className="min-h-11 w-auto">
                  <Link to="/generate">New generation</Link>
                </Button>
              </>
            }
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid max-w-full gap-5 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start"
      >
        <motion.div
          variants={enter}
          className="surface-panel min-w-0 overflow-hidden rounded-[var(--radius-lg)] p-3 sm:p-4 lg:sticky lg:top-[calc(var(--nav-offset)+1.25rem)] lg:self-start"
        >
          <StudioMediaFrame
            aspectRatio={project.aspectRatio}
            backdropSrc={mediaSrc ?? undefined}
            className={cn("mx-auto w-full max-w-full rounded-[var(--radius-md)] ring-1 ring-white/10", mediaMaxHeightClass(project.aspectRatio))}
          >
            {!mediaReady && mediaSrc && <Skeleton className="absolute inset-0 z-[2] rounded-none" aria-hidden />}

            {hasVideo ? (
              <video
                key="video"
                src={project.generatedVideo}
                poster={project.generatedImage}
                controls
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={onMediaReady}
                className="max-h-full max-w-full object-contain"
              />
            ) : hasImage ? (
              <img
                key="image"
                src={project.generatedImage}
                alt="Generated result"
                onLoad={onMediaReady}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div
                className="flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                <span
                  className={cn(
                    "flex size-14 items-center justify-center rounded-[var(--radius-lg)] border border-border bg-muted/60",
                    (project.isGenerating || isGenerating) && "animate-pulse-ring",
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
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex items-center gap-3 border-t border-white/10 bg-card/95 px-4 py-3 backdrop-blur-sm"
                role="status"
                aria-live="polite"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/80">
                  <HugeiconsIcon icon={AiVideoIcon} size={16} className="animate-pulse text-brand" aria-hidden />
                </span>
                <div className="text-xs">
                  <p className="font-medium text-foreground">Animating with speech…</p>
                  <p className="text-muted-foreground">Usually 1–3 minutes. You can stay on this page.</p>
                </div>
              </div>
            )}
          </StudioMediaFrame>
        </motion.div>

        <div className="flex min-w-0 flex-col gap-4">
          <motion.div variants={enter}>
            <Card className="gap-0 border-border bg-card/80 shadow-none">
              <CardHeader className="px-5 pt-5 pb-2">
                <CardTitle className="text-base">Downloads & share</CardTitle>
                <CardDescription>Full-resolution files for Reels, Shorts, and TikTok.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 px-5 pb-5">
                <Button asChild framer={false} variant="outline" className="min-h-11 justify-start" disabled={!hasImage}>
                  <a href={project.generatedImage || undefined} download target="_blank" rel="noreferrer">
                    <HugeiconsIcon icon={Image02Icon} size={16} aria-hidden />
                    Download image
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">PNG</span>
                  </a>
                </Button>
                <Button asChild framer={false} variant="outline" className="min-h-11 justify-start" disabled={!hasVideo}>
                  <a href={project.generatedVideo || undefined} download target="_blank" rel="noreferrer">
                    <HugeiconsIcon icon={Video02Icon} size={16} aria-hidden />
                    Download video
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">MP4</span>
                  </a>
                </Button>
                <Button framer={false} variant="ghost" className="min-h-11 justify-start" onClick={onShare} disabled={!mediaSrc}>
                  <HugeiconsIcon icon={Share08Icon} size={16} aria-hidden />
                  Share link
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={enter}>
            <Card className="relative gap-0 overflow-hidden border-border bg-card/80 shadow-none">
              <CardHeader className="px-5 pt-5 pb-2">
                <CardTitle className="text-base">Talking video</CardTitle>
                <CardDescription>
                  Turn this still into an ~8s clip with on-camera speech and product in hand.
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
              <Card className="gap-0 border-border bg-card/80 shadow-none">
                <CardHeader className="px-5 pt-5 pb-2">
                  <CardTitle className="text-base">Brief</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-5 pb-5 text-sm">
                  {project.productDescription && (
                    <div>
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Description
                      </p>
                      <p className="leading-relaxed text-foreground/90">{project.productDescription}</p>
                    </div>
                  )}
                  {project.userPrompt && (
                    <div>
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Direction
                      </p>
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
            projectError={project.error}
            onGenerateVideo={onGenerateVideo}
            layout="sticky"
          />
        </div>
      )}
    </div>
  );
}
