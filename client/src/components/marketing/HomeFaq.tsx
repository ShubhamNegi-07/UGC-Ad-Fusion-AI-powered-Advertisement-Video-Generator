import { Accordion as AccordionPrimitive } from "radix-ui";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import Title from "@/components/Title";

const homeFaq = [
  {
    question: "How does generation work?",
    answer:
      "AI blends your product and model photos into one scene, then can animate that frame into a talking video with generated speech.",
  },
  {
    question: "Do I own the outputs?",
    answer: "You can use images and videos you generate in your own marketing campaigns.",
  },
  {
    question: "How are credits consumed?",
    answer:
      "Still images cost 5 credits and talking videos cost 10. If a run fails, we refund the credits for that step when possible.",
  },
  {
    question: "What files can I upload?",
    answer: "JPG, PNG and WEBP up to 10 MB each. Outputs are PNG stills and MP4 videos.",
  },
  {
    question: "How do I change or cancel a paid plan?",
    answer:
      "Paid packs and self-serve checkout are not live yet. The free tier and Plans page reflect what you can use in the app today.",
  },
];

export default function HomeFaq() {
  return (
    <section id="faq" className="py-[var(--space-section)]">
      <div className="container-marketing max-w-3xl">
        <Title
          marketing
          title="FAQ"
          heading="Frequently asked questions"
          description="Straight answers about credits, files, and ownership."
        />
        <AccordionPrimitive.Root type="single" collapsible className="space-y-3">
          {homeFaq.map((faq, i) => (
            <AccordionPrimitive.Item
              key={faq.question}
              value={`item-${i}`}
              className="rounded-[var(--radius-lg)] border border-border bg-card shadow-sm"
            >
              <AccordionPrimitive.Header asChild>
                <h3>
                  <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 rounded-[var(--radius-lg)] px-5 py-4 text-left text-[15px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {faq.question}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180">
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} />
                    </span>
                  </AccordionPrimitive.Trigger>
                </h3>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
