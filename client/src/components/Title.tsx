import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

interface TitleProps {
  title?: string;
  heading?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}

export default function Title({ title, heading, description, align = "center", className, as = "h2" }: TitleProps) {
  const Heading = motion[as];
  const isPageTitle = as === "h1";
  return (
    <motion.div
      variants={stagger(0, 0.08)}
      initial="hidden"
      animate={isPageTitle ? "show" : undefined}
      whileInView={isPageTitle ? undefined : "show"}
      viewport={isPageTitle ? undefined : viewportOnce}
      className={cn("mb-12 md:mb-16", align === "center" ? "text-center" : "text-left", className)}
    >
      {title && (
        <motion.p
          variants={fadeUp}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-300"
        >
          <span className="size-1.5 rounded-full bg-zinc-200" />
          {title}
        </motion.p>
      )}
      {heading && (
        <Heading
          variants={fadeUp}
          className={cn(
            "text-balance font-semibold tracking-tight text-zinc-50",
            isPageTitle
              ? "text-2xl leading-tight md:text-3xl lg:text-[2rem]"
              : "text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          )}
        >
          {heading}
        </Heading>
      )}
      {description && (
        <motion.p
          variants={fadeUp}
          className={cn(
            "mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-zinc-400",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
