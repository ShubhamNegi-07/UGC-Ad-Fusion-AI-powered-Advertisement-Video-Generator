import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import MyGenerationsStudioView from "@/components/studio/MyGenerationsStudioView";
import { readCachedProjectsList, writeCachedProject, writeCachedProjectsList } from "@/lib/studio-cache";
import { errorMessage } from "@/lib/utils";

export default function MyGenerations() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();

  const cachedOnMount = useRef(readCachedProjectsList()).current;
  const revalidateSilently = useRef(cachedOnMount !== null);

  const [generations, setGenerations] = useState<Project[]>(cachedOnMount ?? []);
  const [loading, setLoading] = useState(cachedOnMount === null);

  const fetchMyGenerations = useCallback(
    async (opts?: { silent?: boolean }) => {
      try {
        if (!opts?.silent) setLoading(true);
        const token = await getToken();
        const { data } = await api.get("/api/user/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = (data.projects ?? []) as Project[];
        setGenerations(list);
        writeCachedProjectsList(list);
        for (const item of list) writeCachedProject(item);
      } catch (error) {
        if (!opts?.silent) {
          toast.error(errorMessage(error, "Could not load your generations"));
        }
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [getToken],
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      void fetchMyGenerations({ silent: revalidateSilently.current });
      revalidateSilently.current = false;
    } else {
      setLoading(false);
    }
  }, [isLoaded, user, fetchMyGenerations]);

  return (
    <MyGenerationsStudioView
      loading={!isLoaded || loading}
      signedIn={Boolean(user)}
      generations={generations}
      setGenerations={setGenerations}
      onRefresh={() => void fetchMyGenerations()}
      onSignIn={() => openSignIn()}
    />
  );
}
