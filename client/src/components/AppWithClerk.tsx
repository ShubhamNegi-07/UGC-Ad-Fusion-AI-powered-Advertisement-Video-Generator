import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getSurfaceMode } from "@/lib/surface";
import ThemeSurface from "@/components/ThemeSurface";
import App from "@/App";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

export default function AppWithClerk() {
  const { pathname } = useLocation();
  const surface = getSurfaceMode(pathname);
  const appearance = useMemo(() => clerkAppearance(surface), [surface]);

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={appearance}>
      <ThemeSurface />
      <App />
    </ClerkProvider>
  );
}
