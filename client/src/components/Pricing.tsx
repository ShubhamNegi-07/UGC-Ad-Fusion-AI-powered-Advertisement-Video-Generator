import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { plansData } from "@/assets/dummy-data";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export default function Pricing({ compact = false }: { compact?: boolean }) {
  return (
    <section id="pricing" className={cn(compact ? "py-10" : "py-24 md:py-32")}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Title
          title="Pricing"
          heading="Simple, credit-based pricing"
          description="Every account starts with 20 free credits. An image costs 5, a talking video costs 10. Top up when you need more."
          as={compact ? "h1" : "h2"}
        />

        <motion.div
          variants={stagger(0, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 md:grid-cols-3 md:items-stretch"
        >
          {plansData.map((plan) => (
            <motion.article
              key={plan.id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={cn(
                "relative flex flex-col rounded-2xl p-6 md:p-7",
                plan.popular
                  ? "glass-strong border-white/15 shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_30px_80px_-40px_rgb(0_0_0/0.8)]"
                  : "glass",
              )}
            >
              {plan.popular && (
                <div className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-zinc-200/70 to-transparent" />
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{plan.name}</h3>
                {plan.popular && <Badge variant="primary">Most popular</Badge>}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/ {plan.credits} credits</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>

              <ul className="mt-6 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                      <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={3} />
                    </span>
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "gradient" : "outline"}
                size="lg"
                className="mt-8 w-full rounded-xl"
              >
                <Link to="/generate">Get {plan.name}</Link>
              </Button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
