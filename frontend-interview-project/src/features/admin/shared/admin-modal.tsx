import type { ReactNode } from "react";

import styles from "./admin-ui.module.css";

type AdminModalProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
};

export function AdminModal({
  children,
  description,
  footer,
  onClose,
  title,
}: AdminModalProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 className={styles.cardTitle}>{title}</h2>
          {description ? <p className={styles.muted}>{description}</p> : null}
        </header>
        <div className={styles.modalBody}>{children}</div>
        <footer className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={onClose} type="button">
            Cancel
          </button>
          {footer}
        </footer>
      </div>
    </div>
  );
}
