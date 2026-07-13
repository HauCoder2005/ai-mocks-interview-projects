import type { MockTestDetail } from "../types/mock-test.type";
import styles from "./mock-tests.module.css";

type Props = {
  mockTest: MockTestDetail;
  answeredCount: number;
  isResult: boolean;
};

export function MockTestHeader({ mockTest, answeredCount, isResult }: Props) {
  return (
    <header className={styles.testHeader}>
      <p className={styles.eyebrow}>
        {isResult ? "Kết quả bài kiểm tra" : "Bài kiểm tra trắc nghiệm"}
      </p>
      <h1 className={styles.testTitle}>{mockTest.title}</h1>
      {mockTest.description ? (
        <p className={styles.testDescription}>{mockTest.description}</p>
      ) : null}
      <div className={styles.testMeta}>
        <span>{mockTest.totalQuestions} câu hỏi</span>
        <i aria-hidden="true" />
        <span>{mockTest.durationMinutes ?? 30} phút</span>
        {!isResult ? (
          <>
            <i aria-hidden="true" />
            <span>
              Đã làm {answeredCount}/{mockTest.questions.length} câu
            </span>
          </>
        ) : null}
      </div>
    </header>
  );
}
