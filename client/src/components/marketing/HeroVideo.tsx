import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  src: string;
  poster: string;
  className?: string;
  priority?: boolean;
};

export default function HeroVideo({ src, poster, className, priority = false }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mqMobile.matches || mqMotion.matches) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanPlay(true);
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={canPlay ? src : undefined}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      preload={priority ? "metadata" : "none"}
    />
  );
}
