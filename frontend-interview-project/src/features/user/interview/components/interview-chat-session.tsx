"use client";

import { Mic, RotateCcw, Send, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { candidateInterviewSessionService } from "@/lib/api/services/interview/candidate-interview-session";
import type { EvaluateAnswerData } from "@/lib/api/services/interview/candidate-interview-session";
import { useVoiceRecorder } from "../hooks";

import styles from "./interview.module.css";

type InterviewChatSessionProps = {
  sessionId: string;
};

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
  createdAt: string;
};

type InterviewSessionContext = {
  positionId?: number;
  levelId?: number;
  technologyId?: number | null;
  topicId?: number | null;
  positionName?: string;
  levelName?: string;
  technologyName?: string;
  topicName?: string;
  interviewType?: string;
};

const initialQuestion = "Xin chào bạn, bạn giới thiệu bản thân đi.";

const fallbackContext = {
  positionName: "Candidate",
  levelName: "Candidate",
  technologyName: "Interview",
  topicName: "Interview",
  interviewType: "TECHNICAL",
};

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${role}-${Date.now()}-${Math.random()}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function getSessionContext(sessionId: string): InterviewSessionContext {
  const storageKey = `interview-session-context:${sessionId}`;
  const storedContext = sessionStorage.getItem(storageKey);

  if (!storedContext) {
    return fallbackContext;
  }

  try {
    return {
      ...fallbackContext,
      ...(JSON.parse(storedContext) as InterviewSessionContext),
    };
  } catch {
    return fallbackContext;
  }
}

function formatRecordingTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function buildAiChatMessage(result: EvaluateAnswerData): string {
  const feedback = result.feedback?.trim();
  const nextQuestion = result.nextQuestion?.trim();

  if (feedback && nextQuestion) {
    return `${feedback}\n\n${nextQuestion}`;
  }

  if (nextQuestion) {
    return nextQuestion;
  }

  if (feedback) {
    return feedback;
  }

  return "Cảm ơn bạn, mình đã ghi nhận câu trả lời. Bạn có thể chia sẻ rõ hơn một chút không?";
}

