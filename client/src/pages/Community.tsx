import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import CommunityStudioView from "@/components/studio/CommunityStudioView";
import { readCachedCommunityProjects, writeCachedCommunityProjects } from "@/lib/studio-cache";
import { errorMessage } from "@/lib/utils";

export default function Community() {
  const cachedOnMount = useRef(readCachedCommunityProjects()).current;
  const revalidateSilently = useRef(cachedOnMount !== null);

  const [projects, setProjects] = useState<Project[]>(cachedOnMount ?? []);
  const [loading, setLoading] = useState(cachedOnMount === null);

  const fetchPublished = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const { data } = await api.get("/api/project/published");
      const list = (data.projects ?? []) as Project[];
      setProjects(list);
      writeCachedCommunityProjects(list);
    } catch (error) {
      if (!opts?.silent) {
        toast.error(errorMessage(error, "Could not load community projects"));
      }
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPublished({ silent: revalidateSilently.current });
    revalidateSilently.current = false;
  }, [fetchPublished]);

  return (
    <CommunityStudioView
      loading={loading}
      projects={projects}
      setProjects={setProjects}
      onRetry={() => void fetchPublished()}
    />
  );
}
