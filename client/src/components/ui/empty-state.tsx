import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon: IconSvgElement;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-2xl px-6 py-16 text-center",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-72 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="relative mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-200 shadow-inner">
        <HugeiconsIcon icon={icon} size={24} strokeWidth={1.8} />
      </div>
      <h3 className="relative text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="relative mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export { EmptyState };
