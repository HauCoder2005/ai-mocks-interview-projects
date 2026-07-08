import { request } from "@/lib/api/core";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";

import type {
  AdminMasterDataStatusFilter,
  CreateInterviewLevelRequest,
  CreateInterviewPositionRequest,
  CreateInterviewTechnologyRequest,
  CreateInterviewTopicRequest,
  InterviewLevelListResponse,
  InterviewLevelResponse,
  InterviewPositionListResponse,
  InterviewPositionResponse,
  InterviewTechnologyListResponse,
  InterviewTechnologyResponse,
  InterviewTopicListResponse,
  InterviewTopicResponse,
  UpdateInterviewLevelRequest,
  UpdateInterviewPositionRequest,
  UpdateInterviewTechnologyRequest,
  UpdateInterviewTopicRequest,
} from "./master-data.dto";

const MASTER_DATA_PATH = "/admin/interview-master-data";

function statusPath(basePath: string, status: AdminMasterDataStatusFilter) {
  if (status === "active" || status === "inactive") {
    return `${basePath}/${status}`;
  }

  return basePath;
}

export const adminMasterDataService = {
  getPositions(): Promise<InterviewPositionListResponse> {
    return request<InterviewPositionListResponse>(
      `${MASTER_DATA_PATH}/positions`,
      {
        method: ApiHttpMethod.GET,
        auth: true,
      },
    );
  },

  createPosition(
    input: CreateInterviewPositionRequest,
  ): Promise<InterviewPositionResponse> {
    return request<InterviewPositionResponse>(`${MASTER_DATA_PATH}/positions`, {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  updatePosition(
    id: number,
    input: UpdateInterviewPositionRequest,
  ): Promise<InterviewPositionResponse> {
    return request<InterviewPositionResponse>(
      `${MASTER_DATA_PATH}/positions/${id}`,
      {
        method: ApiHttpMethod.PATCH,
        auth: true,
        body: JSON.stringify(input),
      },
    );
  },

  activatePosition(id: number): Promise<InterviewPositionResponse> {
    return request<InterviewPositionResponse>(
      `${MASTER_DATA_PATH}/positions/${id}/activate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },

  deactivatePosition(id: number): Promise<InterviewPositionResponse> {
    return request<InterviewPositionResponse>(
      `${MASTER_DATA_PATH}/positions/${id}/deactivate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },

  getLevels(): Promise<InterviewLevelListResponse> {
    return request<InterviewLevelListResponse>(`${MASTER_DATA_PATH}/levels`, {
      method: ApiHttpMethod.GET,
      auth: true,
    });
  },

  createLevel(input: CreateInterviewLevelRequest): Promise<InterviewLevelResponse> {
    return request<InterviewLevelResponse>(`${MASTER_DATA_PATH}/levels`, {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  updateLevel(
    id: number,
    input: UpdateInterviewLevelRequest,
  ): Promise<InterviewLevelResponse> {
    return request<InterviewLevelResponse>(`${MASTER_DATA_PATH}/levels/${id}`, {
      method: ApiHttpMethod.PATCH,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  activateLevel(id: number): Promise<InterviewLevelResponse> {
    return request<InterviewLevelResponse>(
      `${MASTER_DATA_PATH}/levels/${id}/activate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },

  deactivateLevel(id: number): Promise<InterviewLevelResponse> {
    return request<InterviewLevelResponse>(
      `${MASTER_DATA_PATH}/levels/${id}/deactivate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },

  getTechnologies(
    status: AdminMasterDataStatusFilter = "all",
  ): Promise<InterviewTechnologyListResponse> {
    return request<InterviewTechnologyListResponse>(
      statusPath(`${MASTER_DATA_PATH}/technologies`, status),
      { method: ApiHttpMethod.GET, auth: true },
    );
  },

  createTechnology(
    input: CreateInterviewTechnologyRequest,
  ): Promise<InterviewTechnologyResponse> {
    return request<InterviewTechnologyResponse>(
      `${MASTER_DATA_PATH}/technologies`,
      {
        method: ApiHttpMethod.POST,
        auth: true,
        body: JSON.stringify(input),
      },
    );
  },

  updateTechnology(
    id: number,
    input: UpdateInterviewTechnologyRequest,
  ): Promise<InterviewTechnologyResponse> {
    return request<InterviewTechnologyResponse>(
      `${MASTER_DATA_PATH}/technologies/${id}`,
      {
        method: ApiHttpMethod.PATCH,
        auth: true,
        body: JSON.stringify(input),
      },
    );
  },

  activateTechnology(id: number): Promise<InterviewTechnologyResponse> {
    return request<InterviewTechnologyResponse>(
      `${MASTER_DATA_PATH}/technologies/${id}/activate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },

  deactivateTechnology(id: number): Promise<InterviewTechnologyResponse> {
    return request<InterviewTechnologyResponse>(
      `${MASTER_DATA_PATH}/technologies/${id}/deactivate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },

  getTopics(
    status: AdminMasterDataStatusFilter = "all",
  ): Promise<InterviewTopicListResponse> {
    return request<InterviewTopicListResponse>(
      statusPath(`${MASTER_DATA_PATH}/topics`, status),
      { method: ApiHttpMethod.GET, auth: true },
    );
  },

  createTopic(input: CreateInterviewTopicRequest): Promise<InterviewTopicResponse> {
    return request<InterviewTopicResponse>(`${MASTER_DATA_PATH}/topics`, {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  updateTopic(
    id: number,
    input: UpdateInterviewTopicRequest,
  ): Promise<InterviewTopicResponse> {
    return request<InterviewTopicResponse>(`${MASTER_DATA_PATH}/topics/${id}`, {
      method: ApiHttpMethod.PATCH,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  activateTopic(id: number): Promise<InterviewTopicResponse> {
    return request<InterviewTopicResponse>(
      `${MASTER_DATA_PATH}/topics/${id}/activate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },

  deactivateTopic(id: number): Promise<InterviewTopicResponse> {
    return request<InterviewTopicResponse>(
      `${MASTER_DATA_PATH}/topics/${id}/deactivate`,
      { method: ApiHttpMethod.PATCH, auth: true },
    );
  },
};
