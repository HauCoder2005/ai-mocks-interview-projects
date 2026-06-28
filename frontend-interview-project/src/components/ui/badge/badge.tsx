import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import styles from "./badge.module.css";

type BadgeVariant = "default" | "primary" | "success" | "danger" | "warning";

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
        styles.badge,
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
