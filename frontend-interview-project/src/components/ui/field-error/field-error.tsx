import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import styles from "./field-error.module.css";

type FieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  message?: string;
};

export function FieldError({ className, message, ...props }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className={cn(styles.error, className)} {...props}>
      {message}
    </p>
  );
}
