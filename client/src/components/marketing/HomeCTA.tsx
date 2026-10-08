import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function HomeCTA() {
  return (
    <section className="container-marketing pb-[var(--space-section)]">
      <div className="rounded-[var(--radius-xl)] border border-border bg-muted/40 px-6 py-14 text-center md:px-12">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ready to make your first ad?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-[15px] text-muted-foreground">
          Sign up, get 20 free credits, and run your first still — then add a talking video when you are happy with the
          frame. No credit card required.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full px-8 uppercase tracking-wide">
          <Link to="/generate">
            Start creating now
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
