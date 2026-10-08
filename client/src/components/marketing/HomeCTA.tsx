import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
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
          <Button asChild variant="gradient" size="lg" className="mt-8 uppercase tracking-[0.12em]">
            <Link to="/generate">Start creating now</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
