import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ArrowDown01Icon, Image02Icon, Video02Icon } from "@hugeicons/core-free-icons";
import { Accordion as AccordionPrimitive } from "radix-ui";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plansFaq = [
  {
    question: "How are credits consumed?",
    answer:
      "Still images cost 5 credits and talking videos cost 10, enforced in the API. Failed image runs refund 5 credits; failed video runs attempt to refund 10 credits.",
  },
  {
    question: "What do new accounts get?",
    answer: "Every user row in our database starts with 20 credits (@default(20) in Prisma). No card is required to try Generator.",
  },
  {
    question: "Can I buy a paid plan here?",
    answer:
      "Not yet. Paid tiers are coming soon. There is no checkout button on this page and Plans does not charge cards today.",
  },
  {
    question: "What files can I upload?",
    answer: "JPG, PNG and WEBP up to 10 MB each in Generator. Outputs are PNG stills and MP4 videos from the API.",
  },
];

export default function Plans() {
  return (
    <div className="bg-background pb-[var(--space-section)] pt-nav">
      <div className="container-marketing">
        <Title
          marketing
          as="h1"
          title="Pricing"
          heading="Start free, upgrade when we ship billing"
          description="Only the free tier is active in the app today. Paid plans stay disabled until checkout and server slugs are aligned."
          className="mb-10 md:mb-14"
        />

        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <article className="relative flex flex-col rounded-[var(--radius-xl)] border-2 border-brand bg-card p-6 shadow-md">
            <Badge className="mb-4 w-fit border-0 bg-brand text-brand-foreground">Active</Badge>
            <h2 className="marketing-display text-2xl font-semibold tracking-tight text-foreground">Free</h2>
            <p className="mt-2 text-sm text-muted-foreground">Included with every new account — no checkout.</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={Image02Icon} size={18} strokeWidth={2} />
                </span>
                <span>
                  <span className="font-medium text-foreground">Still image</span> — 5 credits each
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={Video02Icon} size={18} strokeWidth={2} />
                </span>
                <span>
                  <span className="font-medium text-foreground">Talking video</span> — 10 credits each
                </span>
              </li>
              <li className="rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-sm tabular-nums text-foreground">
                20 credits to start
              </li>
            </ul>
            <Button asChild size="lg" className="mt-8 w-full rounded-full">
              <Link to="/generate">
                Start generating free
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2} />
              </Link>
            </Button>
          </article>

          <article className="flex flex-col rounded-[var(--radius-xl)] border border-border bg-muted/20 p-6">
            <Badge variant="outline" className="mb-4 w-fit">
              Coming soon
            </Badge>
            <h2 className="marketing-display text-2xl font-semibold tracking-tight text-foreground">Paid plans</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Credit packs and checkout will appear here after we verify prices, slug names, and Clerk billing with the
              server webhook.
            </p>
            <Button type="button" size="lg" variant="outline" className="mt-8 w-full rounded-full" disabled>
              Coming soon
            </Button>
          </article>
        </div>

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="marketing-display text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            FAQ
          </h2>
          <AccordionPrimitive.Root type="single" collapsible className="mt-8 space-y-3">
            {plansFaq.map((faq, i) => (
              <AccordionPrimitive.Item
                key={faq.question}
                value={`plan-faq-${i}`}
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
        </section>
      </div>
    </div>
  );
}
