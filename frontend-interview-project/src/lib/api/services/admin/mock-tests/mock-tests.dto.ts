import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/core/api-response";

import type { AdminQuestionBankDto } from "../question-banks";

export type MockTestStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type MockTestQuestion = Pick<
  AdminQuestionBankDto,
  "id" | "title" | "content" | "difficulty" | "technology" | "topic" | "options"
> & {
  displayOrder: number;
};

export type MockTest = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  durationMinutes: number | null;
  totalQuestions: number;
  status: MockTestStatus;
  createdAt: string;
  updatedAt: string;
};

export type MockTestDetail = MockTest & {
  questions: MockTestQuestion[];
};

export type MockTestQuery = {
  keyword?: string;
  technologyId?: number;
  topicId?: number;
  difficulty?: AdminQuestionBankDto["difficulty"];
  page?: number;
  limit?: number;
};

export type CreateMockTestRequest = {
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  durationMinutes?: number;
};

export type UpdateMockTestRequest = Partial<CreateMockTestRequest>;

export type AttachMockTestQuestionsRequest = {
  questionBankIds: number[];
};

export type MockTestListResponse = ApiResponseWithMeta<MockTest[]>;
export type MockTestResponse = ApiResponse<MockTestDetail>;
