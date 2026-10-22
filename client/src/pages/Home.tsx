import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import { Skeleton } from "@/components/ui/skeleton";

const HomePositioning = lazy(() => import("@/components/marketing/HomePositioning"));
const HomePillars = lazy(() => import("@/components/marketing/HomePillars"));
const HomeToolkit = lazy(() => import("@/components/marketing/HomeToolkit"));
const HomePricingSummary = lazy(() => import("@/components/marketing/HomePricingSummary"));
const HomeFaq = lazy(() => import("@/components/marketing/HomeFaq"));
const HomeCTA = lazy(() => import("@/components/marketing/HomeCTA"));

function HomeSectionsFallback() {
  return (
    <div className="container-marketing space-y-8 py-16" aria-busy="true" aria-label="Loading sections">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-9 w-80 max-w-full rounded-lg" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-[var(--radius-xl)]" />
        <Skeleton className="h-64 w-full rounded-[var(--radius-xl)]" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-10 bg-background">
        <Suspense fallback={<HomeSectionsFallback />}>
          <HomePositioning />
          <HomePillars />
          <HomeToolkit />
          <HomePricingSummary />
          <HomeFaq />
          <HomeCTA />
        </Suspense>
      </div>
    </>
  );
}
