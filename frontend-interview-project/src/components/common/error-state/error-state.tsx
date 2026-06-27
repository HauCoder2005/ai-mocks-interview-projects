import type { ReactNode } from "react";

import styles from "./error-state.module.css";

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function ErrorState({
  action,
  description = "Something went wrong. Please try again.",
  title = "Unable to load data",
}: ErrorStateProps) {
  return (
    <div className={styles.errorState}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
