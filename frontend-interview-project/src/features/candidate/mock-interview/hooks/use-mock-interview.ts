"use client";

import { useMutation } from "@tanstack/react-query";

import { mockInterviewApi } from "@/features/candidate/mock-interview/api/mock-interview.api";

export function useMockInterview() {
  return useMutation({
    mutationFn: mockInterviewApi.start,
  });
}
