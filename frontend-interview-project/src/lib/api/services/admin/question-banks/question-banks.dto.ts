import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/core/api-response";

export type AdminQuestionBankOptionDto = {
  id: number;
  content: string;
  isCorrect: boolean;
  displayOrder: number;
};

export type AdminQuestionBankDto = {
  id: number;
  title: string;
  content: string;
  questionType: "MCQ" | "THEORY" | "CODING" | "CASE_STUDY";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  expectedAnswer: string | null;
  topic: { id: number; name: string; code: string } | null;
  technology: { id: number; name: string; slug: string; code: string } | null;
  options: AdminQuestionBankOptionDto[];
  createdAt: string;
  updatedAt: string;
};

export type UpsertAdminQuestionBankOptionRequest = {
  content: string;
  isCorrect: boolean;
  displayOrder: number;
};

export type CreateAdminQuestionBankRequest = {
  topicId: number;
  technologyId: number;
  title: string;
  content: string;
  questionType: AdminQuestionBankDto["questionType"];
  difficulty: AdminQuestionBankDto["difficulty"];
  expectedAnswer?: string;
  options?: UpsertAdminQuestionBankOptionRequest[];
};

export type UpdateAdminQuestionBankRequest =
  Partial<CreateAdminQuestionBankRequest>;

export type AdminQuestionBankListResponse =
  ApiResponseWithMeta<AdminQuestionBankDto[]>;
export type AdminQuestionBankResponse = ApiResponse<AdminQuestionBankDto>;
