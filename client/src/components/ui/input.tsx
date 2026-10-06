import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full min-w-0 rounded-xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-zinc-100",
  "placeholder:text-zinc-500 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)]",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "hover:border-white/16 hover:bg-zinc-900/70",
  "focus-visible:outline-none focus-visible:border-zinc-400/40 focus-visible:ring-4 focus-visible:ring-zinc-400/10 focus-visible:bg-zinc-900/80",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-red-500/60 aria-invalid:ring-4 aria-invalid:ring-red-500/15",
];

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(fieldBase, "h-11", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(fieldBase, "min-h-24 resize-none py-3 leading-relaxed", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
