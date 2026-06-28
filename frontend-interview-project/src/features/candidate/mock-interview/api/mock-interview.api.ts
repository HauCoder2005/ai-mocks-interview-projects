import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type { MockInterviewSession } from "@/features/candidate/mock-interview/types";

export const mockInterviewApi = {
  start() {
    return apiRequest<MockInterviewSession>({
      method: "POST",
      url: `${apiEndpoints.candidate.mockInterview}/start`,
    });
  },
};
