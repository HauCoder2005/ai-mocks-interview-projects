import { request } from "@/lib/api/core";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";

import type {
  AdminQuestionBankListResponse,
  AdminQuestionBankResponse,
  CreateAdminQuestionBankRequest,
  UpdateAdminQuestionBankRequest,
} from "./question-banks.dto";

const ADMIN_QUESTION_BANKS_PATH = "/admin/interview-question-banks";

export const adminQuestionBanksService = {
  getQuestionBanks(): Promise<AdminQuestionBankListResponse> {
    return request<AdminQuestionBankListResponse>(ADMIN_QUESTION_BANKS_PATH, {
      method: ApiHttpMethod.GET,
      auth: true,
    });
  },

  getQuestionBankById(id: number): Promise<AdminQuestionBankResponse> {
    return request<AdminQuestionBankResponse>(
      `${ADMIN_QUESTION_BANKS_PATH}/${id}`,
      {
        method: ApiHttpMethod.GET,
        auth: true,
      },
    );
  },

  createQuestionBank(
    input: CreateAdminQuestionBankRequest,
  ): Promise<AdminQuestionBankResponse> {
    return request<AdminQuestionBankResponse>(ADMIN_QUESTION_BANKS_PATH, {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  updateQuestionBank(
    id: number,
    input: UpdateAdminQuestionBankRequest,
  ): Promise<AdminQuestionBankResponse> {
    return request<AdminQuestionBankResponse>(
      `${ADMIN_QUESTION_BANKS_PATH}/${id}`,
      {
        method: ApiHttpMethod.PATCH,
        auth: true,
        body: JSON.stringify(input),
      },
    );
  },

  deleteQuestionBank(id: number): Promise<AdminQuestionBankResponse> {
    return request<AdminQuestionBankResponse>(
      `${ADMIN_QUESTION_BANKS_PATH}/${id}`,
      {
        method: ApiHttpMethod.DELETE,
        auth: true,
      },
    );
  },
};
