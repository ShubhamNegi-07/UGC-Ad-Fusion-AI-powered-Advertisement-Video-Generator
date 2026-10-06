import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("shimmer rounded-xl bg-white/[0.05]", className)}
      {...props}
    />
  );
}

const masonryHeights = ["h-[26rem]", "h-72", "h-80", "h-[24rem]", "h-72", "h-96"];

function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("mb-4 break-inside-avoid rounded-2xl", masonryHeights[i % masonryHeights.length])}
        />
      ))}
    </div>
  );
}

export { Skeleton, GridSkeleton };
