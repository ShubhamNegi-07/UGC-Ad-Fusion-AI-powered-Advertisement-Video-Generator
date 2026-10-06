import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiVideoIcon,
  Alert02Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Coins01Icon,
  Image02Icon,
  Mic01Icon,
  PlusSignIcon,
  Share08Icon,
  Video02Icon,
} from "@hugeicons/core-free-icons";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp, spring, stagger } from "@/components/ui/motion";
import { cn, errorMessage, formatDate } from "@/lib/utils";

function ResultSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
      <Skeleton className="aspect-[9/16] max-h-[min(62dvh,560px)] w-full rounded-2xl sm:aspect-video" />
      <div className="space-y-3">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    </div>
  );
}

export default function Result() {
  const { projectId } = useParams();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await api.get(`/api/user/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(data.project);
      setIsGenerating(Boolean(data.project?.isGenerating));
    } catch (error) {
      toast.error(errorMessage(error, "Could not load project"));
    } finally {
      setLoading(false);
    }
  }, [getToken, projectId]);

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/project/video",
        { projectId },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 360000 },
      );
      setMediaReady(false);
      setProject((prev) => (prev ? { ...prev, generatedVideo: data.videoUrl, isGenerating: false, error: "" } : prev));
      toast.success(data.message || "Video generated");
    } catch (error) {
      const message = errorMessage(error, "Video generation failed");
      if (!/pollen|top-up/i.test(message)) {
        toast.error(message, { duration: 7000 });
      }
      await fetchProject();
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      navigate("/");
      return;
    }
    void fetchProject();
  }, [isLoaded, user, fetchProject, navigate]);

  useEffect(() => {
    if (!user || !isGenerating) return;
    const interval = setInterval(() => void fetchProject(), 10000);
    return () => clearInterval(interval);
  }, [user, isGenerating, fetchProject]);

  const hasVideo = Boolean(project?.generatedVideo);
  const hasImage = Boolean(project?.generatedImage);
  const mediaSrc = project?.generatedVideo || project?.generatedImage;

  const share = async () => {
    if (!mediaSrc) return;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ url: mediaSrc, title: project?.productName });
      } else {
        await navigator.clipboard.writeText(mediaSrc);
        toast.success("Link copied");
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") toast.error("Could not share");
    }
  };

  return (
    <div className="px-4 pb-10 pt-nav sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.header
          variants={stagger(0, 0.06)}
          initial="hidden"
          animate="show"
          className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <motion.div variants={fadeUp}>
              <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1 h-8 text-muted-foreground">
                <Link to="/my-generations">
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                  My generations
                </Link>
              </Button>
            </motion.div>
            <motion.h1 variants={fadeUp} className="truncate text-xl font-semibold tracking-tight md:text-2xl">
              {loading ? <Skeleton className="h-7 w-48" /> : project?.productName || project?.name || "Generation result"}
            </motion.h1>
            {!loading && project && (
              <motion.div variants={fadeUp} className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDate(project.createdAt)}</span>
                <span aria-hidden>·</span>
                <Badge variant="outline" className="font-mono">{project.aspectRatio}</Badge>
                {project.isPublished && (
                  <Badge variant="success">Published</Badge>
                )}
              </motion.div>
            )}
          </div>
          <motion.div variants={fadeUp} className="shrink-0">
            <Button asChild variant="outline">
              <Link to="/generate">
                <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.2} />
                New generation
              </Link>
            </Button>
          </motion.div>
        </motion.header>

        {loading ? (
          <ResultSkeleton />
        ) : !project ? (
          <Card className="items-center py-16 text-center">
            <CardContent>
              <HugeiconsIcon icon={Alert02Icon} size={28} className="mx-auto text-amber-300" />
              <p className="mt-4 font-medium">Project not found</p>
              <p className="mt-1 text-sm text-muted-foreground">It may have been deleted or belongs to another account.</p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/my-generations">Back to my generations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={stagger(0.05, 0.08)}
            initial="hidden"
            animate="show"
            className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
          >
            {/* Media */}
            <motion.div variants={fadeUp} className="glass-strong rounded-3xl p-2">
              <div
                className={cn(
                  "relative mx-auto overflow-hidden rounded-2xl bg-black",
                  project.aspectRatio === "16:9" && "aspect-video w-full max-h-[min(62dvh,560px)]",
                  project.aspectRatio === "1:1" && "aspect-square h-[min(62dvh,520px)] w-auto max-w-full",
                  project.aspectRatio !== "16:9" && project.aspectRatio !== "1:1" && "aspect-[9/16] h-[min(62dvh,560px)] w-auto max-w-full",
                )}
              >
                {!mediaReady && mediaSrc && <Skeleton className="absolute inset-0 rounded-none" />}

                <AnimatePresence mode="wait">
                  {hasVideo ? (
                    <motion.video
                      key="video"
                      src={project.generatedVideo}
                      poster={project.generatedImage}
                      controls
                      autoPlay
                      loop
                      playsInline
                      onLoadedData={() => setMediaReady(true)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full w-full object-contain"
                    />
                  ) : hasImage ? (
                    <motion.img
                      key="image"
                      src={project.generatedImage}
                      alt="Generated result"
                      onLoad={() => setMediaReady(true)}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={spring}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-full min-h-72 flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground"
                    >
                      <span className={cn("flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]", project.isGenerating && "animate-pulse-ring")}>
                        <HugeiconsIcon icon={Image02Icon} size={24} />
                      </span>
                      <p className="text-sm">
                        {project.isGenerating || isGenerating ? "Generation is still running…" : project.error || "No media generated yet"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isGenerating && hasImage && !hasVideo && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/90 to-transparent p-4 pt-10">
                    <span className="flex size-8 items-center justify-center rounded-full bg-white/10">
                      <HugeiconsIcon icon={AiVideoIcon} size={16} className="animate-pulse" />
                    </span>
                    <div className="text-xs">
                      <p className="font-medium">Animating with speech…</p>
                      <p className="text-white/60">Usually 1–3 minutes. You can stay on this page.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Side panel */}
            <div
              className="flex flex-col gap-3 lg:max-h-[calc(100dvh-var(--nav-offset)-5.5rem)] lg:overflow-y-auto lg:pr-1"
              data-lenis-prevent
            >
              <motion.div variants={fadeUp}>
                <Card className="gap-3">
                  <CardHeader className="px-5 pt-5">
                    <CardTitle>Downloads</CardTitle>
                    <CardDescription>Full-resolution files, ready to post.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2 px-5 pb-5">
                    <Button asChild variant="outline" className="justify-start" disabled={!hasImage}>
                      <a href={project.generatedImage || undefined} download target="_blank" rel="noreferrer">
                        <HugeiconsIcon icon={Image02Icon} size={16} />
                        Download image
                        <span className="ml-auto font-mono text-[11px] text-muted-foreground">PNG</span>
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" disabled={!hasVideo}>
                      <a href={project.generatedVideo || undefined} download target="_blank" rel="noreferrer">
                        <HugeiconsIcon icon={Video02Icon} size={16} />
                        Download video
                        <span className="ml-auto font-mono text-[11px] text-muted-foreground">MP4</span>
                      </a>
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={share} disabled={!mediaSrc}>
                      <HugeiconsIcon icon={Share08Icon} size={16} />
                      Share link
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="relative gap-3 overflow-hidden">
                  <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/[0.06] blur-3xl" />
                  <HugeiconsIcon icon={AiVideoIcon} size={96} strokeWidth={1} className="pointer-events-none absolute -right-4 -top-2 text-white/[0.04]" />
                  <CardHeader className="px-5 pt-5">
                    <CardTitle>Talking video</CardTitle>
                    <CardDescription>
                      Animate this frame into an 8-second clip where the creator speaks to camera and shows the product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <ul className="mb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
                        <HugeiconsIcon icon={Mic01Icon} size={14} className="text-zinc-200" />
                        Speech included
                      </li>
                      <li className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
                        <HugeiconsIcon icon={Coins01Icon} size={14} className="text-amber-300" />
                        10 credits
                      </li>
                    </ul>

                    <AnimatePresence mode="wait" initial={false}>
                      {hasVideo ? (
                        <motion.div
                          key="done"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={spring}
                          className="flex items-center gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
                        >
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                          Video generated successfully
                        </motion.div>
                      ) : (
                        <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Button
                            variant="gradient"
                            size="lg"
                            className="w-full"
                            onClick={handleGenerateVideo}
                            loading={isGenerating}
                            loadingText="Generating video…"
                            disabled={!hasImage}
                          >
                            <HugeiconsIcon icon={AiVideoIcon} size={18} strokeWidth={2} />
                            Generate video
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {project.error && !isGenerating && hasImage && !hasVideo && (
                      <div role="alert" className="mt-4 space-y-3 rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-3 text-xs leading-relaxed text-red-100">
                        <div className="flex gap-2.5">
                          <HugeiconsIcon icon={Alert02Icon} size={16} className="mt-0.5 shrink-0" />
                          <span className="break-words">{project.error}</span>
                        </div>
                        {/pollen|top-up/i.test(project.error) && (
                          <a
                            href="https://enter.pollinations.ai/top-up"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-8 items-center rounded-lg bg-red-400/15 px-3 font-medium text-red-50 transition-colors hover:bg-red-400/25"
                          >
                            Add Pollen
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {(project.productDescription || project.userPrompt) && (
                <motion.div variants={fadeUp}>
                  <Card className="gap-3">
                    <CardHeader className="px-5 pt-5">
                      <CardTitle className="text-base">Brief</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-5 pb-5 text-sm">
                      {project.productDescription && (
                        <div>
                          <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Description</p>
                          <p className="leading-relaxed text-foreground/85">{project.productDescription}</p>
                        </div>
                      )}
                      {project.userPrompt && (
                        <div>
                          <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Direction</p>
                          <p className="leading-relaxed text-foreground/85">{project.userPrompt}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
