import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, Linkedin01Icon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import { footerLinks } from "@/assets/dummy-data";
import { fadeIn, viewportOnce } from "@/components/ui/motion";

const socials = [
  { label: "Twitter", icon: NewTwitterIcon, url: "#" },
  { label: "LinkedIn", icon: Linkedin01Icon, url: "https://www.linkedin.com/in/shubham-singh2006/" },
  { label: "GitHub", icon: Github01Icon, url: "https://github.com/shubhamsingh206" },
];

function FooterLink({ name, url }: { name: string; url: string }) {
  const className =
    "text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground";
  if (url.startsWith("/")) {
    return (
      <Link to={url} className={className}>
        {name}
      </Link>
    );
  }
  return (
    <a href={url} className={className} target={url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {name}
    </a>
  );
}

export default function Footer() {
  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="relative z-10 mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 py-14 md:grid-cols-[1.3fr_1fr]">
          <div>
            <img src={assets.logo} alt="UGC Ad Fusion" className="h-7 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Turn a product photo and a model photo into a photoreal image and a short talking video ad,
              framed for Reels, Shorts and TikTok.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  aria-label={s.label}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-md)] border border-border bg-card text-muted-foreground transition-colors hover:border-ring/30 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <HugeiconsIcon icon={s.icon} size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <FooterLink name={link.name} url={link.url} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} UGC Ad Fusion. All rights reserved.</p>
          <p className="font-mono">Built with React, Tailwind and Veo.</p>
        </div>
      </div>
    </motion.footer>
  );
}
