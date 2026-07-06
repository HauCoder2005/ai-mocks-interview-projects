import { ApiResponseWithMeta } from "@/lib/api/core/api-response";

export type InterviewOptionBaseDto = {
  id: number;
  name: string;
  code: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InterviewLevelDto = InterviewOptionBaseDto;

export type InterviewPositionDto = InterviewOptionBaseDto;

export type InterviewTechnologyDto = InterviewOptionBaseDto & {
  slug: string;
};

export type InterviewTopicDto = InterviewOptionBaseDto;

export type InterviewLevelListResponse = ApiResponseWithMeta<
  InterviewLevelDto[]
>;

export type InterviewPositionListResponse = ApiResponseWithMeta<
  InterviewPositionDto[]
>;

export type InterviewTechnologyListResponse = ApiResponseWithMeta<
  InterviewTechnologyDto[]
>;

export type InterviewTopicListResponse = ApiResponseWithMeta<
  InterviewTopicDto[]
>;
