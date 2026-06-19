"use client";

import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/src/lib/api/axiosClient";
import type { PaginatedResponse } from "@/src/types/api";

export type Job = {
  id: string | number;
  title?: string;
  companyName?: string;
  company?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  description?: string;
};

export type UseJobsParams = {
  page?: number;
  limit?: number;
};

export const fetchJobs = ({
  page = 1,
  limit = 10,
}: UseJobsParams = {}): Promise<PaginatedResponse<Job>> => {
  return axiosClient.get<PaginatedResponse<Job>>("/jobs", {
    params: {
      page,
      limit,
    },
  });
};

export const useJobsQuery = ({ page = 1, limit = 10 }: UseJobsParams = {}) => {
  return useQuery<PaginatedResponse<Job>, Error>({
    queryKey: ["jobs", page, limit],
    queryFn: () => fetchJobs({ page, limit }),
  });
};

export const useJobs = useJobsQuery;
