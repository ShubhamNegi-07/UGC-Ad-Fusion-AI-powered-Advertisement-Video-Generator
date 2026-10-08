import type { Appearance } from "@clerk/types";
import type { SurfaceMode } from "@/lib/surface";

const brandPrimary = "#0F766E";
const brandOnPrimary = "#FFFFFF";

export function clerkAppearance(surface: SurfaceMode): Appearance {
  const isMarketing = surface === "marketing";

  return {
    variables: {
      colorPrimary: brandPrimary,
      colorTextOnPrimaryBackground: brandOnPrimary,
      colorBackground: isMarketing ? "#FFFFFF" : "#1A1917",
      colorText: isMarketing ? "#0A0A0A" : "#F5F2EB",
      colorInputBackground: isMarketing ? "#FFFFFF" : "#0F0E0C",
      colorInputText: isMarketing ? "#0A0A0A" : "#F5F2EB",
      colorNeutral: isMarketing ? "#52525B" : "#9C958C",
      borderRadius: "0.75rem",
      fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif',
    },
    elements: {
      card: isMarketing
        ? "shadow-lg border border-[#E4E4E7]"
        : "shadow-xl border border-[#2E2C28]",
      userButtonPopoverCard: isMarketing
        ? "border border-[#E4E4E7] shadow-lg"
        : "border border-[#2E2C28] shadow-xl",
      formButtonPrimary: "bg-[#0F766E] hover:bg-[#0B6B62] text-white",
    },
  };
}
