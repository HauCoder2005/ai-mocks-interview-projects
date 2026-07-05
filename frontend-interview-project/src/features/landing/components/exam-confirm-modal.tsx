"use client";

import type { MockTestSummaryDto } from "@/lib/api/services/mock-tests";
import styles from "./landing.module.css";

type ExamConfirmModalProps = {
  exam: MockTestSummaryDto | null;
  isOpen: boolean;
  isStarting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ExamConfirmModal({
  exam,
  isOpen,
  isStarting = false,
  onClose,
  onConfirm,
}: ExamConfirmModalProps) {
  if (!isOpen || !exam) return null;

  return (
    <div className={styles.modalOverlay} role="presentation">
      <div
        aria-labelledby="exam-confirm-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <h2 className={styles.modalTitle} id="exam-confirm-title">
          Xác nhận bắt đầu bài kiểm tra
        </h2>
        <p className={styles.modalText}>
          Bạn sắp bắt đầu bài “{exam.title}” với {exam.totalQuestions} câu hỏi
          trong {exam.durationMinutes ?? "--"} phút.
        </p>
        <div className={styles.modalMeta}>
          <span>Số câu: {exam.totalQuestions}</span>
          <span>Thời lượng: {exam.durationMinutes ?? "--"} phút</span>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.secondaryButton} onClick={onClose} type="button">
            Hủy
          </button>
          <button
            className={styles.primaryButton}
            disabled={isStarting}
            onClick={onConfirm}
            type="button"
          >
            {isStarting ? "Đang bắt đầu..." : "Bắt đầu làm bài"}
          </button>
        </div>
      </div>
    </div>
  );
}
