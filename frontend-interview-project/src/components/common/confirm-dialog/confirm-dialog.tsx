import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import styles from "./confirm-dialog.module.css";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  description,
  isLoading = false,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title}>
      {description ? (
        <p className={styles.description}>{description}</p>
      ) : null}
      <div className={styles.actions}>
        <Button onClick={onCancel} type="button" variant="secondary">
          {cancelLabel}
        </Button>
        <Button
          isLoading={isLoading}
          onClick={onConfirm}
          type="button"
          variant="danger"
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
