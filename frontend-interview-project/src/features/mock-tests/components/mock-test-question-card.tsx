import type {
  MockTestQuestion,
  SubmitMockTestResultQuestion,
} from "../types/mock-test.type";
import { normalizeAnswerContent } from "../utils/mock-test-answer-content.util";
import { MockTestAnswerOption } from "./mock-test-answer-option";
import styles from "./mock-tests.module.css";

type Props = {
  question: MockTestQuestion;
  questionIndex: number;
  selectedAnswerId?: number;
  result?: SubmitMockTestResultQuestion;
  onSelectAnswer: (answerId: number) => void;
};

export function MockTestQuestionCard({
  question,
  questionIndex,
  selectedAnswerId,
  result,
  onSelectAnswer,
}: Props) {
  return (
    <article className={styles.questionCard}>
      <div className={styles.resultCardHeader}>
        <span className={styles.resultQuestionNumber}>
          Câu {questionIndex + 1}
        </span>
        {result ? (
          <span
            className={`${styles.resultBadge} ${
              result.isCorrect
                ? styles.resultBadgeCorrect
                : styles.resultBadgeWrong
            }`}
          >
            {result.isCorrect ? "Đúng" : "Sai"}
          </span>
        ) : null}
      </div>
      <h2 className={styles.questionTitle}>{question.title}</h2>
      <p className={styles.questionContent}>{question.content}</p>
      <div className={styles.questionMeta}>
        <span>{question.difficulty}</span>
        <span>{question.technology?.name ?? "N/A"}</span>
        <span>{question.topic?.name ?? "N/A"}</span>
      </div>
      <div className={styles.optionList}>
        {question.answers.map((answer, index) => {
          const gradedAnswer = result?.answers.find(
            (item) => item.id === answer.id,
          );
          const state = gradedAnswer?.isCorrect
            ? "correct"
            : gradedAnswer?.isUserSelected
              ? "wrong"
              : undefined;

          return (
            <MockTestAnswerOption
              answer={{
                ...answer,
                content: normalizeAnswerContent(answer.content),
              }}
              checked={selectedAnswerId === answer.id}
              disabled={Boolean(result)}
              key={answer.id}
              label={String.fromCharCode(65 + index)}
              onSelect={() => onSelectAnswer(answer.id)}
              questionId={question.id}
              state={state}
            />
          );
        })}
      </div>
      {result?.expectedAnswer || result?.explanation ? (
        <div className={styles.explanationBox}>
          <h3>Giải thích</h3>
          <p>{result.explanation ?? result.expectedAnswer}</p>
        </div>
      ) : null}
    </article>
  );
}
