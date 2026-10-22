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
            <Skeleton className="h-[min(17.5rem,34dvh)] w-full rounded-none sm:h-[min(19rem,36dvh)]" />
            <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-1/3 rounded-md" />
                <Skeleton className="h-3.5 w-5/6 rounded-md" />
              </div>
              <div className="space-y-2 pt-2">
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
        className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        aria-hidden
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="surface-panel flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <Skeleton className="h-[min(17.5rem,34dvh)] w-full rounded-none sm:h-[min(19rem,36dvh)]" />
            <div className="mt-auto space-y-2.5 p-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/3 rounded-md" />
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
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
