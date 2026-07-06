import { candidateInterviewSessionService } from "@/lib/api/services/interview/candidate-interview-session";
import type {
  AudioAnswerResponse,
  EvaluateAnswerInput,
  EvaluateAnswerResponse,
  InterviewSession,
  InterviewSetupInput,
} from "@/types/candidate-interview.type";
import type { ApiResponse } from "./core";

export const candidateInterviewApi = {
  startInterviewSession(
    input: InterviewSetupInput,
  ): Promise<ApiResponse<InterviewSession>> {
    return candidateInterviewSessionService.startInterviewSession(input);
  },

  uploadAudioAnswer(
    sessionId: string | number,
    file: File,
  ): Promise<ApiResponse<AudioAnswerResponse>> {
    return candidateInterviewSessionService.uploadAudioAnswer({
      sessionId,
      audio: file,
    });
  },

  evaluateAnswer(
    sessionId: string | number,
    input: EvaluateAnswerInput,
  ): Promise<ApiResponse<EvaluateAnswerResponse>> {
    return candidateInterviewSessionService.evaluateAnswer(sessionId, input);
  },
};
