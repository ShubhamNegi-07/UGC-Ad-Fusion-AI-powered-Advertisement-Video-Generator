import { type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CommunityFeedSkeleton } from "@/components/ui/page-skeletons";
import { studioReveal, studioStagger } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import CommunityMasonry from "@/components/studio/CommunityMasonry";

export type CommunityStudioViewProps = {
  loading: boolean;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  onRetry?: () => void;
  errorMessage?: string | null;
  rootId?: string;
  className?: string;
};

export default function CommunityStudioView({
  loading,
  projects,
  setProjects: _setProjects,
  onRetry,
  errorMessage,
  rootId,
  className,
}: CommunityStudioViewProps) {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.04, 0.05);

  return (
    <div id={rootId} className={cn("studio-shell studio-shell-bottom relative pt-nav", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand/[0.08] to-transparent"
        aria-hidden
      />
      <div className="monex-backdrop-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-40" aria-hidden />

      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={enter} className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Published feed</p>
            <h1 className="studio-page-title mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Community
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Sample outputs plus ads published by creators — see who posted each still or video.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit shrink-0">
            <Link to="/my-generations">My generations</Link>
          </Button>
        </motion.div>
      </motion.div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-2">
            <HugeiconsIcon icon={Alert02Icon} size={18} className="shrink-0" aria-hidden />
            <span>{errorMessage}</span>
          </div>
          {onRetry && (
            <Button variant="outline" className="min-h-11 shrink-0" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      )}

      {loading && projects.length === 0 ? (
        <CommunityFeedSkeleton count={6} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={UserGroupIcon}
          title="Nothing published yet"
          description="Generate an ad, then publish from Result or from a card in My generations."
          action={
            <Button asChild variant="gradient" className="min-h-11">
              <Link to="/generate">Create an ad</Link>
            </Button>
          }
        />
      ) : (
        <CommunityMasonry projects={projects} />
      )}
    </div>
  );
}
