import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { fadeUp, viewportOnce } from "@/components/ui/motion";

export default function HomeCTA() {
  return (
    <section className="hero-dark-band relative overflow-hidden py-[var(--space-section)]">
      <div className="hero-dark-band-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-marketing relative z-[1]">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <h2 className="marketing-display text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Ready to make your first ad?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-white/70">
            Sign up, get 20 free credits, and run your first still — then add a talking video when you are happy with
            the frame. No credit card required.
          </p>
          <Link
            to="/generate"
            className="hero-split-cta group mt-8 inline-flex overflow-hidden rounded-lg shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center bg-brand px-4 py-3.5 text-brand-foreground">
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={2.5} />
            </span>
            <span className="flex min-h-[52px] items-center bg-black px-8 text-xs font-semibold uppercase tracking-[0.14em] text-white md:text-sm">
              Start creating now
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
