import { cva } from "class-variance-authority";

const framerShell = [
  "btn-framer group/button relative inline-flex shrink-0 items-stretch justify-center gap-0 whitespace-nowrap text-sm font-semibold",
  "rounded-[14px] border border-[#343a46] bg-[#1c2129] p-[5px] shadow-[0_10px_28px_rgb(0_0_0_/_0.42)]",
  "transform-gpu transition-[background,border-color,box-shadow,transform] duration-200 ease-[var(--motion-ease)]",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  "active:scale-[0.98] motion-reduce:active:scale-100",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "[&_a]:inline-flex [&_a]:w-auto [&_a]:max-w-full [&_a]:min-w-0 [&_a]:items-stretch [&_a]:text-inherit [&_a]:no-underline",
];

const plainShell = [
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold",
  "border border-white/12 bg-white/[0.05] shadow-sm backdrop-blur-sm",
  "transition-[background,border-color,color,transform] duration-200 ease-[var(--motion-ease)]",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:pointer-events-none disabled:opacity-50",
  "hover:border-white/20 hover:bg-white/[0.08]",
  "active:scale-[0.98] motion-reduce:active:scale-100",
];

export const buttonVariants = cva("", {
  variants: {
    framer: {
      true: framerShell,
      false: plainShell,
    },
    variant: {
      default: "",
      gradient: "",
      secondary: "",
      outline: "",
      ghost: "",
      destructive: "",
      link: "",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      xl: "",
      icon: "",
      "icon-sm": "",
    },
  },
  compoundVariants: [
    {
      framer: true,
      variant: "default",
      className: "text-white",
    },
    {
      framer: true,
      variant: "gradient",
      className: "text-white",
    },
    {
      framer: true,
      variant: "secondary",
      className:
        "bg-[#141820] text-foreground hover:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand)_55%,#141820),color-mix(in_srgb,var(--brand)_88%,#141820))]",
    },
    {
      framer: true,
      variant: "outline",
      className: "border-[#343a46] bg-[#1c2129]/95 backdrop-blur-sm",
    },
    {
      framer: true,
      variant: "ghost",
      className:
        "border-transparent bg-transparent shadow-none hover:border-white/10 hover:bg-[#141820] hover:shadow-[0_4px_18px_rgb(0_0_0_/_0.4)]",
    },
    {
      framer: true,
      variant: "destructive",
      className:
        "hover:bg-[linear-gradient(180deg,#f87171,#dc2626)] hover:border-[#020617] [&_.btn-framer-icon]:bg-destructive",
    },
    {
      framer: true,
      variant: "link",
      className:
        "btn-framer-link h-auto min-h-0 rounded-none border-0 bg-transparent p-0 shadow-none hover:border-transparent hover:bg-transparent hover:shadow-none active:scale-100",
    },
    {
      framer: true,
      size: "default",
      className: "min-h-[46px]",
    },
    {
      framer: true,
      size: "sm",
      className:
        "min-h-[38px] rounded-lg p-0.5 text-xs [&_.btn-framer-icon]:min-h-[34px] [&_.btn-framer-icon]:min-w-[34px] [&_.btn-framer-icon]:rounded-md",
    },
    {
      framer: true,
      size: "lg",
      className:
        "min-h-[54px] rounded-[14px] p-[5px] text-[15px] [&_.btn-framer-icon]:min-h-[44px] [&_.btn-framer-icon]:min-w-[44px]",
    },
    {
      framer: true,
      size: "xl",
      className:
        "min-h-[56px] rounded-xl p-1.5 text-base [&_.btn-framer-icon]:min-h-[48px] [&_.btn-framer-icon]:min-w-[48px]",
    },
    {
      framer: true,
      size: "icon",
      className: "size-11 min-h-[44px] min-w-[44px] p-1",
    },
    {
      framer: true,
      size: "icon-sm",
      className: "size-9 min-h-[36px] min-w-[36px] rounded-lg p-0.5",
    },
    {
      framer: false,
      variant: "default",
      className: "border-brand/40 bg-brand text-brand-foreground hover:bg-brand-hover",
    },
    {
      framer: false,
      variant: "gradient",
      className: "border-brand/40 bg-brand text-brand-foreground hover:bg-brand-hover",
    },
    {
      framer: false,
      variant: "outline",
      className: "border-white/15 bg-white/[0.04] text-foreground",
    },
    {
      framer: false,
      variant: "secondary",
      className: "border-border bg-secondary text-secondary-foreground",
    },
    {
      framer: false,
      variant: "ghost",
      className: "border-transparent bg-transparent shadow-none hover:bg-white/[0.06]",
    },
    {
      framer: false,
      variant: "destructive",
      className: "border-destructive/35 bg-destructive/15 text-destructive",
    },
    {
      framer: false,
      variant: "link",
      className: "h-auto min-h-0 border-0 bg-transparent p-0 text-brand shadow-none hover:underline",
    },
    {
      framer: false,
      size: "default",
      className: "min-h-11 px-4 py-2",
    },
    {
      framer: false,
      size: "sm",
      className: "min-h-9 px-3 text-xs",
    },
    {
      framer: false,
      size: "lg",
      className: "min-h-12 px-6 text-[15px]",
    },
    {
      framer: false,
      size: "icon",
      className: "size-11 min-h-[44px] min-w-[44px] p-0",
    },
    {
      framer: false,
      size: "icon-sm",
      className: "size-9 min-h-[36px] min-w-[36px] p-0",
    },
  ],
  defaultVariants: {
    framer: true,
    variant: "default",
    size: "default",
  },
});
