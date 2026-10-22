import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoftBackdrop from "@/components/SoftBackdrop";
import ScrollRoot from "@/components/ScrollRoot";
import PageTransition from "@/components/PageTransition";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import Home from "@/pages/Home";
import { PageRouteSkeleton } from "@/components/ui/page-skeletons";

const Generator = lazy(() => import("@/pages/Generator"));
const Result = lazy(() => import("@/pages/Result"));
const MyGenerations = lazy(() => import("@/pages/MyGenerations"));
const Community = lazy(() => import("@/pages/Community"));
const Plans = lazy(() => import("@/pages/Plans"));
const Loading = lazy(() => import("@/pages/Loading"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const DevStyleguide = import.meta.env.DEV ? lazy(() => import("@/pages/Styleguide")) : null;
const DevStudioStates = import.meta.env.DEV ? lazy(() => import("@/pages/dev/StudioStates")) : null;

const studioRoutes = ["/generate", "/result", "/my-generations", "/community"];

function LazyPage({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <RouteErrorBoundary>
      <PageTransition>
        <Suspense fallback={<PageRouteSkeleton pathname={pathname} />}>{children}</Suspense>
      </PageTransition>
    </RouteErrorBoundary>
  );
}

export default function App() {
  const location = useLocation();
  const hideFooter =
    studioRoutes.some((path) => location.pathname.startsWith(path)) ||
    (import.meta.env.DEV && location.pathname.startsWith("/dev/studio-states"));

  return (
    <ScrollRoot>
      <TooltipProvider delayDuration={200}>
        <Toaster
          position="bottom-center"
          gutter={12}
          toastOptions={{
            duration: 5000,
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "12px 16px",
              maxWidth: "420px",
              boxShadow: "var(--shadow-md)",
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: "13px",
              lineHeight: "1.45",
            },
            success: {
              iconTheme: { primary: "var(--success)", secondary: "var(--card)" },
            },
            error: {
              style: {
                background: "var(--card)",
                color: "var(--destructive)",
                border: "1px solid color-mix(in srgb, var(--destructive) 35%, transparent)",
              },
              iconTheme: { primary: "var(--destructive)", secondary: "var(--card)" },
            },
          }}
        />
        <SoftBackdrop />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[var(--radius-md)] focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:text-brand-foreground"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="relative z-[1]">
          <Routes location={location}>
              <Route path="/" element={<RouteErrorBoundary><PageTransition><Home /></PageTransition></RouteErrorBoundary>} />
              <Route path="/generate" element={<LazyPage><Generator /></LazyPage>} />
              <Route path="/result/:projectId" element={<LazyPage><Result /></LazyPage>} />
              <Route path="/my-generations" element={<LazyPage><MyGenerations /></LazyPage>} />
              <Route path="/community" element={<LazyPage><Community /></LazyPage>} />
              <Route path="/plans" element={<LazyPage><Plans /></LazyPage>} />
              <Route path="/loading" element={<LazyPage><Loading /></LazyPage>} />
              {import.meta.env.DEV && DevStyleguide && (
                <Route
                  path="/dev/styleguide"
                  element={
                    <LazyPage>
                      <DevStyleguide />
                    </LazyPage>
                  }
                />
              )}
              {import.meta.env.DEV && DevStudioStates && (
                <Route
                  path="/dev/studio-states"
                  element={
                    <LazyPage>
                      <DevStudioStates />
                    </LazyPage>
                  }
                />
              )}
              <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
            </Routes>
        </main>
        {!hideFooter && <Footer />}
      </TooltipProvider>
    </ScrollRoot>
  );
}
