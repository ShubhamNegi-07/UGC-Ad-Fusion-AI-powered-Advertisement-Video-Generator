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

  Delete02Icon,

  Share08Icon,

  Video02Icon,

} from "@hugeicons/core-free-icons";

import type { Project } from "@/Types";

import StudioPageHero from "@/components/studio/StudioPageHero";

import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

import { EmptyState } from "@/components/ui/empty-state";

import { studioReveal, studioStagger } from "@/components/ui/motion";

import { useVisualViewportInset } from "@/hooks/useVisualViewportInset";

import { cn, formatDate } from "@/lib/utils";



const SHELL = "studio-shell studio-shell-bottom studio-scroll-pad relative overflow-x-clip pt-nav";



export function ResultStudioSkeleton() {

  return (

    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_min(22rem,32vw)] xl:grid-cols-[minmax(0,1fr)_26rem]">
      <Skeleton className="aspect-video min-h-[14rem] w-full rounded-[var(--radius-xl)]" />
      <Skeleton className="min-h-[18rem] w-full rounded-[var(--radius-xl)]" />
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

  onDelete?: () => void;

  rootId?: string;

  className?: string;

  hideStickyVideoBar?: boolean;

};



function resultHeroDescription(project: Project) {

  const parts = [formatDate(project.createdAt), project.aspectRatio];

  if (project.isPublished) parts.push("Published to Community");

  return parts.join(" · ");

}



function resultMediaSizeClass(aspectRatio: string) {

  if (aspectRatio === "9:16") return "max-w-[17.5rem] sm:max-w-[19rem]";

  if (aspectRatio === "1:1") return "max-w-md";

  return "max-w-3xl";

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



function ResultActionsAside({

  project,

  hasVideo,

  hasImage,

  mediaSrc,

  isGenerating,

  showStickyVideo,

  onGenerateVideo,

  onShare,

}: {

  project: Project;

  hasVideo: boolean;

  hasImage: boolean;

  mediaSrc?: string;

  isGenerating: boolean;

  showStickyVideo: boolean;

  onGenerateVideo: () => void;

  onShare: () => void;

}) {

  const showTalkingOnSidebar = hasImage && !hasVideo;



  return (

    <aside className="surface-panel flex w-full min-w-0 flex-col gap-4 self-start rounded-[var(--radius-xl)] p-5 sm:p-6">

      {showTalkingOnSidebar ? (

        <div className={cn("space-y-2", showStickyVideo && "hidden lg:block")}>

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Talking video</p>

          <VideoGenerateBlock

            hasVideo={hasVideo}

            hasImage={hasImage}

            isGenerating={isGenerating}

            projectError={project.error}

            onGenerateVideo={onGenerateVideo}

          />

        </div>

      ) : null}



      <div className="grid gap-2">

        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Export</p>

        <Button asChild framer={false} variant="outline" className="min-h-11 w-full justify-start gap-2 px-3" disabled={!hasImage}>

          <a href={project.generatedImage || undefined} download target="_blank" rel="noreferrer" className="flex w-full items-center gap-2">

            <HugeiconsIcon icon={Image02Icon} size={15} className="shrink-0" aria-hidden />

            <span className="text-sm">Image</span>

            <span className="ml-auto font-mono text-[10px] text-muted-foreground">PNG</span>

          </a>

        </Button>

        <Button asChild framer={false} variant="outline" className="min-h-11 w-full justify-start gap-2 px-3" disabled={!hasVideo}>

          <a href={project.generatedVideo || undefined} download target="_blank" rel="noreferrer" className="flex w-full items-center gap-2">

            <HugeiconsIcon icon={Video02Icon} size={15} className="shrink-0" aria-hidden />

            <span className="text-sm">Video</span>

            <span className="ml-auto font-mono text-[10px] text-muted-foreground">MP4</span>

          </a>

        </Button>

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

  projectError,

  onGenerateVideo,

  compact,

}: {

  hasVideo: boolean;

  hasImage: boolean;

  isGenerating: boolean;

  projectError?: string;

  onGenerateVideo: () => void;

  compact?: boolean;

}) {

  if (hasVideo) {

    return (

      <div

        className="flex items-center gap-3 rounded-[var(--radius-md)] border border-brand/35 bg-brand/10 px-3.5 py-3 text-sm text-brand-muted"

        role="status"

      >

        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} aria-hidden />

        Video ready — use the downloads below.

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



      <Button

        framer={false}

        variant="gradient"

        size="default"

        className="min-h-11 w-full"

        onClick={onGenerateVideo}

        loading={isGenerating}

        loadingText="Generating video…"

        disabled={!hasImage}

      >

        <HugeiconsIcon icon={AiVideoIcon} size={18} strokeWidth={2} aria-hidden />

        Generate video

      </Button>



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

          {/pollen|top-up/i.test(projectError) && (

            <a

              href="https://enter.pollinations.ai/top-up"

              target="_blank"

              rel="noreferrer"

              className="inline-flex min-h-10 items-center rounded-md border border-destructive/30 bg-destructive/15 px-3 font-medium"

            >

              Add Pollen

            </a>

          )}

        </div>

      )}

    </div>

  );

}



