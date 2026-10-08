import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ImageUpload01Icon, Video02Icon } from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import type { BrandAccentId } from "@/lib/brand-accents";

const workflow = [
  { step: "Upload", desc: "Product + model", icon: ImageUpload01Icon },
  { step: "Still", desc: "Fused frame", icon: ImageUpload01Icon },
  { step: "Video", desc: "Talking clip", icon: Video02Icon },
];

export default function HomePreview({ accent }: { accent?: BrandAccentId }) {
  const accentClass = accent ? `brand-accent-${accent}` : "";

  return (
    <div className={cnMarketingPreview(accentClass)}>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={assets.logo} alt="" className="h-7 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <span>Features</span>
            <span>Pricing</span>
            <span>Community</span>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button size="sm" className="rounded-full px-5 font-semibold uppercase tracking-wide">
              Get started
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12 lg:py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">UGC Ad Fusion</p>
          <h1 className="mt-4 text-[length:var(--text-display)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
            Turn one product photo into a viral UGC ad
          </h1>
          <p className="mt-5 max-w-lg text-[length:var(--text-lg)] leading-relaxed text-muted-foreground">
            Upload a product and a model. We fuse them into a photoreal still, then animate it into a short clip where
            the creator talks to camera and shows the product.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="rounded-full px-8 text-sm font-semibold uppercase tracking-wide">
              Start generating free
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2} />
            </Button>
            <p className="text-xs text-muted-foreground">No credit card required</p>
          </div>

          <ol className="mt-10 flex gap-2 overflow-x-auto pb-1">
            {workflow.map((w, i) => (
              <li
                key={w.step}
                className="workflow-step flex min-w-[7.5rem] flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                  <HugeiconsIcon icon={w.icon} size={16} strokeWidth={2} />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-foreground">{w.step}</p>
                  <p className="text-[10px] text-muted-foreground">{w.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hero-output-composition relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="grid grid-cols-[0.9fr_1.2fr] gap-3">
            <div className="flex flex-col gap-3">
              <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
                <img src={assets.product7} alt="" className="aspect-square w-full object-cover" />
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
                <img src={assets.model1} alt="" className="aspect-square w-full object-cover object-top" />
              </figure>
            </div>
            <figure className="hero-video-ring overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="relative aspect-[9/16] bg-black">
                <video
                  src={assets.generatedVideo1}
                  poster={assets.generated1}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </figure>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function cnMarketingPreview(accentClass: string) {
  return ["mode-marketing overflow-hidden rounded-[var(--radius-xl)] border border-border", accentClass]
    .filter(Boolean)
    .join(" ");
}
