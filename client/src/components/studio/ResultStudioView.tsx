import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  AiMagicIcon,
  AiVideoIcon,
  Alert02Icon,
  CheckmarkCircle02Icon,
  Coins01Icon,
  Download01Icon,
  GlobalIcon,
  Image02Icon,
  LockIcon,
  Mic01Icon,
  Delete02Icon,
  RefreshIcon,
  Share08Icon,
  Video02Icon,
} from "@/icons";

import type { Project } from "@/Types";

import StudioPageHero from "@/components/studio/StudioPageHero";

import { Button } from "@/components/ui/button";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Skeleton } from "@/components/ui/skeleton";
import { ResultPageSkeleton, ResultWorkspaceSkeleton } from "@/components/ui/page-skeletons";

import { GenerationPlusGridOverlay } from "@/components/ui/plus-grid-loader";

import { EmptyState } from "@/components/ui/empty-state";

import { studioReveal, studioStagger } from "@/components/ui/motion";

import { useVisualViewportInset } from "@/hooks/useVisualViewportInset";

import { downloadMediaFile } from "@/lib/download";
import { isStillPublished, isVideoPublished, type PublishMedia } from "@/lib/publish";
import { cn, formatDate, safeUserMessage } from "@/lib/utils";



const SHELL = "studio-shell studio-shell-bottom studio-scroll-pad relative overflow-x-clip pt-nav";



export function ResultStudioSkeleton() {
  return <ResultWorkspaceSkeleton />;
}

export type ResultStudioViewProps = {
  loading: boolean;
  project: Project | null;
  isGenerating: boolean;
  isRegeneratingImage?: boolean;
  mediaReady: boolean;
  onMediaReady: () => void;
  onGenerateVideo: () => void;
  onRegenerateImage?: () => void;
  onShare: () => void;
  publishingMedia?: PublishMedia | null;
  onTogglePublish?: (media: PublishMedia) => void;
  onDelete?: () => void;
  rootId?: string;
  className?: string;
  hideStickyVideoBar?: boolean;
};



function resultHeroDescription(project: Project) {

  const parts = [formatDate(project.createdAt), project.aspectRatio];

  if (isStillPublished(project)) parts.push("Image published");
  if (isVideoPublished(project)) parts.push("Video published");

  return parts.join(" · ");

}



function resultMediaFrameClass(aspectRatio: string) {

  if (aspectRatio === "9:16") return "w-full max-w-[min(100%,22rem)] aspect-[9/16]";

  if (aspectRatio === "1:1") return "w-full max-w-md aspect-square";

  return "w-full max-w-3xl aspect-video";

}



function ResultBriefStrip({ project }: { project: Project }) {

  if (!project.productDescription && !project.userPrompt) return null;



  return (

    <div className="surface-panel grid gap-4 rounded-[var(--radius-xl)] p-4 text-sm sm:grid-cols-2 sm:gap-6 sm:p-5">

      {project.productDescription ? (

        <div className="min-w-0">

          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/85">Description</p>

          <p className="mt-1.5 leading-relaxed text-foreground/90">{project.productDescription}</p>

        </div>

      ) : null}

      {project.userPrompt ? (

        <div className="min-w-0">

          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/85">Direction</p>

          <p className="mt-1.5 leading-relaxed text-foreground/90">{project.userPrompt}</p>

        </div>

      ) : null}

    </div>

  );

}



type ActiveMediaView = "image" | "video";

async function saveMediaFile(url: string | undefined, filename: string) {
  try {
    await downloadMediaFile(url, filename);
  } catch {
    // Keep the result page usable if the host blocks fetch.
  }
}

