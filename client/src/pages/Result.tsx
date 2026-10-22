import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import ResultStudioView from "@/components/studio/ResultStudioView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@/icons";
import { applyPublishFlags, type PublishMedia } from "@/lib/publish";
import { readCachedProject, writeCachedProject } from "@/lib/studio-cache";
import { errorMessage } from "@/lib/utils";

export default function Result() {
  const { projectId } = useParams();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const cachedOnMount = useRef(projectId ? readCachedProject(projectId) : null).current;
  const revalidateSilently = useRef(Boolean(cachedOnMount));
  const errorToasted = useRef(false);

  const [project, setProject] = useState<Project | null>(cachedOnMount);
  const [loading, setLoading] = useState(!cachedOnMount);
  const [isGenerating, setIsGenerating] = useState(Boolean(cachedOnMount?.isGenerating));
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [publishingMedia, setPublishingMedia] = useState<PublishMedia | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mediaReady, setMediaReady] = useState(
    Boolean(cachedOnMount?.generatedImage || cachedOnMount?.generatedVideo || cachedOnMount?.videoUrl),
  );

  const fetchProject = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!projectId) return;
      if (!opts?.silent) setLoading(true);
      try {
        const token = await getToken();
        const { data } = await api.get(`/api/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = data.project as Project | undefined;
        if (raw) {
          const resolvedVideo = raw.videoUrl || raw.generatedVideo || "";
          const next: Project = {
            ...raw,
            generatedVideo: resolvedVideo,
            videoUrl: resolvedVideo || undefined,
          };
          setProject(next);
          writeCachedProject(next);
          setIsGenerating(Boolean(next.isGenerating));
          if (next.generatedImage || resolvedVideo) {
            setMediaReady(true);
          }
          if (!next.isGenerating && next.error && !next.generatedImage && !errorToasted.current) {
            errorToasted.current = true;
            toast.error(next.error);
          }
        }
      } catch (error) {
        if (!opts?.silent) {
          toast.error(errorMessage(error, "Could not load project"));
        }
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [getToken, projectId],
  );

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/project/video",
        { projectId },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 360000 },
      );
      const nextVideoUrl = data.videoUrl || data.project?.videoUrl || data.project?.generatedVideo || "";
      setProject((prev) => {
        const base = data.project ? { ...(prev ?? {}), ...data.project } : prev;
        if (!base) return prev;
        const next: Project = {
          ...base,
          generatedVideo: nextVideoUrl,
          videoUrl: nextVideoUrl || undefined,
          isGenerating: false,
          error: "",
        };
        writeCachedProject(next);
        return next;
      });
      setMediaReady(true);
      toast.success(data.message || "Video generated");
    } catch (error) {
      const message = errorMessage(error, "Video generation failed");
      if (!/pollen|top-up/i.test(message)) {
        toast.error(message, { duration: 7000 });
      }
      await fetchProject({ silent: true });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!projectId) return;
    setIsRegeneratingImage(true);
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/project/regenerate-image",
        { projectId },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 180000 },
      );
      const nextImage = data.generatedImage || data.project?.generatedImage || "";
      setProject((prev) => {
        const base = data.project ? { ...(prev ?? {}), ...data.project } : prev;
        if (!base) return prev;
        const resolvedVideo = base.videoUrl || base.generatedVideo || "";
        const next: Project = {
          ...base,
          generatedImage: nextImage,
          generatedVideo: resolvedVideo,
          videoUrl: resolvedVideo || undefined,
          isGenerating: false,
          error: "",
        };
        writeCachedProject(next);
        return next;
      });
      setMediaReady(true);
      toast.success(data.message || "Image regenerated");
    } catch (error) {
      const message = errorMessage(error, "Image regeneration failed");
      toast.error(message, { duration: 6000 });
      await fetchProject({ silent: true });
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      navigate("/");
      return;
    }
    void fetchProject({ silent: revalidateSilently.current });
    revalidateSilently.current = false;
  }, [isLoaded, user, fetchProject, navigate]);

  useEffect(() => {
    if (!user || !isGenerating) return;
    const interval = setInterval(() => void fetchProject({ silent: true }), 4000);
    return () => clearInterval(interval);
  }, [user, isGenerating, fetchProject]);

  const mediaSrc = project?.videoUrl || project?.generatedVideo || project?.generatedImage;

  const togglePublish = async (media: PublishMedia) => {
    if (!project?.id) return;
    setPublishingMedia(media);
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/user/publish/${project.id}`,
        { media },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProject((prev) => {
        if (!prev) return prev;
        const next = applyPublishFlags(prev, data);
        writeCachedProject(next);
        return next;
      });
      const nowOn = media === "image" ? data.publishedImage : data.publishedVideo;
      toast.success(
        nowOn
          ? media === "image"
            ? "Image published to Community"
            : "Video published to Community"
          : media === "image"
            ? "Image removed from Community"
            : "Video removed from Community",
      );
    } catch (error) {
      toast.error(errorMessage(error, "Could not update publish status"));
    } finally {
      setPublishingMedia(null);
    }
  };

  const handleDelete = async () => {
    if (!project?.id) return;
    try {
      setDeleting(true);
      const token = await getToken();
      await api.delete(`/api/project/${project.id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Project deleted");
      navigate("/my-generations");
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete project"));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

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

  const showLoading = !isLoaded || (loading && !project);

  return (
    <>
      <ResultStudioView
        loading={showLoading}
        project={project}
        isGenerating={isGenerating}
        isRegeneratingImage={isRegeneratingImage}
        mediaReady={mediaReady}
        onMediaReady={() => setMediaReady(true)}
        onGenerateVideo={handleGenerateVideo}
        onRegenerateImage={handleRegenerateImage}
        onShare={share}
        publishingMedia={publishingMedia}
        onTogglePublish={togglePublish}
        onDelete={project ? () => setDeleteOpen(true) : undefined}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              “{project?.productName || "This project"}” and its generated media will be removed permanently. Credits
              are not refunded.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void handleDelete()} loading={deleting} loadingText="Deleting">
              <HugeiconsIcon icon={Delete02Icon} size={15} />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
