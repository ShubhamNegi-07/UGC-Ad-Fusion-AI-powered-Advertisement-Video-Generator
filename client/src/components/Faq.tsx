import { Accordion as AccordionPrimitive } from "radix-ui";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { faqData } from "@/assets/dummy-data";
import Title from "@/components/Title";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";

export default function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Title
          title="FAQ"
          heading="Frequently asked questions"
          description="Everything you need to know about generating, credits and rights. Still curious? Reach out any time."
        />

        <motion.div variants={stagger(0, 0.06)} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <AccordionPrimitive.Root type="single" collapsible className="space-y-3">
            {faqData.map((faq, i) => (
              <motion.div key={faq.question} variants={fadeUp}>
                <AccordionPrimitive.Item
                  value={`item-${i}`}
                  className="glass group rounded-xl transition-colors data-[state=open]:border-white/15 data-[state=open]:bg-white/[0.05]"
                >
                  <AccordionPrimitive.Header asChild>
                    <h3>
                      <AccordionPrimitive.Trigger className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left text-[15px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/70">
                        {faq.question}
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-foreground">
                          <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </h3>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </motion.div>
            ))}
          </AccordionPrimitive.Root>
        </motion.div>
      </div>
    </section>
  );
}
