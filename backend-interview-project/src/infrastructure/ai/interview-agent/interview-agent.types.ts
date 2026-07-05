export interface EvaluateAnswerInput {
  sessionId: string;
  turnId: string;
  question: string;
  mainTopic: string;
  positionName: string;
  levelName: string;
  interviewType: string;
  rawTranscript: string;
  normalizedTranscript: string;
  previousQuestions: string[];
  previousAnswers: string[];
  sessionContext?: InterviewAgentSessionContext;
  evaluationLanguage: string;
}

export interface InterviewAgentSessionContext {
  currentQuestionIndex: number | null;
  totalQuestions: number | null;
  answeredQuestionCount: number | null;
  remainingQuestionCount: number | null;
}

export interface InterviewAgentEvaluationResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  relevanceScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  improvedAnswerSuggestion: string;
  nextQuestion: string;
  shouldContinue: boolean;
  topicFocus: string;
  model: string;
}