function ResultActionsAside({
  project,
  hasVideo,
  hasImage,
  videoUrl,
  mediaSrc,
  activeView,
  onSelectView,
  isGenerating,
  isRegeneratingImage,
  showStickyVideo,
  onGenerateVideo,
  onRegenerateImage,
  onShare,
}: {
  project: Project;
  hasVideo: boolean;
  hasImage: boolean;
  videoUrl?: string;
  mediaSrc?: string;
  activeView: ActiveMediaView;
  onSelectView: (view: ActiveMediaView) => void;
  isGenerating: boolean;
  isRegeneratingImage?: boolean;
  showStickyVideo: boolean;
  onGenerateVideo: () => void;
  onRegenerateImage?: () => void;
  onShare: () => void;
}) {
  const showTalkingOnSidebar = hasImage || hasVideo;
  const anyBusy = isGenerating || Boolean(isRegeneratingImage);
  const slug = (project.productName || project.name || "ugc-ad").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <aside className="surface-panel flex w-full min-w-0 flex-col gap-4 self-start rounded-[var(--radius-xl)] p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Still image</p>
        {!hasImage ? (
          <Button asChild framer={false} variant="gradient" size="default" className="min-h-11 w-full">
            <Link to="/generate">
              <HugeiconsIcon icon={AiMagicIcon} size={16} strokeWidth={2} aria-hidden />
              Go to Generate
            </Link>
          </Button>
        ) : null}
        {onRegenerateImage && (
          <Button
            framer={false}
            variant={hasImage ? "outline" : "outline"}
            size="default"
            className="min-h-11 w-full"
            onClick={onRegenerateImage}
            loading={isRegeneratingImage}
            loadingText="Regenerating image…"
            disabled={anyBusy}
          >
            <HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={2} aria-hidden />
            {hasImage ? "Regenerate image (5 credits)" : "Try again (5 credits)"}
          </Button>
        )}
      </div>

      {showTalkingOnSidebar ? (
        <div className={cn("space-y-2", showStickyVideo && "hidden lg:block")}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Talking video</p>
          <VideoGenerateBlock
            hasVideo={hasVideo}
            hasImage={hasImage}
            isGenerating={isGenerating}
            disabled={anyBusy}
            projectError={safeUserMessage(project.error, "")}
            onGenerateVideo={onGenerateVideo}
          />
        </div>
      ) : null}

      <div className="grid gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview &amp; Export</p>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            framer={false}
            variant="outline"
            className={cn(
              "min-h-11 flex-1 justify-start gap-2 px-3",
              activeView === "image" && hasImage && "border-brand/70 bg-brand/15 text-white shadow-[0_0_0_1px_rgb(37_99_235_/_0.35)]",
            )}
            disabled={!hasImage}
            onClick={() => onSelectView("image")}
          >
            <HugeiconsIcon icon={Image02Icon} size={15} className="shrink-0" aria-hidden />
            <span className="text-sm">Image</span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {activeView === "image" && hasImage ? "Viewing · PNG" : "PNG"}
            </span>
          </Button>
          <Button
            type="button"
            framer={false}
            variant="outline"
            size="icon"
            className="size-11 shrink-0"
            disabled={!hasImage}
            aria-label="Download image"
            title="Download image"
            onClick={() => void saveMediaFile(project.generatedImage, `${slug}-image.png`)}
          >
            <HugeiconsIcon icon={Download01Icon} size={15} aria-hidden />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            framer={false}
            variant="outline"
            className={cn(
              "min-h-11 flex-1 justify-start gap-2 px-3",
              activeView === "video" && hasVideo && "border-brand/70 bg-brand/15 text-white shadow-[0_0_0_1px_rgb(37_99_235_/_0.35)]",
            )}
            disabled={!hasVideo}
            onClick={() => onSelectView("video")}
          >
            <HugeiconsIcon icon={Video02Icon} size={15} className="shrink-0" aria-hidden />
            <span className="text-sm">Video</span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {activeView === "video" && hasVideo ? "Viewing · MP4" : "MP4"}
            </span>
          </Button>
          <Button
            type="button"
            framer={false}
            variant="outline"
            size="icon"
            className="size-11 shrink-0"
            disabled={!hasVideo}
            aria-label="Download video"
            title="Download video"
            onClick={() => void saveMediaFile(videoUrl, `${slug}-video.mp4`)}
          >
            <HugeiconsIcon icon={Download01Icon} size={15} aria-hidden />
          </Button>
        </div>

        <Button framer={false} variant="ghost" className="min-h-11 w-full justify-start gap-2 px-3" onClick={onShare} disabled={!mediaSrc}>
          <HugeiconsIcon icon={Share08Icon} size={15} className="shrink-0" aria-hidden />
          <span className="text-sm">Share link</span>
        </Button>
      </div>
    </aside>
  );
}



