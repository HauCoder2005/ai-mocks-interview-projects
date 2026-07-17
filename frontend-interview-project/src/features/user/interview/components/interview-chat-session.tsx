"use client";

import Link from "next/link";
import { Mic, Play, RotateCcw, Send, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { getInterviewHistoryDetail } from "@/features/interview-history/api/interview-history.api";
import type { InterviewHistoryStatus } from "@/features/interview-history/types/interview-history.type";
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

function createMessage(
  role: ChatMessage["role"],
  content: string,
): ChatMessage {
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
  const [sessionStatus, setSessionStatus] =
    useState<InterviewHistoryStatus | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isStartingSession, setIsStartingSession] = useState(false);
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
    let active = true;
    getInterviewHistoryDetail(sessionId)
      .then((detail) => {
        if (!active) return;
        const storedContext = getSessionContext(sessionId);
        setSessionContext({
          ...storedContext,
          positionId: detail.position.id,
          positionName: detail.position.name,
          levelId: detail.level.id,
          levelName: detail.level.name,
          interviewType: detail.interviewType,
        });
        setSessionStatus(detail.status);

        const answeredQuestions = detail.questions.filter(
          (question) => question.answer?.answerText,
        );
        if (detail.questions.length) {
          const restoredMessages = detail.questions.flatMap((question) => {
            const questionMessage: ChatMessage = {
              id: `question-${question.sessionQuestionId}`,
              role: "ai",
              content: question.content,
              createdAt: detail.createdAt,
            };
            return question.answer?.answerText
              ? [
                  questionMessage,
                  {
                    id: `answer-${question.sessionQuestionId}`,
                    role: "user" as const,
                    content: question.answer.answerText,
                    createdAt: detail.updatedAt,
                  },
                ]
              : [questionMessage];
          });
          setMessages(restoredMessages);
          setPreviousQuestions(answeredQuestions.map((question) => question.content));
          setPreviousAnswers(
            answeredQuestions.map((question) => question.answer?.answerText ?? ""),
          );
          setCurrentQuestion(
            detail.questions.find((question) => !question.answered)?.content ??
              detail.questions.at(-1)?.content ??
              initialQuestion,
          );
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Không thể tải phiên phỏng vấn.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingSession(false);
      });
    return () => {
      active = false;
    };
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

  const handleStartSession = async () => {
    if (isStartingSession) return;
    setIsStartingSession(true);
    setErrorMessage(null);
    try {
      const response =
        await candidateInterviewSessionService.startCreatedSession(sessionId);
      setSessionStatus(response.data.status);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể bắt đầu phiên phỏng vấn.",
      );
    } finally {
      setIsStartingSession(false);
    }
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

      if (!evaluateResult.data.shouldContinue) {
        await candidateInterviewSessionService.completeSession(
          sessionId,
          evaluateResult.data.overallScore,
        );
      }

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

  if (isLoadingSession) {
    return (
      <div className={styles.chatPage}>
        <div className={styles.sessionGate}>Đang tải phiên phỏng vấn...</div>
      </div>
    );
  }

  if (sessionStatus === "PENDING") {
    return (
      <div className={styles.chatPage}>
        <section className={styles.sessionGate}>
          <p className={styles.eyebrow}>Phiên #{sessionId}</p>
          <h1>Phiên phỏng vấn chưa bắt đầu</h1>
          <p>Trạng thái sẽ chỉ chuyển sang Đang thực hiện khi bạn chủ động bắt đầu.</p>
          {errorMessage ? <div className={styles.errorAlert}>{errorMessage}</div> : null}
          <button className={styles.primaryButton} disabled={isStartingSession} onClick={handleStartSession} type="button">
            <Play size={18} />
            {isStartingSession ? "Đang bắt đầu..." : "Bắt đầu"}
          </button>
        </section>
      </div>
    );
  }

  if (sessionStatus === "COMPLETED" || sessionStatus === "CANCELLED") {
    return (
      <div className={styles.chatPage}>
        <section className={styles.sessionGate}>
          <h1>Phiên phỏng vấn đã đóng</h1>
          <p>Phiên này không thể chuyển lại sang trạng thái đang thực hiện.</p>
          <Link className={styles.primaryButton} href={`/interviews/${sessionId}`}>Xem chi tiết</Link>
        </section>
      </div>
    );
  }

  if (!sessionStatus) {
    return (
      <div className={styles.chatPage}>
        <section className={styles.sessionGate}>
          <div className={styles.errorAlert}>{errorMessage ?? "Không thể tải phiên phỏng vấn."}</div>
          <Link className={styles.primaryButton} href="/interviews">Về lịch sử</Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatShell}>
        <header className={styles.chatHeader}>
          <div>
            <p className={styles.eyebrow}>Mã phiên: {sessionId}</p>
            <h1 className={styles.chatTitle}>Phỏng vấn AI bằng ghi âm</h1>
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

        {errorMessage || recorderErrorMessage ? (
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
                  : ""}
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
