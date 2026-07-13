import type { MockTestAnswer } from "../types/mock-test.type";
import styles from "./mock-tests.module.css";

type Props = {
  answer: MockTestAnswer;
  label: string;
  questionId: number;
  checked: boolean;
  disabled?: boolean;
  state?: "correct" | "wrong";
  onSelect: () => void;
};

export function MockTestAnswerOption({
  answer,
  label,
  questionId,
  checked,
  disabled,
  state,
  onSelect,
}: Props) {
  return (
    <label
      className={[
        styles.optionCard,
        checked ? styles.optionCardActive : "",
        state === "correct" ? styles.optionCorrect : "",
        state === "wrong" ? styles.optionWrong : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        checked={checked}
        disabled={disabled}
        name={`question-${questionId}`}
        onChange={onSelect}
        type="radio"
      />
      <span className={styles.radioMark} />
      <span className={styles.answerLabel}>{label}</span>
      <span className={styles.answerContent}>{answer.content}</span>
    </label>
  );
}
