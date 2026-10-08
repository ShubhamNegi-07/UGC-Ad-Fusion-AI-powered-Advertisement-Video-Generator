import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoftBackdrop from "@/components/SoftBackdrop";
import SmoothScroll from "@/components/lenis";
import PageTransition from "@/components/PageTransition";
import Home from "@/pages/Home";
import Generator from "@/pages/Generator";
import Result from "@/pages/Result";
import MyGenerations from "@/pages/MyGenerations";
import Community from "@/pages/Community";
import Plans from "@/pages/Plans";
import Loading from "@/pages/Loading";
const DevStyleguide = import.meta.env.DEV ? lazy(() => import("@/pages/Styleguide")) : null;
const studioRoutes = ["/generate", "/result", "/my-generations", "/community"];

export default function App() {
  const location = useLocation();
  const hideFooter = studioRoutes.some((path) => location.pathname.startsWith(path));

  return (
    <SmoothScroll>
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
              <Route path="/generate" element={<PageTransition><Generator /></PageTransition>} />
              <Route path="/result/:projectId" element={<PageTransition><Result /></PageTransition>} />
              <Route path="/my-generations" element={<PageTransition><MyGenerations /></PageTransition>} />
              <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
              <Route path="/plans" element={<PageTransition><Plans /></PageTransition>} />
              <Route path="/loading" element={<PageTransition><Loading /></PageTransition>} />
              {import.meta.env.DEV && DevStyleguide && (
                <Route
                  path="/dev/styleguide"
                  element={
                    <PageTransition>
                      <Suspense fallback={null}>
                        <DevStyleguide />
                      </Suspense>
                    </PageTransition>
                  }
                />
              )}
            </Routes>
          </AnimatePresence>
        </main>
        {!hideFooter && <Footer />}
      </TooltipProvider>
    </SmoothScroll>
  );
}
