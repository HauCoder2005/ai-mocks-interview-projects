import { EvaluateAnswerResponse } from "@/types/candidate-interview.type";

import styles from "./interview.module.css";

type EvaluationScoreCardsProps = {
  evaluation: EvaluateAnswerResponse;
};

export function EvaluationScoreCards({ evaluation }: EvaluationScoreCardsProps) {
  const scores = [
    { label: "Tổng quan", value: evaluation.overallScore },
    { label: "Kỹ thuật", value: evaluation.technicalScore },
    { label: "Giao tiếp", value: evaluation.communicationScore },
    { label: "Bám câu hỏi", value: evaluation.relevanceScore },
  ];

  return (
    <div className={styles.scoreGrid}>
      {scores.map((score) => (
        <article className={styles.scoreCard} key={score.label}>
          <p className={styles.muted}>{score.label}</p>
          <p className={styles.scoreValue}>{score.value}</p>
          <div className={styles.progress}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.max(0, Math.min(score.value, 100))}%` }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
