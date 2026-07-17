import styles from "./mock-tests.module.css";

export function MockTestErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className={styles.error}>
      <p>{message || "Không thể tải bài kiểm tra."}</p>
      {onRetry ? <button className={styles.secondaryButton} onClick={onRetry} type="button">Thử lại</button> : null}
    </div>
  );
}
