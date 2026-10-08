import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, FolderOpenIcon, PlusSignIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import type { Dispatch, SetStateAction } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { GridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { studioReveal, studioStagger } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export type MyGenerationsStudioViewProps = {
  loading: boolean;
  signedIn: boolean;
  generations: Project[];
  setGenerations: Dispatch<SetStateAction<Project[]>>;
  onRefresh: () => void;
  onSignIn: () => void;
  errorMessage?: string | null;
  rootId?: string;
  className?: string;
};

export default function MyGenerationsStudioView({
  loading,
  signedIn,
  generations,
  setGenerations,
  onRefresh,
  onSignIn,
  errorMessage,
  rootId,
  className,
}: MyGenerationsStudioViewProps) {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.04, 0.05);

  return (
    <div id={rootId} className={cn("studio-shell studio-shell-bottom pt-nav", className)}>
      <motion.header
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <motion.h1 variants={enter} className="studio-page-title text-2xl font-semibold tracking-tight md:text-3xl">
            My generations
          </motion.h1>
          <motion.p variants={enter} className="mt-2 text-sm text-muted-foreground" aria-live="polite">
            {loading ? "Loading your projects…" : `${generations.length} project${generations.length === 1 ? "" : "s"}. Preview videos in the feed.`}
          </motion.p>
        </div>
        <motion.div variants={enter} className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-11 min-h-[44px] min-w-[44px]"
            aria-label="Refresh projects"
            onClick={onRefresh}
            disabled={loading || !signedIn}
          >
            <HugeiconsIcon icon={RefreshIcon} size={18} className={loading ? "animate-spin" : undefined} aria-hidden />
          </Button>
          <Button asChild variant="gradient" className="min-h-11">
            <Link to="/generate">
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} aria-hidden />
              New generation
            </Link>
          </Button>
        </motion.div>
      </motion.header>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-2">
            <HugeiconsIcon icon={Alert02Icon} size={18} className="shrink-0" aria-hidden />
            <span>{errorMessage}</span>
          </div>
          <Button variant="outline" className="min-h-11 shrink-0" onClick={onRefresh}>
            Try again
          </Button>
        </div>
      )}

      {loading ? (
        <GridSkeleton />
      ) : !signedIn ? (
        <EmptyState
          icon={FolderOpenIcon}
          title="Sign in to see your generations"
          description="Your projects stay on your account so you can publish, download, or continue later."
          action={
            <Button variant="gradient" className="min-h-11" onClick={onSignIn}>
              Sign in
            </Button>
          }
        />
      ) : generations.length === 0 ? (
        <EmptyState
          icon={FolderOpenIcon}
          title="No generations yet"
          description="Upload a product photo and a model photo to create your first in-context image."
          action={
            <Button asChild variant="gradient" className="min-h-11">
              <Link to="/generate">
                <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} aria-hidden />
                Create your first ad
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {generations.map((gen) => (
            <ProjectCard key={gen.id} gen={gen} setGenerations={setGenerations} studio />
          ))}
        </div>
      )}
    </div>
  );
}
