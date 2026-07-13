import { request } from "@/lib/api/core";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";

import type { JobListResponse, JobQuery, JobResponse } from "../types/job.type";

function buildQueryString(query?: JobQuery) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export const jobsApi = {
  getJobs(query?: JobQuery): Promise<JobListResponse> {
    return request<JobListResponse>(`/jobs${buildQueryString(query)}`, {
      method: ApiHttpMethod.GET,
    });
  },

  getAdminJobs(query?: JobQuery): Promise<JobListResponse> {
    return request<JobListResponse>(`/admin/jobs${buildQueryString(query)}`, {
      method: ApiHttpMethod.GET,
      auth: true,
    });
  },

  activateJob(id: number): Promise<JobResponse> {
    return request<JobResponse>(`/admin/jobs/${id}/activate`, {
      method: ApiHttpMethod.PATCH,
      auth: true,
    });
  },

  deactivateJob(id: number): Promise<JobResponse> {
    return request<JobResponse>(`/admin/jobs/${id}/deactivate`, {
      method: ApiHttpMethod.PATCH,
      auth: true,
    });
  },
};
