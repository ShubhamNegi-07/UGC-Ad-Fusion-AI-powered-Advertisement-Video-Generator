import type { ReactNode } from "react";
import { useNavigationType } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { pageVariants } from "@/components/ui/motion";

export default function PageTransition({ children }: { children: ReactNode }) {
  const navType = useNavigationType();
  const skipEnterMotion = navType === "POP";

  return (
    <motion.div
      variants={pageVariants}
      initial={skipEnterMotion ? false : "initial"}
      animate="animate"
      exit="exit"
      className="min-h-[60vh] will-change-[opacity,transform]"
    >
      {children}
    </motion.div>
  );
}
