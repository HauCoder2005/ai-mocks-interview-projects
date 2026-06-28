"use client";

import { useMutation } from "@tanstack/react-query";

import { interviewConfigurationApi } from "@/features/candidate/interview-configuration/api/interview-configuration.api";

export function useInterviewConfiguration() {
  return useMutation({
    mutationFn: interviewConfigurationApi.save,
  });
}
