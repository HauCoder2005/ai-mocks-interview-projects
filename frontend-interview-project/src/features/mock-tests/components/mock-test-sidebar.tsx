import type {
  MockTestQuestion,
  SubmitMockTestResult,
} from "../types/mock-test.type";
import { MockTestProgress } from "./mock-test-progress";
import { MockTestQuestionNavigator } from "./mock-test-question-navigator";
import { MockTestSubmitButton } from "./mock-test-submit-button";
import { MockTestTimer } from "./mock-test-timer";
import styles from "./mock-tests.module.css";

type Props = {
  questions: MockTestQuestion[];
  durationMinutes: number | null;
  selectedAnswers: Record<number, number>;
  answeredCount: number;
  activeQuestionIndex: number;
  submitting: boolean;
  result: SubmitMockTestResult | null;
  onExpire: () => void;
  onSubmit: () => void;
  onJumpToQuestion: (index: number) => void;
};

export function MockTestSidebar({
  questions,
  durationMinutes,
  selectedAnswers,
  answeredCount,
  activeQuestionIndex,
  submitting,
  result,
  onExpire,
  onSubmit,
  onJumpToQuestion,
}: Props) {
  return (
    <aside className={styles.sidebar}>
      <section className={styles.sidebarCard}>
        {!result ? (
          <MockTestTimer
            durationMinutes={durationMinutes}
            onExpire={onExpire}
            stopped={submitting}
          />
        ) : null}
        <MockTestProgress
          answeredCount={answeredCount}
          totalQuestions={questions.length}
        />
        <div className={styles.sidebarSection}>
          <h2 className={styles.navigatorTitle}>Danh sách câu</h2>
          <MockTestQuestionNavigator
            activeQuestionIndex={activeQuestionIndex}
            onJumpToQuestion={onJumpToQuestion}
            questions={questions}
            result={result}
            selectedAnswers={selectedAnswers}
          />
        </div>
        {!result ? (
          <MockTestSubmitButton
            answeredCount={answeredCount}
            onSubmit={onSubmit}
            submitting={submitting}
            totalQuestions={questions.length}
          />
        ) : null}
      </section>
    </aside>
  );
}
