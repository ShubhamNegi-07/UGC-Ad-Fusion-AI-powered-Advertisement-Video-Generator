import { cn } from "@/lib/utils";

const GRID_SIZE = 6;

const PLUS_CELLS = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
  const row = Math.floor(idx / GRID_SIZE);
  const col = idx % GRID_SIZE;
  // Diagonal wave from top-right (row 0, col 5) -> bottom-left (row 5, col 0)
  const diagOrder = row + (GRID_SIZE - 1 - col);
  return { key: `${row}-${col}`, diagOrder };
});

export function PlusGridLoader({
  size = "fill",
  className,
}: {
  size?: "sm" | "md" | "lg" | "fill";
  className?: string;
}) {
  const containerClasses =
    size === "fill"
      ? "h-full w-full p-5 sm:p-8 md:p-10"
      : size === "sm"
        ? "h-full w-full p-3.5"
        : size === "lg"
          ? "size-56 sm:size-64 p-6 rounded-[var(--radius-xl)] border border-white/10 bg-[#0d0e12]"
          : "size-44 sm:size-52 p-5 rounded-[var(--radius-xl)] border border-white/10 bg-[#0d0e12]";

  const iconSize =
    size === "sm"
      ? "size-2.5 sm:size-3"
      : size === "fill"
        ? "size-3.5 sm:size-4 md:size-5"
        : "size-3.5 sm:size-4";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid grid-cols-6 grid-rows-6 place-items-center select-none",
        containerClasses,
        className,
      )}
    >
      {PLUS_CELLS.map((cell) => (
        <span
          key={cell.key}
          style={{ animationDelay: `${cell.diagOrder * 110}ms` }}
          className={cn(
            "plus-grid-cell relative flex items-center justify-center text-white/85",
            iconSize,
          )}
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-full">
            <path
              d="M8 2.25V13.75M2.25 8H13.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function GenerationPlusGridOverlay({
  title,
  subtitle,
  steps,
  className,
}: {
  title: string;
  subtitle?: string;
  steps?: string[];
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] bg-[#0b0c10] text-center",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.04),transparent_70%)]" />

      <div className="relative z-[1] flex min-h-0 flex-1 items-center justify-center w-full">
        <PlusGridLoader size="fill" className="max-h-full max-w-full" />
      </div>

      <div className="relative z-[2] border-t border-white/[0.08] bg-[#0e1017]/90 px-4 py-3.5 backdrop-blur-md">
        <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
        {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
        {steps && steps.length > 0 ? (
          <ol className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-muted-foreground">
            {steps.map((step, idx) => (
              <li key={step} className="inline-flex items-center gap-2.5">
                <span className={idx === 1 ? "font-semibold text-foreground" : undefined}>{step}</span>
                {idx < steps.length - 1 ? <span aria-hidden>→</span> : null}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
