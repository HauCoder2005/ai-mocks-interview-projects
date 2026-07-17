import type { SubmitMockTestPayload } from "../types/mock-test.type";

export function buildSubmitPayload(selectedAnswers: Record<number, number>): SubmitMockTestPayload {
  return {
    answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      answerId,
    })),
  };
}
