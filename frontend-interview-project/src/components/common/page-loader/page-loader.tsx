import styles from "./page-loader.module.css";

type PageLoaderProps = {
  text?: string;
};

export function PageLoader({ text = "Đang tải dữ liệu..." }: PageLoaderProps) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.spinner} aria-hidden="true" />
        <p>{text}</p>
      </div>
    </div>
  );
}
