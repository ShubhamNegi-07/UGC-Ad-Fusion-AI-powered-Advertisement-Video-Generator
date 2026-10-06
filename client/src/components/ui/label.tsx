import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none text-foreground/90 select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function FieldHint({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-[11px] font-normal uppercase tracking-wide text-muted-foreground/80", className)}
      {...props}
    />
  );
}

export { Label, FieldHint };
