"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/common/skeleton";
import { mockTestsService } from "@/lib/api/services/mock-tests";
import type { MockTestResultDto } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

type MockTestResultPageProps = {
  attemptId: string;
};

function MockTestResultSkeleton() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <Skeleton className={styles.skeletonBadge} />
          <Skeleton className={styles.skeletonHeading} />
          <Skeleton className={styles.skeletonText} />
        </div>
        <div className={styles.headerActions}>
          <Skeleton className={styles.skeletonButton} />
          <Skeleton className={styles.skeletonButton} />
        </div>
      </header>
      <section className={styles.scorePanel}>
        {Array.from({ length: 4 }).map((_, index) => (
          <article className={styles.summaryCard} key={index}>
            <Skeleton className={styles.skeletonTextShort} />
            <Skeleton className={styles.skeletonScore} />
          </article>
        ))}
      </section>
      <section className={styles.reviewList}>
        {Array.from({ length: 3 }).map((_, index) => (
          <article className={styles.resultCard} key={index}>
            <div className={styles.resultCardHeader}>
              <Skeleton className={styles.skeletonBadge} />
              <Skeleton className={styles.skeletonBadge} />
            </div>
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonText} />
            <Skeleton className={styles.skeletonOption} />
            <Skeleton className={styles.skeletonOption} />
            <Skeleton className={styles.skeletonOption} />
          </article>
        ))}
      </section>
    </>
  );
}

export function MockTestResultPage({ attemptId }: MockTestResultPageProps) {
  const [result, setResult] = useState<MockTestResultDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    mockTestsService
      .getMockTestResult(attemptId)
      .then((response) => setResult(response.data))
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Không thể tải kết quả.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, [attemptId]);

  const getOptionContent = (
    options: MockTestResultDto["answers"][number]["options"],
    optionId: number | null,
  ) => options.find((option) => option.id === optionId)?.content ?? "Chưa chọn";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {isLoading ? <MockTestResultSkeleton /> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        {result ? (
          <>
            <header className={styles.header}>
              <div>
                <p className={styles.eyebrow}>Kết quả bài kiểm tra</p>
                <h1 className={styles.title}>{result.mockTest.title}</h1>
              </div>
              <div className={styles.headerActions}>
                <Link className={styles.secondaryButton} href={appRoutes.mockTests}>
                  Về danh sách bài kiểm tra
                </Link>
                <Link
                  className={styles.primaryButton}
                  href={appRoutes.mockTestDetail(result.mockTest.slug)}
                >
                  Làm lại
                </Link>
              </div>
            </header>

            <section className={styles.scorePanel}>
              <article className={styles.summaryCard}>
                <span>Tổng điểm</span>
                <strong>{result.score ?? 0}%</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Câu đúng</span>
                <strong>
                  {result.correctAnswers}/{result.totalQuestions}
                </strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Tổng câu</span>
                <strong>{result.totalQuestions}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Trạng thái</span>
                <strong>{result.completedAt ? "Đã nộp" : "Chưa hoàn tất"}</strong>
              </article>
            </section>

            <section className={styles.reviewList}>
              {result.answers.map((answer, index) => {
                const selectedOption = getOptionContent(
                  answer.options,
                  answer.selectedOptionId,
                );
                const correctOption = getOptionContent(
                  answer.options,
                  answer.correctOptionId,
                );

                return (
                  <article className={styles.resultCard} key={answer.questionId}>
                    <div className={styles.resultCardHeader}>
                      <span
                        className={`${styles.resultBadge} ${
                          answer.isCorrect ? styles.resultBadgeCorrect : styles.resultBadgeWrong
                        }`}
                      >
                        {answer.isCorrect ? "Đúng" : "Sai"}
                      </span>
                      <span className={styles.resultQuestionNumber}>
                        Câu {index + 1}
                      </span>
                    </div>
                    <h2 className={styles.cardTitle}>{answer.questionTitle}</h2>
                    <p className={styles.text}>{answer.questionContent}</p>

                    <div className={styles.optionList}>
                      {answer.options.map((option) => {
                        const isWrongSelected =
                          answer.selectedOptionId === option.id && !option.isCorrect;

                        return (
                          <div
                            className={`${styles.optionCard} ${
                              option.isCorrect ? styles.optionCorrect : ""
                            } ${isWrongSelected ? styles.optionWrong : ""}`}
                            key={option.id}
                          >
                            {option.isCorrect ? <Check size={18} /> : null}
                            {isWrongSelected ? <X size={18} /> : null}
                            <span>{option.content}</span>
                          </div>
                        );
                      })}
                    </div>

                    {!answer.isCorrect ? (
                      <div className={styles.answerSummary}>
                        <p>
                          <strong>Bạn chọn:</strong> {selectedOption}
                        </p>
                        <p>
                          <strong>Đáp án đúng:</strong> {correctOption}
                        </p>
                      </div>
                    ) : null}

                    {answer.expectedAnswer ? (
                      <div className={styles.explanationBox}>
                        <h3>Giải thích</h3>
                        <p>{answer.expectedAnswer}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
