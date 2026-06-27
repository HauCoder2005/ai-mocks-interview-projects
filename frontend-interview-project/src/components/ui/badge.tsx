import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import { badgeVariants } from "@/lib/styles/variants";

type BadgeVariant = keyof typeof badgeVariants;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
