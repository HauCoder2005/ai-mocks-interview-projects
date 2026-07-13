import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/core/api-response";

export type MockTestSummaryDto = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  durationMinutes: number | null;
  totalQuestions: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
};

export type MockTestOptionDto = {
  id: number;
  content: string;
  displayOrder: number;
  isCorrect?: boolean;
};

export type MockTestQuestionDto = {
  id: number;
  title: string;
  content: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  displayOrder: number;
  selectedOptionId?: number | null;
  answeredAt?: string | null;
  isCorrect?: boolean;
  technology: { id: number; name: string; slug: string } | null;
  topic: { id: number; name: string; code: string } | null;
  options: MockTestOptionDto[];
  answers: (MockTestOptionDto & { label: string })[];
};

export type SubmitMockTestRequest = {
  answers: { questionId: number; answerId: number }[];
};

export type SubmitMockTestResultDto = {
  mockTestId: number;
  title: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  percentage: number;
  questions: {
    questionId: number;
    title: string;
    content: string;
    userAnswerId: number | null;
    correctAnswerId: number | null;
    isCorrect: boolean;
    expectedAnswer: string | null;
    answers: {
      id: number;
      label: string;
      content: string;
      isUserSelected: boolean;
      isCorrect: boolean;
    }[];
  }[];
};

export type MockTestDetailDto = MockTestSummaryDto & {
  questions: MockTestQuestionDto[];
};

export type MockTestAttemptDto = {
  id: number;
  mockTestId: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  totalQuestions: number;
  correctAnswers: number;
  score: number | null;
  startedAt: string;
  completedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  mockTest?: MockTestSummaryDto;
  questions?: MockTestQuestionDto[];
};

export type SubmitMockTestAnswerRequest = {
  questionBankId: number;
  selectedOptionId: number;
};

export type MockTestAnswerResponseDto = {
  questionBankId: number;
  selectedOptionId: number;
  answeredAt: string;
};

export type MockTestSubmitResultDto = {
  attemptId: number;
  status: "COMPLETED";
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
};

export type MockTestResultDto = {
  attemptId: number;
  mockTest: MockTestSummaryDto;
  score: number | null;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: string;
  completedAt: string | null;
  answers: {
    questionId: number;
    questionTitle: string;
    questionContent: string;
    selectedOptionId: number | null;
    correctOptionId: number | null;
    isCorrect: boolean;
    expectedAnswer: string | null;
    options: { id: number; content: string; isCorrect: boolean }[];
  }[];
};

export type MockTestListResponse = ApiResponseWithMeta<MockTestSummaryDto[]>;
export type MockTestDetailResponse = ApiResponse<MockTestDetailDto>;
export type SubmitMockTestResponse = ApiResponse<SubmitMockTestResultDto>;
export type MockTestAttemptResponse = ApiResponse<MockTestAttemptDto>;
export type MockTestAnswerResponse = ApiResponse<MockTestAnswerResponseDto>;
export type MockTestSubmitResponse = ApiResponse<MockTestSubmitResultDto>;
export type MockTestResultResponse = ApiResponse<MockTestResultDto>;
export type MockTestAttemptListResponse = ApiResponse<MockTestAttemptDto[]>;
