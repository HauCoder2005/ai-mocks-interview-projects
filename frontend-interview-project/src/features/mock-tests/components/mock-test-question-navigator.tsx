import type { MockTestQuestion, SubmitMockTestResult } from "../types/mock-test.type";
import styles from "./mock-tests.module.css";

type Props = { questions: MockTestQuestion[]; selectedAnswers: Record<number, number>; activeQuestionIndex: number; result?: SubmitMockTestResult | null; onJumpToQuestion: (index: number) => void };

export function MockTestQuestionNavigator({ questions, selectedAnswers, activeQuestionIndex, result, onJumpToQuestion }: Props) {
  return (
    <div className={styles.progressGrid}>
      {questions.map((question, index) => {
        const gradedQuestion = result?.questions.find(
          (item) => item.questionId === question.id,
        );
        const resultClass = gradedQuestion
          ? gradedQuestion.userAnswerId === null
            ? styles.progressButtonUnanswered
            : gradedQuestion.isCorrect
              ? styles.progressButtonCorrect
              : styles.progressButtonWrong
          : "";

        return (
          <button
            aria-label={`Đi tới câu ${index + 1}`}
            className={[
              styles.progressButton,
              !result && selectedAnswers[question.id]
                ? styles.progressButtonAnswered
                : "",
              resultClass,
              index === activeQuestionIndex ? styles.progressButtonActive : "",
              !result && index === activeQuestionIndex && selectedAnswers[question.id]
                ? styles.progressButtonCurrentAnswered
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={question.id}
            onClick={() => onJumpToQuestion(index)}
            type="button"
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
