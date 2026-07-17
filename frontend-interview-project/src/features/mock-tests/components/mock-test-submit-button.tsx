"use client";

import { Send } from "lucide-react";
import styles from "./mock-tests.module.css";

type Props = {
  totalQuestions: number;
  answeredCount: number;
  submitting: boolean;
  onSubmit: () => void;
};

export function MockTestSubmitButton({
  totalQuestions,
  answeredCount,
  submitting,
  onSubmit,
}: Props) {
  const handleSubmit = () => {
    if (
      answeredCount < totalQuestions &&
      !window.confirm(
        "Bạn vẫn còn câu chưa trả lời. Bạn có chắc muốn nộp bài không?",
      )
    ) {
      return;
    }
    onSubmit();
  };

  return (
    <button
      className={styles.submitButton}
      disabled={submitting}
      onClick={handleSubmit}
      type="button"
    >
      <Send size={17} />
      {submitting ? "Đang nộp bài..." : "Nộp bài"}
    </button>
  );
}
