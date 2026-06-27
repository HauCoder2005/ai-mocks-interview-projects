export type QuestionType = "MCQ" | "THEORY" | "CODING" | "CASE_STUDY";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export type QuestionBankOption = {
  id?: string;
  content: string;
  isCorrect: boolean;
  explanation?: string;
};

export type AdminQuestionBank = {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  position?: string;
  level?: string;
  technology?: string;
  topic?: string;
  options?: QuestionBankOption[];
  isActive: boolean;
};

export type CreateAdminQuestionBankPayload = Omit<AdminQuestionBank, "id" | "isActive"> & {
  isActive?: boolean;
};

export type UpdateAdminQuestionBankPayload = Partial<CreateAdminQuestionBankPayload>;
