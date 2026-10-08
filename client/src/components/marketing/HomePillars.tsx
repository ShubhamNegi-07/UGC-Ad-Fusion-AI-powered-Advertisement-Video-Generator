import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { assets, marketingAssets } from "@/assets/assets";
import HeroVideo from "@/components/marketing/HeroVideo";
import { fadeUp, viewportOnce } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

type Pillar = {
  label: string;
  title: string;
  bullets: string[];
  cta: { label: string; to: string };
  media: ReactNode;
  reverse?: boolean;
  muted?: boolean;
};

function PillarBlock({ pillar }: { pillar: Pillar }) {
  return (
    <section
      className={cn(
        "py-[var(--space-section)]",
        pillar.muted ? "border-y border-border bg-muted/35" : "bg-background",
      )}
    >
      <div className="container-marketing">
        <div
          className={cn(
            "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
            pillar.reverse && "lg:[&>*:first-child]:order-2",
          )}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="max-w-xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">{pillar.label}</p>
            <h2 className="marketing-display mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {pillar.title}
            </h2>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {pillar.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              to={pillar.cta.to}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand"
            >
              {pillar.cta.label}
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </Link>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="relative"
          >
            {pillar.media}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePillars() {
  const pillars: Pillar[] = [
    {
      label: "Upload",
      title: "Drop a product shot and a model photo",
      bullets: [
        "Two Upload zones in Generator — one for product, one for model (JPG, PNG, WEBP up to 10 MB).",
        "Name and describe the product so prompts stay on-brand in later steps.",
        "Pick 9:16, 1:1, or 16:9 before you generate the still.",
      ],
      cta: { label: "Open Generator", to: "/generate" },
      media: (
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-md">
          <img
            src={marketingAssets.generatorUi}
            alt="Generator screen with product and model upload fields"
            width={marketingAssets.generatorUiWidth}
            height={marketingAssets.generatorUiHeight}
            className="h-auto w-full"
            loading="lazy"
            decoding="async"
          />
        </div>
      ),
    },
    {
      label: "Still",
      title: "Fuse both photos into one photoreal frame",
      bullets: [
        "Still generation costs 5 credits and runs through our image API.",
        "If fusion fails, the server refunds 5 credits when the error path runs.",
        "Review the PNG on the Result screen before you spend credits on video.",
      ],
      cta: { label: "See sample still", to: "/generate" },
      reverse: true,
      muted: true,
      media: (
        <div className="mx-auto max-w-xs overflow-hidden rounded-[var(--radius-xl)] border border-border shadow-lg">
          <img
            src={assets.generated1}
            alt="Sample fused still from our generator"
            width={768}
            height={1376}
            className="aspect-[9/16] w-full object-cover"
            loading="lazy"
          />
        </div>
      ),
    },
    {
      label: "Video",
      title: "Animate the still into a talking UGC clip",
      bullets: [
        "Video generation costs 10 credits and uses your approved still as the source frame.",
        "Clips export as MP4; playback uses lazy loading in marketing previews.",
        "Pollinations quota errors surface in-app and attempt a 10-credit refund.",
      ],
      cta: { label: "Try a talking ad", to: "/generate" },
      media: (
        <div className="mx-auto max-w-xs overflow-hidden rounded-[var(--radius-xl)] border border-border shadow-lg">
          <HeroVideo
            src={assets.generatedVideo1}
            poster={assets.generated1}
            className="aspect-[9/16] h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      label: "Share",
      title: "Publish, browse, and manage generations",
      bullets: [
        "My generations lists every project tied to your Clerk account.",
        "Publish from Result to add a clip to the Community feed when you are ready.",
        "Download or revisit outputs anytime from Result or Community cards.",
      ],
      cta: { label: "Browse community", to: "/community" },
      reverse: true,
      muted: true,
      media: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[assets.generated2, assets.generated3, assets.generated4, assets.generated1].map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-sm"
            >
              <img
                src={src}
                alt=""
                width={768}
                height={1376}
                className="aspect-[9/16] w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
          <div className="col-span-2 flex flex-col justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-muted/50 p-4 sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">My generations</p>
            <p className="mt-1 text-sm text-foreground">Filter, open, and republish past runs.</p>
            <Link to="/my-generations" className="mt-3 text-sm font-medium text-brand hover:underline">
              Open library
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {pillars.map((pillar) => (
        <PillarBlock key={pillar.label} pillar={pillar} />
      ))}
    </>
  );
}
