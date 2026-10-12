import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarketingShowcaseFrameProps = {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  /** When true, children sit on studio dark backdrop (phone / UI shots). */
  studioBackdrop?: boolean;
  /** Tight media well — no full-width letterbox (still / video samples). */
  compact?: boolean;
};

export default function MarketingShowcaseFrame({
  title,
  description,
  footer,
  children,
  className,
  studioBackdrop = true,
  compact = false,
}: MarketingShowcaseFrameProps) {
  return (
    <figure
      className={cn("m-0 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-lg", className)}
    >
      <figcaption className="border-b border-border bg-background/90 px-4 py-3.5 sm:px-5 sm:py-4">
        <p className="text-sm font-semibold tracking-tight text-foreground sm:text-base">{title}</p>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </figcaption>
      <div
        className={cn(
          "flex items-center justify-center",
          compact ? "bg-muted/25 p-4 sm:p-5" : "p-3 sm:p-4",
          !compact && studioBackdrop && "bg-[var(--studio-media-bg,#020617)]",
          !compact && !studioBackdrop && "bg-muted/20",
        )}
      >
        {children}
      </div>
      {footer ? <div className="border-t border-border px-4 py-3 text-center">{footer}</div> : null}
    </figure>
  );
}

