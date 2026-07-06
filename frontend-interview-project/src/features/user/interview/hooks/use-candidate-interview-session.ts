"use client";

import { useState } from "react";

import { candidateInterviewSessionService } from "@/lib/api/services/interview/candidate-interview-session";
import type {
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

  const startSession = async (
    input: StartInterviewSessionRequest,
  ): Promise<StartInterviewSessionData> => {
    setErrorMessage(null);
    setIsStarting(true);

    try {
      const response =
        await candidateInterviewSessionService.startInterviewSession(input);

      return response.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể tạo phiên phỏng vấn.";
      setErrorMessage(message);
      throw error;
    } finally {
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
    startSession,
    uploadAudioAnswer,
    evaluateAnswer,
  };
}
