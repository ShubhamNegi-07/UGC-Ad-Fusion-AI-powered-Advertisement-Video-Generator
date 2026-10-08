/** Styleguide accent options — production site locks cobalt blue. */

export type BrandAccentId = "cobalt" | "crimson";

export const brandAccents: Record<
  BrandAccentId,
  { label: string; brand: string; hover: string; muted: string; foreground: string }
> = {
  cobalt: {
    label: "Cobalt blue (locked)",
    brand: "#2563EB",
    hover: "#1D4ED8",
    muted: "#60A5FA",
    foreground: "#FFFFFF",
  },
  crimson: {
    label: "Signal crimson (comparison only)",
    brand: "#BE123C",
    hover: "#9F1239",
    muted: "#FB7185",
    foreground: "#FFFFFF",
  },
};

export const defaultBrandAccent: BrandAccentId = "cobalt";

export const lockedBrandAccent: BrandAccentId = "cobalt";

/** @deprecated Use `cobalt` — alias for older styleguide state */
export type LegacyBrandAccentId = "teal";
