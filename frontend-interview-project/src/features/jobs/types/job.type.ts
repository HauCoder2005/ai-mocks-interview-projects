import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/core/api-response";

export type JobStatus = "ACTIVE" | "INACTIVE";
export type JobSource =
  | "UNKNOWN"
  | "TOPCV"
  | "CAREERVIET"
  | "VIETNAMWORKS"
  | "TOPDEV";

export type JobDto = {
  id: number;
  title: string;
  company: string;
  source: JobSource;
  sourceUrl: string;
  location: string | null;
  salary: string | null;
  technologies: string[];
  tags: string[];
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
  source?: JobSource;
  status?: JobStatus;
};

export type JobListResponse = ApiResponseWithMeta<JobDto[]>;
export type JobResponse = ApiResponse<JobDto>;
