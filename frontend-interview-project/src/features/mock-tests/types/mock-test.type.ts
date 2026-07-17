import type { ApiListMeta } from "@/lib/api/core/api-response";

export type MockTestRelation = { id: number; name: string } | null;

export type MockTestListItem = {
  id: number;
  title: string;
  slug?: string;
  description: string | null;
  coverImageUrl?: string | null;
  durationMinutes: number | null;
  totalQuestions: number;
  status: "PUBLISHED";
  position?: MockTestRelation;
  level?: MockTestRelation;
  publishedAt?: string | null;
  createdAt: string;
};

export type MockTestAnswer = {
  id: number;
  label: string;
  content: string;
};

export type MockTestQuestion = {
  id: number;
  title: string;
  content: string;
  type: string;
  difficulty: string;
  technology: MockTestRelation;
  topic: MockTestRelation;
  level?: MockTestRelation;
  answers: MockTestAnswer[];
};

export type MockTestDetail = MockTestListItem & {
  questions: MockTestQuestion[];
};

export type SelectedMockTestAnswer = { questionId: number; answerId: number };
export type SubmitMockTestPayload = { answers: SelectedMockTestAnswer[] };

export type SubmitMockTestResultAnswer = MockTestAnswer & {
  isUserSelected: boolean;
  isCorrect: boolean;
};

export type SubmitMockTestResultQuestion = {
  questionId: number;
  title: string;
  content: string;
  userAnswerId: number | null;
  correctAnswerId: number | null;
  isCorrect: boolean;
  answers: SubmitMockTestResultAnswer[];
  expectedAnswer: string | null;
  explanation?: string | null;
};

export type SubmitMockTestResult = {
  mockTestId: number;
  title: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  percentage: number;
  questions: SubmitMockTestResultQuestion[];
};

export type MockTestListResponse = {
  items: MockTestListItem[];
  meta: ApiListMeta | null;
};

export type MockTestQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  technologyId?: number;
};
