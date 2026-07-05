import { request } from "@/lib/api/core";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";

import type {
  InterviewLevelListResponse,
  InterviewPositionListResponse,
  InterviewTechnologyListResponse,
  InterviewTopicListResponse,
} from "./interview-options.dto";

const INTERVIEW_OPTIONS_PATH = "/interviews/options";

export const interviewOptionsService = {
  getInterviewLevels(): Promise<InterviewLevelListResponse> {
    return request<InterviewLevelListResponse>(
      `${INTERVIEW_OPTIONS_PATH}/levels`,
      {
        method: ApiHttpMethod.GET,
        auth: false,
      },
    );
  },

  getInterviewPositions(): Promise<InterviewPositionListResponse> {
    return request<InterviewPositionListResponse>(
      `${INTERVIEW_OPTIONS_PATH}/positions`,
      {
        method: ApiHttpMethod.GET,
        auth: false,
      },
    );
  },

  getInterviewTechnologies(): Promise<InterviewTechnologyListResponse> {
    return request<InterviewTechnologyListResponse>(
      `${INTERVIEW_OPTIONS_PATH}/technologies`,
      {
        method: ApiHttpMethod.GET,
        auth: false,
      },
    );
  },

  getInterviewTopics(): Promise<InterviewTopicListResponse> {
    return request<InterviewTopicListResponse>(
      `${INTERVIEW_OPTIONS_PATH}/topics`,
      {
        method: ApiHttpMethod.GET,
        auth: false,
      },
    );
  },

  
};
