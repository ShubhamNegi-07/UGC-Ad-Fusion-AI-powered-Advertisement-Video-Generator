import { Button, type ButtonProps } from "@/components/ui/button";

/** Compatibility wrappers around the shadcn-style Button primitive. */
export const PrimaryButton = ({ variant = "gradient", ...props }: ButtonProps) => (
  <Button variant={variant} {...props} />
);

export const GhostButton = ({ variant = "outline", ...props }: ButtonProps) => (
  <Button variant={variant} {...props} />
);
