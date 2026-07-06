import { InterviewAgentEvaluationResult } from 'src/infrastructure/ai/interview-agent';

export interface CandidateInterviewEvaluationResult extends InterviewAgentEvaluationResult {
  sessionId: string;
  turnId: string;
}
