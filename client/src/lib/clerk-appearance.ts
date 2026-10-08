import type { Appearance } from "@clerk/types";
import type { SurfaceMode } from "@/lib/surface";

const brandPrimary = "#2563EB";
const brandOnPrimary = "#FFFFFF";

const surfaceBg = "#030712";
const surfaceText = "#f8fafc";
const surfaceMuted = "#94a3b8";
const surfaceInput = "#0f172a";
const geistStack = '"Geist", sans-serif';

export function clerkAppearance(_surface: SurfaceMode): Appearance {
  return {
    variables: {
      colorPrimary: brandPrimary,
      colorTextOnPrimaryBackground: brandOnPrimary,
      colorBackground: surfaceBg,
      colorText: surfaceText,
      colorInputBackground: surfaceInput,
      colorInputText: surfaceText,
      colorNeutral: surfaceMuted,
      borderRadius: "0.75rem",
      fontFamily: geistStack,
      fontFamilyButtons: geistStack,
    },
    elements: {
      rootBox: { fontFamily: geistStack },
      cardBox: { fontFamily: geistStack },
      card: "shadow-xl border border-white/10 bg-[#0f172a] font-sans",
      modalContent: { fontFamily: geistStack },
      formFieldInput: { fontFamily: geistStack },
      formFieldLabel: { fontFamily: geistStack },
      headerTitle: "text-[#f8fafc] font-sans",
      headerSubtitle: { fontFamily: geistStack },
      socialButtonsBlockButton: "border-white/15 bg-white/[0.04] text-[#f8fafc] font-sans",
      userButtonPopoverCard: "border border-white/10 bg-[#0f172a] shadow-xl font-sans",
      formButtonPrimary: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sans",
      navbar: "bg-[#030712] font-sans",
    },
  };
}
