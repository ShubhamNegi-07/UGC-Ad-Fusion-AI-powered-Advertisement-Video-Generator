import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, ImageUpload01Icon, Tick02Icon } from "@/icons";
import toast from "react-hot-toast";
import type { UploadZoneProps } from "@/Types";
import { Label, FieldHint } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { spring, studioReveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 10;

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function UploadZone({ id, label, hint, file, onClear, onFile, disabled, studio }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    setPreviewLoaded(false);
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const accept = (candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED.includes(candidate.type)) {
      toast.error("Please use a JPG, PNG or WEBP image.");
      return;
    }
    if (candidate.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_MB} MB.`);
      return;
    }
    onFile(candidate);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    accept(e.dataTransfer.files?.[0]);
  };

  const open = () => !disabled && inputRef.current?.click();

  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id} className="justify-between">
        {label}
        {hint && <FieldHint>{hint}</FieldHint>}
      </Label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={file ? `${label}: ${file.name}. Press Enter to replace.` : `${label}: choose an image`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "group relative aspect-square w-full min-h-0 cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-dashed transition-[border-color,background-color,box-shadow] duration-200 outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          studio
            ? file
              ? "border-solid border-border bg-muted"
              : "border-border bg-card hover:border-brand/40 hover:bg-muted/80"
            : file
              ? "border-solid border-white/15 bg-black/30"
              : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]",
          dragging &&
            (studio
              ? "border-brand/50 bg-muted shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_25%,transparent)]"
              : "border-zinc-300/50 bg-white/[0.06] shadow-[0_0_0_4px_rgb(255_255_255/0.08)]"),
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {file && previewUrl ? (
            <motion.div
              key="preview"
              initial={studio ? { opacity: 1, scale: 1.02 } : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: studio ? 1 : 0 }}
              transition={spring}
              className="absolute inset-0"
            >
              {!previewLoaded && <Skeleton className="absolute inset-0 z-0 rounded-none" />}
              <img
                src={previewUrl}
                alt={`${label} preview`}
                width={512}
                height={512}
                loading="lazy"
                decoding="async"
                onLoad={() => setPreviewLoaded(true)}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-300",
                  previewLoaded ? "opacity-100" : "opacity-0",
                )}
              />
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 p-3 pt-10",
                  studio ? "bg-card/95 border-t border-border" : "bg-gradient-to-t from-black/85 via-black/40 to-transparent",
                )}
              >
                <p className="truncate text-xs font-medium">{file.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              <span
                className={cn(
                  "absolute left-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  studio
                    ? "border border-brand/30 bg-brand/10 text-brand-muted"
                    : "bg-brand/20 text-brand-muted backdrop-blur",
                )}
              >
                <HugeiconsIcon icon={Tick02Icon} size={10} strokeWidth={3} />
                Ready
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                aria-label={`Remove ${label}`}
                className={cn(
                  "absolute right-2.5 top-2.5 flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  studio
                    ? "border border-border bg-card text-foreground hover:border-destructive hover:bg-destructive/15 hover:text-destructive"
                    : "size-7 bg-black/60 text-white/80 backdrop-blur hover:bg-red-500/80 hover:text-white focus-visible:ring-ring/70",
                )}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2.4} />
              </button>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    studio ? "border-border bg-card text-foreground" : "border-white/20 bg-black/50 backdrop-blur",
                  )}
                >
                  Replace
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              variants={studio ? studioReveal : undefined}
              initial={studio ? "hidden" : { opacity: 0 }}
              animate={studio ? "show" : { opacity: 1 }}
              exit={{ opacity: studio ? 1 : 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center sm:gap-3 sm:p-4"
            >
              <motion.span
                animate={dragging ? { scale: 1.04, y: -2 } : { scale: 1, y: 0 }}
                transition={spring}
                className={cn(
                  "flex size-9 items-center justify-center rounded-[var(--radius-md)] border transition-colors sm:size-12",
                  studio
                    ? "border-border bg-muted text-brand"
                    : "border-white/10 bg-white/[0.05] text-zinc-300 group-hover:border-white/20",
                )}
              >
                <HugeiconsIcon icon={ImageUpload01Icon} size={22} strokeWidth={1.8} />
              </motion.span>
              <div>
                <p className="text-xs font-medium sm:text-sm">
                  {dragging ? "Drop to upload" : "Add image"}
                </p>
                <p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:mt-1 sm:block">
                  JPG, PNG, WEBP · up to {MAX_MB} MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
