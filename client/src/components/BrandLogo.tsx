import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
};

/**
 * Real-world SaaS Brand Mark + Live "Plus Jakarta Sans" Variable Font Wordmark.
 * Synced directly with the application's primary electric-blue theme tokens (`var(--brand)` #2563EB / `var(--hero-glow)` #3B82F6).
 */
export function BrandLogo({ className, markClassName, wordmarkClassName }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex select-none items-center gap-2.5", className)}>
      {/* Iconic Solid Squircle Badge + Negative-Space Geometric "U" Mark in Main Theme Electric Blue */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("size-8 shrink-0", markClassName)}
      >
        {/* Solid Brand Squircle synced with `var(--brand)` (#2563EB) */}
        <rect width="32" height="32" rx="8" className="fill-brand" fill="#2563EB" />

        {/* Crisp White Geometric "U" with Architectural Right Cut */}
        <path
          d="M8.5 8.5H13.2V17.8C13.2 19.7882 14.6118 21.2 16.5 21.2C18.3882 21.2 19.8 19.7882 19.8 17.8V14.2H16.2V10.2H23.5V18.0C23.5 22.1421 20.4421 25.2 16.3 25.2C11.9922 25.2 8.5 21.8078 8.5 17.5V8.5Z"
          fill="#FFFFFF"
        />
        {/* Precision Corner Play-Triangle Accent in Top-Right of the U */}
        <path d="M18.8 7.5L24.2 10.6L18.8 13.7V7.5Z" fill="#FFFFFF" />
      </svg>

      {/* Genuine Display Typeface ("Plus Jakarta Sans" Variable Font in Capital Letters) */}
      <span
        className={cn(
          "font-[family-name:var(--font-jakarta)] text-[1.18rem] font-semibold uppercase leading-none tracking-[-0.025em] text-current",
          wordmarkClassName,
        )}
      >
        UGC
        <span className="text-brand">.</span>
        <span className="text-brand-muted">AI</span>
      </span>
    </span>
  );
}

export default BrandLogo;
