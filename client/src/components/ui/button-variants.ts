import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium",
    "transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-[var(--motion-duration)] ease-[var(--motion-ease)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "active:scale-[0.98] motion-reduce:active:scale-100",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-foreground shadow-sm hover:bg-brand-hover",
        gradient: "bg-brand text-brand-foreground shadow-sm hover:bg-brand-hover",
        secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
        link: "text-brand h-auto p-0 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 min-h-[44px] px-4 py-2",
        sm: "h-9 min-h-[36px] rounded-[var(--radius-sm)] px-3 text-xs",
        lg: "h-12 min-h-[44px] rounded-[var(--radius-lg)] px-6 text-[15px]",
        xl: "h-13 min-h-[44px] rounded-[var(--radius-lg)] px-7 text-base",
        icon: "size-11 min-h-[44px] min-w-[44px]",
        "icon-sm": "size-9 min-h-[36px] min-w-[36px] rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
