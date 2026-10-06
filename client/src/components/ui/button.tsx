import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium",
    "transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "active:scale-[0.98] motion-reduce:active:scale-100",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-950 shadow-[0_1px_0_0_rgb(255_255_255/0.35)_inset,0_10px_24px_-12px_rgb(255_255_255/0.25)] hover:bg-white",
        gradient:
          "bg-zinc-100 text-zinc-950 shadow-[0_1px_0_0_rgb(255_255_255/0.4)_inset,0_14px_32px_-14px_rgb(255_255_255/0.3)] hover:bg-white",
        secondary:
          "bg-zinc-900 text-zinc-100 border border-white/10 hover:bg-zinc-800 hover:border-white/15",
        outline:
          "border border-white/12 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.07] hover:border-white/18",
        ghost: "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100",
        destructive:
          "bg-red-500/12 text-red-200 border border-red-500/25 hover:bg-red-500/20",
        link: "text-zinc-100 underline-offset-4 hover:underline h-auto p-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-6 text-[15px]",
        xl: "h-13 rounded-2xl px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-loading={loading || undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={asChild ? isDisabled || undefined : undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : loading ? (
          <>
            <HugeiconsIcon icon={Loading03Icon} size={16} strokeWidth={2} className="animate-spin" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
