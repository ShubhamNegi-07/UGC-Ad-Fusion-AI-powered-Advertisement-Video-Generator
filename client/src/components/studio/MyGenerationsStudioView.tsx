import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, FolderOpenIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import type { Dispatch, SetStateAction } from "react";
import ProjectCard from "@/components/ProjectCard";
import StudioPageHero from "@/components/studio/StudioPageHero";
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

function countDescription(loading: boolean, count: number) {
  if (loading) return "Loading your projects…";
  if (count === 0) return "Create a still or video from Create — it will show up here.";
  return `${count} project${count === 1 ? "" : "s"} · Open any card to continue or publish to Community.`;
}

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
    <div id={rootId} className={cn("studio-shell studio-shell-bottom relative pt-nav", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand/[0.08] to-transparent"
        aria-hidden
      />
      <div className="monex-backdrop-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-40" aria-hidden />

      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={enter}>
          <StudioPageHero
            title="My generations"
            description={countDescription(loading, generations.length)}
            actions={
              <>
                <Button
                  framer={false}
                  variant="outline"
                  size="icon"
                  className="size-11 shrink-0"
                  aria-label="Refresh projects"
                  onClick={onRefresh}
                  disabled={loading || !signedIn}
                >
                  <HugeiconsIcon icon={RefreshIcon} size={18} className={loading ? "animate-spin" : undefined} aria-hidden />
                </Button>
                <Button asChild variant="gradient" size="default" className="w-auto">
                  <Link to="/generate">New generation</Link>
                </Button>
              </>
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
          <Button variant="outline" className="min-h-11 w-auto shrink-0" onClick={onRefresh}>
            Try again
          </Button>
        </div>
      )}

      {loading ? (
        <GridSkeleton layout="studio-grid" count={8} />
      ) : !signedIn ? (
        <EmptyState
          icon={FolderOpenIcon}
          title="Sign in to see your generations"
          description="Your projects stay on your account so you can publish, download, or continue later."
          action={
            <Button variant="gradient" className="min-h-11 w-auto" onClick={onSignIn}>
              Sign in
            </Button>
          }
        />
      ) : generations.length === 0 ? (
        <EmptyState
          icon={FolderOpenIcon}
          title="No generations yet"
          description="Upload a product photo and a model photo in Create to generate your first still."
          action={
            <Button asChild variant="gradient" className="min-h-11 w-auto">
              <Link to="/generate">Create your first ad</Link>
            </Button>
          }
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {generations.map((gen) => (
            <motion.div key={gen.id} variants={enter} className="min-w-0">
              <ProjectCard gen={gen} setGenerations={setGenerations} studio />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
