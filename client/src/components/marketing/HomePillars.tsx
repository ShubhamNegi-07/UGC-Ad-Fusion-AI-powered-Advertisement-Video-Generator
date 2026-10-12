import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import { motion } from "@/components/ui/motion";

import { Button } from "@/components/ui/button";

import HeroVideo from "@/components/marketing/HeroVideo";

import MarketingShowcaseFrame from "@/components/marketing/MarketingShowcaseFrame";

import { assets } from "@/assets/assets";

import { fadeUp, viewportOnce } from "@/components/ui/motion";

import { cn } from "@/lib/utils";



type Pillar = {

  id: string;

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

      id={pillar.id}

      className={cn(

        "scroll-mt-[calc(var(--nav-offset)+0.75rem)] py-[var(--space-section)]",

        pillar.muted ? "border-y border-border bg-muted/35" : "bg-background",

      )}

    >

      <div className="container-marketing">

        <div

          className={cn(

            "grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14",

            pillar.reverse && "lg:[&>*:first-child]:order-2",

          )}

        >

          <motion.div

            initial="hidden"

            whileInView="show"

            viewport={viewportOnce}

            variants={fadeUp}

            className="min-w-0"

          >

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">{pillar.label}</p>

            <h2 className="marketing-display mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">

              {pillar.title}

            </h2>

            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted-foreground">

              {pillar.bullets.map((b) => (

                <li key={b} className="flex gap-2.5">

                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />

                  <span>{b}</span>

                </li>

              ))}

            </ul>

            <Button asChild framer={false} variant="outline" size="default" className="mt-8 w-auto self-start">

              <Link to={pillar.cta.to}>{pillar.cta.label}</Link>

            </Button>

          </motion.div>



          <motion.div

            initial="hidden"

            whileInView="show"

            viewport={viewportOnce}

            variants={fadeUp}

            className="min-w-0 w-full"

          >

            {pillar.media}

          </motion.div>

        </div>

      </div>

    </section>

  );

}



function StillShowcase() {

  return (

    <MarketingShowcaseFrame

      className="w-full"

      compact

      studioBackdrop={false}

      title="Fused still on Result"

      description="Photoreal frame from your product + model uploads — review before you spend credits on video."

      footer={

        <p className="text-[11px] text-muted-foreground sm:text-xs">

          <Link to="/generate" className="font-medium text-brand hover:underline">

            Generate a still

          </Link>{" "}

          · 5 credits per run

        </p>

      }

    >

      <img

        src={assets.generated1}

        alt="Sample fused still from the generator"

        width={768}

        height={1376}

        className="mx-auto block h-auto w-full max-w-[17.5rem] rounded-[var(--radius-xl)] border border-border object-contain shadow-md sm:max-w-[18rem]"

        loading="lazy"

        decoding="async"

      />

    </MarketingShowcaseFrame>

  );

}



function VideoShowcase() {

  return (

    <MarketingShowcaseFrame

      className="w-full"

      compact

      studioBackdrop={false}

      title="Talking UGC clip"

      description="Animate the approved still into a short MP4 — ready for Reels, Shorts, and TikTok."

      footer={

        <p className="text-[11px] text-muted-foreground sm:text-xs">

          <Link to="/generate" className="font-medium text-brand hover:underline">

            Try video generation

          </Link>{" "}

          · 10 credits after still approval

        </p>

      }

    >

      <HeroVideo

        src={assets.generatedVideo1}

        poster={assets.generated1}

        className="mx-auto block h-auto w-full max-w-[17.5rem] rounded-[var(--radius-xl)] border border-border object-contain shadow-md sm:max-w-[18rem]"

      />

    </MarketingShowcaseFrame>

  );

}



function ShareShowcase() {

  const tiles = [assets.generated2, assets.generated3, assets.generated4, assets.generated1];



  return (

    <MarketingShowcaseFrame

      className="w-full"

      compact

      title="My generations & Community"

      description="Every project in your library — publish to the feed when you are ready."

      studioBackdrop={false}

      footer={

        <p className="text-[11px] text-muted-foreground sm:text-xs">

          <Link to="/my-generations" className="font-medium text-brand hover:underline">

            Open library

          </Link>

          {" · "}

          <Link to="/community" className="font-medium text-brand hover:underline">

            Browse community

          </Link>

        </p>

      }

    >

      <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">

        {tiles.map((src) => (

          <img

            key={src}

            src={src}

            alt=""

            width={768}

            height={1376}

            className="aspect-[9/16] w-full rounded-[var(--radius-lg)] border border-border object-cover shadow-sm"

            loading="lazy"

            decoding="async"

          />

        ))}

      </div>

    </MarketingShowcaseFrame>

  );

}



export default function HomePillars() {

  const pillars: Pillar[] = [

    {

      id: "still",

      label: "Still",

      title: "Fuse both photos into one photoreal frame",

      bullets: [

        "Still generation costs 5 credits per run.",

        "If fusion fails, those credits are refunded when possible.",

        "Review the still on Result before you spend 10 credits on video.",

      ],

      cta: { label: "See sample still", to: "/generate" },

      reverse: true,

      muted: true,

      media: <StillShowcase />,

    },

    {

      id: "video",

      label: "Video",

      title: "Animate the still into a talking UGC clip",

      bullets: [

        "Video generation costs 10 credits and animates your approved still.",

        "Clips export as MP4, ready for Reels, Shorts, and TikTok.",

        "If video generation fails, we attempt to refund those 10 credits.",

      ],

      cta: { label: "Try a talking ad", to: "/generate" },

      media: <VideoShowcase />,

    },

    {

      id: "share",

      label: "Share",

      title: "Publish, browse, and manage generations",

      bullets: [

        "My generations lists every project tied to your account.",

        "Publish from Result to add a clip to the Community feed when you are ready.",

        "Download or revisit outputs anytime from Result or Community cards.",

      ],

      cta: { label: "Browse community", to: "/community" },

      reverse: true,

      muted: true,

      media: <ShareShowcase />,

    },

  ];



  return (

    <>

      {pillars.map((pillar) => (

        <PillarBlock key={pillar.id} pillar={pillar} />

      ))}

    </>

  );

}


