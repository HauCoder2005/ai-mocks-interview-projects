"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/common/skeleton";
import { useMockTestAttempt } from "@/features/user/mock-tests/hooks";
import { mockTestsService } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

type MockTestAttemptPageProps = {
  attemptId: string;
};

function MockTestAttemptSkeleton() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <Skeleton className={styles.skeletonBadge} />
          <Skeleton className={styles.skeletonHeading} />
          <Skeleton className={styles.skeletonTextShort} />
          <Skeleton className={styles.skeletonProgress} />
        </div>
        <div className={styles.headerActions}>
          <Skeleton className={styles.skeletonButton} />
          <Skeleton className={styles.skeletonButton} />
        </div>
      </header>
      <section className={styles.questionLayout}>
        <article className={styles.questionCard}>
          <Skeleton className={styles.skeletonBadge} />
          <div className={styles.questionMeta}>
            <Skeleton className={styles.skeletonBadge} />
            <Skeleton className={styles.skeletonBadge} />
          </div>
          <Skeleton className={styles.skeletonHeading} />
          <Skeleton className={styles.skeletonText} />
          <div className={styles.optionList}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className={styles.skeletonOption} key={index} />
            ))}
          </div>
        </article>
        <aside className={styles.sidebar}>
          <section className={styles.panel}>
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonTextShort} />
            <div className={styles.progressGrid}>
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton className={styles.skeletonProgressButton} key={index} />
              ))}
            </div>
          </section>
        </aside>
      </section>
    </>
  );
}

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
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);

  const questions = useMemo(() => attempt?.questions ?? [], [attempt?.questions]);
  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => questions.filter((question) => question.selectedOptionId).length,
    [questions],
  );
  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;
  const unansweredCount = Math.max(questions.length - answeredCount, 0);

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
      setIsSubmitConfirmOpen(false);
    }
  };

  const openSubmitConfirm = () => {
    setIsSubmitConfirmOpen(true);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {isLoading ? <MockTestAttemptSkeleton /> : null}
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
                <div className={styles.progressBar} aria-label="Tiến độ làm bài">
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <div className={styles.headerActions}>
                <span className={styles.timerBadge}>
                  {attempt.mockTest?.durationMinutes ?? "--"} phút
                </span>
                <button
                  className={styles.dangerButton}
                  disabled={isSubmitting}
                  onClick={openSubmitConfirm}
                  type="button"
                >
                  {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                </button>
              </div>
            </header>

            <section className={styles.questionLayout}>
              <article className={styles.questionCard}>
                <span className={styles.badge}>
                  Câu {currentIndex + 1}/{questions.length}
                </span>
                <div className={styles.questionMeta}>
                  <span>{currentQuestion.difficulty}</span>
                  <span>{currentQuestion.topic?.name ?? "Chưa có chủ đề"}</span>
                  <span>{currentQuestion.technology?.name ?? "Backend"}</span>
                </div>
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
                      <span className={styles.radioMark} />
                      <span>{option.content}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.questionActions}>
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
                  <button
                    className={styles.dangerButton}
                    disabled={isSubmitting}
                    onClick={openSubmitConfirm}
                    type="button"
                  >
                    {isSubmitting ? "Đang nộp..." : "Nộp bài"}
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
                        className={[
                          styles.progressButton,
                          question.selectedOptionId ? styles.progressButtonAnswered : "",
                          index === currentIndex ? styles.progressButtonActive : "",
                          index === currentIndex && question.selectedOptionId
                            ? styles.progressButtonCurrentAnswered
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={question.id}
                        onClick={() => setCurrentIndex(index)}
                        type="button"
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <div className={styles.progressLegend}>
                    <span>
                      <i className={styles.legendCurrent} />
                      Đang làm
                    </span>
                    <span>
                      <i className={styles.legendAnswered} />
                      Đã trả lời
                    </span>
                    <span>
                      <i className={styles.legendEmpty} />
                      Chưa trả lời
                    </span>
                  </div>
                </section>
              </aside>
            </section>
          </>
        ) : null}
      </div>
      {isSubmitConfirmOpen && attempt ? (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} role="dialog" aria-modal="true">
            <h2 className={styles.cardTitle}>Xác nhận nộp bài</h2>
            <p className={styles.text}>
              Bạn đã trả lời {answeredCount}/{questions.length} câu. Sau khi nộp bài,
              bạn sẽ không thể thay đổi đáp án.
            </p>
            {unansweredCount ? (
              <div className={styles.warningBox}>
                Bạn còn {unansweredCount} câu chưa trả lời.
              </div>
            ) : null}
            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => setIsSubmitConfirmOpen(false)}
                type="button"
              >
                Tiếp tục làm
              </button>
              <button
                className={styles.dangerButton}
                disabled={isSubmitting}
                onClick={handleSubmit}
                type="button"
              >
                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
