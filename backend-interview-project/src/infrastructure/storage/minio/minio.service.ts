import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Readable } from 'stream';
import { MinioConfig } from 'src/config/env.interface';
import { ResourceLifecycleService } from 'src/shared/abstracts/connectable/resource-lifecycle.service';

@Injectable()
export class MinioService extends ResourceLifecycleService {
  private readonly logger = new Logger(MinioService.name);
  private readonly client: Client;
  private readonly bucketName: string;
  private readonly interviewAudioBucket: string;

  constructor(private readonly configService: ConfigService) {
    super();
    const minioConfig =
      this.configService.getOrThrow<MinioConfig>('config.minio');
    if (!minioConfig)
      this.logger.log(
        'Failed to load Minio configuration from environment variables.',
      );
    const minioUrl = new URL(minioConfig.endpoint);
    this.bucketName = minioConfig.bucketName;
    this.interviewAudioBucket = minioConfig.interviewAudioBucket;
    this.client = new Client({
      endPoint: minioUrl.hostname,
      port: Number(minioUrl.port || 9000),
      useSSL: minioUrl.protocol === 'https:',
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
      region: minioConfig.region,
    });
  }

  /**
   * Trả về bucket mặc định để các service dùng chung cấu hình storage.
   */
  getDefaultBucketName(): string {
    return this.bucketName;
  }

  /**
   * Trả về bucket dành riêng cho audio answer của voice interview.
   */
  getInterviewAudioBucketName(): string {
    return this.interviewAudioBucket;
  }

  /**
   * Tạo object key cố định cho audio answer theo user, session và turn.
   */
  buildInterviewAnswerAudioKey(input: {
    userId: string | number;
    sessionId: string | number;
    turnId: string;
    extension?: string;
  }): string {
    const extension = input.extension ?? 'mp3';

    return `interviews/${input.userId}/${input.sessionId}/${input.turnId}/answer.${extension}`;
  }

  /**
   * Upload buffer lên bucket MinIO và trả về object key đã lưu.
   */
  async uploadBuffer(input: {
    objectKey: string;
    buffer: Buffer;
    bucket?: string;
    contentType?: string;
  }): Promise<string> {
    const bucket = input.bucket ?? this.bucketName;

    await this.client.putObject(
      bucket,
      input.objectKey,
      input.buffer,
      input.buffer.length,
      input.contentType ? { 'Content-Type': input.contentType } : undefined,
    );

    return input.objectKey;
  }

  /**
   * Kiểm tra object có tồn tại trong bucket MinIO hay không.
   */
  async objectExists(bucket: string, objectKey: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, objectKey);

      return true;
    } catch (error) {
      const code = this.getMinioErrorCode(error);

      if (
        code === 'NotFound' ||
        code === 'NoSuchBucket' ||
        code === 'NoSuchKey'
      ) {
        return false;
      }

      throw error;
    }
  }

  /**
   * Đọc object từ MinIO thành Buffer để phục vụ xử lý nội bộ.
   */
  async getObjectBuffer(
    objectKey: string,
    bucket = this.bucketName,
  ): Promise<Buffer> {
    const objectStream = await this.client.getObject(bucket, objectKey);

    return this.readStreamToBuffer(objectStream);
  }

  /**
   * Tạo bucket mặc định nếu chưa tồn tại.
   */
  async onModuleInit(): Promise<void> {
    await Promise.all([
      this.ensureBucketExists(this.bucketName),
      this.ensureBucketExists(this.interviewAudioBucket),
    ]);

    this.logger.log(`MinIO connected successfully: ${this.bucketName}`);
  }

  /**
   * Tạo bucket theo tên truyền vào nếu bucket chưa tồn tại.
   */
  async ensureBucketExists(bucketName: string): Promise<void> {
    const bucketExists = await this.client.bucketExists(bucketName);
    if (!bucketExists) {
      await this.client.makeBucket(bucketName);

      this.logger.log(`MinIO bucket created: ${bucketName}`);
    }
  }

  private async readStreamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  private getMinioErrorCode(error: unknown): string | undefined {
    if (typeof error === 'object' && error && 'code' in error) {
      return String((error as { code?: unknown }).code);
    }

    return undefined;
  }
}
