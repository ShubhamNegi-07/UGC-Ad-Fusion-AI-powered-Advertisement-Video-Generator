import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import { cn } from "@/lib/utils";

const steps = [
  { n: "01", title: "Upload" },
  { n: "02", title: "Describe" },
  { n: "03", title: "Generate" },
];

function MockUpload({ label, src, fileName }: { label: string; src: string; fileName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Required</span>
      </div>
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-border bg-muted">
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[9px] font-medium text-brand-muted">
          <HugeiconsIcon icon={Tick02Icon} size={9} strokeWidth={3} aria-hidden />
          Ready
        </span>
        <div className="absolute inset-x-0 bottom-0 border-t border-border bg-card/95 px-2.5 py-2">
          <p className="truncate text-[10px] font-medium text-foreground">{fileName}</p>
        </div>
      </div>
    </div>
  );
}

type GeneratorMarketingPreviewProps = {
  className?: string;
  layout?: "pillar" | "bento";
};

/** Static Create UI mock — real theme tokens + sample assets (no scaled live form). */
export default function GeneratorMarketingPreview({
  className,
  layout = "pillar",
}: GeneratorMarketingPreviewProps) {
  const compact = layout === "bento";

  return (
    <div
      className={cn(
        "mode-studio overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background shadow-md",
        className,
      )}
      aria-label="Create screen with product and model upload fields"
      role="img"
    >
      <div className={cn("border-b border-border", compact ? "px-4 py-3" : "px-5 py-4")}>
        <p className={cn("font-semibold tracking-tight text-foreground", compact ? "text-sm" : "text-base md:text-lg")}>
          Generate an in-context product image
        </p>
        <ol className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
          {steps.map((s) => (
            <li
              key={s.n}
              className="surface-panel flex shrink-0 items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-2"
            >
              <span className="font-mono text-[10px] text-muted-foreground">{s.n}</span>
              <span className="text-[11px] font-medium text-foreground">{s.title}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={cn("grid gap-4", compact ? "p-3 sm:grid-cols-2" : "p-4 md:grid-cols-[minmax(0,11.5rem)_1fr] md:gap-5 md:p-5")}>
        <div className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-1")}>
          <MockUpload label="Product image" src={assets.product7} fileName="product.jpg" />
          <MockUpload label="Model image" src={assets.model1} fileName="model.png" />
        </div>

        {!compact && (
          <div className="min-w-0 space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">Details</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">Project name</span>
                <div className="rounded-[var(--radius-md)] border border-input bg-background px-3 py-2 text-xs text-foreground">
                  Summer launch · Reel 01
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">Product name</span>
                <div className="rounded-[var(--radius-md)] border border-input bg-background px-3 py-2 text-xs text-foreground">
                  Carry-on suitcase
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground">Aspect ratio</span>
              <div className="flex gap-1.5">
                {["9:16", "1:1", "16:9"].map((r) => (
                  <span
                    key={r}
                    className={cn(
                      "rounded-md border px-2 py-1 font-mono text-[10px]",
                      r === "9:16"
                        ? "border-brand/40 bg-brand/10 text-brand-muted"
                        : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
