import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import styles from "./input.module.css";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(styles.field, styles.input, className)}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = "Input";
