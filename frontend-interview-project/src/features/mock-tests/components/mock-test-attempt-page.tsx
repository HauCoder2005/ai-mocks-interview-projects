"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useMockTestAttempt } from "@/features/user/mock-tests/hooks";
import { mockTestsService } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

type MockTestAttemptPageProps = {
  attemptId: string;
};

export function MockTestAttemptPage({ attemptId }: MockTestAttemptPageProps) {
  const router = useRouter();
  const {
    data: attempt,
    errorMessage,
    isLoading,
    refetch,
    setData: setAttempt,
    setErrorMessage,
  } = useMockTestAttempt(attemptId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = useMemo(() => attempt?.questions ?? [], [attempt?.questions]);
  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => questions.filter((question) => question.selectedOptionId).length,
    [questions],
  );

  const handleSelectOption = async (selectedOptionId: number) => {
    if (!currentQuestion || !attempt) return;

    setIsSaving(true);
    setErrorMessage("");
    try {
      const response = await mockTestsService.submitMockTestAnswer(attempt.id, {
        questionBankId: currentQuestion.id,
        selectedOptionId,
      });
      setAttempt({
        ...attempt,
        questions: questions.map((question) =>
          question.id === currentQuestion.id
            ? {
                ...question,
                selectedOptionId: response.data.selectedOptionId,
                answeredAt: response.data.answeredAt,
              }
            : question,
        ),
      });
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu đáp án.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    const confirmed = window.confirm("Bạn chắc chắn muốn nộp bài?");
    if (!confirmed) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await mockTestsService.submitMockTestAttempt(attempt.id);
      router.push(appRoutes.mockTestResult(attempt.id));
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error
          ? requestError.message
          : "Không thể nộp bài.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {isLoading ? <section className={styles.panel}>Đang tải bài làm...</section> : null}
        {errorMessage ? (
          <div className={styles.error}>
            <p>{errorMessage}</p>
            <button className={styles.secondaryButton} onClick={refetch} type="button">
              Thử lại
            </button>
          </div>
        ) : null}
        {attempt && currentQuestion ? (
          <>
            <header className={styles.header}>
              <div>
                <p className={styles.eyebrow}>Đang làm bài</p>
                <h1 className={styles.title}>{attempt.mockTest?.title}</h1>
                <p className={styles.text}>
                  Đã trả lời {answeredCount}/{questions.length} câu.
                </p>
              </div>
              <button
                className={styles.dangerButton}
                disabled={isSubmitting}
                onClick={handleSubmit}
                type="button"
              >
                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </header>

            <section className={styles.questionLayout}>
              <article className={styles.questionCard}>
                <span className={styles.badge}>
                  Câu {currentIndex + 1}/{questions.length}
                </span>
                <h2 className={styles.cardTitle}>{currentQuestion.title}</h2>
                <p className={styles.text}>{currentQuestion.content}</p>
                <div className={styles.optionList}>
                  {currentQuestion.options.map((option) => (
                    <label
                      className={`${styles.optionCard} ${
                        currentQuestion.selectedOptionId === option.id
                          ? styles.optionCardActive
                          : ""
                      }`}
                      key={option.id}
                    >
                      <input
                        checked={currentQuestion.selectedOptionId === option.id}
                        disabled={isSaving}
                        name={`question-${currentQuestion.id}`}
                        onChange={() => handleSelectOption(option.id)}
                        type="radio"
                      />
                      <span>{option.content}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.secondaryButton}
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((value) => value - 1)}
                    type="button"
                  >
                    Câu trước
                  </button>
                  <button
                    className={styles.primaryButton}
                    disabled={currentIndex === questions.length - 1}
                    onClick={() => setCurrentIndex((value) => value + 1)}
                    type="button"
                  >
                    Câu sau
                  </button>
                </div>
              </article>

              <aside className={styles.sidebar}>
                <section className={styles.panel}>
                  <h2 className={styles.cardTitle}>Tiến độ</h2>
                  <p className={styles.text}>
                    {answeredCount}/{questions.length} câu đã chọn đáp án.
                  </p>
                  <div className={styles.progressGrid}>
                    {questions.map((question, index) => (
                      <button
                        className={`${styles.progressButton} ${
                          index === currentIndex ? styles.progressButtonActive : ""
                        }`}
                        key={question.id}
                        onClick={() => setCurrentIndex(index)}
                        type="button"
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </section>
              </aside>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
