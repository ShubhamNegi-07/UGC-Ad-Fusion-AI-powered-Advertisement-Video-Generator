import { Link } from "react-router-dom";
import { motion, fadeIn, viewportOnce } from "@/components/ui/motion";
import BrandLogo from "@/components/BrandLogo";

const productLinks = [
  { name: "Home", to: "/" },
  { name: "Create", to: "/generate" },
  { name: "My generations", to: "/my-generations" },
  { name: "Community", to: "/community" },
  { name: "Plans", to: "/plans" },
];

const accountLinks = [
  { name: "Sign in", to: "/generate" },
  { name: "Plans & credits", to: "/plans" },
];

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4.5 11.5L11.5 4.5M11.5 4.5H5.75M11.5 4.5V10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterNavLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex items-center gap-1.5 py-1 text-[15px] font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="relative inline-flex overflow-hidden leading-tight">
        <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 inline-block translate-y-full text-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>

      <span className="relative inline-flex size-4 items-center justify-center overflow-hidden">
        <ArrowUpRightIcon className="size-4 text-muted-foreground/60 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:opacity-0" />
        <ArrowUpRightIcon className="absolute size-4 -translate-x-3 translate-y-3 text-brand-muted opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-right scale-x-0 rounded-full bg-gradient-to-r from-brand via-brand-muted to-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100"
      />
    </Link>
  );
}

export default function Footer() {
  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="relative z-10 border-t border-white/[0.08] bg-background font-[family-name:var(--font-jakarta)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent"
      />

      <div className="container-marketing py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12">
          <div className="flex flex-col items-start justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <Link
                to="/"
                className="inline-flex items-center rounded-[var(--radius-sm)] text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BrandLogo markClassName="size-9" wordmarkClassName="text-[1.32rem]" />
              </Link>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-foreground/75">
                Turn product photos into photoreal creator ads and talking videos in seconds.
              </p>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-foreground/80">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
              <span>All systems operational</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/90">Product</h3>
            <ul className="mt-4 flex flex-col items-start gap-2.5">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <FooterNavLink to={link.to}>{link.name}</FooterNavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/90">Account</h3>
            <ul className="mt-4 flex flex-col items-start gap-2.5">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <FooterNavLink to={link.to}>{link.name}</FooterNavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-7 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} UGC.AI. All rights reserved.</p>
          <p className="text-foreground/70">AI video ads for modern brands &amp; creators.</p>
        </div>
      </div>
    </motion.footer>
  );
}
