import { HugeiconsIcon } from "@hugeicons/react";
import { Image02Icon, Video02Icon } from "@hugeicons/core-free-icons";
import Pricing from "@/components/Pricing";

const costs = [
  { icon: Image02Icon, label: "Image", value: 5 },
  { icon: Video02Icon, label: "Talking video", value: 10 },
];

export default function Plans() {
  return (
    <div className="pt-nav">
      <Pricing compact />
      <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 px-4 pb-10 sm:flex-row sm:justify-center">
        {costs.map((c) => (
          <div key={c.label} className="glass flex w-full items-center gap-3 rounded-xl px-4 py-3 sm:w-auto">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-200">
              <HugeiconsIcon icon={c.icon} size={18} strokeWidth={1.8} />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="font-mono text-sm font-medium tabular-nums">{c.value} credits</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
