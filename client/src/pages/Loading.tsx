import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusGridLoader } from "@/components/ui/plus-grid-loader";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/", { replace: true }), 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center" role="status" aria-live="polite">
      <PlusGridLoader size="lg" />
      <div>
        <p className="font-medium">Finishing up…</p>
        <p className="mt-1 text-sm text-muted-foreground">You will be redirected in a moment.</p>
      </div>
    </div>
  );
}
