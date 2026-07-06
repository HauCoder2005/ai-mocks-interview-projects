import styles from "./route-loading.module.css";

type RouteLoadingProps = {
  text?: string;
};

export function RouteLoading({ text = "Đang tải..." }: RouteLoadingProps) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.spinner} aria-hidden="true" />
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
