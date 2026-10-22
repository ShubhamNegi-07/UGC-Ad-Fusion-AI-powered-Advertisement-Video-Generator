import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import { HomeSectionsSkeleton } from "@/components/ui/page-skeletons";

const HomePositioning = lazy(() => import("@/components/marketing/HomePositioning"));
const HomePillars = lazy(() => import("@/components/marketing/HomePillars"));
const HomeToolkit = lazy(() => import("@/components/marketing/HomeToolkit"));
const HomePricingSummary = lazy(() => import("@/components/marketing/HomePricingSummary"));
const HomeFaq = lazy(() => import("@/components/marketing/HomeFaq"));
const HomeCTA = lazy(() => import("@/components/marketing/HomeCTA"));

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-10 bg-background">
        <Suspense fallback={<HomeSectionsSkeleton />}>
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
