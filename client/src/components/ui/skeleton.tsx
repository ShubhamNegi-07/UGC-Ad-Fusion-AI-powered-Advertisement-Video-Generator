import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "shimmer animate-pulse motion-reduce:animate-none rounded-xl bg-white/[0.08]",
        className,
      )}
      {...props}
    />
  );
}

const masonryHeights = ["h-[24rem]", "h-72", "h-80", "h-[22rem]", "h-72", "h-88"];

function GridSkeleton({
  count = 8,
  layout = "studio-grid",
}: {
  count?: number;
  layout?: "masonry" | "studio-grid" | "community-grid";
}) {
  if (layout === "studio-grid") {
    return (
      <div
        className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        aria-hidden
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="surface-panel flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <Skeleton className="aspect-[4/5] w-full rounded-none" />
            <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-1/3 rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-11 rounded-xl" />
                  <Skeleton className="h-11 rounded-xl" />
                </div>
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (layout === "community-grid") {
    return (
      <div
        className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(16.5rem,1fr))] sm:gap-5"
        aria-hidden
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="surface-panel flex flex-col overflow-hidden rounded-[1.1rem] border border-white/8">
            <div className="relative flex items-center justify-center bg-[var(--studio-media-bg,#070b12)] px-3 py-3">
              <Skeleton className="mx-auto aspect-[9/16] w-full max-w-[min(100%,18rem)] rounded-lg" />
            </div>
            <div className="flex items-start gap-2 px-3.5 py-3">
              <Skeleton className="mt-0.5 size-6 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-3 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5"
      aria-hidden
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1018] p-2"
        >
          <Skeleton
            className={cn("w-full rounded-xl", masonryHeights[i % masonryHeights.length])}
          />
          <div className="mt-3 space-y-2 px-2 pb-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, GridSkeleton };
