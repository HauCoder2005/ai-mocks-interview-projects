"use client";

import { useQuery } from "@tanstack/react-query";

import { interviewHistoryApi } from "@/features/candidate/interview-history/api/interview-history.api";

export function useInterviewHistory() {
  return useQuery({
    queryKey: ["candidate", "interview-history"],
    queryFn: interviewHistoryApi.list,
    enabled: false,
  });
}
