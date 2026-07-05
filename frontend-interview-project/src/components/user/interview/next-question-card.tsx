import { EvaluateAnswerResponse } from "@/types/candidate-interview.type";

import styles from "./interview.module.css";

type NextQuestionCardProps = {
  evaluation: EvaluateAnswerResponse;
  onContinue: () => void;
  onEnd: () => void;
};

export function NextQuestionCard({
  evaluation,
  onContinue,
  onEnd,
}: NextQuestionCardProps) {
  return (
    <div className={styles.infoPanel}>
      <h3 className={styles.cardTitle}>Câu hỏi tiếp theo</h3>
      <p>{evaluation.nextQuestion || "AI chưa trả về câu hỏi tiếp theo."}</p>
      <p className={styles.muted}>Trọng tâm: {evaluation.topicFocus || "Chưa có"}</p>
      <div className={styles.buttonRow}>
        <button
          className={styles.primaryButton}
          disabled={!evaluation.shouldContinue || !evaluation.nextQuestion}
          onClick={onContinue}
          type="button"
        >
          Continue with Câu hỏi tiếp theo
        </button>
        <button className={styles.dangerButton} onClick={onEnd} type="button">
          Kết thúc phiên
        </button>
      </div>
    </div>
  );
}
