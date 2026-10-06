import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "@/components/ui/motion";

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-[60vh] will-change-[opacity,transform]"
    >
      {children}
    </motion.div>
  );
}
