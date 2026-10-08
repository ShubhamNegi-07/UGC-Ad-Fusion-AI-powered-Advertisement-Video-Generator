/** Gate 3 accent options — user picks one in Phase 4. Default: teal. */

export type BrandAccentId = "teal" | "crimson";

export const brandAccents: Record<
  BrandAccentId,
  { label: string; brand: string; hover: string; muted: string; foreground: string }
> = {
  teal: {
    label: "Option A — Performance teal",
    brand: "#0F766E",
    hover: "#0B6B62",
    muted: "#2DD4BF",
    foreground: "#FFFFFF",
  },
  crimson: {
    label: "Option B — Signal crimson",
    brand: "#BE123C",
    hover: "#9F1239",
    muted: "#FB7185",
    foreground: "#FFFFFF",
  },
};

export const defaultBrandAccent: BrandAccentId = "teal";

/** Gate 3 locked — crimson kept for styleguide comparison only. */
export const lockedBrandAccent: BrandAccentId = "teal";
