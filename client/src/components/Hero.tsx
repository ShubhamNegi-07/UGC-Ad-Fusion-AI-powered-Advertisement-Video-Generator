import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ImageUpload01Icon, SparklesIcon, Video02Icon } from "@/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { assets } from "@/assets/assets";
import HeroOutputCarousel from "@/components/marketing/HeroOutputCarousel";
import { cn } from "@/lib/utils";

const workflow = [
  { step: "Upload", desc: "Product + model", icon: ImageUpload01Icon },
  { step: "Still", desc: "Fused frame", icon: SparklesIcon },
  { step: "Video", desc: "Talking clip", icon: Video02Icon },
];

const HeroThumb = memo(function HeroThumb({ src, width, height, className }: { src: string; width: number; height: number; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className="relative size-14 overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-md">
      {!loaded && <Skeleton className="absolute inset-0 z-0 rounded-none" />}
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "relative z-[1] h-full w-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </figure>
  );
});

export default function Hero() {
  return (
    <section id="home" className="hero-dark-band relative overflow-x-hidden overflow-y-visible pb-6 pt-nav md:pb-8">
      <div className="hero-dark-band-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="monex-backdrop-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-marketing relative z-[1]">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="hero-display text-balance font-medium text-white">
            Turn one product photo into a UGC-style ad
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-[1.6] text-white/90 sm:text-base md:mt-8 md:text-lg md:leading-relaxed">
            Upload a product and a model. We fuse them into a photoreal still, then animate it into a short clip where
            the creator talks to camera and shows the product.
          </p>
          <p className="mt-3 hidden text-sm leading-relaxed text-white/75 sm:block md:mt-5">
            Image first, then optional talking video — the same flow as in Generator.
          </p>

          <ol className="mx-auto mt-8 grid w-full max-w-lg grid-cols-3 gap-2 md:mt-12 md:gap-3">
            {workflow.map((w, i) => (
              <li
                key={w.step}
                className="workflow-step flex min-w-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2 sm:gap-2 sm:px-3"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white">
                  <HugeiconsIcon icon={w.icon} size={16} strokeWidth={2} />
                </span>
                <div className="text-left leading-tight">
                  <p className="text-xs font-semibold text-white">{w.step}</p>
                  <p className="text-[10px] text-white/55">{w.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-center gap-4 md:mt-12">
            <Button
              asChild
              variant="gradient"
              size="lg"
              className="w-full max-w-md font-sans uppercase tracking-[0.08em] sm:w-auto"
            >
              <Link to="/generate">Start generating free</Link>
            </Button>
            <p className="text-xs text-white/50">No credit card required</p>
          </div>

          <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-2">
            <HeroThumb src={assets.product7Thumb} width={128} height={128} />
            <span className="text-white/40" aria-hidden>
              +
            </span>
            <HeroThumb src={assets.model1Thumb} width={128} height={128} className="object-top" />
            <span className="text-white/40" aria-hidden>
              →
            </span>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Sample outputs below</p>
          </div>
        </div>
      </div>

      <HeroOutputCarousel />
    </section>
  );
}
