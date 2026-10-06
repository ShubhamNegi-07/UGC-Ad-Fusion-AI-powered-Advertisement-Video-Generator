import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/components/lenis";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Coins01Icon,
  CreditCardIcon,
  FolderOpenIcon,
  Menu01Icon,
  SparklesIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";
import api from "@/configs/axios";
import { assets } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, errorMessage } from "@/lib/utils";
import { spring } from "@/components/ui/motion";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Create", to: "/generate" },
  { name: "Community", to: "/community" },
  { name: "Plans", to: "/plans" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { openSignIn, openSignUp } = useClerk();

  const [menuOpen, setMenuOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useLenis((instance) => {
    setScrolled(instance.scroll > 24);
  });

  const loadCredits = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(Number(data.credits) || 0);
    } catch (error) {
      toast.error(errorMessage(error, "Could not load credits"));
    }
  }, [getToken]);

  useEffect(() => {
    if (user) void loadCredits();
  }, [user, pathname, loadCredits]);

  // Close the sheet on route change and stop Lenis while the menu is open.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
    return () => {
      lenis.start();
    };
  }, [menuOpen, lenis]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[5.75rem] bg-gradient-to-b from-[#09090b] via-[#09090b]/90 to-transparent"
        />
        <div className="relative px-3 pt-3 sm:px-4 sm:pt-4">
          <nav
            aria-label="Primary"
            className={cn(
              "glass-strong mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-2xl border px-3 pl-4 transition-shadow duration-300",
              scrolled && "shadow-[0_12px_40px_-20px_rgb(0_0_0/0.85)]",
            )}
          >
          <Link to="/" className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70" aria-label="UGC Ad Fusion home">
            <img src={assets.logo} alt="" className="h-7 w-auto" />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={spring}
                          className="absolute inset-0 -z-10 rounded-lg bg-white/[0.07]"
                        />
                      )}
                      {link.name}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {!isLoaded ? (
              <Skeleton className="h-9 w-24 rounded-full" />
            ) : user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/plans")}
                  className="h-9 gap-1.5 rounded-full pl-2.5 pr-3 font-mono text-xs tabular-nums"
                  aria-label={`Credits: ${credits ?? 0}. Open plans`}
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/[0.08] text-zinc-200">
                    <HugeiconsIcon icon={Coins01Icon} size={13} strokeWidth={2} />
                  </span>
                  {credits === null ? <Skeleton className="h-3 w-6 rounded" /> : credits}
                </Button>
                <div className="flex size-9 items-center justify-center">
                  <UserButton
                    appearance={{ elements: { avatarBox: "size-8 ring-2 ring-white/10" } }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="Generate"
                        labelIcon={<HugeiconsIcon icon={SparklesIcon} size={14} />}
                        onClick={() => navigate("/generate")}
                      />
                      <UserButton.Action
                        label="My generations"
                        labelIcon={<HugeiconsIcon icon={FolderOpenIcon} size={14} />}
                        onClick={() => navigate("/my-generations")}
                      />
                      <UserButton.Action
                        label="Community"
                        labelIcon={<HugeiconsIcon icon={UserGroupIcon} size={14} />}
                        onClick={() => navigate("/community")}
                      />
                      <UserButton.Action
                        label="Plans"
                        labelIcon={<HugeiconsIcon icon={CreditCardIcon} size={14} />}
                        onClick={() => navigate("/plans")}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-1.5 md:flex">
                <Button variant="ghost" size="sm" className="h-9" onClick={() => openSignIn()}>
                  Sign in
                </Button>
                <Button variant="gradient" size="sm" className="h-9 rounded-full px-4" onClick={() => openSignUp()}>
                  Get started
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="size-9 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} size={20} strokeWidth={2} />
            </Button>
          </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-40 md:hidden"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -12, opacity: 0, scale: 0.98 }}
              transition={spring}
              className="glass-strong absolute inset-x-3 top-20 rounded-2xl p-2"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.04 * i }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                          isActive ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
                        )
                      }
                    >
                      {link.name}
                    </NavLink>
                  </motion.li>
                ))}
                {user && (
                  <motion.li
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.18 }}
                  >
                    <NavLink
                      to="/my-generations"
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                          isActive ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
                        )
                      }
                    >
                      My generations
                    </NavLink>
                  </motion.li>
                )}
              </ul>
              {!user && (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 p-2 pt-4">
                  <Button variant="outline" onClick={() => { setMenuOpen(false); openSignIn(); }}>
                    Sign in
                  </Button>
                  <Button variant="gradient" onClick={() => { setMenuOpen(false); openSignUp(); }}>
                    Get started
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
