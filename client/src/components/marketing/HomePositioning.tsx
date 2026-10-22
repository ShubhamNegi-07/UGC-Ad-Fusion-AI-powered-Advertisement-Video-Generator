import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import HomeCreateScreenshot from "@/components/marketing/HomeCreateScreenshot";
import { Button } from "@/components/ui/button";
import { fadeUp, viewportOnce } from "@/components/ui/motion";

const bullets = [
  "Two upload zones in Create — product and model (JPG, PNG, or WEBP, up to 10 MB each).",
  "Name and describe the product so prompts stay on-brand in later steps.",
  "Pick 9:16, 1:1, or 16:9 before you generate the still.",
];

export default function HomePositioning() {
  return (
    <section
      id="create-flow"
      className="scroll-mt-[calc(var(--nav-offset)+0.75rem)] border-t border-border bg-background py-[var(--space-section)]"
    >
      <div className="container-marketing">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:items-center xl:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="max-w-xl lg:max-w-none"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-muted">Product-led UGC ads</p>
            <h2 className="marketing-display mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              One upload path from still frame to talking clip
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Generator fuses your product and model photos, then optionally animates the result into a short vertical
              or landscape video — the same screens you use after sign-in, without a separate ad studio.
            </p>
            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground">Upload</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                Drop a product shot and a model photo
              </p>
            </div>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Button asChild framer={false} variant="default" size="default" className="mt-8 min-h-11 w-auto">
              <Link to="/generate">Open Create</Link>
            </Button>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="min-w-0 w-full lg:sticky lg:top-[calc(var(--nav-offset)+1rem)] lg:self-start"
          >
            <HomeCreateScreenshot className="w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
