"use client";

import { useQuery } from "@tanstack/react-query";

import { adminQuestionBankApi } from "@/features/admin/question-banks/api/admin-question-bank.api";

export function useAdminQuestionBanks() {
  return useQuery({
    queryKey: ["admin", "question-banks"],
    queryFn: () => adminQuestionBankApi.list(),
    enabled: false,
  });
}
