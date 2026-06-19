import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

export interface UploadedAudioFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

/**
 * Service lưu trữ object lên MinIO.
 *
 * Service này che giấu chi tiết MinIO client để các module nghiệp vụ chỉ cần
 * gọi một hành động upload có nghĩa nghiệp vụ rõ ràng.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Client;
  private readonly bucketName: string;
  private readonly publicEndpoint: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.getOrThrow<string>('storage.endpoint');
    const accessKey =
      this.configService.getOrThrow<string>('storage.accessKey');
    const secretKey =
      this.configService.getOrThrow<string>('storage.secretKey');
    const endpointUrl = new URL(endpoint);

    this.bucketName =
      this.configService.getOrThrow<string>('storage.bucketName');
    this.publicEndpoint = endpoint.replace(/\/$/, '');
    this.client = new Client({
      endPoint: endpointUrl.hostname,
      port:
        Number(endpointUrl.port) ||
        (endpointUrl.protocol === 'https:' ? 443 : 80),
      useSSL: endpointUrl.protocol === 'https:',
      accessKey,
      secretKey,
    });
  }

  /**
   * Upload file audio câu trả lời lên MinIO.
   *
   * @param file File audio nhận từ multipart request.
   * @param userId Id người dùng sở hữu file.
   * @param questionId Id câu hỏi được trả lời.
   * @returns URL object đã upload.
   * @throws InternalServerErrorException Khi MinIO upload thất bại.
   */
  async uploadInterviewAudio(
    file: UploadedAudioFile,
    userId: number,
    questionId: number,
  ): Promise<string> {
    const objectName = this.buildObjectName(
      file.originalname,
      userId,
      questionId,
    );

    try {
      await this.ensureBucketExists();
      await this.client.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return `${this.publicEndpoint}/${this.bucketName}/${objectName}`;
    } catch (error) {
      this.logger.error(
        `Không thể upload audio phỏng vấn questionId=${questionId}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể lưu file audio. Vui lòng thử lại sau.',
      );
    }
  }

  private async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucketName);

    if (!exists) {
      await this.client.makeBucket(this.bucketName);
    }
  }

  private buildObjectName(
    originalName: string,
    userId: number,
    questionId: number,
  ): string {
    const extension = extname(originalName) || '.webm';

    return `interview-audio/users/${userId}/questions/${questionId}/${randomUUID()}${extension}`;
  }
}
