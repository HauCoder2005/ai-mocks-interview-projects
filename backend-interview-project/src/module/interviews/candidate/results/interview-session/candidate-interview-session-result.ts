import { interview_sessions_status } from 'generated/prisma/client';

export interface CandidateInterviewSessionResult {
  id: number;
  sessionId: number;
  configurationId: number;
  positionId: number;
  levelId: number;
  attemptNumber: number;
  status: interview_sessions_status;
  startedAt: Date | null;
}