function VideoGenerateBlock({
  hasVideo,
  hasImage,
  isGenerating,
  disabled,
  projectError,
  onGenerateVideo,
  compact,
}: {
  hasVideo: boolean;
  hasImage: boolean;
  isGenerating: boolean;
  disabled?: boolean;
  projectError?: string;
  onGenerateVideo: () => void;
  compact?: boolean;
}) {
  const isBusy = isGenerating || Boolean(disabled);
  if (hasVideo) {
    return (
      <div className="space-y-2.5">
        <div
          className="flex items-center gap-3 rounded-[var(--radius-md)] border border-brand/35 bg-brand/10 px-3.5 py-3 text-sm text-brand-muted"
          role="status"
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} aria-hidden />
          Video ready — use the player controls or downloads below.
        </div>
        <Button
          framer={false}
          variant="outline"
          size="default"
          className="min-h-10 w-full"
          onClick={onGenerateVideo}
          loading={isGenerating}
          loadingText="Regenerating video…"
          disabled={isBusy}
        >
          <HugeiconsIcon icon={AiVideoIcon} size={16} strokeWidth={2} aria-hidden />
          Regenerate video (10 credits)
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!compact && (
        <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-muted/50 px-2.5 py-2">
            <HugeiconsIcon icon={Mic01Icon} size={14} className="text-foreground" aria-hidden />
            Speech included
          </li>
          <li className="flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-muted/50 px-2.5 py-2">
            <HugeiconsIcon icon={Coins01Icon} size={14} className="text-brand" aria-hidden />
            10 credits
          </li>
        </ul>
      )}

      {!hasImage ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex w-full">
              <Button
                framer={false}
                variant="gradient"
                size="default"
                className="min-h-11 w-full"
                disabled
                type="button"
              >
                <HugeiconsIcon icon={AiVideoIcon} size={18} strokeWidth={2} aria-hidden />
                Generate video
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Generate the still image first — video uses that frame.</TooltipContent>
        </Tooltip>
      ) : (
        <Button
          framer={false}
          variant="gradient"
          size="default"
          className="min-h-11 w-full"
          onClick={onGenerateVideo}
          loading={isGenerating}
          loadingText="Generating video…"
          disabled={isBusy}
        >
          <HugeiconsIcon icon={AiVideoIcon} size={18} strokeWidth={2} aria-hidden />
          Generate video
        </Button>
      )}



      {compact && (

        <p className="text-center text-xs text-muted-foreground">Costs 10 credits · speech included</p>

      )}



      {projectError && !isGenerating && hasImage && !hasVideo && (

        <div

          role="alert"

          className="space-y-2 rounded-[var(--radius-md)] border border-destructive/35 bg-destructive/10 px-3 py-2.5 text-xs text-destructive"

        >

          <div className="flex gap-2">

            <HugeiconsIcon icon={Alert02Icon} size={16} className="shrink-0" aria-hidden />

            <span className="break-words">{projectError}</span>

          </div>


        </div>

      )}

    </div>

  );

}



