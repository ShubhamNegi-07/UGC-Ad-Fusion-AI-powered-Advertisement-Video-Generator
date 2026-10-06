import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Mic01Icon,
  PlayIcon,
  SmartPhone01Icon,
  SparklesIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { assets } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp, scaleIn, softSpring, stagger } from "@/components/ui/motion";

const brands = ["Shopify", "Glossier", "Notion", "Allbirds", "Figma", "Gymshark", "Linear"];

const perks = [
  { icon: ZapIcon, title: "Seconds to create", desc: "Image in ~20s, video in ~2min" },
  { icon: Mic01Icon, title: "Speaks to camera", desc: "Audio generated with the clip" },
  { icon: CheckmarkCircle02Icon, title: "Commercial rights", desc: "Use anywhere, no fees" },
];

export default function Hero() {
  return (
    <>
      <section id="home" className="relative overflow-hidden pt-32 md:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div variants={stagger(0.05, 0.09)} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <Badge variant="primary" className="h-7 gap-2 pl-1.5 pr-3">
                <span className="flex size-4 items-center justify-center rounded-full bg-white/15">
                  <HugeiconsIcon icon={SparklesIcon} size={10} strokeWidth={2.4} />
                </span>
                New: talking video ads with Veo
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-50 sm:text-5xl lg:text-6xl"
            >
              Turn one product photo into a <span className="text-gradient">viral UGC ad</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-lg text-pretty text-[15px] leading-relaxed text-zinc-400 sm:text-base">
              Upload a product and a model. We fuse them into a photoreal still, then animate it into a
              short clip where the creator talks to camera and shows the product. Framed for Reels, Shorts and TikTok.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="gradient" size="lg" className="group rounded-full">
                <Link to="/generate">
                  Start generating free
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/community">
                  <HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={2} />
                  See examples
                </Link>
              </Button>
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-10 grid gap-3 sm:grid-cols-3">
              {perks.map((p) => (
                <li key={p.title} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-200">
                    <HugeiconsIcon icon={p.icon} size={16} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-tight text-zinc-100">{p.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{p.desc}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Visual */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            transition={{ ...softSpring, delay: 0.25 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.08),transparent_62%)] blur-2xl" />

            <div className="grid grid-cols-[1fr_1.35fr] gap-3 sm:gap-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                <motion.figure
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...softSpring, delay: 0.45 }}
                  className="glass overflow-hidden rounded-2xl p-1.5"
                >
                  <img src={assets.product7} alt="Product input" className="aspect-square w-full rounded-xl object-cover" loading="eager" />
                  <figcaption className="px-1.5 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    01 · Product
                  </figcaption>
                </motion.figure>
                <motion.figure
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...softSpring, delay: 0.55 }}
                  className="glass overflow-hidden rounded-2xl p-1.5"
                >
                  <img src={assets.model1} alt="Model input" className="aspect-square w-full rounded-xl object-cover object-top" loading="eager" />
                  <figcaption className="px-1.5 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    02 · Model
                  </figcaption>
                </motion.figure>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...softSpring, delay: 0.65 }}
                className="glass-strong relative overflow-hidden rounded-3xl p-1.5"
              >
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.25rem] bg-black">
                  <video
                    src={assets.generatedVideo1}
                    poster={assets.generated1}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <Badge className="bg-black/40 text-[10px] backdrop-blur-md">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Generated
                    </Badge>
                    <Badge className="bg-black/40 text-[10px] backdrop-blur-md">
                      <HugeiconsIcon icon={SmartPhone01Icon} size={11} />
                      9:16
                    </Badge>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                    <p className="text-xs font-medium">Talking ad · 8s · with audio</p>
                    <p className="mt-0.5 text-[11px] text-white/60">Trolley bag · generated with Veo</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...softSpring, delay: 0.9 }}
              className="glass-strong absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-8"
            >
              <div className="flex -space-x-2">
                {[assets.model1, assets.model2, assets.generated3].map((src, i) => (
                  <img key={i} src={src} alt="" className="size-7 rounded-full border-2 border-background object-cover object-top" />
                ))}
              </div>
              <div>
                <p className="text-xs font-medium leading-none">2,400+ ads shipped</p>
                <p className="mt-1 text-[11px] text-muted-foreground">this month by creators</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand marquee */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-24 border-y border-white/[0.06] py-6"
        aria-label="Trusted by"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams at
          </p>
          <div className="mask-fade-x overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-14 whitespace-nowrap">
              {[...brands, ...brands].map((b, i) => (
                <span key={`${b}-${i}`} className="text-base font-semibold tracking-tight text-foreground/35 transition-colors hover:text-foreground/70">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
