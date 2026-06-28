import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import styles from "./label.module.css";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn(styles.label, className)} {...props} />
  );
}
