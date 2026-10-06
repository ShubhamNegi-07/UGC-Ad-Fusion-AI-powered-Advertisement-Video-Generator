import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderOpenIcon, PlusSignIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { GridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { fadeUp, stagger } from "@/components/ui/motion";
import { errorMessage } from "@/lib/utils";

export default function MyGenerations() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const [generations, setGenerations] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyGenerations = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await api.get("/api/user/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenerations(data.projects ?? []);
    } catch (error) {
      toast.error(errorMessage(error, "Could not load your generations"));
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    if (user) void fetchMyGenerations();
    else setLoading(false);
  }, [isLoaded, user, fetchMyGenerations]);

  return (
    <div className="px-4 pb-24 pt-nav sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.header
          variants={stagger(0, 0.06)}
          initial="hidden"
          animate="show"
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.h1 variants={fadeUp} className="text-3xl font-semibold tracking-tight md:text-4xl">
              My generations
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-muted-foreground">
              {loading ? "Loading your projects…" : `${generations.length} project${generations.length === 1 ? "" : "s"}. Hover a card to preview its video.`}
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Refresh" onClick={() => void fetchMyGenerations()} disabled={loading || !user}>
              <HugeiconsIcon icon={RefreshIcon} size={18} className={loading ? "animate-spin" : undefined} />
            </Button>
            <Button asChild variant="gradient">
              <Link to="/generate">
                <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} />
                New generation
              </Link>
            </Button>
          </motion.div>
        </motion.header>

        {loading ? (
          <GridSkeleton />
        ) : !user ? (
          <EmptyState
            icon={FolderOpenIcon}
            title="Sign in to see your generations"
            description="Your projects are saved to your account so you can come back, publish or download them later."
            action={<Button variant="gradient" onClick={() => openSignIn()}>Sign in</Button>}
          />
        ) : generations.length === 0 ? (
          <EmptyState
            icon={FolderOpenIcon}
            title="No generations yet"
            description="Upload a product and a model photo to create your first in-context image. You have free credits waiting."
            action={
              <Button asChild variant="gradient">
                <Link to="/generate">
                  <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} />
                  Create your first ad
                </Link>
              </Button>
            }
          />
        ) : (
          <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            <AnimatePresence mode="popLayout">
              {generations.map((gen) => (
                <ProjectCard key={gen.id} gen={gen} setGenerations={setGenerations} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
