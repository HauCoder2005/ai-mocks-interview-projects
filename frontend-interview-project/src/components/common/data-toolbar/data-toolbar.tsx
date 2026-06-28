import type { ReactNode } from "react";

import styles from "./data-toolbar.module.css";

type DataToolbarProps = {
  title?: string;
  description?: string;
  filters?: ReactNode;
  actions?: ReactNode;
};

export function DataToolbar({
  actions,
  description,
  filters,
  title,
}: DataToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      <div className={styles.controls}>
        {filters}
        {actions}
      </div>
    </div>
  );
}
