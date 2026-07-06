import type {
  AdminQuestionBankDto,
  CreateAdminQuestionBankRequest,
} from "@/lib/api/services/admin/question-banks";

export type AdminQuestion = AdminQuestionBankDto;

export type AdminQuestionFormInput = CreateAdminQuestionBankRequest;

export type AdminQuestionFilters = {
  technology: string;
  difficulty: string;
  questionType: string;
  topic: string;
  keyword: string;
};
