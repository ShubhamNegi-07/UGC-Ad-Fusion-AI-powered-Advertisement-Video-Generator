import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StudioPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export default function StudioPageHero({ eyebrow, title, description, actions, className }: StudioPageHeroProps) {
  return (
    <header
      className={cn(
        "surface-panel relative mb-8 overflow-hidden rounded-2xl border border-white/10 p-6 md:mb-10 md:p-8",
        className,
      )}
    >
      <div className="monex-backdrop-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
          ) : null}
          <h1
            className={cn(
              "studio-page-title font-semibold tracking-tight text-foreground",
              eyebrow ? "mt-2" : "",
              "text-2xl md:text-3xl",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
