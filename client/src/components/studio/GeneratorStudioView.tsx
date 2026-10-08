import { type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  Alert02Icon,
  Coins01Icon,
  ComputerIcon,
  SmartPhone01Icon,
  SquareIcon,
} from "@hugeicons/core-free-icons";
import Title from "@/components/Title";
import UploadZone from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label, FieldHint } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studioReveal, studioStagger } from "@/components/ui/motion";
import { useVisualViewportInset } from "@/hooks/useVisualViewportInset";
import { cn } from "@/lib/utils";

export const GENERATOR_FORM_ID = "generator-form";

const ratios = [
  { value: "9:16", label: "Portrait", hint: "Reels · Shorts", icon: SmartPhone01Icon },
  { value: "1:1", label: "Square", hint: "Feed", icon: SquareIcon },
  { value: "16:9", label: "Landscape", hint: "YouTube", icon: ComputerIcon },
];

const steps = [
  { n: "01", title: "Upload", desc: "Product and model photos" },
  { n: "02", title: "Describe", desc: "Name, details, optional prompt" },
  { n: "03", title: "Generate", desc: "Image now, video after" },
];

export type GeneratorStatusBanner = {
  variant: "error" | "warning" | "info";
  message: string;
  live?: "polite" | "assertive";
};

export type GeneratorStudioViewProps = {
  name: string;
  setName: (v: string) => void;
  productName: string;
  setProductName: (v: string) => void;
  productDescription: string;
  setProductDescription: (v: string) => void;
  aspectRatio: string;
  setAspectRatio: (v: string) => void;
  productImage: File | null;
  setProductImage: (f: File | null) => void;
  modelImage: File | null;
  setModelImage: (f: File | null) => void;
  userPrompt: string;
  setUserPrompt: (v: string) => void;
  isGenerating: boolean;
  isValid: boolean;
  isLoaded: boolean;
  signedIn: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  /** Dev / mock only — not used in production Generator page. */
  statusBanner?: GeneratorStatusBanner | null;
  /** Dev / mock only — e.g. insufficient credits copy. */
  creditsHint?: string | null;
  className?: string;
  /** Wrap sections for dev screenshots (optional id). */
  rootId?: string;
  hideStickyBar?: boolean;
  /** Prefix field ids when multiple forms on one page (dev only). */
  idPrefix?: string;
};

