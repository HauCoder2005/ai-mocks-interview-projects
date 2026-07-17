import type { ApiListMeta } from '@/lib/api/core/api-response';

export type InterviewHistoryStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InterviewHistoryItem = {
  sessionId: number; configurationId: number; title: string; attemptNumber: number;
  status: InterviewHistoryStatus; position: { id: number; name: string };
  level: { id: number; name: string }; interviewType: string;
  questionCount: number; answeredQuestionCount: number; durationMinutes: number;
  durationSeconds: number | null; overallScore: number | null;
  technologies: Array<{ id: number; name: string; slug: string }>;
  topics: Array<{ id: number; name: string }>; startedAt: string | null;
  completedAt: string | null; createdAt: string; updatedAt: string;
};
export type InterviewHistoryDetail = InterviewHistoryItem & {
  questions: Array<{
    sessionQuestionId: number;
    displayOrder: number;
    content: string;
    answered: boolean;
    answer: { answerText: string | null } | null;
    review: { feedback: string | null } | null;
  }>;
  report: { recommendations: string | null; strengths: string | null } | null;
};
export type InterviewHistoryQuery = { page?: number; limit?: number; status?: InterviewHistoryStatus };
export type InterviewHistoryList = { items: InterviewHistoryItem[]; meta: ApiListMeta & { totalPages?: number } };
