import * as React from "react";
import { Slot } from "radix-ui";
import type { VariantProps } from "class-variance-authority";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { ButtonFace } from "@/components/ui/button-face";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  /** Split Framer-style chrome (video reference). Default true for text CTAs. */
  framer?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      framer,
      asChild = false,
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : "button";
    const isDisabled = disabled || loading;
    const isLink = variant === "link";
    const iconOnly = size === "icon" || size === "icon-sm";
    const useFramer =
      framer ?? (!isLink && !iconOnly);

    const face = (
      <ButtonFace loading={loading && !isLink} iconOnly={false}>
        {loading && !isLink ? (loadingText ?? children) : children}
      </ButtonFace>
    );

    let content: React.ReactNode;
    if (!useFramer || isLink) {
      content =
        loading && !isLink ? (
          <>
            <HugeiconsIcon icon={Loading03Icon} size={16} strokeWidth={2} className="animate-spin" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        );
    } else if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{ children?: React.ReactNode; className?: string }>;
      content = React.cloneElement(
        child,
        {
          className: cn(
            "inline-flex w-auto max-w-full min-w-0 items-stretch text-inherit no-underline",
            child.props.className,
          ),
        },
        face,
      );
    } else {
      content = face;
    }

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-framer={useFramer && !isLink ? "true" : undefined}
        data-loading={loading || undefined}
        className={cn(buttonVariants({ framer: useFramer && !isLink, variant, size, className }))}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={asChild ? isDisabled || undefined : undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button };
