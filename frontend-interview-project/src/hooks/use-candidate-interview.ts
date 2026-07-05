"use client";

import { useState } from "react";

import { candidateInterviewSessionService } from "@/lib/api/services/interview/candidate-interview-session";
import {
  AudioAnswerResponse,
  EvaluateAnswerInput,
  EvaluateAnswerResponse,
  InterviewSession,
  InterviewSetupInput,
} from "@/types/candidate-interview.type";

export function useCandidateInterview() {
  const [isStarting, setIsStarting] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState("");

  const startInterviewSession = async (
    input: InterviewSetupInput,
  ): Promise<InterviewSession> => {
    setError("");
    setIsStarting(true);
    try {
      const response =
        await candidateInterviewSessionService.startInterviewSession(input);
      return response.data;
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Không thể tạo phiên phỏng vấn.";
      setError(message);
      throw caught;
    } finally {
      setIsStarting(false);
    }
  };

  const uploadAudioAnswer = async (
    sessionId: string,
    file: File,
  ): Promise<AudioAnswerResponse> => {
    setError("");
    setIsUploadingAudio(true);
    try {
      const response = await candidateInterviewSessionService.uploadAudioAnswer(
        {
          sessionId,
          audio: file,
        },
      );
      return response.data;
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Không thể tải audio.";
      setError(message);
      throw caught;
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const evaluateAnswer = async (
    sessionId: string,
    input: EvaluateAnswerInput,
  ): Promise<EvaluateAnswerResponse> => {
    setError("");
    setIsEvaluating(true);
    try {
      const response = await candidateInterviewSessionService.evaluateAnswer(
        sessionId,
        input,
      );
      return response.data;
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Không thể đánh giá câu trả lời.";
      setError(message);
      throw caught;
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    error,
    evaluateAnswer,
    isEvaluating,
    isStarting,
    isUploadingAudio,
    setError,
    startInterviewSession,
    uploadAudioAnswer,
  };
}
