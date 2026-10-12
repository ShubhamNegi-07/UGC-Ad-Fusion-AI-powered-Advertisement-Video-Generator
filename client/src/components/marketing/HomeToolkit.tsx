import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, ImageUpload01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import MarketingShowcaseFrame from "@/components/marketing/MarketingShowcaseFrame";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { StudioMediaFrame } from "@/components/studio/StudioMediaFill";
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
    <section
      id="toolkit"
      className="scroll-mt-[calc(var(--nav-offset)+0.75rem)] border-t border-border bg-background py-[var(--space-section)]"
    >
      <div className="container-marketing">
        <Title
          marketing
          title="Toolkit"
          heading="Everything in the app, in one workspace"
          description="Create, Result, library, and credits — wired to the same routes you use when signed in."
        />
        <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto] lg:gap-5">
          <BentoTile className="md:col-span-4 md:row-span-2 md:p-0">
            <MarketingShowcaseFrame
              className="h-full rounded-none border-0 shadow-none"
              title="Result — still first, video second"
              description="Approve the fused image, then generate or download a talking clip from the same Result page."
              studioBackdrop
              footer={
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  <Link to="/generate" className="font-medium text-brand hover:underline">
                    Start a project
                  </Link>{" "}
                  to open your own Result view.
                </p>
              }
            >
              <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-lg">
                <div className="overflow-hidden rounded-[var(--radius-lg)] border border-white/10 shadow-md">
                  <StudioMediaFrame aspectRatio="9:16" backdropSrc={assets.generated1}>
                    <img
                      src={assets.generated1}
                      alt="Sample fused still"
                      width={768}
                      height={1376}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </StudioMediaFrame>
                </div>
                <div className="flex flex-col justify-center gap-2 rounded-[var(--radius-lg)] border border-border bg-card/90 p-3 text-left sm:p-4">
                  <p className="text-xs font-semibold text-foreground">On Result you can</p>
                  <ul className="space-y-1.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                    <li>· Regenerate or download the still</li>
                    <li>· Run video generation (10 credits)</li>
                    <li>· Publish to Community when ready</li>
                  </ul>
                </div>
              </div>
            </MarketingShowcaseFrame>
          </BentoTile>

          <BentoTile className="md:col-span-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <HugeiconsIcon icon={ImageUpload01Icon} size={20} strokeWidth={2} />
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">Dual upload</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Product and model files validated client-side (JPG, PNG, WEBP, 10 MB cap).
            </p>
            <Button asChild framer={false} variant="outline" size="sm" className="mt-4 w-auto self-start">
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
                  className="aspect-[9/16] rounded-lg border border-border object-cover"
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
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <HugeiconsIcon icon={Coins01Icon} size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="text-lg font-semibold text-foreground">Credits in the nav</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Signed-in users see a live balance in the nav. Still = 5 credits · Video = 10 · New accounts start
                  with 20.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild framer={false} variant="outline" size="sm" className="w-auto">
                <Link to="/my-generations">My generations</Link>
              </Button>
              <Button asChild framer={false} variant="outline" size="sm" className="w-auto">
                <Link to="/community">Community</Link>
              </Button>
            </div>
          </BentoTile>
        </div>
      </div>
    </section>
  );
}
