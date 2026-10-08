import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, Linkedin01Icon } from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import { fadeIn, viewportOnce } from "@/components/ui/motion";

const productLinks = [
  { name: "Home", to: "/" },
  { name: "Generator", to: "/generate" },
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
      className="relative z-10 border-t border-border bg-muted/30"
    >
      <div className="container-marketing py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <img src={assets.logo} alt="UGC Ad Fusion" className="h-7 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Turn a product photo and a model photo into a photoreal still and optional talking video — built for
              short-form feeds.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">Account</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/generate" className="transition-colors hover:text-foreground">
                  Sign in via Generator
                </Link>
              </li>
              <li>
                <Link to="/plans" className="transition-colors hover:text-foreground">
                  View plans & credits
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">Connect</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-card text-muted-foreground transition-colors hover:border-ring/30 hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={s.icon} size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} UGC Ad Fusion. All rights reserved.</p>
          <p>Built with React and Tailwind.</p>
        </div>
      </div>
    </motion.footer>
  );
}
