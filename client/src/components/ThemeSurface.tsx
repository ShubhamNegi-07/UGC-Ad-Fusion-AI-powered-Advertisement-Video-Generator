import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSurfaceMode } from "@/lib/surface";

export default function ThemeSurface() {
  const { pathname } = useLocation();

  useEffect(() => {
    const mode = getSurfaceMode(pathname);
    document.documentElement.dataset.surface = mode;
  }, [pathname]);

  return null;
}
