import { request } from "@/lib/api/core";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";

import type {
  EvaluateAnswerRequest,
  EvaluateAnswerResponse,
  StartInterviewSessionRequest,
  StartInterviewSessionResponse,
  UploadAudioAnswerRequest,
  UploadAudioAnswerResponse,
} from "./candidate-interview-session.dto";

const CANDIDATE_INTERVIEW_SESSION_PATH = "/candidate/interviews/sessions";

export const candidateInterviewSessionService = {
  startInterviewSession(
    input: StartInterviewSessionRequest,
  ): Promise<StartInterviewSessionResponse> {
    const body = new URLSearchParams({
      positionId: String(input.positionId),
      levelId: String(input.levelId),
    });

    return request<StartInterviewSessionResponse>(
      `${CANDIDATE_INTERVIEW_SESSION_PATH}/start`,
      {
        method: ApiHttpMethod.POST,
        auth: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );
  },

  uploadAudioAnswer(
    input: UploadAudioAnswerRequest,
  ): Promise<UploadAudioAnswerResponse> {
    const body = new FormData();
    body.append("audio", input.audio);

    return request<UploadAudioAnswerResponse>(
      `${CANDIDATE_INTERVIEW_SESSION_PATH}/${input.sessionId}/answers/audio`,
      {
        method: ApiHttpMethod.POST,
        auth: true,
        body,
      },
    );
  },

  evaluateAnswer(
    sessionId: string | number,
    input: EvaluateAnswerRequest,
  ): Promise<EvaluateAnswerResponse> {
    return request<EvaluateAnswerResponse>(
      `${CANDIDATE_INTERVIEW_SESSION_PATH}/${sessionId}/agent/evaluate-answer`,
      {
        method: ApiHttpMethod.POST,
        auth: true,
        body: JSON.stringify(input),
      },
    );
  },
};
