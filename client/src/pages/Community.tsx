import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { fadeUp, stagger } from "@/components/ui/motion";
import { GridSkeleton } from "@/components/ui/skeleton";
import { errorMessage } from "@/lib/utils";

export default function Community() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/project/published");
        if (!cancelled) setProjects(data.projects ?? []);
      } catch (error) {
        if (!cancelled) toast.error(errorMessage(error, "Could not load community projects"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-4 pb-24 pt-nav sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.header variants={stagger(0, 0.06)} initial="hidden" animate="show" className="mb-10">
          <motion.h1 variants={fadeUp} className="text-3xl font-semibold tracking-tight md:text-4xl">
            Community
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-2 max-w-xl text-sm text-muted-foreground">
            Ads other creators chose to publish. Hover a card to preview the video.
          </motion.p>
        </motion.header>

        {loading ? (
          <GridSkeleton />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={UserGroupIcon}
            title="Nothing published yet"
            description="Be the first. Generate an ad, then press Publish on the card in My generations."
            action={
              <Button asChild variant="gradient">
                <Link to="/generate">
                  <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} />
                  Create an ad
                </Link>
              </Button>
            }
          />
        ) : (
          <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <ProjectCard key={project.id} gen={project} setGenerations={setProjects} forCommunity />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
