import styles from "./admin-ui.module.css";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  confirmLabel = "Delete",
  description,
  isConfirming = false,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <div className={styles.overlay} role="alertdialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.muted}>{description}</p>
        </header>
        <footer className={styles.modalFooter}>
          <button
            className={styles.secondaryButton}
            disabled={isConfirming}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={styles.dangerButton}
            disabled={isConfirming}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