function ResultMediaPanel({

  project,

  hasVideo,

  hasImage,

  mediaSrc,

  mediaReady,

  isGenerating,

  onMediaReady,

}: {

  project: Project;

  hasVideo: boolean;

  hasImage: boolean;

  mediaSrc?: string;

  mediaReady: boolean;

  isGenerating: boolean;

  onMediaReady: () => void;

}) {

  const mediaClass = cn(

    "mx-auto block h-auto w-auto max-w-full max-h-[min(55dvh,500px)] object-contain",

    resultMediaSizeClass(project.aspectRatio),

    mediaReady ? "opacity-100" : "opacity-0",

  );



  return (

    <figure

      className={cn(

        "surface-panel mx-auto flex w-fit max-w-full min-w-0 items-center justify-center rounded-[var(--radius-xl)] p-3 sm:p-4",

        resultMediaSizeClass(project.aspectRatio),

      )}

    >

      {!hasVideo && !hasImage ? (

        <div className="flex min-h-[12rem] w-full flex-col items-center justify-center gap-3 p-4 text-center text-sm text-muted-foreground">

          <span

            className={cn(

              "flex size-12 items-center justify-center rounded-lg border border-border bg-muted/60",

              (project.isGenerating || isGenerating) && "animate-pulse-ring",

            )}

          >

            <HugeiconsIcon icon={Image02Icon} size={22} aria-hidden />

          </span>

          {project.isGenerating || isGenerating ? "Generation is still running…" : project.error || "No media yet"}

        </div>

      ) : (

        <div className="relative mx-auto w-fit max-w-full">

          {!mediaReady && mediaSrc ? <Skeleton className="absolute inset-0 z-[2] rounded-[var(--radius-lg)]" aria-hidden /> : null}



          {hasVideo ? (

            <video

              src={project.generatedVideo}

              poster={project.generatedImage}

              controls

              autoPlay

              loop

              muted

              playsInline

              onLoadedData={onMediaReady}

              className={cn(mediaClass, "rounded-[var(--radius-lg)] ring-1 ring-white/10")}

            />

          ) : (

            <img

              src={project.generatedImage}

              alt={project.productName || "Generated result"}

              onLoad={onMediaReady}

              className={cn(mediaClass, "rounded-[var(--radius-lg)] ring-1 ring-white/10")}

            />

          )}



          {isGenerating && hasImage && !hasVideo ? (

            <div className="absolute inset-x-0 bottom-0 z-[3] flex items-center gap-3 rounded-b-[var(--radius-lg)] border-t border-border bg-card/95 px-4 py-3 text-xs backdrop-blur-sm">

              <HugeiconsIcon icon={AiVideoIcon} size={16} className="animate-pulse text-brand" aria-hidden />

              <span>Animating with speech… usually 1–3 minutes.</span>

            </div>

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

  mediaReady,

  onMediaReady,

  onGenerateVideo,

  onShare,

  isPublishing = false,

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



  const shellClass = cn(SHELL, className);



  if (loading) {

    return (

      <div id={rootId} className={shellClass}>

        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-brand/[0.08] to-transparent" aria-hidden />

        <StudioPageHero eyebrow="Result" title="Loading project…" description="Fetching your generation." />

        <ResultStudioSkeleton />

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



  const hasVideo = Boolean(project.generatedVideo);

  const hasImage = Boolean(project.generatedImage);

  const hasMedia = hasImage || hasVideo;

  const mediaSrc = project.generatedVideo || project.generatedImage;

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

              <div className="flex max-w-full flex-wrap items-center gap-2">

                {onTogglePublish && (

                  <Button

                    framer={false}

                    variant={project.isPublished ? "secondary" : "gradient"}

                    size="default"

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

                <Button asChild framer={false} variant="outline" size="default" className="min-h-11 w-auto">

                  <Link to="/my-generations">My generations</Link>

                </Button>

                <Button asChild framer={false} variant="outline" size="default" className="min-h-11 w-auto">

                  <Link to="/generate">New generation</Link>

                </Button>

                {onDelete && (

                  <Button

                    framer={false}

                    variant="outline"

                    size="default"

                    className="min-h-11 w-auto border-destructive/35 text-destructive hover:bg-destructive/10"

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
                mediaSrc={mediaSrc}
                mediaReady={mediaReady}
                isGenerating={isGenerating}
                onMediaReady={onMediaReady}
              />
            </div>

            <ResultActionsAside
              project={project}
              hasVideo={hasVideo}
              hasImage={hasImage}
              mediaSrc={mediaSrc}
              isGenerating={isGenerating}
              showStickyVideo={showStickyVideo}
              onGenerateVideo={onGenerateVideo}
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

            projectError={project.error}

            onGenerateVideo={onGenerateVideo}

            compact

          />

        </div>

      )}

    </div>

  );

}


