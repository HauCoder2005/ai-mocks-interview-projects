"use client";

import { useCallback, useEffect, useState } from "react";

import { jobsApi } from "../api/jobs.api";
import type { JobDto, JobQuery } from "../types/job.type";
import type { ApiListMeta } from "@/lib/api/core/api-response";

type UseJobsOptions = {
  admin?: boolean;
};

export function useJobs(query: JobQuery = { limit: 12 }, options: UseJobsOptions = {}) {
  const [data, setData] = useState<JobDto[]>([]);
  const [meta, setMeta] = useState<ApiListMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const queryKey = JSON.stringify(query);
  const isAdmin = Boolean(options.admin);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const parsedQuery = JSON.parse(queryKey) as JobQuery;
      const response = isAdmin
        ? await jobsApi.getAdminJobs(parsedQuery)
        : await jobsApi.getJobs(parsedQuery);
      setData(response.data);
      setMeta(response.meta ?? null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải danh sách việc làm.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, queryKey]);

  useEffect(() => {
    let isMounted = true;

    const timer = window.setTimeout(() => {
      if (!isMounted) return;
      setIsLoading(true);
      setErrorMessage("");

      const parsedQuery = JSON.parse(queryKey) as JobQuery;
      const requestJobs = isAdmin
        ? jobsApi.getAdminJobs(parsedQuery)
        : jobsApi.getJobs(parsedQuery);

      requestJobs
        .then((response) => {
          if (!isMounted) return;
          setData(response.data);
          setMeta(response.meta ?? null);
        })
        .catch((error) => {
          if (!isMounted) return;
          setErrorMessage(
            error instanceof Error ? error.message : "Không thể tải danh sách việc làm.",
          );
        })
        .finally(() => {
          if (!isMounted) return;
          setIsLoading(false);
        });
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [isAdmin, queryKey]);

  return {
    data,
    meta,
    isLoading,
    errorMessage,
    refetch,
  };
}
