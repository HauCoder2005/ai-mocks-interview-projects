import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type { AdminInterviewOption } from "@/features/admin/interview-options/types";

const endpointByType = {
  position: apiEndpoints.admin.positions,
  level: apiEndpoints.admin.levels,
  technology: apiEndpoints.admin.technologies,
  topic: apiEndpoints.admin.topics,
};

export const adminInterviewOptionsApi = {
  list(type: AdminInterviewOption["type"]) {
    return apiRequest<AdminInterviewOption[]>({
      method: "GET",
      url: endpointByType[type],
    });
  },
};
