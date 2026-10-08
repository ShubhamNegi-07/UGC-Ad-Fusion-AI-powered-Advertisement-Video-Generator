import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import CommunityStudioView from "@/components/studio/CommunityStudioView";
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
    <CommunityStudioView
      loading={loading}
      projects={projects}
      setProjects={setProjects}
    />
  );
}
