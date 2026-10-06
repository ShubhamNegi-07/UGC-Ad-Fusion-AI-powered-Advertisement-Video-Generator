import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1",
        className,
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground",
        "transition-[background-color,color,box-shadow] duration-200 outline-none",
        "hover:text-foreground hover:bg-white/[0.05]",
        "focus-visible:ring-2 focus-visible:ring-ring/70",
        "data-[state=on]:bg-white/[0.1] data-[state=on]:text-foreground data-[state=on]:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_6px_16px_-10px_rgb(0_0_0/0.8)]",
        "disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
