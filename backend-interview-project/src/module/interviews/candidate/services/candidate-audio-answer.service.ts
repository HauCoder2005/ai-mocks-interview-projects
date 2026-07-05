import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { SpeechTranscriptionService } from 'src/infrastructure/ai/speech-transcription/speech-transcription.service';
import { MinioService } from 'src/infrastructure/storage/minio/minio.service';
import { TranscriptNormalizationService } from 'src/shared/transcript-processing';
import { CandidateInterviewSessionRepository } from '../repositories/candidate-interview-session.repository';
import { CandidateAudioAnswerResult } from '../results/audio-answer/candidate-audio-answer-result';

export interface CandidateAudioAnswerFileInput {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class CandidateAudioAnswerService {
  private readonly logger = new Logger(CandidateAudioAnswerService.name);
  private readonly allowedMimeTypes = new Set([
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/webm',
    'audio/ogg',
    'video/webm',
  ]);

  constructor(
    private readonly minioService: MinioService,
    private readonly speechTranscriptionService: SpeechTranscriptionService,
    private readonly sessionRepository: CandidateInterviewSessionRepository,
    private readonly transcriptNormalizationService: TranscriptNormalizationService,
  ) {}

  /**
   * Nhận audio answer của Candidate, lưu vào MinIO và chuyển thành transcript text.
   */
  async submitAudioAnswer(input: {
    userId: number;
    sessionId: string;
    audioFile: CandidateAudioAnswerFileInput;
  }): Promise<CandidateAudioAnswerResult> {
    this.validateAudioFile(input.audioFile);
    const sessionId = this.parseSessionId(input.sessionId);
    await this.validateInProgressSession({
      sessionId,
      userId: input.userId,
    });

    const turnId = this.buildTurnId();
    const bucket = this.minioService.getInterviewAudioBucketName();
    const objectKey = this.minioService.buildInterviewAnswerAudioKey({
      userId: input.userId,
      sessionId,
      turnId,
      extension: this.getAudioExtension(input.audioFile),
    });

    this.logger.log(
      `Uploading candidate audio answer: bucket=${bucket}, objectKey=${objectKey}, sessionId=${sessionId}, turnId=${turnId}`,
    );

    await this.minioService.uploadBuffer({
      bucket,
      objectKey,
      buffer: input.audioFile.buffer,
      contentType: input.audioFile.mimetype,
    });

    const objectExists = await this.minioService.objectExists(
      bucket,
      objectKey,
    );
    if (!objectExists) {
      this.logger.error(
        `Uploaded candidate audio object not found: bucket=${bucket}, objectKey=${objectKey}, sessionId=${sessionId}, turnId=${turnId}`,
      );

      throw new InternalServerErrorException(
        'Audio upload failed before transcription',
      );
    }

    const transcription =
      await this.speechTranscriptionService.transcribeFromObject({
        bucket,
        objectKey,
        userId: input.userId,
        sessionId,
        turnId,
      });
    const rawTranscript = transcription.transcript;
    const normalizedTranscript =
      this.transcriptNormalizationService.normalize(rawTranscript);

    this.logger.log(
      `Candidate audio answer transcribed: userId=${input.userId}, sessionId=${input.sessionId}, turnId=${turnId}`,
    );

    return {
      sessionId: String(sessionId),
      turnId,
      audio: {
        bucket,
        objectKey,
      },
      transcript: normalizedTranscript || rawTranscript,
      rawTranscript,
      normalizedTranscript,
      transcription: {
        model: transcription.transcription?.model ?? '',
        language: transcription.transcription?.language ?? '',
        detectedLanguage: transcription.transcription?.detectedLanguage,
      },
    };
  }

  private validateAudioFile(audioFile?: CandidateAudioAnswerFileInput): void {
    if (!audioFile) {
      throw new BadRequestException('Audio file is required');
    }

    if (!this.allowedMimeTypes.has(audioFile.mimetype)) {
      throw new BadRequestException('Unsupported audio type');
    }

    if (!audioFile.buffer?.length) {
      throw new BadRequestException('Audio file is empty');
    }
  }

  private parseSessionId(sessionId: string): number {
    const parsedSessionId = Number(sessionId);

    if (!Number.isInteger(parsedSessionId) || parsedSessionId < 1) {
      throw new BadRequestException('Invalid interview session id');
    }

    return parsedSessionId;
  }

  private async validateInProgressSession(input: {
    sessionId: number;
    userId: number;
  }): Promise<void> {
    const session =
      await this.sessionRepository.findInProgressSessionByIdAndUserId(input);

    if (!session) {
      throw new NotFoundException(
        'Interview session not found or not in progress',
      );
    }
  }

  private buildTurnId(): string {
    return `turn-${randomUUID()}`;
  }

  private getAudioExtension(audioFile: CandidateAudioAnswerFileInput): string {
    const extension = extname(audioFile.originalname).replace('.', '');

    if (extension) {
      return extension;
    }

    const fallbackExtensions: Record<string, string> = {
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/wav': 'wav',
      'audio/x-wav': 'wav',
      'audio/webm': 'webm',
      'video/webm': 'webm',
      'audio/ogg': 'ogg',
    };

    return fallbackExtensions[audioFile.mimetype] ?? 'mp3';
  }
}
