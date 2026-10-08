import generateUi from "../../../baseline-screenshots/generate-1440.png";
import { assets } from "@/assets/assets";

const steps = [
  { title: "Upload", caption: "Product + model in Generator", image: assets.product7, kind: "asset" as const },
  { title: "Still", caption: "Fused photoreal frame", image: assets.generated1, kind: "asset" as const },
  { title: "Video", caption: "Talking-head clip", image: assets.generatedVideo1, kind: "video" as const },
];

export default function WorkflowStory() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <article
            key={step.title}
            className="workflow-step overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-sm"
            style={{ animationDelay: `${120 + i * 100}ms` }}
          >
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {i + 1}</p>
              <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.caption}</p>
            </div>
            <div className="aspect-[4/3] bg-muted">
              {step.kind === "video" ? (
                <video
                  src={step.image}
                  poster={assets.generated1}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img src={step.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          </article>
        ))}
      </div>
      <figure className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-sm">
        <figcaption className="border-b border-border px-4 py-3 text-sm text-muted-foreground">
          Our Generator UI (baseline capture — real app chrome)
        </figcaption>
        <img src={generateUi} alt="" className="w-full" />
      </figure>
    </div>
  );
}
