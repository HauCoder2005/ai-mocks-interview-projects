import styles from "./page-loading.module.css";

type PageLoadingProps = {
  text?: string;
};

export function PageLoading({ text = "Đang tải..." }: PageLoadingProps) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.spinner} aria-hidden="true" />
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
