import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import { getSurfaceMode } from "@/lib/surface";
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

  const [menu, setMenu] = useState<{ open: boolean; at: string }>({ open: false, at: "" });
  const menuOpen = menu.open && menu.at === pathname;
  const setMenuOpen = useCallback(
    (open: boolean) => setMenu(open ? { open: true, at: pathname } : { open: false, at: pathname }),
    [pathname],
  );

  const [credits, setCredits] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const marketing = getSurfaceMode(pathname) === "marketing";
  const homeRoute = pathname === "/";
  const homeDarkNav = marketing && homeRoute && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayCredits = user ? credits : null;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const { data } = await api.get("/api/user/credits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setCredits(Number(data.credits) || 0);
      } catch (error) {
        if (!cancelled) toast.error(errorMessage(error, "Could not load credits"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, pathname, getToken]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, pathname, setMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        className="fixed inset-x-0 top-0 z-50"
      >
        {!marketing && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[5.75rem] bg-gradient-to-b from-background via-background/90 to-transparent"
          />
        )}
        <div
          className={cn(
            "relative",
            marketing
              ? "pt-[max(0px,var(--safe-top))]"
              : "px-3 pt-[max(0.75rem,var(--safe-top))] sm:px-4 sm:pt-4",
          )}
        >
          <nav
            aria-label="Primary"
            className={cn(
              "nav-chrome nav-chrome-inner flex w-full items-center justify-between gap-3 transition-[background-color,border-color,box-shadow,color] duration-[var(--motion-duration)]",
              marketing ? "h-16" : "surface-panel mx-auto h-14 max-w-6xl rounded-[var(--radius-lg)] px-3 pl-4",
              marketing && !homeDarkNav && "surface-panel",
              homeDarkNav && "border-transparent bg-transparent shadow-none text-white",
              !marketing && scrolled && "shadow-lg",
              marketing && scrolled && homeRoute && "surface-panel shadow-sm",
              marketing && scrolled && !homeRoute && "shadow-sm",
            )}
          >
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="UGC Ad Fusion home"
            >
              <img
                src={assets.logo}
                alt=""
                className={cn("h-7 w-auto", homeDarkNav && "nav-logo-on-dark")}
              />
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "relative rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        homeDarkNav
                          ? isActive
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                          : isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            transition={spring}
                            className={cn(
                              "absolute inset-0 -z-10 rounded-[var(--radius-sm)]",
                              homeDarkNav ? "bg-white/15" : "bg-muted",
                            )}
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
                  aria-label={`Credits: ${displayCredits ?? 0}. Open plans`}
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-muted text-foreground">
                    <HugeiconsIcon icon={Coins01Icon} size={13} strokeWidth={2} />
                  </span>
                  {displayCredits === null ? <Skeleton className="h-3 w-6 rounded" /> : displayCredits}
                  </Button>
                  <div className="flex size-9 items-center justify-center">
                    <UserButton appearance={{ elements: { avatarBox: "size-8 ring-2 ring-border" } }}>
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
                  <Button variant="default" size="sm" className="h-9 rounded-full px-4" onClick={() => openSignUp()}>
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
                onClick={() => setMenuOpen(!menuOpen)}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -12, opacity: 0, scale: 0.98 }}
              transition={spring}
              className="surface-panel absolute inset-x-3 top-20 rounded-[var(--radius-lg)] p-2"
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
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex min-h-[44px] items-center justify-between rounded-[var(--radius-md)] px-4 py-3 text-[15px] font-medium transition-colors",
                          isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
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
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex min-h-[44px] items-center justify-between rounded-[var(--radius-md)] px-4 py-3 text-[15px] font-medium transition-colors",
                          isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        )
                      }
                    >
                      My generations
                    </NavLink>
                  </motion.li>
                )}
              </ul>
              {!user && (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border p-2 pt-4">
                  <Button variant="outline" onClick={() => { setMenuOpen(false); openSignIn(); }}>
                    Sign in
                  </Button>
                  <Button variant="default" onClick={() => { setMenuOpen(false); openSignUp(); }}>
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
