export interface TranscribeFromObjectInput {
  bucket?: string;
  objectKey: string;
  userId: string | number;
  sessionId: string | number;
  turnId: string;
}

export interface SpeechTranscriptionResult {
  success: boolean;
  transcript: string;
  userId?: string;
  sessionId?: string;
  turnId?: string;
  transcription?: {
    model: string;
    language: string;
    detectedLanguage?: string;
  };
}

export interface SpeechTranscriptionHttpResponse {
  success: boolean;
  transcript: string;
  transcription?: {
    model?: string;
    language?: string;
    detectedLanguage?: string;
  };
}

export interface SpeechTranscriptionFromObjectHttpResponse extends SpeechTranscriptionHttpResponse {
  userId?: string;
  sessionId?: string;
  turnId?: string;
}
