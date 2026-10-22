import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  src: string;
  poster: string;
  className?: string;
  priority?: boolean;
};

export default function HeroVideo({ src, poster, className, priority = false }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [canPlay, setCanPlay] = useState(priority);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mqMotion.matches) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCanPlay(entry.isIntersecting);
        if (!entry.isIntersecting) el.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canPlay) return;
    void el.play().catch(() => {});
  }, [canPlay, src]);

  return (
    <video
      ref={ref}
      src={canPlay ? src : undefined}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      preload={priority || canPlay ? "auto" : "none"}
    />
  );
}