function ResultMediaPanel({
  project,
  hasVideo,
  hasImage,
  videoUrl,
  mediaSrc,
  activeView,
  mediaReady,
  isGenerating,
  isRegeneratingImage,
  onMediaReady,
}: {
  project: Project;
  hasVideo: boolean;
  hasImage: boolean;
  videoUrl?: string;
  mediaSrc?: string;
  activeView: ActiveMediaView;
  mediaReady: boolean;
  isGenerating: boolean;
  isRegeneratingImage?: boolean;
  onMediaReady: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameClass = resultMediaFrameClass(project.aspectRatio);
  const showVideoInBox = activeView === "video" && hasVideo && Boolean(videoUrl);
  const imageClass = cn(
    "h-full w-full object-contain rounded-[var(--radius-lg)] ring-1 ring-white/10",
    mediaReady ? "opacity-100" : "opacity-0",
  );

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !showVideoInBox || !videoUrl) return;
    el.muted = false;
    el.play().catch(() => {
      el.muted = true;
      void el.play().catch(() => undefined);
    });
  }, [showVideoInBox, videoUrl]);

  return (
    <figure
      className="surface-panel mx-auto flex w-full max-w-full min-w-0 items-center justify-center rounded-[var(--radius-xl)] p-3 sm:p-4"
    >
      {!hasVideo && !hasImage ? (
        project.isGenerating || isGenerating || isRegeneratingImage ? (
          <div className={cn("relative mx-auto overflow-hidden rounded-[var(--radius-lg)] ring-1 ring-white/10", frameClass)}>
            <GenerationPlusGridOverlay
              title="Generating your image…"
              subtitle="Blending product and model with studio lighting…"
              steps={["Uploading", "Generating", "Finalizing"]}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <div className="flex min-h-[12rem] w-full flex-col items-center justify-center gap-3 p-4 text-center text-sm text-muted-foreground">
            <span className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted/60">
              <HugeiconsIcon icon={Image02Icon} size={22} aria-hidden />
            </span>
            {safeUserMessage(project.error, "") || "No media yet"}
          </div>
        )
      ) : (
        <div className={cn("relative mx-auto overflow-hidden rounded-[var(--radius-lg)] bg-black/40", frameClass)}>
          {!showVideoInBox && !mediaReady && mediaSrc ? (
            <Skeleton className="absolute inset-0 z-[2] rounded-[var(--radius-lg)]" aria-hidden />
          ) : null}

          {showVideoInBox && videoUrl ? (
            <video
              ref={videoRef}
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              loop
              playsInline
              preload="auto"
              onLoadedMetadata={onMediaReady}
              onLoadedData={onMediaReady}
              onCanPlay={onMediaReady}
              className="w-full h-full object-contain rounded-[var(--radius-lg)] ring-1 ring-white/10"
            />
          ) : (
            <img
              key={project.generatedImage}
              src={project.generatedImage}
              alt={project.productName || "Generated result"}
              width={768}
              height={1376}
              loading="eager"
              decoding="async"
              onLoad={onMediaReady}
              className={imageClass}
            />
          )}

          {isRegeneratingImage ? (
            <GenerationPlusGridOverlay
              title="Regenerating your image…"
              subtitle="Blending product and model with fresh composition…"
              steps={["Analyzing", "Generating", "Finalizing"]}
              className="absolute inset-0 z-[3] h-full w-full rounded-[var(--radius-lg)] ring-1 ring-white/10"
            />
          ) : isGenerating && hasImage ? (
            <GenerationPlusGridOverlay
              title="Generating video…"
              subtitle="Animating with speech · usually 15–45 seconds"
              className="absolute inset-0 z-[3] h-full w-full rounded-[var(--radius-lg)] ring-1 ring-white/10"
            />
          ) : null}
        </div>
      )}
    </figure>
  );
}



