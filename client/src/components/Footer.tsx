import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, Linkedin01Icon } from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import { fadeIn, viewportOnce } from "@/components/ui/motion";

const productLinks = [
  { name: "Home", to: "/" },
  { name: "Create", to: "/generate" },
  { name: "My generations", to: "/my-generations" },
  { name: "Community", to: "/community" },
  { name: "Plans", to: "/plans" },
];

const socials = [
  { label: "LinkedIn", icon: Linkedin01Icon, url: "https://www.linkedin.com/in/shubham-singh2006/" },
  { label: "GitHub", icon: Github01Icon, url: "https://github.com/shubhamsingh206" },
];

export default function Footer() {
  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="relative z-10 bg-background pt-[var(--space-section)]"
    >
      <div className="container-marketing pb-10 md:pb-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <img src={assets.logo} alt="UGC.AI" width={170} height={40} className="h-8 w-auto max-w-[10rem]" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Product stills and talking clips from one upload flow — built for short-form feeds.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Account</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/generate" className="text-foreground/80 transition-colors hover:text-foreground">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-foreground/80 transition-colors hover:text-foreground">
                  Plans & credits
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Connect</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-10 items-center justify-center rounded-lg border border-border/80 bg-card/60 text-muted-foreground transition-colors hover:border-brand/30 hover:text-foreground"
                >
                  <HugeiconsIcon icon={s.icon} size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} UGC.AI. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
