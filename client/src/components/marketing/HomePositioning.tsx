import { motion } from "@/components/ui/motion";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";

export default function HomePositioning() {
  return (
    <section className="border-t border-border bg-background py-[var(--space-section)]">
      <div className="container-marketing">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={stagger(0, 0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Product-led UGC ads
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="marketing-display mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
          >
            One upload path from still frame to talking clip
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed">
            Generator fuses your product and model photos, then optionally animates the result into a short vertical or
            landscape video — the same screens you use after sign-in, without a separate ad studio.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
