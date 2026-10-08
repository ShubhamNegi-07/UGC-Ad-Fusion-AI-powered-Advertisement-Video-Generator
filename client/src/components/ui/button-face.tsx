import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import FramerButtonArrow from "@/components/ui/FramerButtonArrow";
import { cn } from "@/lib/utils";

function isLeadingIcon(child: React.ReactNode): boolean {
  if (!React.isValidElement(child)) return false;
  const props = child.props as Record<string, unknown>;
  if (props["aria-hidden"] === true) return true;
  return "icon" in props && props.icon != null;
}

function stripDecorativeIcons(nodes: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(nodes).filter((child) => !isLeadingIcon(child));
}

export function ButtonFace({
  children,
  loading,
  iconOnly,
  className,
}: {
  children?: React.ReactNode;
  loading?: boolean;
  iconOnly?: boolean;
  className?: string;
}) {
  const label = stripDecorativeIcons(children);
  const hasLabel = !iconOnly && label.length > 0;

  return (
    <span className={cn("btn-framer-face", iconOnly && "btn-framer-face-icon-only", className)}>
      <span className="btn-framer-icon" aria-hidden={!loading}>
        {loading ? (
          <HugeiconsIcon icon={Loading03Icon} size={18} strokeWidth={2} className="animate-spin" />
        ) : (
          <FramerButtonArrow className="btn-framer-icon-chevron" />
        )}
      </span>
      {hasLabel ? <span className="btn-framer-label">{label}</span> : null}
      <span className="btn-framer-marquee" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <FramerButtonArrow
            key={i}
            className="btn-framer-marquee-chevron"
            style={{ ["--chevron-i" as string]: i }}
          />
        ))}
      </span>
    </span>
  );
}
