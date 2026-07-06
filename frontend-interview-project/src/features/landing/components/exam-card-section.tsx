"use client";

import { ClipboardList, Info, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getStoredAccessToken } from "@/lib/auth/auth-storage";
import { mockTestsService } from "@/lib/api/services/mock-tests";
import type { MockTestSummaryDto } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";

import { ExamConfirmModal } from "./exam-confirm-modal";
import styles from "./landing.module.css";

export function ExamCardSection() {
  const router = useRouter();
  const [mockTests, setMockTests] = useState<MockTestSummaryDto[]>([]);
  const [selectedExam, setSelectedExam] = useState<MockTestSummaryDto | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    mockTestsService
      .getMockTests({ limit: 6 })
      .then((response) => setMockTests(response.data))
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Không thể tải bài kiểm tra.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const openConfirmModal = (exam: MockTestSummaryDto) => {
    setSelectedExam(exam);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmStart = async () => {
    if (!selectedExam) return;

    if (!getStoredAccessToken()) {
      router.push(appRoutes.login);
      return;
    }

    setIsStarting(true);
    setError("");
    try {
      const response = await mockTestsService.startMockTestAttempt(selectedExam.id);
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
    <section className={`${styles.section} ${styles.block}`} id="exam-cards">
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Kiểm tra dưới dạng trắc nghiệm</h2>
        </div>
        <Link className={styles.secondaryButton} href={appRoutes.mockTests}>
          Xem tất cả
        </Link>
      </div>

      {error ? <p className={styles.errorText}>{error}</p> : null}
      {isLoading ? <div className={styles.emptyCard}>Đang tải bài kiểm tra...</div> : null}
      {!isLoading && !mockTests.length ? (
        <div className={styles.emptyCard}>Chưa có bài kiểm tra nào.</div>
      ) : null}

      <div className={styles.examGrid}>
        {mockTests.map((exam) => (
          <article className={styles.examCard} key={exam.id}>
            <div className={styles.examCover}>
              {exam.coverImageUrl ? (
                <span
                  className={styles.examCoverImage}
                  style={{ backgroundImage: `url(${exam.coverImageUrl})` }}
                />
              ) : (
                <span className={styles.examCoverFallback}>
                  <ClipboardList size={44} />
                </span>
              )}
              <span className={`${styles.smallBadge} ${styles.examCoverStatus}`}>
                {exam.status}
              </span>
            </div>
            <div>
              <h3 className={styles.cardTitle}>{exam.title}</h3>
              <p className={styles.cardText}>{exam.description}</p>
            </div>
            <div className={styles.examMeta}>
              <span>{exam.totalQuestions} câu</span>
              <span>{exam.durationMinutes ?? "--"} phút</span>
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.primaryButton}
                onClick={() => openConfirmModal(exam)}
                type="button"
              >
                <Play size={16} />
                Bắt đầu
              </button>
              <Link
                className={styles.secondaryButton}
                href={appRoutes.mockTestDetail(exam.slug)}
              >
                <Info size={16} />
                Xem chi tiết
              </Link>
            </div>
          </article>
        ))}
      </div>

      <ExamConfirmModal
        exam={selectedExam}
        isOpen={isConfirmOpen}
        isStarting={isStarting}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmStart}
      />
    </section>
  );
}
