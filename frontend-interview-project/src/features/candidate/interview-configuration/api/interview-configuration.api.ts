import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type { InterviewConfiguration } from "@/features/candidate/interview-configuration/types";

export const interviewConfigurationApi = {
  save(payload: InterviewConfiguration) {
    return apiRequest<InterviewConfiguration>({
      method: "POST",
      url: apiEndpoints.candidate.interviewConfiguration,
      data: payload,
    });
  },
};
