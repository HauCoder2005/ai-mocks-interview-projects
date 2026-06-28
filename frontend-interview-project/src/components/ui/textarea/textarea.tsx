import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import styles from "./textarea.module.css";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <textarea
      className={cn(styles.field, styles.textarea, className)}
      ref={ref}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
