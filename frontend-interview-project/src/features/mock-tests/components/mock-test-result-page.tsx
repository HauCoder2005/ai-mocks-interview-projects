"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { mockTestsService } from "@/lib/api/services/mock-tests";
import type { MockTestResultDto } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

type MockTestResultPageProps = {
  attemptId: string;
};

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

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {isLoading ? <section className={styles.panel}>Đang tải kết quả...</section> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        {result ? (
          <>
            <header className={styles.header}>
              <div>
                <p className={styles.eyebrow}>Kết quả bài kiểm tra</p>
                <h1 className={styles.title}>{result.mockTest.title}</h1>
                <div className={styles.score}>{result.score ?? 0}%</div>
                <p className={styles.text}>
                  Đúng {result.correctAnswers}/{result.totalQuestions} câu.
                </p>
              </div>
              <Link className={styles.secondaryButton} href={appRoutes.mockTests}>
                Xem bài khác
              </Link>
            </header>

            <section className={styles.reviewList}>
              {result.answers.map((answer, index) => (
                <article className={styles.resultCard} key={answer.questionId}>
                  <span
                    className={`${styles.badge} ${
                      answer.isCorrect ? styles.optionCorrect : styles.optionWrong
                    }`}
                  >
                    {answer.isCorrect ? "Đúng" : "Sai"}
                  </span>
                  <h2 className={styles.cardTitle}>
                    Câu {index + 1}: {answer.questionTitle}
                  </h2>
                  <p className={styles.text}>{answer.questionContent}</p>
                  <div className={styles.optionList}>
                    {answer.options.map((option) => (
                      <div
                        className={`${styles.optionCard} ${
                          option.isCorrect ? styles.optionCorrect : ""
                        } ${
                          answer.selectedOptionId === option.id && !option.isCorrect
                            ? styles.optionWrong
                            : ""
                        }`}
                        key={option.id}
                      >
                        {option.content}
                      </div>
                    ))}
                  </div>
                  {answer.expectedAnswer ? (
                    <p className={styles.text}>
                      Đáp án kỳ vọng: {answer.expectedAnswer}
                    </p>
                  ) : null}
                </article>
              ))}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
