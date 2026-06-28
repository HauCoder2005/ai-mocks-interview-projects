import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type {
  AdminQuestionBank,
  CreateAdminQuestionBankPayload,
  UpdateAdminQuestionBankPayload,
} from "@/features/admin/question-banks/types";
import type { PaginationParams } from "@/types/pagination";

export function getAdminQuestionBanks(params?: PaginationParams) {
  return apiRequest<AdminQuestionBank[]>({
    method: "GET",
    url: apiEndpoints.admin.interviewQuestionBanks.list,
    params,
  });
}

export function getAdminQuestionBank(id: string) {
  return apiRequest<AdminQuestionBank>({
    method: "GET",
    url: apiEndpoints.admin.interviewQuestionBanks.detail(id),
  });
}

export function createAdminQuestionBank(payload: CreateAdminQuestionBankPayload) {
  return apiRequest<AdminQuestionBank>({
    method: "POST",
    url: apiEndpoints.admin.interviewQuestionBanks.create,
    data: payload,
  });
}

export function updateAdminQuestionBank(id: string, payload: UpdateAdminQuestionBankPayload) {
  return apiRequest<AdminQuestionBank>({
    method: "PATCH",
    url: apiEndpoints.admin.interviewQuestionBanks.update(id),
    data: payload,
  });
}

export function deleteAdminQuestionBank(id: string) {
  return apiRequest<void>({
    method: "DELETE",
    url: apiEndpoints.admin.interviewQuestionBanks.delete(id),
  });
}

export const adminQuestionBankApi = {
  list(params?: PaginationParams) {
    return getAdminQuestionBanks(params);
  },
  create(payload: CreateAdminQuestionBankPayload) {
    return createAdminQuestionBank(payload);
  },
  update(id: string, payload: UpdateAdminQuestionBankPayload) {
    return updateAdminQuestionBank(id, payload);
  },
  delete(id: string) {
    return deleteAdminQuestionBank(id);
  },
};
