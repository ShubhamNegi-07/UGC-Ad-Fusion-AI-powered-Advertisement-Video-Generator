import { Link } from "react-router-dom";
import { marketingAssets } from "@/assets/assets";
import MarketingShowcaseFrame from "@/components/marketing/MarketingShowcaseFrame";
import { cn } from "@/lib/utils";

type HomeCreateScreenshotProps = {
  className?: string;
};

export default function HomeCreateScreenshot({ className }: HomeCreateScreenshotProps) {
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
      <img
        src={marketingAssets.generatorUi}
        alt="Create screen with product and model upload zones, project fields, aspect ratio controls, and generate button"
        width={marketingAssets.generatorUiWidth}
        height={marketingAssets.generatorUiHeight}
        className={cn("mx-auto block w-full max-w-full rounded-[var(--radius-lg)] border border-white/10 shadow-md")}
        loading="lazy"
        decoding="async"
      />
    </MarketingShowcaseFrame>
  );
}
