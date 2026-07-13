import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/core/api-response";

export type JobStatus = "ACTIVE" | "INACTIVE";

export type JobDto = {
  id: number;
  title: string;
  company: string;
  sourceUrl: string;
  technologies: string[];
  focusTopics: string[];
  expiredAt: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};

export type JobQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  technology?: string;
  topic?: string;
  focusTopic?: string;
  company?: string;
  status?: JobStatus;
};

export type JobListResponse = ApiResponseWithMeta<JobDto[]>;
export type JobResponse = ApiResponse<JobDto>;
