"use client";

import { useRef, useState } from "react";

import { ApiClientError } from "@/lib/api/core";
import { candidateInterviewSessionService } from "@/lib/api/services/interview/candidate-interview-session";
import type {
  ActiveInterviewSessionData,
  EvaluateAnswerData,
  EvaluateAnswerRequest,
  StartInterviewSessionData,
  StartInterviewSessionRequest,
  UploadAudioAnswerData,
  UploadAudioAnswerRequest,
} from "@/lib/api/services/interview/candidate-interview-session";

export function useCandidateInterviewSession() {
  const [isStarting, setIsStarting] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictingSession, setConflictingSession] =
    useState<Partial<ActiveInterviewSessionData> | null>(null);
  const createInFlightRef = useRef(false);

  const startSession = async (
    input: StartInterviewSessionRequest,
  ): Promise<StartInterviewSessionData> => {
    if (createInFlightRef.current) {
      throw new Error("Yêu cầu tạo phiên đang được xử lý.");
    }

    createInFlightRef.current = true;
    setErrorMessage(null);
    setConflictingSession(null);
    setIsStarting(true);

    try {
      const response =
        await candidateInterviewSessionService.startInterviewSession(input);

      return response.data;
    } catch (error) {
      const isActiveSessionConflict =
        error instanceof ApiClientError &&
        error.statusCode === 409 &&
        error.code === "ACTIVE_INTERVIEW_SESSION_EXISTS";
      const message = isActiveSessionConflict
        ? "Bạn đang có một phiên phỏng vấn chưa hoàn thành. Hãy tiếp tục hoặc hủy phiên hiện tại trước khi tạo phiên mới."
        : error instanceof Error
          ? error.message
          : "Không thể tạo phiên phỏng vấn.";
      if (isActiveSessionConflict) {
        setConflictingSession(
          (error.data as Partial<ActiveInterviewSessionData>) ?? null,
        );
      }
      setErrorMessage(message);
      throw error;
    } finally {
      createInFlightRef.current = false;
      setIsStarting(false);
    }
  };

  const uploadAudioAnswer = async (
    input: UploadAudioAnswerRequest,
  ): Promise<UploadAudioAnswerData> => {
    setErrorMessage(null);
    setIsUploadingAudio(true);

    try {
      const response =
        await candidateInterviewSessionService.uploadAudioAnswer(input);

      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xử lý audio.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const evaluateAnswer = async (
    sessionId: string | number,
    input: EvaluateAnswerRequest,
  ): Promise<EvaluateAnswerData> => {
    setErrorMessage(null);
    setIsEvaluating(true);

    try {
      const response = await candidateInterviewSessionService.evaluateAnswer(
        sessionId,
        input,
      );

      return response.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể đánh giá câu trả lời.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    isStarting,
    isUploadingAudio,
    isEvaluating,
    errorMessage,
    conflictingSession,
    startSession,
    uploadAudioAnswer,
    evaluateAnswer,
  };
}
