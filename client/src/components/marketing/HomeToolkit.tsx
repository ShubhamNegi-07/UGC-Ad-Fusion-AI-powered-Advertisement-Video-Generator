import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, ImageUpload01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import GeneratorMarketingPreview from "@/components/marketing/GeneratorMarketingPreview";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
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
                <p className="text-sm font-semibold text-foreground">Create layout</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload zones, aspect ratio chips, and credit-aware actions — same as the live app.
                </p>
              </div>
              <GeneratorMarketingPreview layout="bento" className="rounded-none border-0 shadow-none" />
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
            <Button asChild variant="outline" size="sm" className="mt-4 w-auto self-start">
              <Link to="/generate">Open Create</Link>
            </Button>
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
              Same sample stills as the hero carousel — real outputs from our demo pipeline.
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
                  Signed-in users see a live balance in the nav. Still = 5 credits · Video = 10 · New accounts start with 20.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="w-auto">
                <Link to="/my-generations">My generations</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-auto">
                <Link to="/community">Community</Link>
              </Button>
            </div>
          </BentoTile>
        </div>
      </div>
    </section>
  );
}
