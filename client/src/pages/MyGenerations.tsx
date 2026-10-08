import { useCallback, useEffect, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import type { Project } from "@/Types";
import api from "@/configs/axios";
import MyGenerationsStudioView from "@/components/studio/MyGenerationsStudioView";
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
    <MyGenerationsStudioView
      loading={loading}
      signedIn={Boolean(user)}
      generations={generations}
      setGenerations={setGenerations}
      onRefresh={() => void fetchMyGenerations()}
      onSignIn={() => openSignIn()}
    />
  );
}
