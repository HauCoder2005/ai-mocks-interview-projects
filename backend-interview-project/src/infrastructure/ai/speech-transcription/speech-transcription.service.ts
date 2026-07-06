import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { SpeechTranscriptionConfig } from 'src/config/env.interface';
import {
  SpeechTranscriptionFromObjectHttpResponse,
  SpeechTranscriptionResult,
  TranscribeFromObjectInput,
} from './interfaces/speech-transcription.interface';

@Injectable()
export class SpeechTranscriptionService {
  private readonly logger = new Logger(SpeechTranscriptionService.name);
  private readonly serviceUrl: string;
  private readonly internalServiceToken?: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    const speechConfig =
      this.configService.getOrThrow<SpeechTranscriptionConfig>(
        'config.speechTranscription',
      );

    this.serviceUrl = speechConfig.serviceUrl.replace(/\/$/, '');
    this.internalServiceToken = speechConfig.internalServiceToken;
    this.timeoutMs = speechConfig.timeoutMs;
  }

  /**
   * Gọi speech-transcription-service để chuyển audio đã lưu trong MinIO thành transcript text.
   */
  async transcribeFromObject(
    input: TranscribeFromObjectInput,
  ): Promise<SpeechTranscriptionResult> {
    const targetUrl = `${this.serviceUrl}/transcribe/from-object`;

    this.logger.log(
      `Calling speech service: url=${targetUrl}, bucket=${input.bucket}, objectKey=${input.objectKey}, sessionId=${input.sessionId}, turnId=${input.turnId}`,
    );

    try {
      const response =
        await axios.post<SpeechTranscriptionFromObjectHttpResponse>(
          targetUrl,
          {
            bucket: input.bucket,
            objectKey: input.objectKey,
            userId: String(input.userId),
            sessionId: String(input.sessionId),
            turnId: input.turnId,
          },
          {
            headers: this.buildHeaders(),
            timeout: this.timeoutMs,
          },
        );

      return {
        success: response.data.success,
        transcript: response.data.transcript,
        userId: String(input.userId),
        sessionId: String(input.sessionId),
        turnId: input.turnId,
        transcription: {
          model: response.data.transcription?.model ?? '',
          language: response.data.transcription?.language ?? '',
          detectedLanguage: response.data.transcription?.detectedLanguage,
        },
      };
    } catch (error) {
      this.logTranscriptionError(error, targetUrl, input);

      throw new BadGatewayException(
        'Speech transcription service failed to transcribe audio object',
      );
    }
  }

  private logTranscriptionError(
    error: unknown,
    targetUrl: string,
    input: TranscribeFromObjectInput,
  ): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Speech service error: url=${targetUrl}, status=${axiosError.response?.status ?? 'NO_RESPONSE'}, code=${axiosError.code ?? 'UNKNOWN'}, responseData=${this.stringifySafeResponse(axiosError.response?.data)}, objectKey=${input.objectKey}, sessionId=${input.sessionId}, turnId=${input.turnId}`,
      );

      return;
    }

    this.logger.error(
      `Speech service error: url=${targetUrl}, errorType=${error instanceof Error ? error.name : typeof error}, objectKey=${input.objectKey}, sessionId=${input.sessionId}, turnId=${input.turnId}`,
    );
  }

  private stringifySafeResponse(data: unknown): string {
    if (data === undefined) {
      return 'undefined';
    }

    try {
      return JSON.stringify(data);
    } catch {
      return '[unserializable]';
    }
  }

  private buildHeaders(): Record<string, string> {
    if (!this.internalServiceToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${this.internalServiceToken}`,
      'x-internal-service-token': this.internalServiceToken,
    };
  }
}
