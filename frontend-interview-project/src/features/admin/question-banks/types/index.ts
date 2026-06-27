export type QuestionType = "behavioral" | "technical" | "system-design" | "coding";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionBankOption = {
  id: string;
  label: string;
  value: string;
};

export type AdminQuestionBank = {
  id: string;
  title: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  technology?: string;
  topic?: string;
  isActive: boolean;
};

export type CreateAdminQuestionBankPayload = Omit<AdminQuestionBank, "id">;

export type UpdateAdminQuestionBankPayload = Partial<CreateAdminQuestionBankPayload>;
