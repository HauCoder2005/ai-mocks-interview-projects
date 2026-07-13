import styles from "./mock-tests.module.css";

export function MockTestEmptyState({ detail = false }: { detail?: boolean }) {
  return <section className={styles.panel}>{detail ? "Bài kiểm tra này chưa có câu hỏi." : "Chưa có bài kiểm tra nào được công bố."}</section>;
}
