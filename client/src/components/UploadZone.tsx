import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, ImageUpload01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";
import type { UploadZoneProps } from "@/Types";
import { Label, FieldHint } from "@/components/ui/label";
import { spring } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 10;

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function UploadZone({ id, label, hint, file, onClear, onFile, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
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
          "group relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-dashed transition-[border-color,background-color,box-shadow] duration-200 outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          file
            ? "border-solid border-white/15 bg-black/30"
            : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]",
          dragging && "border-zinc-300/50 bg-white/[0.06] shadow-[0_0_0_4px_rgb(255_255_255/0.08)]",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {file && previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={spring}
              className="absolute inset-0"
            >
              <img src={previewUrl} alt={`${label} preview`} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
                <p className="truncate text-xs font-medium">{file.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-white/60">{formatSize(file.size)}</p>
              </div>
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200 backdrop-blur">
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
                className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur transition-colors hover:bg-red-500/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2.4} />
              </button>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs backdrop-blur">
                  Replace
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center"
            >
              <motion.span
                animate={dragging ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
                transition={spring}
                className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-300 transition-colors group-hover:border-white/20"
              >
                <HugeiconsIcon icon={ImageUpload01Icon} size={22} strokeWidth={1.8} />
              </motion.span>
              <div>
                <p className="text-sm font-medium">
                  {dragging ? "Drop to upload" : "Click or drop image"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">JPG, PNG, WEBP · up to {MAX_MB} MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
