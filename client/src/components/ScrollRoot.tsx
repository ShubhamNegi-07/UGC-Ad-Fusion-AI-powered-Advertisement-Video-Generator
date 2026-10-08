import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

function RouteScrollReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? ("instant" as ScrollBehavior) : "auto" });
  }, [pathname, hash]);

  return null;
}

export default function ScrollRoot({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteScrollReset />
      {children}
    </>
  );
}
