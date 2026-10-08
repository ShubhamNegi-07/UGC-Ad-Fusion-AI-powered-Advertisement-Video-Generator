import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import ResultStudioView from "@/components/studio/ResultStudioView";
import { readCachedProject, writeCachedProject } from "@/lib/studio-cache";
import { errorMessage } from "@/lib/utils";

export default function Result() {
  const { projectId } = useParams();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const cachedOnMount = useRef(projectId ? readCachedProject(projectId) : null).current;
  const revalidateSilently = useRef(Boolean(cachedOnMount));

  const [project, setProject] = useState<Project | null>(cachedOnMount);
  const [loading, setLoading] = useState(!cachedOnMount);
  const [isGenerating, setIsGenerating] = useState(Boolean(cachedOnMount?.isGenerating));
  const [isPublishing, setIsPublishing] = useState(false);
  const [mediaReady, setMediaReady] = useState(Boolean(cachedOnMount?.generatedImage || cachedOnMount?.generatedVideo));

  const fetchProject = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!projectId) return;
      if (!opts?.silent) setLoading(true);
      try {
        const token = await getToken();
        const { data } = await api.get(`/api/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const next = data.project as Project | undefined;
        if (next) {
          setProject(next);
          writeCachedProject(next);
          setIsGenerating(Boolean(next.isGenerating));
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
      setMediaReady(false);
      setProject((prev) => {
        if (!prev) return prev;
        const next = { ...prev, generatedVideo: data.videoUrl, isGenerating: false, error: "" };
        writeCachedProject(next);
        return next;
      });
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
    const interval = setInterval(() => void fetchProject({ silent: true }), 10000);
    return () => clearInterval(interval);
  }, [user, isGenerating, fetchProject]);

  const mediaSrc = project?.generatedVideo || project?.generatedImage;

  const togglePublish = async () => {
    if (!project?.id) return;
    setIsPublishing(true);
    try {
      const token = await getToken();
      const { data } = await api.get(`/api/user/publish/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject((prev) => {
        if (!prev) return prev;
        const next = { ...prev, isPublished: data.isPublished };
        writeCachedProject(next);
        return next;
      });
      toast.success(data.isPublished ? "Published to Community" : "Removed from Community");
    } catch (error) {
      toast.error(errorMessage(error, "Could not update publish status"));
    } finally {
      setIsPublishing(false);
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
    <ResultStudioView
      loading={showLoading}
      project={project}
      isGenerating={isGenerating}
      mediaReady={mediaReady}
      onMediaReady={() => setMediaReady(true)}
      onGenerateVideo={handleGenerateVideo}
      onShare={share}
      isPublishing={isPublishing}
      onTogglePublish={togglePublish}
    />
  );
}
