import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { featuresData } from "@/assets/dummy-data";
import Title from "@/components/Title";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Title
          title="Features"
          heading="Everything you need to ship UGC ads"
          description="From the first upload to a posted clip, each step is designed to be fast, predictable and on-brand."
        />
        <motion.ul
          variants={stagger(0, 0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuresData.map((feature) => (
            <motion.li
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group glass relative overflow-hidden rounded-2xl p-6"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-white/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent text-zinc-200 shadow-inner transition-colors duration-300 group-hover:border-white/20 group-hover:text-zinc-50">
                <HugeiconsIcon icon={feature.icon} size={20} strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
