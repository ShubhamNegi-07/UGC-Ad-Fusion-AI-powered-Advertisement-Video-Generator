import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function studioMediaAspect(ratio: string) {
  if (ratio === "9:16") return "aspect-[9/16]";
  if (ratio === "1:1") return "aspect-square";
  return "aspect-video";
}

export function StudioMediaBackdrop({ src, className }: { src: string; className?: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full scale-[1.2] object-cover blur-2xl brightness-[0.45] saturate-150",
        className,
      )}
    />
  );
}

export function StudioMediaFrame({
  aspectRatio,
  backdropSrc,
  className,
  children,
}: {
  aspectRatio: string;
  backdropSrc?: string | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--studio-media-bg,#020617)]",
        studioMediaAspect(aspectRatio),
        className,
      )}
    >
      {backdropSrc ? <StudioMediaBackdrop src={backdropSrc} /> : null}
      <div className="relative z-[1] flex h-full w-full items-center justify-center">{children}</div>
    </div>
  );
}
