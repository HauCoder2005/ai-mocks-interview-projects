import type {
  EvaluateAnswerData,
  EvaluateAnswerRequest,
  StartInterviewSessionData,
  StartInterviewSessionRequest,
  UploadAudioAnswerData,
} from "@/lib/api/services/interview/candidate-interview-session";

export type InterviewSetupInput = StartInterviewSessionRequest;

export type InterviewSession = StartInterviewSessionData;

export type AudioAnswerResponse = UploadAudioAnswerData;

export type EvaluateAnswerInput = EvaluateAnswerRequest;

export type EvaluateAnswerResponse = EvaluateAnswerData;

export interface EvaluationScore {
  label: string;
  value: number;
}
