import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image02Icon, Video02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";

export default function HomePricingSummary() {
  return (
    <section id="pricing" className="border-t border-border bg-muted/30 py-[var(--space-section)]">
      <div className="container-marketing max-w-3xl text-center">
        <Title
          marketing
          title="Pricing"
          heading="Credits you can verify"
          description="Every new account starts with 20 free credits in our database. Generation costs are enforced in the API."
        />
        <ul className="mx-auto grid max-w-md gap-3 text-left sm:grid-cols-2">
          <li className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <HugeiconsIcon icon={Image02Icon} size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Still image</p>
              <p className="font-mono text-sm tabular-nums text-muted-foreground">5 credits</p>
            </div>
          </li>
          <li className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <HugeiconsIcon icon={Video02Icon} size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Talking video</p>
              <p className="font-mono text-sm tabular-nums text-muted-foreground">10 credits</p>
            </div>
          </li>
        </ul>
        <p className="mx-auto mt-6 max-w-lg text-sm text-muted-foreground">
          Paid tiers and checkout are not wired from the Plans page yet — see full plan copy on{" "}
          <Link to="/plans" className="font-medium text-brand underline-offset-4 hover:underline">
            Plans
          </Link>
          . TODO: self-serve billing UI when Clerk checkout is connected.
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/plans">
            View plans
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
