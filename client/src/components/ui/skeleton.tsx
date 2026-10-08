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

function GridSkeleton({ count = 6, layout = "masonry" }: { count?: number; layout?: "masonry" | "studio-grid" }) {
  if (layout === "studio-grid") {
    return (
      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        aria-hidden
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <Skeleton className="aspect-[9/16] max-h-[min(480px,52vh)] w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-3 w-1/3 rounded-md" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