export default function ResultStudioView({
  loading,
  project,
  isGenerating,
  isRegeneratingImage = false,
  mediaReady,
  onMediaReady,
  onGenerateVideo,
  onRegenerateImage,
  onShare,
  publishingMedia = null,
  onTogglePublish,
  onDelete,
  rootId,
  className,
  hideStickyVideoBar,
}: ResultStudioViewProps) {
  useVisualViewportInset();
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.04, 0.05);

  const videoUrl = project?.videoUrl || project?.generatedVideo;
  const hasVideo = Boolean(videoUrl);
  const hasImage = Boolean(project?.generatedImage);

  const [selectedView, setSelectedView] = useState<ActiveMediaView>(() =>
    hasVideo ? "video" : "image",
  );
  const prevImageRef = useRef(project?.generatedImage);
  const prevVideoRef = useRef(videoUrl);

  useEffect(() => {
    if (project?.generatedImage && project.generatedImage !== prevImageRef.current) {
      prevImageRef.current = project.generatedImage;
      setSelectedView("image");
    }
  }, [project?.generatedImage]);

  useEffect(() => {
    if (videoUrl && videoUrl !== prevVideoRef.current) {
      prevVideoRef.current = videoUrl;
      setSelectedView("video");
    }
  }, [videoUrl]);

  const shellClass = cn(SHELL, className);

  if (loading) {
    return (
      <div id={rootId} className={shellClass}>
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-brand/[0.08] to-transparent" aria-hidden />
        <ResultPageSkeleton embedded />
      </div>
    );
  }

  if (!project) {
    return (
      <div id={rootId} className={shellClass}>
        <EmptyState
          icon={Alert02Icon}
          title="Project not found"
          description="It may have been deleted or belongs to another account."
          action={
            <Button asChild framer={false} variant="gradient" className="min-h-11 w-auto">
              <Link to="/my-generations">Back to My generations</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const activeView: ActiveMediaView =
    selectedView === "video" && hasVideo ? "video" : hasImage ? "image" : "video";

  const mediaSrc = activeView === "video" && videoUrl ? videoUrl : project.generatedImage || videoUrl;

  const showStickyVideo = !hideStickyVideoBar && hasImage && !hasVideo;



  return (

    <div id={rootId} className={shellClass}>

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-brand/[0.08] to-transparent" aria-hidden />



      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        <motion.div variants={enter}>

          <StudioPageHero

            eyebrow="Result"

            title={project.productName || project.name || "Generation result"}

            description={resultHeroDescription(project)}

            actions={

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">

                {onTogglePublish && hasImage && (

                  <Button

                    framer={false}

                    variant={isStillPublished(project) ? "secondary" : "gradient"}

                    size="default"

                    className="min-h-11 w-full sm:w-auto"

                    loading={publishingMedia === "image"}

                    loadingText={isStillPublished(project) ? "Removing image…" : "Publishing image…"}

                    disabled={!hasImage || publishingMedia !== null}

                    onClick={() => onTogglePublish("image")}

                  >

                    <HugeiconsIcon icon={isStillPublished(project) ? LockIcon : GlobalIcon} size={16} aria-hidden />

                    {isStillPublished(project) ? (hasVideo ? "Remove image" : "Unpublish") : hasVideo ? "Publish image" : "Publish"}

                  </Button>

                )}

                {onTogglePublish && hasVideo && (

                  <Button

                    framer={false}

                    variant={isVideoPublished(project) ? "secondary" : "gradient"}

                    size="default"

                    className="min-h-11 w-full sm:w-auto"

                    loading={publishingMedia === "video"}

                    loadingText={isVideoPublished(project) ? "Removing video…" : "Publishing video…"}

                    disabled={!hasVideo || publishingMedia !== null}

                    onClick={() => onTogglePublish("video")}

                  >

                    <HugeiconsIcon icon={isVideoPublished(project) ? LockIcon : GlobalIcon} size={16} aria-hidden />

                    {isVideoPublished(project) ? (hasImage ? "Remove video" : "Unpublish") : hasImage ? "Publish video" : "Publish"}

                  </Button>

                )}

                <Button asChild framer={false} variant="outline" size="default" className="min-h-11 w-full sm:w-auto">

                  <Link to="/my-generations">My generations</Link>

                </Button>

                <Button asChild framer={false} variant="outline" size="default" className="min-h-11 w-full sm:w-auto">

                  <Link to="/generate">New generation</Link>

                </Button>

                {onDelete && (

                  <Button

                    framer={false}

                    variant="outline"

                    size="default"

                    className="min-h-11 w-full border-destructive/35 text-destructive hover:bg-destructive/10 sm:w-auto"

                    onClick={onDelete}

                  >

                    <HugeiconsIcon icon={Delete02Icon} size={16} aria-hidden />

                    Delete

                  </Button>

                )}

              </div>

            }

          />

        </motion.div>



        <motion.div variants={enter} className="space-y-4">
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_min(22rem,32vw)] xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="flex min-w-0 justify-center">
              <ResultMediaPanel
                project={project}
                hasVideo={hasVideo}
                hasImage={hasImage}
                videoUrl={videoUrl}
                mediaSrc={mediaSrc}
                activeView={activeView}
                mediaReady={mediaReady}
                isGenerating={isGenerating}
                isRegeneratingImage={isRegeneratingImage}
                onMediaReady={onMediaReady}
              />
            </div>

            <ResultActionsAside
              project={project}
              hasVideo={hasVideo}
              hasImage={hasImage}
              videoUrl={videoUrl}
              mediaSrc={mediaSrc}
              activeView={activeView}
              onSelectView={setSelectedView}
              isGenerating={isGenerating}
              isRegeneratingImage={isRegeneratingImage}
              showStickyVideo={showStickyVideo}
              onGenerateVideo={onGenerateVideo}
              onRegenerateImage={onRegenerateImage}
              onShare={onShare}
            />
          </div>

          <ResultBriefStrip project={project} />
        </motion.div>

      </motion.div>



      {showStickyVideo && (
        <div className="surface-panel studio-sticky-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border px-4 py-3 lg:hidden">
          <VideoGenerateBlock
            hasVideo={hasVideo}
            hasImage={hasImage}
            isGenerating={isGenerating}
            disabled={isRegeneratingImage}
            projectError={safeUserMessage(project.error, "")}
            onGenerateVideo={onGenerateVideo}
            compact
          />
        </div>
      )}

    </div>

  );

}


