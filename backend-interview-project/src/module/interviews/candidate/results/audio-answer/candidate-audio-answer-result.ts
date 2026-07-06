export interface CandidateAudioAnswerResult {
  sessionId: string;
  turnId: string;
  audio: {
    bucket: string;
    objectKey: string;
  };
  transcript: string;
  rawTranscript: string;
  normalizedTranscript: string;
  transcription: {
    model: string;
    language: string;
    detectedLanguage?: string;
  };
}
