"use client";

import { useState } from "react";

import { AudioAnswerResponse } from "@/types/candidate-interview.type";

import { TranscriptPreview } from "./transcript-preview";
import { VoiceAnswerRecorder } from "./voice-answer-recorder";
import styles from "./interview.module.css";

type AnswerMode = "text" | "voice";

type InterviewAnswerEditorProps = {
  answer: string;
  isEvaluating: boolean;
  isUploading: boolean;
  transcript?: AudioAnswerResponse;
  onAnswerChange: (value: string) => void;
  onEvaluate: () => void;
  onUploadAudio: (file: File) => void;
};

export function InterviewAnswerEditor({
  answer,
  isEvaluating,
  isUploading,
  onAnswerChange,
  onEvaluate,
  onUploadAudio,
  transcript,
}: InterviewAnswerEditorProps) {
  const [mode, setMode] = useState<AnswerMode>("text");

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.cardTitle}>Câu trả lời của bạn</h2>
          <p className={styles.subtitle}>Chọn trả lời bằng văn bản hoặc giọng nói.</p>
        </div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === "text" ? styles.tabActive : ""}`}
            onClick={() => setMode("text")}
            type="button"
          >
            Văn bản
          </button>
          <button
            className={`${styles.tab} ${mode === "voice" ? styles.tabActive : ""}`}
            onClick={() => setMode("voice")}
            type="button"
          >
            Giọng nói
          </button>
        </div>
      </div>

      {mode === "text" ? (
        <div className={styles.stack}>
          <textarea
            className={styles.textarea}
            onChange={(event) => onAnswerChange(event.target.value)}
            placeholder="Nhập câu trả lời tại đây..."
            value={answer}
          />
          <button
            className={styles.primaryButton}
            disabled={isEvaluating || !answer.trim()}
            onClick={onEvaluate}
            type="button"
          >
            {isEvaluating ? "Đang đánh giá..." : "Đánh giá câu trả lời"}
          </button>
        </div>
      ) : (
        <div className={styles.stack}>
          <VoiceAnswerRecorder
            isUploading={isUploading}
            onUpload={onUploadAudio}
          />
          {transcript ? (
            <>
              <TranscriptPreview
                normalizedTranscript={transcript.normalizedTranscript}
                rawTranscript={transcript.rawTranscript}
              />
              <button
                className={styles.primaryButton}
                disabled={isEvaluating}
                onClick={onEvaluate}
                type="button"
              >
                {isEvaluating ? "Đang đánh giá..." : "Đánh giá câu trả lời"}
              </button>
            </>
          ) : null}
        </div>
      )}
    </section>
  );
}
