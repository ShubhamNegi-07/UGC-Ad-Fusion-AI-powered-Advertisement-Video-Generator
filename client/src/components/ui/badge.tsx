import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-5 tracking-wide whitespace-nowrap backdrop-blur-md transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/[0.05] text-zinc-200",
        primary: "border-white/12 bg-white/[0.08] text-zinc-100",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        warning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
        destructive: "border-red-400/25 bg-red-400/10 text-red-200",
        outline: "border-white/12 bg-transparent text-zinc-400",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
