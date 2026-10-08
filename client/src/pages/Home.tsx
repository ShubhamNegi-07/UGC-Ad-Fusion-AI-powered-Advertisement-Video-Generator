import Hero from "@/components/Hero";
import HomePositioning from "@/components/marketing/HomePositioning";
import HomePillars from "@/components/marketing/HomePillars";
import HomeToolkit from "@/components/marketing/HomeToolkit";
import HomePricingSummary from "@/components/marketing/HomePricingSummary";
import HomeFaq from "@/components/marketing/HomeFaq";
import HomeCTA from "@/components/marketing/HomeCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-10 bg-background">
        <HomePositioning />
        <HomePillars />
        <HomeToolkit />
        <HomePricingSummary />
        <HomeFaq />
        <HomeCTA />
      </div>
    </>
  );
}
