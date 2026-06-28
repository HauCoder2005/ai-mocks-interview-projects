"use client";

import { useQuery } from "@tanstack/react-query";

import { adminInterviewOptionsApi } from "@/features/admin/interview-options/api/admin-interview-options.api";
import type { InterviewOptionType } from "@/features/admin/interview-options/types";

export function useAdminInterviewOptions(type: InterviewOptionType) {
  return useQuery({
    queryKey: ["admin", "interview-options", type],
    queryFn: () => adminInterviewOptionsApi.list(type),
  });
}
