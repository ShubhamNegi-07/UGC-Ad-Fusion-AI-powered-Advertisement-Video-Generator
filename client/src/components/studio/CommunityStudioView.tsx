import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, PlusSignIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import type { Dispatch, SetStateAction } from "react";
import ProjectCard from "@/components/ProjectCard";
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
  setProjects,
  onRetry,
  errorMessage,
  rootId,
  className,
}: CommunityStudioViewProps) {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.04, 0.05);

  return (
    <div id={rootId} className={cn("studio-shell studio-shell-bottom pt-nav", className)}>
      <motion.header variants={stagger} initial="hidden" animate="show" className="mb-8 sm:mb-10">
        <motion.h1 variants={enter} className="studio-page-title text-2xl font-semibold tracking-tight md:text-3xl">
          Community
        </motion.h1>
        <motion.p variants={enter} className="mt-2 max-w-xl text-sm text-muted-foreground">
          Ads creators chose to publish. Browse the feed — no rankings or view counts.
        </motion.p>
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
          description="Generate an ad, then choose Publish on the card in My generations."
          action={
            <Button asChild variant="gradient" className="min-h-11">
              <Link to="/generate">
                <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} aria-hidden />
                Create an ad
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} gen={project} setGenerations={setProjects} forCommunity studio />
          ))}
        </div>
      )}
    </div>
  );
}
