import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full min-w-0 rounded-[var(--radius-md)] border border-input bg-background px-4 text-sm text-foreground",
  "placeholder:text-muted-foreground shadow-sm",
  "transition-[border-color,box-shadow,background-color] duration-[var(--motion-duration)]",
  "hover:border-ring/40",
  "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
];

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input ref={ref} type={type} data-slot="input" className={cn(fieldBase, "h-11 min-h-[44px]", className)} {...props} />
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