export function InterviewChatSession({ sessionId }: InterviewChatSessionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-ai-message",
      role: "ai",
      content: initialQuestion,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [previousAnswers, setPreviousAnswers] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluateAnswerData[]>([]);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionContext, setSessionContext] =
    useState<InterviewSessionContext>(fallbackContext);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const {
    isRecording,
    audioBlob,
    audioUrl,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
    errorMessage: recorderErrorMessage,
  } = useVoiceRecorder();

  const isBusy = isUploadingAudio || isEvaluating;
  const mainTopic = useMemo(
    () =>
      sessionContext.topicName ||
      sessionContext.technologyName ||
      sessionContext.positionName ||
      "Interview",
    [sessionContext],
  );

  useEffect(() => {
    queueMicrotask(() => {
      setSessionContext(getSessionContext(sessionId));
    });
  }, [sessionId]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isBusy]);

  useEffect(() => {
    if (!evaluations.length) {
      return;
    }

    sessionStorage.setItem(
      `interview-session-evaluations:${sessionId}`,
      JSON.stringify(evaluations),
    );
  }, [evaluations, sessionId]);

  const handleToggleRecording = async () => {
    setErrorMessage(null);

    if (isRecording) {
      stopRecording();
      return;
    }

    await startRecording();
  };

  const handleSendAudioAnswer = async () => {
    if (!audioBlob || isBusy) {
      return;
    }

    setErrorMessage(null);
    setIsUploadingAudio(true);

    try {
      const audioFile = new File([audioBlob], `answer-${Date.now()}.webm`, {
        type: audioBlob.type || "audio/webm",
      });
      const transcriptResult =
        await candidateInterviewSessionService.uploadAudioAnswer({
          sessionId,
          audio: audioFile,
        });
      const answerText =
        transcriptResult.data.normalizedTranscript ||
        transcriptResult.data.transcript ||
        transcriptResult.data.rawTranscript ||
        "";

      if (!answerText.trim()) {
        setErrorMessage("Không nhận được transcript từ audio.");
        return;
      }

      const userMessage = createMessage("user", answerText);
      setMessages((current) => [...current, userMessage]);
      setIsUploadingAudio(false);
      setIsEvaluating(true);

      const evaluateResult =
        await candidateInterviewSessionService.evaluateAnswer(sessionId, {
          turnId: transcriptResult.data.turnId || `turn-${Date.now()}`,
          question: currentQuestion,
          rawTranscript: transcriptResult.data.rawTranscript || answerText,
          normalizedTranscript:
            transcriptResult.data.normalizedTranscript || answerText,
          previousQuestions,
          previousAnswers,
          mainTopic,
          positionName: sessionContext.positionName || "Candidate",
          levelName: sessionContext.levelName || "Candidate",
          interviewType: "TECHNICAL",
        });
      const aiContent = buildAiChatMessage(evaluateResult.data);

      setEvaluations((currentEvaluations) => [
        ...currentEvaluations,
        evaluateResult.data,
      ]);
      setMessages((current) => [...current, createMessage("ai", aiContent)]);

      if (evaluateResult.data.nextQuestion) {
        setCurrentQuestion(evaluateResult.data.nextQuestion);
        setPreviousQuestions((current) => [...current, currentQuestion]);
        setPreviousAnswers((current) => [...current, answerText]);
      }

      resetRecording();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "AI Senpai chưa đánh giá được câu trả lời. Vui lòng thử lại.";
      setErrorMessage(message);
      setMessages((current) => [
        ...current,
        createMessage(
          "ai",
          "AI Senpai chưa đánh giá được câu trả lời lúc này. Bạn vui lòng thử lại sau nhé.",
        ),
      ]);
    } finally {
      setIsUploadingAudio(false);
      setIsEvaluating(false);
    }
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatShell}>
        <header className={styles.chatHeader}>
          <div>
            <p className={styles.eyebrow}>Mã phiên: {sessionId}</p>
            <h1 className={styles.chatTitle}>Phỏng vấn AI bằng giọng nói</h1>
            <p className={styles.chatSubtitle}>
              Bấm microphone để trả lời, sau đó gửi audio để AI đánh giá và hỏi tiếp.
            </p>
          </div>

          <div className={styles.contextBadges}>
            <span className={styles.contextBadge}>
              {sessionContext.positionName || "Candidate"}
            </span>
            <span className={styles.contextBadge}>
              {sessionContext.levelName || "Candidate"}
            </span>
            <span className={styles.contextBadge}>{mainTopic}</span>
          </div>
        </header>

        {(errorMessage || recorderErrorMessage) ? (
          <div className={styles.errorAlert}>
            {errorMessage || recorderErrorMessage}
          </div>
        ) : null}

        <section className={styles.chatPanel}>
          <div className={styles.messageList} ref={messageListRef}>
            {messages.map((message) => (
              <div
                className={`${styles.messageRow} ${
                  message.role === "user"
                    ? styles.messageRowUser
                    : styles.messageRowAi
                }`}
                key={message.id}
              >
                {message.role === "ai" ? (
                  <span className={styles.messageAvatar}>AI</span>
                ) : null}
                <div
                  className={`${styles.messageBubble} ${
                    message.role === "user"
                      ? styles.messageBubbleUser
                      : styles.messageBubbleAi
                  }`}
                >
                  {message.role === "ai" ? (
                    <span className={styles.messageAuthor}>AI Senpai</span>
                  ) : null}
                  {message.content}
                </div>
              </div>
            ))}

            {isUploadingAudio ? (
              <p className={styles.loadingText}>Đang xử lý audio...</p>
            ) : null}
            {isEvaluating ? (
              <p className={styles.loadingText}>Đang đánh giá câu trả lời...</p>
            ) : null}
          </div>

          <div className={styles.composer}>
            <button
              aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
              className={`${styles.micButton} ${
                isRecording ? styles.micButtonRecording : ""
              }`}
              disabled={isBusy}
              onClick={handleToggleRecording}
              type="button"
            >
              {isRecording ? <Square size={26} /> : <Mic size={30} />}
              {isRecording ? <span className={styles.micPulse} /> : null}
            </button>

            <div className={styles.composerHint}>
              <strong>
                {isRecording
                  ? `Đang ghi âm ${formatRecordingTime(recordingTime)}`
                  : audioBlob
                    ? "Audio đã sẵn sàng"
                    : "Bấm mic để bắt đầu trả lời"}
              </strong>
              <span>
                {audioBlob
                  ? "Nghe lại audio rồi gửi câu trả lời."
                  : "Tin nhắn sẽ được tạo từ transcript sau khi upload audio."}
              </span>
            </div>

            {audioUrl ? (
              <audio className={styles.audioPreview} controls src={audioUrl}>
                <track kind="captions" />
              </audio>
            ) : null}

            {audioBlob ? (
              <>
                <button
                  className={styles.resetButton}
                  disabled={isBusy}
                  onClick={resetRecording}
                  type="button"
                >
                  <RotateCcw size={16} />
                  Ghi lại
                </button>
                <button
                  className={styles.sendButton}
                  disabled={isBusy}
                  onClick={handleSendAudioAnswer}
                  type="button"
                >
                  <Send size={16} />
                  Gửi câu trả lời
                </button>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
