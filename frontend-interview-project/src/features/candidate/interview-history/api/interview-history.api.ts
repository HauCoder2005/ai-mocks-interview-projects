import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type { InterviewHistoryItem } from "@/features/candidate/interview-history/types";

export const interviewHistoryApi = {
  list() {
    return apiRequest<InterviewHistoryItem[]>({
      method: "GET",
      url: apiEndpoints.candidate.interviewHistory,
    });
  },
};
