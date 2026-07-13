export class CandidateInterviewHistoryItemResponse {
  sessionId!: number;
  configurationId!: number;
  title!: string;
  attemptNumber!: number;
  status!: string;
  position!: { id: number; name: string };
  level!: { id: number; name: string };
  interviewType!: string;
  questionCount!: number;
  answeredQuestionCount!: number;
  durationMinutes!: number;
  durationSeconds!: number | null;
  overallScore!: number | null;
  technologies!: Array<{ id: number; name: string; slug: string }>;
  topics!: Array<{ id: number; name: string }>;
  startedAt!: Date | null;
  completedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
