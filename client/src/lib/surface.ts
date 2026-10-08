/** Marketing = bright light (Creatify-style). Studio = matte dark. Shared tokens. */

export type SurfaceMode = "marketing" | "studio";

const marketingPaths = ["/", "/plans", "/loading"];

const studioPrefixes = ["/generate", "/result", "/my-generations", "/community"];

export function getSurfaceMode(pathname: string): SurfaceMode {
  if (studioPrefixes.some((p) => pathname.startsWith(p))) return "studio";
  if (import.meta.env.DEV && pathname.startsWith("/dev/studio-states")) return "studio";
  if (import.meta.env.DEV && pathname.startsWith("/dev/styleguide")) return "marketing";
  if (marketingPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return "marketing";
  return "marketing";
}

export function isStudioRoute(pathname: string): boolean {
  return getSurfaceMode(pathname) === "studio";
}
