import styles from "./interview.module.css";

type InterviewQuestionCardProps = {
  question: string;
  positionName: string;
  levelName: string;
  interviewType: string;
  currentIndex: number;
  totalQuestions: number;
};

export function InterviewQuestionCard({
  currentIndex,
  interviewType,
  levelName,
  positionName,
  question,
  totalQuestions,
}: InterviewQuestionCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={styles.badge}>
          Câu {currentIndex} / {totalQuestions}
        </span>
        <span className={styles.badge}>{interviewType}</span>
        <span className={styles.badge}>{levelName}</span>
      </div>
      <h2 className={styles.title} style={{ marginTop: 16 }}>
        {question}
      </h2>
      <p className={styles.subtitle}>{positionName}</p>
    </section>
  );
}
