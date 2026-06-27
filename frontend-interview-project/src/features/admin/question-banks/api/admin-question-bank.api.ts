import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type {
  AdminQuestionBank,
  CreateAdminQuestionBankPayload,
  UpdateAdminQuestionBankPayload,
} from "@/features/admin/question-banks/types";
import type { PaginationParams } from "@/types/pagination";

export const adminQuestionBankApi = {
  list(params?: PaginationParams) {
    return apiRequest<AdminQuestionBank[]>({
      method: "GET",
      url: apiEndpoints.admin.questionBanks,
      params,
    });
  },
  create(payload: CreateAdminQuestionBankPayload) {
    return apiRequest<AdminQuestionBank>({
      method: "POST",
      url: apiEndpoints.admin.questionBanks,
      data: payload,
    });
  },
  update(id: string, payload: UpdateAdminQuestionBankPayload) {
    return apiRequest<AdminQuestionBank>({
      method: "PATCH",
      url: `${apiEndpoints.admin.questionBanks}/${id}`,
      data: payload,
    });
  },
};
