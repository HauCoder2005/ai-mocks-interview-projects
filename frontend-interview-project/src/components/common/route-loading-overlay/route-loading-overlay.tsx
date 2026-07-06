import styles from "./route-loading-overlay.module.css";

type RouteLoadingOverlayProps = {
  text?: string;
};

export function RouteLoadingOverlay({
  text = "Đang tải dữ liệu...",
}: RouteLoadingOverlayProps) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.panel}>
        <span className={styles.spinner} aria-hidden="true" />
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
