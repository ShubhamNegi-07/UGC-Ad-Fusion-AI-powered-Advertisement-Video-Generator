import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/", { replace: true }), 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center" role="status" aria-live="polite">
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="animate-pulse-ring flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-200"
      >
        <HugeiconsIcon icon={SparklesIcon} size={26} strokeWidth={1.8} />
      </motion.span>
      <div>
        <p className="font-medium">Finishing up…</p>
        <p className="mt-1 text-sm text-muted-foreground">You will be redirected in a moment.</p>
      </div>
    </div>
  );
}
