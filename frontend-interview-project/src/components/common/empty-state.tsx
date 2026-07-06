import type { ReactNode } from "react";

import styles from "./empty-state.module.css";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>AI</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action}
    </div>
  );
}
