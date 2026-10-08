import * as React from "react";
import { Slot } from "radix-ui";
import type { VariantProps } from "class-variance-authority";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

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

export { Button };
