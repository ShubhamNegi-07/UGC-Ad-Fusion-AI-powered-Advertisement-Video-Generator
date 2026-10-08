import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoftBackdrop from "@/components/SoftBackdrop";
import ScrollRoot from "@/components/ScrollRoot";
import PageTransition from "@/components/PageTransition";
import Home from "@/pages/Home";
import Loading from "@/pages/Loading";

const Generator = lazy(() => import("@/pages/Generator"));
const Result = lazy(() => import("@/pages/Result"));
const MyGenerations = lazy(() => import("@/pages/MyGenerations"));
const Community = lazy(() => import("@/pages/Community"));
const Plans = lazy(() => import("@/pages/Plans"));
const DevStyleguide = import.meta.env.DEV ? lazy(() => import("@/pages/Styleguide")) : null;

const studioRoutes = ["/generate", "/result", "/my-generations", "/community"];

function RouteFallback() {
  return <div className="min-h-[60vh] pt-nav" aria-busy="true" aria-label="Loading page" />;
}

function LazyPage({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
    </PageTransition>
  );
}

export default function App() {
  const location = useLocation();
  const hideFooter = studioRoutes.some((path) => location.pathname.startsWith(path));

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
        <main id="main" className="relative z-10">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/generate" element={<LazyPage><Generator /></LazyPage>} />
              <Route path="/result/:projectId" element={<LazyPage><Result /></LazyPage>} />
              <Route path="/my-generations" element={<LazyPage><MyGenerations /></LazyPage>} />
              <Route path="/community" element={<LazyPage><Community /></LazyPage>} />
              <Route path="/plans" element={<LazyPage><Plans /></LazyPage>} />
              <Route path="/loading" element={<PageTransition><Loading /></PageTransition>} />
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
            </Routes>
          </AnimatePresence>
        </main>
        {!hideFooter && <Footer />}
      </TooltipProvider>
    </ScrollRoot>
  );
}
