import { EvaluateAnswerResponse } from "@/types/candidate-interview.type";

import { EvaluationScoreCards } from "./evaluation-score-cards";
import { NextQuestionCard } from "./next-question-card";
import styles from "./interview.module.css";

type EvaluationFeedbackPanelProps = {
  evaluation: EvaluateAnswerResponse;
  onContinue: () => void;
  onEnd: () => void;
};

export function EvaluationFeedbackPanel({
  evaluation,
  onContinue,
  onEnd,
}: EvaluationFeedbackPanelProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Kết quả đánh giá</h2>
      <div className={styles.stack}>
        <EvaluationScoreCards evaluation={evaluation} />

        <div className={styles.grid}>
          <div className={styles.successPanel}>
            <h3 className={styles.cardTitle}>Điểm mạnh</h3>
            <ul className={styles.list}>
              {evaluation.strengths.length ? (
                evaluation.strengths.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>AI chưa trả về điểm mạnh.</li>
              )}
            </ul>
          </div>

          <div className={styles.warningPanel}>
            <h3 className={styles.cardTitle}>Điểm cần cải thiện</h3>
            <ul className={styles.list}>
              {evaluation.weaknesses.length ? (
                evaluation.weaknesses.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>AI chưa trả về điểm cần cải thiện.</li>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.infoPanel}>
          <h3 className={styles.cardTitle}>Góp ý</h3>
          <p>{evaluation.feedback}</p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Gợi ý trả lời tốt hơn</h3>
          <p>{evaluation.improvedAnswerSuggestion}</p>
        </div>

        <NextQuestionCard
          evaluation={evaluation}
          onContinue={onContinue}
          onEnd={onEnd}
        />
      </div>
    </section>
  );
}
