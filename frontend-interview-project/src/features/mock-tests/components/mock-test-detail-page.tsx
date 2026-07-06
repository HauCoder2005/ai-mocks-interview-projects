"use client";

import { ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Skeleton } from "@/components/common/skeleton";
import { useMockTestDetail } from "@/features/user/mock-tests/hooks";
import { getStoredAccessToken } from "@/lib/auth/auth-storage";
import { mockTestsService } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

type MockTestDetailPageProps = {
  slug: string;
};

function MockTestDetailSkeleton() {
  return (
    <>
      <section className={styles.detailHero}>
        <div className={styles.detailMain}>
          <Skeleton className={styles.skeletonDetailCover} />
          <div className={styles.detailContent}>
            <Skeleton className={styles.skeletonBadge} />
            <Skeleton className={styles.skeletonHeading} />
            <Skeleton className={styles.skeletonText} />
            <Skeleton className={styles.skeletonTextShort} />
          </div>
        </div>
        <aside className={styles.startPanel}>
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonStat} />
          <Skeleton className={styles.skeletonStat} />
          <Skeleton className={styles.skeletonStat} />
          <Skeleton className={styles.skeletonButton} />
        </aside>
      </section>
      <section className={styles.panel}>
        <Skeleton className={styles.skeletonTitle} />
        <div className={styles.reviewList}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={styles.questionCard} key={index}>
              <Skeleton className={styles.skeletonTitle} />
              <Skeleton className={styles.skeletonText} />
              <Skeleton className={styles.skeletonTextShort} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

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
        {isLoading ? <MockTestDetailSkeleton /> : null}
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
            <section className={styles.detailHero}>
              <div className={styles.detailMain}>
                <div className={styles.cover}>
                  {mockTest.coverImageUrl ? (
                    <span
                      aria-label={mockTest.title}
                      className={styles.coverImage}
                      role="img"
                      style={{ backgroundImage: `url(${mockTest.coverImageUrl})` }}
                    />
                  ) : (
                    <span className={styles.coverFallback}>
                      <ClipboardList size={54} />
                    </span>
                  )}
                  <span className={`${styles.badge} ${styles.coverBadge}`}>
                    {mockTest.status}
                  </span>
                </div>

                <div className={styles.detailContent}>
                  <p className={styles.eyebrow}>Chi tiết bài kiểm tra</p>
                  <h1 className={styles.title}>{mockTest.title}</h1>
                  <p className={styles.text}>{mockTest.description}</p>
                </div>
              </div>

              <aside className={styles.startPanel}>
                <h2 className={styles.cardTitle}>Thông tin bài thi</h2>
                <div className={styles.statList}>
                  <span>
                    <strong>{mockTest.totalQuestions}</strong>
                    Câu hỏi
                  </span>
                  <span>
                    <strong>{mockTest.durationMinutes ?? "--"}</strong>
                    Phút
                  </span>
                  <span>
                    <strong>{mockTest.status}</strong>
                    Trạng thái
                  </span>
                </div>
                <button
                  className={styles.primaryButton}
                  onClick={() => setIsConfirmOpen(true)}
                  type="button"
                >
                  Bắt đầu làm bài
                </button>
              </aside>
            </section>

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
                {isStarting ? "Đang tạo..." : "Bắt đầu"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
