import { useState } from "react";
import toast from "react-hot-toast";
import { useClerk } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HomePreview from "@/components/styleguide/HomePreview";
import WorkflowStory from "@/components/styleguide/WorkflowStory";
import { brandAccents, type BrandAccentId } from "@/lib/brand-accents";
import creatifyHomeRef from "../../design-refs/creatify/creatify-home-1440.png";

const headline = "Turn one product photo into a UGC-style ad";

const semanticTokens = [
  { name: "Success", fg: "#15803D", bg: "#FFFFFF", onBg: "#F0FDF4" },
  { name: "Warning", fg: "#A16207", bg: "#FFFFFF", onBg: "#FFFBEB" },
  { name: "Destructive / error", fg: "#DC2626", bg: "#FFFFFF", onBg: "#FEF2F2" },
  { name: "Brand accent (locked cobalt)", fg: "#2563EB", bg: "#030712", onBg: "#0f172a" },
];

function contrastRatio(fg: string, bg: string) {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const a = lum(fg);
  const b = lum(bg);
  return ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
}

function SemanticStates() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Semantic states (distinct from accent)</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {semanticTokens.map((t) => (
          <div key={t.name} className="rounded-[var(--radius-lg)] border border-border p-4">
            <p className="text-sm font-medium">{t.name}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              on white: {contrastRatio(t.fg, t.bg)}:1 · on tint: {contrastRatio(t.fg, t.onBg)}:1
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={t.name.startsWith("Success") ? "success" : t.name.startsWith("Warning") ? "warning" : t.name.startsWith("Destructive") ? "destructive" : "primary"}>
                {t.name.split(" ")[0]}
              </Badge>
              {t.name.startsWith("Destructive") && (
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Swatch({ name, css }: { name: string; css: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="size-10 shrink-0 rounded-[var(--radius-sm)] border border-border" style={{ background: css }} />
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{css}</p>
      </div>
    </div>
  );
}

function ModePanel({
  mode,
  title,
  accent,
}: {
  mode: "marketing" | "studio";
  title: string;
  accent?: BrandAccentId;
}) {
  const accentWrap = accent && mode === "marketing" ? `brand-accent-${accent}` : "";

  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border border-border p-6 md:p-8",
        mode === "marketing" ? "mode-marketing" : "mode-studio",
        accentWrap,
      )}
    >
      <h2 className="mb-6 text-xl font-semibold tracking-tight">{title}</h2>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Swatch name="Background" css="#030712" />
        <Swatch name="Card" css="rgb(15 23 42 / 0.78)" />
        <Swatch name="Brand" css={accent ? brandAccents[accent].brand : "#2563EB"} />
        <Swatch name="Muted text" css="#94a3b8" />
      </div>

      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Geist — display scale</p>
        <p className="text-[length:var(--text-display)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
          {headline}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Button variant="default">Primary</Button>
        <Button variant="default" className="rounded-full px-6 uppercase tracking-wide">
          Pill CTA
        </Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="default" loading loadingText="Loading">
          Load
        </Button>
        <Button variant="default" disabled>
          Disabled
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="destructive">Error</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>

      <div className="mb-8 grid max-w-md gap-3">
        <Input placeholder="Input field" />
        <Textarea placeholder="Textarea" rows={3} />
      </div>

      <Card className="mb-8 max-w-md">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Shared radius, border, and shadow rhythm.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm" variant="outline">
            <HugeiconsIcon icon={SparklesIcon} size={14} />
            Card action
          </Button>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>Focus trap, escape to close, surface-aware panel.</DialogDescription>
          </DialogHeader>
          <Button className="w-full">Confirm</Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

const matchesCreatify = [
  "Full-width sticky header with logo left, links center/right, pill primary CTA",
  "Hero: split grid — copy left, product UI collage / video right",
  "White page background, zinc borders, soft card shadows",
  "~1200px content max-width, 16–24px horizontal padding, 48–64px section rhythm",
  "Large bold sans headline (~64px+ at desktop), muted body copy",
  "Rounded-full uppercase primary buttons; rounded-xl/2xl cards",
  "Long home scroll: social proof, feature pillars, toolkit grid, case studies, footer columns",
];

const differentCreatify = [
  "Accent: cobalt blue or crimson (not Creatify purple/lavender)",
  "Typography: Geist only (they use a distinct display sans)",
  "Copy, logo, and all imagery from UGC Ad Fusion outputs",
  "Hero collage uses our upload + still + 9:16 generated video",
  "Signature brand-ring pulse on hero video (our motion)",
  "Studio routes stay matte dark with same token scale",
];

export default function Styleguide() {
  const { openSignIn } = useClerk();
  const [accent, setAccent] = useState<BrandAccentId>("cobalt");

  return (
    <div className="container-marketing pb-20 pt-nav">
      <div className="space-y-12">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Phase 3 — Creatify-style foundation</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Temporary route. Marketing tokens + studio tokens, component states, home top preview, and Creatify reference
            comparison. No production Home/Plans redesign yet.
          </p>
        </header>

        <SemanticStates />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Accent (locked: cobalt blue)</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(brandAccents) as BrandAccentId[]).map((id) => (
              <Button
                key={id}
                variant={accent === id ? "default" : "outline"}
                size="sm"
                className={accent === id ? "rounded-full" : ""}
                onClick={() => setAccent(id)}
              >
                {brandAccents[id].label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Preview below uses selected accent. Production marketing and studio both use locked cobalt (#2563EB).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Home top preview vs Creatify (1440 reference)</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Creatify.ai (reference)</p>
              <img
                src={creatifyHomeRef}
                alt=""
                className="rounded-[var(--radius-lg)] border border-border shadow-sm"
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">UGC Ad Fusion preview</p>
              <HomePreview accent={accent} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Signature: Upload → Still → Video</h2>
          <WorkflowStory />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-border p-5">
            <h3 className="font-semibold">Matches Creatify (structure / feel)</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {matchesCreatify.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-border p-5">
            <h3 className="font-semibold">Different from Creatify (on purpose)</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {differentCreatify.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <ModePanel mode="marketing" title="Marketing components (light)" accent={accent} />
        <ModePanel mode="studio" title="Studio components (matte dark)" />

        <section className="surface-panel rounded-[var(--radius-lg)] p-6">
          <h2 className="text-lg font-semibold">Clerk</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign-in modal uses surface-aware variables from <code className="font-mono text-xs">clerkAppearance()</code>.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => openSignIn()}>
            Test sign in
          </Button>
        </section>

        <section className="surface-panel rounded-[var(--radius-lg)] p-6">
          <h2 className="text-lg font-semibold">Toast</h2>
          <Button className="mt-4" onClick={() => toast.success("Saved to your account")}>
            Show success toast
          </Button>
        </section>

        <section className="text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">Screenshots</h2>
          <p className="mt-2">
            Capture with <code className="font-mono text-xs">node scripts/capture-styleguide.mjs</code> after{" "}
            <code className="font-mono text-xs">npm run build</code>. Outputs:{" "}
            <code className="font-mono text-xs">baseline-screenshots/styleguide-375.png</code>,{" "}
            <code className="font-mono text-xs">styleguide-1440.png</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
