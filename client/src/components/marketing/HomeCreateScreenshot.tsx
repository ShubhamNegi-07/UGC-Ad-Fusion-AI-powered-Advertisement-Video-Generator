import { useState } from "react";
import { Link } from "react-router-dom";
import { marketingAssets } from "@/assets/assets";
import MarketingShowcaseFrame from "@/components/marketing/MarketingShowcaseFrame";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type HomeCreateScreenshotProps = {
  className?: string;
};

export default function HomeCreateScreenshot({ className }: HomeCreateScreenshotProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <MarketingShowcaseFrame
      className={className}
      title="Generate an in-context product image"
      description="Steps, dual uploads, details, and aspect ratio — identical to the signed-in Create page."
      footer={
        <p className="text-[11px] text-muted-foreground sm:text-xs">
          <Link to="/generate" className="font-medium text-brand hover:underline">
            Open Create
          </Link>{" "}
          to run your own uploads.
        </p>
      }
    >
      <div className="relative mx-auto w-full max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-white/10 shadow-md">
        {!loaded && <Skeleton className="absolute inset-0 z-0 rounded-none" />}
        <img
          src={marketingAssets.generatorUi}
          alt="Create screen with product and model upload zones, project fields, aspect ratio controls, and generate button"
          width={marketingAssets.generatorUiWidth}
          height={marketingAssets.generatorUiHeight}
          onLoad={() => setLoaded(true)}
          className={cn(
            "relative z-[1] mx-auto block w-full max-w-full transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          )}
          loading="lazy"
          decoding="async"
        />
      </div>
    </MarketingShowcaseFrame>
  );
}