function CreditsAndSubmit({
  signedIn,
  isLoaded,
  isValid,
  isGenerating,
  compact,
  creditsHint,
  formId,
  creditsHintId,
}: {
  signedIn: boolean;
  isLoaded: boolean;
  isValid: boolean;
  isGenerating: boolean;
  compact?: boolean;
  creditsHint?: string | null;
  formId?: string;
  creditsHintId: string;
}) {
  return (
    <div
      className={cn(
        compact ? "flex flex-col gap-3" : "flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div className="flex min-w-0 items-center gap-3 text-sm">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-muted text-brand">
          <HugeiconsIcon icon={Coins01Icon} size={18} strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="font-medium text-foreground">Costs 5 credits</p>
          {!compact && (
            <p className="text-xs text-muted-foreground">
              {creditsHint ?? "Refunded automatically if the generation fails."}
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        form={compact ? formId : undefined}
        variant="gradient"
        size="lg"
        className="min-h-11 w-full sm:w-auto"
        loading={isGenerating}
        loadingText="Generating image…"
        disabled={isLoaded && signedIn && !isValid}
        aria-describedby={creditsHintId}
      >
        <HugeiconsIcon icon={AiMagicIcon} size={18} strokeWidth={2} aria-hidden />
        {signedIn ? "Generate image" : "Sign in to generate"}
      </Button>
    </div>
  );
}

function StatusBanner({ banner }: { banner: GeneratorStatusBanner }) {
  const styles =
    banner.variant === "error"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : banner.variant === "warning"
        ? "border-amber-600/45 bg-amber-500/15 text-foreground"
        : "border-border bg-muted text-foreground";

  const isAlert = banner.variant === "error";
  return (
    <div
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? undefined : (banner.live ?? "polite")}
      className={cn("mb-6 flex gap-2.5 rounded-[var(--radius-lg)] border px-4 py-3 text-sm", styles)}
    >
      <HugeiconsIcon icon={Alert02Icon} size={18} className="mt-0.5 shrink-0" aria-hidden />
      <span>{banner.message}</span>
    </div>
  );
}

export default function GeneratorStudioView({
  name,
  setName,
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  aspectRatio,
  setAspectRatio,
  productImage,
  setProductImage,
  modelImage,
  setModelImage,
  userPrompt,
  setUserPrompt,
  isGenerating,
  isValid,
  isLoaded,
  signedIn,
  onSubmit,
  statusBanner,
  creditsHint,
  className,
  rootId,
  hideStickyBar,
  idPrefix = "",
}: GeneratorStudioViewProps) {
  useVisualViewportInset();
  const pid = (base: string) => `${idPrefix}${base}`;
  const formId = idPrefix ? `${idPrefix}${GENERATOR_FORM_ID}` : GENERATOR_FORM_ID;
  const creditsHintId = pid("generator-credits-hint");
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.04, 0.05);

  let stickyBar: ReactNode = null;
  if (!hideStickyBar) {
    stickyBar = (
      <div
        className="surface-panel studio-sticky-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border px-4 py-3 lg:hidden"
        data-lenis-prevent
      >
        <CreditsAndSubmit
          signedIn={signedIn}
          isLoaded={isLoaded}
          isValid={isValid}
          isGenerating={isGenerating}
          compact
          creditsHint={creditsHint}
          formId={formId}
          creditsHintId={creditsHintId}
        />
      </div>
    );
  }

  return (
    <div id={rootId} className={cn("studio-shell studio-shell-bottom studio-scroll-pad pt-nav", className)}>
      <Title
        as="h1"
        studio
        align="left"
        heading="Generate an in-context product image"
        description="Upload your product and a model. We produce a photoreal still first, then you can turn it into a talking video on the result page."
        className="mb-8 !text-left md:mb-10"
      />

      {statusBanner && <StatusBanner banner={statusBanner} />}

      <motion.ol
        variants={stagger}
        initial="hidden"
        animate="show"
        aria-label="Steps"
        className="mb-8 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-auto sm:mb-10 sm:max-w-3xl sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((s) => (
          <motion.li
            key={s.n}
            variants={enter}
            className="surface-panel flex min-w-[9.75rem] shrink-0 snap-start items-center gap-3 rounded-[var(--radius-lg)] px-3 py-3 sm:min-w-0 sm:px-4"
          >
            <span className="font-mono text-[11px] text-muted-foreground">{s.n}</span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium sm:text-sm">{s.title}</p>
              <p className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{s.desc}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>

      <motion.form
        id={formId}
        onSubmit={onSubmit}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start"
        aria-busy={isGenerating}
      >
        <motion.div variants={enter}>
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle>Source images</CardTitle>
              <CardDescription>Clear, well-lit photos give the best fusion.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 pb-6 sm:grid-cols-2 lg:grid-cols-1">
              <UploadZone
                id={pid("product-image")}
                label="Product image"
                hint="Required"
                file={productImage}
                onFile={setProductImage}
                onClear={() => setProductImage(null)}
                disabled={isGenerating}
                studio
              />
              <UploadZone
                id={pid("model-image")}
                label="Model image"
                hint="Required"
                file={modelImage}
                onFile={setModelImage}
                onClear={() => setModelImage(null)}
                disabled={isGenerating}
                studio
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={enter} className="flex flex-col gap-6">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Tell the model what it is looking at.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 pb-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor={pid("name")}>Project name</Label>
                  <Input
                    id={pid("name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Summer launch · Reel 01"
                    autoComplete="off"
                    required
                    disabled={isGenerating}
                    className="min-h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={pid("productName")}>Product name</Label>
                  <Input
                    id={pid("productName")}
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Mango candy pack"
                    autoComplete="off"
                    required
                    disabled={isGenerating}
                    className="min-h-11"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={pid("productDescription")} className="justify-between">
                  Product description
                  <FieldHint>Optional</FieldHint>
                </Label>
                <Textarea
                  id={pid("productDescription")}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Material, colour, size, key selling points…"
                  maxLength={500}
                  disabled={isGenerating}
                />
                <p className="text-right font-mono text-[11px] text-muted-foreground">{productDescription.length}/500</p>
              </div>

              <div className="grid gap-2.5">
                <Label id={pid("aspect-label")}>Aspect ratio</Label>
                <ToggleGroup
                  type="single"
                  value={aspectRatio}
                  onValueChange={(v) => v && setAspectRatio(v)}
                  aria-labelledby={pid("aspect-label")}
                  className="grid w-full grid-cols-3"
                  disabled={isGenerating}
                >
                  {ratios.map((r) => (
                    <ToggleGroupItem
                      key={r.value}
                      value={r.value}
                      aria-label={`${r.label} ${r.value}`}
                      className="min-h-11 h-auto flex-col gap-1 py-2.5"
                    >
                      <HugeiconsIcon icon={r.icon} size={18} strokeWidth={1.8} aria-hidden />
                      <span className="text-xs font-medium">{r.label}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{r.value}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={pid("userPrompt")} className="justify-between">
                  Creative direction
                  <FieldHint>Optional</FieldHint>
                </Label>
                <Textarea
                  id={pid("userPrompt")}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g. Bright kitchen, morning light, model smiling and holding the pack near the face."
                  maxLength={400}
                  disabled={isGenerating}
                />
              </div>
            </CardContent>
          </Card>

          <motion.div variants={enter} className="surface-panel hidden rounded-[var(--radius-lg)] p-4 lg:block">
            <p id={creditsHintId} className="sr-only">
              Image generation costs five credits.
            </p>
            <CreditsAndSubmit
              signedIn={signedIn}
              isLoaded={isLoaded}
              isValid={isValid}
              isGenerating={isGenerating}
              creditsHint={creditsHint}
              formId={formId}
              creditsHintId={creditsHintId}
            />
          </motion.div>
        </motion.div>
      </motion.form>

      {stickyBar}
    </div>
  );
}
