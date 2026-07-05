"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useMockTestDetail } from "@/features/user/mock-tests/hooks";
import { getStoredAccessToken } from "@/lib/auth/auth-storage";
import { mockTestsService } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

type MockTestDetailPageProps = {
  slug: string;
};

export function MockTestDetailPage({ slug }: MockTestDetailPageProps) {
  const router = useRouter();
  const {
    data: mockTest,
    errorMessage,
    isLoading,
    refetch,
  } = useMockTestDetail(slug);
  const [isStarting, setIsStarting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!mockTest) return;

    if (!getStoredAccessToken()) {
      router.push(appRoutes.login);
      return;
    }

    setIsStarting(true);
    setError("");
    try {
      const response = await mockTestsService.startMockTestAttempt(mockTest.id);
      router.push(appRoutes.mockTestAttempt(response.data.id));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể bắt đầu bài kiểm tra.",
      );
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {isLoading ? <section className={styles.panel}>Đang tải...</section> : null}
        {error || errorMessage ? (
          <div className={styles.error}>
            <p>{error || errorMessage}</p>
            {errorMessage ? (
              <button className={styles.secondaryButton} onClick={refetch} type="button">
                Thử lại
              </button>
            ) : null}
          </div>
        ) : null}
        {mockTest ? (
          <>
            <header className={styles.header}>
              <div>
                <p className={styles.eyebrow}>Chi tiết bài kiểm tra</p>
                <h1 className={styles.title}>{mockTest.title}</h1>
                <p className={styles.text}>{mockTest.description}</p>
                <div className={styles.meta}>
                  <span className={styles.badge}>{mockTest.totalQuestions} câu</span>
                  <span className={styles.badge}>
                    {mockTest.durationMinutes ?? "--"} phút
                  </span>
                </div>
              </div>
              <button
                className={styles.primaryButton}
                onClick={() => setIsConfirmOpen(true)}
                type="button"
              >
                Bắt đầu làm bài
              </button>
            </header>

            <section className={styles.panel}>
              <h2 className={styles.cardTitle}>Danh sách câu hỏi</h2>
              <div className={styles.reviewList}>
                {mockTest.questions.map((question) => (
                  <article className={styles.questionCard} key={question.id}>
                    <h3 className={styles.cardTitle}>{question.title}</h3>
                    <p className={styles.text}>{question.content}</p>
                    <div className={styles.meta}>
                      <span className={styles.badge}>{question.difficulty}</span>
                      <span className={styles.badge}>
                        {question.technology?.name ?? "N/A"}
                      </span>
                      <span className={styles.badge}>
                        {question.topic?.name ?? "N/A"}
                      </span>
                      <span className={styles.badge}>
                        {question.options.length} lựa chọn
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>

      {isConfirmOpen && mockTest ? (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} role="dialog" aria-modal="true">
            <h2 className={styles.cardTitle}>Xác nhận bắt đầu bài kiểm tra</h2>
            <p className={styles.text}>
              Bạn sắp bắt đầu bài “{mockTest.title}” với{" "}
              {mockTest.totalQuestions} câu hỏi trong{" "}
              {mockTest.durationMinutes ?? "--"} phút.
            </p>
            <div className={styles.actions}>
              <button
                className={styles.secondaryButton}
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                Hủy
              </button>
              <button
                className={styles.primaryButton}
                disabled={isStarting}
                onClick={handleStart}
                type="button"
              >
                {isStarting ? "Đang bắt đầu..." : "Bắt đầu"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
