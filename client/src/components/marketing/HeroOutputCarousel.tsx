import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PauseIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { assets, generatedImageMeta } from "@/assets/assets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroVideo from "@/components/marketing/HeroVideo";

const tiles = [
  {
    type: "video" as const,
    src: assets.generatedVideo1,
    poster: assets.generated1,
    label: "Sample talking ad from our generator",
    metaKey: null,
  },
  {
    type: "image" as const,
    src: assets.generated1,
    label: "Sample fused still — product and model",
    metaKey: "generated1" as const,
  },
  {
    type: "image" as const,
    src: assets.generated2,
    label: "Sample fused still output",
    metaKey: "generated2" as const,
  },
  {
    type: "video" as const,
    src: assets.generatedVideo2,
    poster: assets.generated3,
    label: "Sample talking ad, alternate aspect",
    metaKey: null,
  },
  {
    type: "image" as const,
    src: assets.generated3,
    label: "Sample fused still with sneakers",
    metaKey: "generated3" as const,
  },
  {
    type: "image" as const,
    src: assets.generated4,
    label: "Sample fused still output",
    metaKey: "generated4" as const,
  },
];

const AUTO_MS = 6000;

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function HeroOutputCarousel({ featuredPulse = true }: { featuredPulse?: boolean }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const pauseRef = useRef(false);
  const hoverRef = useRef(false);

  const scrollBy = useCallback((dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 280, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  useEffect(() => {
    pauseRef.current = paused || hoverRef.current || reduceMotion;
  }, [paused, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      if (pauseRef.current) return;
      const el = scroller.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else scrollBy(1);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [reduceMotion, scrollBy]);

  return (
    <div
      className="relative mt-10 md:mt-14"
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
      onFocusCapture={() => {
        hoverRef.current = true;
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hoverRef.current = false;
      }}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <p id="hero-carousel-label" className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          Our generated outputs
        </p>
        <div className="flex items-center gap-1">
          {!reduceMotion && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
              aria-label={paused ? "Play carousel" : "Pause carousel"}
              aria-controls="hero-output-carousel"
              onClick={() => setPaused((p) => !p)}
            >
              <HugeiconsIcon icon={paused ? PlayIcon : PauseIcon} size={16} strokeWidth={2} />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
            aria-label="Previous outputs"
            onClick={() => scrollBy(-1)}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
            aria-label="Next outputs"
            onClick={() => scrollBy(1)}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </Button>
        </div>
      </div>
      <div
        id="hero-output-carousel"
        ref={scroller}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby="hero-carousel-label"
        tabIndex={0}
        className="hero-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tiles.map((tile, i) => {
          const meta = tile.metaKey ? generatedImageMeta[tile.metaKey] : null;
          const w = meta?.width ?? 768;
          const h = meta?.height ?? 1376;
          return (
            <figure
              key={`${tile.label}-${i}`}
              className={`hero-carousel-tile relative w-[9.5rem] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg sm:w-[11rem] md:w-[12.5rem] ${
                featuredPulse && i === 0 ? "hero-video-ring" : ""
              }`}
            >
              <div className="aspect-[9/16]">
                {tile.type === "video" ? (
                  <HeroVideo
                    src={tile.src}
                    poster={tile.poster!}
                    className="h-full w-full object-cover"
                    priority={i === 0}
                  />
                ) : (
                  <img
                    src={tile.src}
                    alt={tile.label}
                    width={w}
                    height={h}
                    className="h-full w-full object-cover"
                    loading={i <= 1 ? "eager" : "lazy"}
                    fetchPriority={i === 1 ? "high" : "auto"}
                    decoding="async"
                  />
                )}
              </div>
              <figcaption className="absolute inset-x-0 top-0 flex justify-between gap-1 p-2">
                <Badge className="border-0 bg-black/50 text-[9px] text-white backdrop-blur-sm">Generated</Badge>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
