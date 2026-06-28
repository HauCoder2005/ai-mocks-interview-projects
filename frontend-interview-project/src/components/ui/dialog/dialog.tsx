import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";
import styles from "./dialog.module.css";

type DialogProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  title?: string;
  children: ReactNode;
};

export function Dialog({ children, className, open, title, ...props }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div
        className={cn(styles.panel, className)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        {...props}
      >
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}
