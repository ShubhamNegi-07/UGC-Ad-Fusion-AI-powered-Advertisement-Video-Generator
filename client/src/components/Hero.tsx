import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ImageUpload01Icon, SparklesIcon, Video02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { assets } from "@/assets/assets";
import HeroOutputCarousel from "@/components/marketing/HeroOutputCarousel";

const workflow = [
  { step: "Upload", desc: "Product + model", icon: ImageUpload01Icon },
  { step: "Still", desc: "Fused frame", icon: SparklesIcon },
  { step: "Video", desc: "Talking clip", icon: Video02Icon },
];

export default function Hero() {
  return (
    <section id="home" className="hero-dark-band relative overflow-hidden pb-16 pt-nav md:pb-24">
      <div className="hero-dark-band-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="monex-backdrop-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-marketing relative z-[1]">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="hero-display text-balance font-medium text-white">
            Turn one product photo into a UGC-style ad
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-[1.65] text-white/90 md:mt-8 md:text-lg md:leading-relaxed">
            Upload a product and a model. We fuse them into a photoreal still, then animate it into a short clip where
            the creator talks to camera and shows the product.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/75 md:mt-5">
            Image first, then optional talking video — the same flow as in Generator.
          </p>

          <ol className="mx-auto mt-10 flex max-w-lg justify-center gap-3 overflow-x-auto pb-1 md:mt-12">
            {workflow.map((w, i) => (
              <li
                key={w.step}
                className="workflow-step flex min-w-[7.25rem] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
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

          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2">
            <figure className="size-14 overflow-hidden rounded-xl border border-white/15 shadow-md">
              <img
                src={assets.product7}
                alt=""
                width={474}
                height={474}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </figure>
            <span className="text-white/40" aria-hidden>
              +
            </span>
            <figure className="size-14 overflow-hidden rounded-xl border border-white/15 shadow-md">
              <img
                src={assets.model1}
                alt=""
                width={470}
                height={470}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </figure>
            <span className="text-white/40" aria-hidden>
              →
            </span>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Sample outputs below</p>
          </div>
        </div>

        <HeroOutputCarousel />
      </div>
    </section>
  );
}
