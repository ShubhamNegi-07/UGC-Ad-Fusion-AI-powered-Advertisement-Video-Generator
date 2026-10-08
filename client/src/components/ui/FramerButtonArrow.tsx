import type React from "react";
import { cn } from "@/lib/utils";

/** Right-pointing arrow for Framer-style split buttons (icon box + hover marquee). */
export default function FramerButtonArrow({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-[1.05rem] w-[1.05rem]", className)}
      style={style}
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
