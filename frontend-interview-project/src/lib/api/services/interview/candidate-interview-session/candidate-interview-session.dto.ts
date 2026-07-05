import type { ApiResponse } from "@/lib/api/core";

export type StartInterviewSessionRequest = {
  positionId: number;
  levelId: number;
};

export type StartInterviewSessionData = {
  id: number;
  sessionId: string | number;
  configurationId: number;
  positionId: number;
  levelId: number;
  attemptNumber: number;
  status: string;
  startedAt: string;
};

export type StartInterviewSessionResponse =
  ApiResponse<StartInterviewSessionData>;

export type UploadAudioAnswerRequest = {
  sessionId: string | number;
  audio: File;
};

export type UploadedAudioStorage = {
  bucket: string;
  objectKey: string;
};

export type AudioTranscriptionData = {
  model: string;
  language: string;
  detectedLanguage?: string;
};

export type UploadAudioAnswerData = {
  sessionId: string;
  turnId: string;
  audio: UploadedAudioStorage;
  transcript: string;
  rawTranscript: string;
  normalizedTranscript: string;
  transcription: AudioTranscriptionData;
};

export type UploadAudioAnswerResponse = ApiResponse<UploadAudioAnswerData>;

export type EvaluateAnswerRequest = {
  turnId: string;
  question: string;
  rawTranscript: string;
  normalizedTranscript: string;
  previousQuestions: string[];
  previousAnswers: string[];
  mainTopic: string;
  positionName: string;
  levelName: string;
  interviewType: string;
};

export type EvaluateAnswerData = {
  sessionId: string;
  turnId: string;
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
};

export type EvaluateAnswerResponse = ApiResponse<EvaluateAnswerData>;
