"use client";

import { useState } from "react";

import styles from "./interview.module.css";

type TranscriptPreviewProps = {
  normalizedTranscript: string;
  rawTranscript: string;
};

export function TranscriptPreview({
  normalizedTranscript,
  rawTranscript,
}: TranscriptPreviewProps) {
  const [showRaw, setShowRaw] = useState(false);

  if (!normalizedTranscript && !rawTranscript) {
    return null;
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.cardTitle}>Bản ghi câu trả lời</h2>
          <p className={styles.subtitle}>
            Bản đã làm sạch được dùng để AI đánh giá.
          </p>
        </div>

        {rawTranscript ? (
          <button
            className={styles.secondaryButton}
            onClick={() => setShowRaw((current) => !current)}
            type="button"
          >
            {showRaw ? "Xem bản đã làm sạch" : "Xem bản gốc"}
          </button>
        ) : null}
      </div>

      <div className={styles.transcriptBox}>
        {showRaw ? rawTranscript : normalizedTranscript || rawTranscript}
      </div>
    </section>
  );
}
