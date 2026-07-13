import styles from "./mock-tests.module.css";

export function MockTestProgress({
  answeredCount,
  totalQuestions,
}: {
  answeredCount: number;
  totalQuestions: number;
}) {
  const percentage = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  return (
    <div className={styles.sidebarSection}>
      <div className={styles.sidebarSectionHeading}>
        <h2>Tiến độ</h2>
        <span>{percentage}%</span>
      </div>
      <p className={styles.progressSummary}>
        Đã hoàn thành {answeredCount}/{totalQuestions} câu
      </p>
      <div
        aria-label={`Đã hoàn thành ${percentage}%`}
        className={styles.sidebarProgressBar}
        role="progressbar"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percentage}
      >
        <span style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
