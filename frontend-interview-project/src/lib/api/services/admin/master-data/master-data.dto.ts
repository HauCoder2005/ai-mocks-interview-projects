import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/core/api-response";

export type AdminMasterDataStatusFilter = "all" | "active" | "inactive";

export type AdminMasterDataBaseDto = {
  id: number;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InterviewPosition = AdminMasterDataBaseDto;

export type InterviewLevel = AdminMasterDataBaseDto & {
  displayOrder: number;
};

export type InterviewTechnology = AdminMasterDataBaseDto & {
  slug: string;
};

export type InterviewTopic = AdminMasterDataBaseDto;

export type CreateInterviewPositionRequest = {
  name: string;
  code: string;
  description?: string;
};

export type UpdateInterviewPositionRequest =
  Partial<CreateInterviewPositionRequest>;

export type CreateInterviewLevelRequest = CreateInterviewPositionRequest & {
  displayOrder: number;
};

export type UpdateInterviewLevelRequest =
  Partial<CreateInterviewLevelRequest>;

export type CreateInterviewTechnologyRequest =
  CreateInterviewPositionRequest & {
    slug: string;
  };

export type UpdateInterviewTechnologyRequest =
  Partial<CreateInterviewTechnologyRequest>;

export type CreateInterviewTopicRequest = CreateInterviewPositionRequest;

export type UpdateInterviewTopicRequest = Partial<CreateInterviewTopicRequest>;

export type CreateInterviewCatalogPayload =
  | CreateInterviewPositionRequest
  | CreateInterviewLevelRequest
  | CreateInterviewTechnologyRequest
  | CreateInterviewTopicRequest;

export type UpdateInterviewCatalogPayload =
  | UpdateInterviewPositionRequest
  | UpdateInterviewLevelRequest
  | UpdateInterviewTechnologyRequest
  | UpdateInterviewTopicRequest;

export type InterviewPositionListResponse =
  ApiResponseWithMeta<InterviewPosition[]>;
export type InterviewPositionResponse = ApiResponse<InterviewPosition>;

export type InterviewLevelListResponse = ApiResponseWithMeta<InterviewLevel[]>;
export type InterviewLevelResponse = ApiResponse<InterviewLevel>;

export type InterviewTechnologyListResponse =
  ApiResponseWithMeta<InterviewTechnology[]>;
export type InterviewTechnologyResponse = ApiResponse<InterviewTechnology>;

export type InterviewTopicListResponse = ApiResponseWithMeta<InterviewTopic[]>;
export type InterviewTopicResponse = ApiResponse<InterviewTopic>;
