import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import type { Dispatch, SetStateAction } from "react";
import CommunityMasonry from "@/components/studio/CommunityMasonry";
import StudioPageHero from "@/components/studio/StudioPageHero";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/skeleton";
import { studioReveal, studioStagger } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

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
        <motion.div variants={enter}>
          <StudioPageHero
            eyebrow="Published feed"
            title="Community"
            description="Published ads from your projects — drag the masonry wall to explore. Videos play when a tile is in view."
            actions={
              <Button asChild variant="outline" size="sm">
                <Link to="/my-generations">My generations</Link>
              </Button>
            }
          />
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

      {loading ? (
        <GridSkeleton />
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
