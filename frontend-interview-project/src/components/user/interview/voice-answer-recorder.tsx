"use client";

import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

import styles from "./interview.module.css";

type VoiceAnswerRecorderProps = {
  isUploading: boolean;
  onUpload: (file: File) => void;
};

export function VoiceAnswerRecorder({
  isUploading,
  onUpload,
}: VoiceAnswerRecorderProps) {
  const {
    audioBlob,
    audioUrl,
    error,
    isRecording,
    resetRecording,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  const handleUpload = () => {
    if (!audioBlob) return;

    onUpload(
      new File([audioBlob], `answer-${Date.now()}.webm`, {
        type: audioBlob.type || "audio/webm",
      }),
    );
  };

  return (
    <div className={styles.recorder}>
      <p className={styles.muted}>
        Ghi âm câu trả lời, nghe lại rồi tải lên để chuyển thành văn bản.
      </p>

      {error ? <div className={styles.alert}>{error}</div> : null}

      <div className={styles.buttonRow}>
        <button
          className={styles.primaryButton}
          disabled={isRecording || isUploading}
          onClick={startRecording}
          type="button"
        >
          Ghi âm
        </button>
        <button
          className={styles.secondaryButton}
          disabled={!isRecording || isUploading}
          onClick={stopRecording}
          type="button"
        >
          Dừng
        </button>
        <button
          className={styles.secondaryButton}
          disabled={!audioBlob || isUploading}
          onClick={resetRecording}
          type="button"
        >
          Ghi lại
        </button>
      </div>

      {audioUrl ? (
        <audio className={styles.audio} controls src={audioUrl}>
          <track kind="captions" />
        </audio>
      ) : null}

      <button
        className={styles.primaryButton}
        disabled={!audioBlob || isUploading}
        onClick={handleUpload}
        type="button"
      >
        {isUploading ? "Đang chuyển văn bản..." : "Tải lên và chuyển văn bản"}
      </button>
    </div>
  );
}
