import { EvaluateAnswerResponse } from "@/types/candidate-interview.type";

import styles from "./interview.module.css";

type InterviewProgressSidebarProps = {
  currentIndex: number;
  totalQuestions: number;
  questions: string[];
  evaluation?: EvaluateAnswerResponse;
};

export function InterviewProgressSidebar({
  currentIndex,
  evaluation,
  questions,
  totalQuestions,
}: InterviewProgressSidebarProps) {
  return (
    <aside className={styles.stack}>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Tiến độ phiên</h2>
        <p className={styles.scoreValue}>
          {currentIndex}/{totalQuestions}
        </p>
        <div className={styles.progress}>
          <div
            className={styles.progressFill}
            style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
          />
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Danh sách câu hỏi</h2>
        <ol className={styles.list}>
          {questions.map((question, index) => (
            <li key={`${question}-${index}`}>{question}</li>
          ))}
        </ol>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Tóm tắt điểm</h2>
        {evaluation ? (
          <dl className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <dt>Tổng quan</dt>
              <dd>{evaluation.overallScore}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Kỹ thuật</dt>
              <dd>{evaluation.technicalScore}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Giao tiếp</dt>
              <dd>{evaluation.communicationScore}</dd>
            </div>
          </dl>
        ) : (
          <p className={styles.muted}>Evaluate your answer to see scores.</p>
        )}
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Gợi ý</h2>
        <ul className={styles.list}>
          <li>Answer with concrete project examples.</li>
          <li>Explain tradeoffs, not only tools.</li>
          <li>Keep your answer focused on the current question.</li>
        </ul>
      </section>
    </aside>
  );
}
