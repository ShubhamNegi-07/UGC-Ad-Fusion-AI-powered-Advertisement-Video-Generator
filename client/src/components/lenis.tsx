import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";

const lenisOptions = {
  autoRaf: true,
  lerp: 0.075,
  smoothWheel: true,
  wheelMultiplier: 0.88,
  touchMultiplier: 1.05,
  anchors: { offset: -96 },
  allowNestedScroll: true,
  prevent: (node: HTMLElement) =>
    Boolean(
      node.closest("[data-lenis-prevent]") ||
        node.closest("[data-radix-scroll-area-viewport]") ||
        node.closest("[data-radix-dialog-content]") ||
        node.tagName === "TEXTAREA" ||
        node.tagName === "VIDEO",
    ),
};

function RouteScrollReset() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) return;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={lenisOptions}>
      <RouteScrollReset />
      {children}
    </ReactLenis>
  );
}
