import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Coins01Icon,
  FolderOpenIcon,
  ImageUpload01Icon,
  SmartPhone01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { assets, marketingAssets } from "@/assets/assets";
import Title from "@/components/Title";
import { fadeUp, viewportOnce } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

function BentoTile({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export default function HomeToolkit() {
  return (
    <section id="toolkit" className="border-t border-border bg-background py-[var(--space-section)]">
      <div className="container-marketing">
        <Title
          marketing
          title="Toolkit"
          heading="Everything in the app, in one workspace"
          description="Real Generator and account features — no placeholder icons."
        />
        <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto] lg:gap-5">
          <BentoTile className="md:col-span-4 md:row-span-2 md:p-0">
            <div className="flex h-full flex-col">
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold text-foreground">Generator layout</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload zones, aspect ratio chips, and credit-aware actions match production UI.
                </p>
              </div>
              <img
                src={marketingAssets.generatorUi}
                alt="Full-width Generator interface screenshot"
                width={marketingAssets.generatorUiWidth}
                height={marketingAssets.generatorUiHeight}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </BentoTile>

          <BentoTile className="md:col-span-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <HugeiconsIcon icon={ImageUpload01Icon} size={20} strokeWidth={2} />
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">Dual upload</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Product and model files validated client-side (JPG, PNG, WEBP, 10 MB cap).
            </p>
            <Link to="/generate" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
              Upload in Generator <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </BentoTile>

          <BentoTile className="md:col-span-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <HugeiconsIcon icon={SmartPhone01Icon} size={20} strokeWidth={2} />
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">Aspect ratios</p>
            <p className="mt-2 text-sm text-muted-foreground">Portrait 9:16, square 1:1, and landscape 16:9 selectors.</p>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
              {["9:16", "1:1", "16:9"].map((r) => (
                <span key={r} className="rounded-full border border-border bg-muted px-2.5 py-1">
                  {r}
                </span>
              ))}
            </div>
          </BentoTile>

          <BentoTile className="md:col-span-3">
            <div className="grid grid-cols-3 gap-2">
              {[assets.generated2, assets.generated3, assets.generated4].map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  width={768}
                  height={1376}
                  className="aspect-[9/16] rounded-lg object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">Sample outputs</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Marketing carousel uses the same WebP stills served from public/generated.
            </p>
          </BentoTile>

          <BentoTile className="md:col-span-3">
            <div className="flex items-start gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <HugeiconsIcon icon={Coins01Icon} size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="text-lg font-semibold text-foreground">Credits in the nav</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Signed-in users see live balance from the credits API. Still
                  = 5 · Video = 10 · New users start at 20.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                to="/my-generations"
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-3 text-sm font-medium hover:bg-muted"
              >
                <HugeiconsIcon icon={FolderOpenIcon} size={18} />
                My generations
              </Link>
              <Link
                to="/community"
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-3 text-sm font-medium hover:bg-muted"
              >
                <HugeiconsIcon icon={UserGroupIcon} size={18} />
                Community
              </Link>
            </div>
          </BentoTile>
        </div>
      </div>
    </section>
  );
}
