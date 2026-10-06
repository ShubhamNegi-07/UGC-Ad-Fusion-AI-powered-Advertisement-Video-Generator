import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";

export default function CTA() {
  return (
    <section className="px-4 pb-8 pt-4 sm:px-6">
      <motion.div
        variants={stagger(0, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="noise relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent px-6 py-16 text-center md:px-16 md:py-20"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.08] blur-[100px]" />
        <motion.h2 variants={fadeUp} className="relative text-balance text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Ready to make your first ad?
        </motion.h2>
        <motion.p variants={fadeUp} className="relative mx-auto mt-4 max-w-lg text-pretty text-[15px] text-zinc-400">
          Sign up, get 20 free credits and ship a talking UGC clip in minutes. No credit card required.
        </motion.p>
        <motion.div variants={fadeUp} className="relative mt-8">
          <Button asChild variant="gradient" size="lg" className="group rounded-full">
            <Link to="/generate">
              Start creating now
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
