import { useRef, useState, type CSSProperties } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroVideo from "@/components/marketing/HeroVideo";
import { sampleOutputTiles } from "@/lib/sample-outputs";
import { cn } from "@/lib/utils";

function PeekArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4.5 11.5L11.5 4.5M11.5 4.5H5.75M11.5 4.5V10.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarouselImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 z-0 rounded-none" />}
      <img
        src={src}
        alt={alt}
        width={768}
        height={1376}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "absolute inset-0 z-[1] h-full w-full object-cover object-[center_12%] transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </>
  );
}

export default function HeroOutputCarousel(_props?: { featuredPulse?: boolean }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="relative mt-8 md:mt-10" onMouseLeave={() => setFlipped(null)}>
      <div className="hero-peek-heading container-marketing mb-8 text-center md:mb-10">
        <h2 id="hero-carousel-label">
          Our generated
          <br />
          outputs
        </h2>
        <p>Hover to peek, click a card to flip it.</p>
      </div>

      <div className="hero-peek-stage">
        <div
          id="hero-output-carousel"
          ref={scroller}
          role="region"
          aria-roledescription="carousel"
          aria-labelledby="hero-carousel-label"
          tabIndex={0}
          className="hero-peek-scroller hero-carousel flex items-end justify-start gap-3 overflow-x-auto px-4 pb-8 pt-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 md:pb-10 [&::-webkit-scrollbar]:hidden"
        >
          {sampleOutputTiles.map((tile, i) => {
            const isFlipped = flipped === i;
            return (
              <figure
                key={`${tile.type}-${tile.src}-${tile.name}`}
                className={cn("hero-peek-card hero-carousel-tile", isFlipped && "is-flipped")}
                style={{ "--peek-i": i } as CSSProperties}
              >
                <button
                  type="button"
                  className="hero-peek-flip"
                  aria-pressed={isFlipped}
                  aria-label={
                    isFlipped
                      ? `Hide details for ${tile.name}`
                      : `${tile.name}, ${tile.type === "video" ? "video" : "generated still"}. Click to flip.`
                  }
                  onClick={() => setFlipped((cur) => (cur === i ? null : i))}
                >
                  {isFlipped ? (
                    <span className="hero-peek-face hero-peek-back">
                      <span className="hero-peek-back-kicker">{tile.type === "video" ? "Video" : "Generated"}</span>
                      <span className="hero-peek-back-title">{tile.name}</span>
                      <span className="hero-peek-back-copy">{tile.blurb}</span>
                    </span>
                  ) : (
                    <span className="hero-peek-face hero-peek-front">
                      <span className="hero-peek-media">
                        {tile.type === "video" ? (
                          <HeroVideo
                            src={tile.src}
                            poster={tile.poster}
                            className="absolute inset-0 h-full w-full object-cover object-[center_12%]"
                            priority={tile.name === "Talking"}
                          />
                        ) : (
                          <CarouselImage src={tile.src} alt={tile.blurb} priority={i < 2} />
                        )}
                        <span className="hero-peek-chip" aria-hidden>
                          <PeekArrowIcon className="size-3.5 text-white" />
                        </span>
                      </span>
                      <span className="hero-peek-name">{tile.name}</span>
                    </span>
                  )}
                </button>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
