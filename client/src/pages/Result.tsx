import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import ResultStudioView from "@/components/studio/ResultStudioView";
import { errorMessage } from "@/lib/utils";

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
    <ResultStudioView
      loading={loading}
      project={project}
      isGenerating={isGenerating}
      mediaReady={mediaReady}
      onMediaReady={() => setMediaReady(true)}
      onGenerateVideo={handleGenerateVideo}
      onShare={share}
    />
  );
}
