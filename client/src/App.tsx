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

const studioRoutes = ["/generate", "/result", "/my-generations"];

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
              background: "#0c0c0e",
              color: "#fafafa",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "12px 16px",
              maxWidth: "420px",
              boxShadow: "0 18px 50px -18px rgba(0,0,0,0.8)",
              fontSize: "13px",
              lineHeight: "1.45",
            },
            success: {
              iconTheme: { primary: "#34d399", secondary: "#0c0c0e" },
            },
            error: {
              style: {
                background: "#1c1012",
                color: "#fecaca",
                border: "1px solid rgba(248,113,113,0.35)",
              },
              iconTheme: { primary: "#f87171", secondary: "#1c1012" },
            },
          }}
        />
        <SoftBackdrop />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
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
            </Routes>
          </AnimatePresence>
        </main>
        {!hideFooter && <Footer />}
      </TooltipProvider>
    </SmoothScroll>
  );
}
