import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import styles from "./select.module.css";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
    <select
      className={cn(styles.field, styles.select, className)}
      ref={ref}
      {...props}
    />
  ),
);

Select.displayName = "Select";
