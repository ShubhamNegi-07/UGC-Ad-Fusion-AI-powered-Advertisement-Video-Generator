import { type FormEvent } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { studioReveal, studioStagger } from "@/components/ui/motion";
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
        "flex w-full items-center gap-3",
        compact ? "flex-row" : "flex-col sm:flex-row sm:justify-between",
      )}
    >
      <div className={cn("flex min-w-0 items-center text-sm", compact ? "shrink-0 gap-2" : "gap-3")}>
        {!compact && (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-muted text-brand">
            <HugeiconsIcon icon={Coins01Icon} size={18} strokeWidth={2} aria-hidden />
          </span>
        )}
        <div className="min-w-0 leading-tight">
          <p className={cn("font-medium text-foreground", compact && "whitespace-nowrap text-xs sm:text-sm")}>
            {compact ? "5 credits" : "Costs 5 credits"}
          </p>
          {!compact && (
            <p className="text-xs text-muted-foreground">
              {creditsHint ?? "Refunded automatically if the generation fails."}
            </p>
          )}
        </div>
      </div>
      {!isLoaded ? (
        <Skeleton className={cn("h-11 rounded-[var(--radius-md)]", compact ? "min-w-0 flex-1" : "w-full sm:w-44")} />
      ) : (
        <Button
          type="submit"
          form={compact ? formId : undefined}
          framer={false}
          variant="gradient"
          size="lg"
          className={cn("min-h-11", compact ? "min-w-0 flex-1" : "w-full sm:w-auto")}
          loading={isGenerating}
          loadingText="Generating image…"
          disabled={signedIn && !isValid}
          aria-describedby={creditsHintId}
        >
          <HugeiconsIcon icon={AiMagicIcon} size={18} strokeWidth={2} aria-hidden />
          {signedIn ? "Generate image" : "Sign in to generate"}
        </Button>
      )}
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
  hideStickyBar: _hideStickyBar,
  idPrefix = "",
}: GeneratorStudioViewProps) {
  const pid = (base: string) => `${idPrefix}${base}`;
  const formId = idPrefix ? `${idPrefix}${GENERATOR_FORM_ID}` : GENERATOR_FORM_ID;
  const creditsHintId = pid("generator-credits-hint");
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : studioReveal;
  const stagger = reduceMotion ? studioStagger(0, 0) : studioStagger(0.04, 0.05);

  return (
    <div id={rootId} className={cn("studio-shell relative overflow-x-clip pb-16 pt-nav", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-brand/[0.07] to-transparent"
        aria-hidden
      />
      <Title
        as="h1"
        studio
        align="left"
        heading="Generate an image"
        description="Upload a product and a model photo, then optionally turn the still into a talking video."
        className="mb-4 !text-left md:mb-10"
      />

      {statusBanner && <StatusBanner banner={statusBanner} />}

      <motion.ol
        variants={stagger}
        initial="hidden"
        animate="show"
        aria-label="Steps"
        className="mb-5 grid grid-cols-3 gap-2 sm:mx-auto sm:mb-10 sm:max-w-3xl sm:gap-3"
      >
        {steps.map((s) => (
          <motion.li
            key={s.n}
            variants={enter}
            className="surface-panel flex min-w-0 items-center gap-2 rounded-[var(--radius-lg)] px-2 py-2 sm:gap-3 sm:px-4 sm:py-3"
          >
            <span className="font-mono text-[11px] text-muted-foreground">{s.n}</span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[11px] font-medium sm:text-sm">{s.title}</p>
              <p className="hidden truncate text-[10px] text-muted-foreground sm:block sm:text-[11px]">{s.desc}</p>
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
            <CardContent className="grid grid-cols-2 items-start gap-3 pb-5 lg:grid-cols-1 lg:gap-5 lg:pb-6">
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
            <CardContent className="grid gap-4 pb-5 sm:gap-5 sm:pb-6">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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
                      className="h-auto min-h-10 flex-col gap-0.5 px-1 py-2 sm:min-h-11 sm:py-2.5"
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

          <motion.div variants={enter} className="surface-panel rounded-[var(--radius-lg)] p-4">
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
    </div>
  );
}
