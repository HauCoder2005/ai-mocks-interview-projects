import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

/**
 * Provider dùng chung để upload file lên MinIO Object Storage.
 */
@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly client: Client;
  private readonly bucketName: string;
  private readonly publicEndpoint: string;

  constructor(private readonly configService: ConfigService) {
    const rawEndpoint =
      this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
    const port = this.parsePort(this.configService.get<string>('MINIO_PORT'));
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY') || '';
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY') || '';
    const endpointUrl = this.buildEndpointUrl(rawEndpoint, port);

    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET') || 'cv-uploads';
    this.publicEndpoint = `${endpointUrl.protocol}//${endpointUrl.hostname}:${port}`;
    this.client = new Client({
      endPoint: endpointUrl.hostname,
      port,
      useSSL: endpointUrl.protocol === 'https:',
      accessKey,
      secretKey,
    });

    this.logger.log(
      `MinIO đang kết nối tới ${endpointUrl.hostname}:${port}, bucket=${this.bucketName}.`,
    );
  }

  /**
   * Upload file lên MinIO và trả về URL public tương ứng.
   *
   * @param file File nhận từ multipart request.
   * @param folder Thư mục logic trong bucket.
   * @returns URL file sau khi upload thành công.
   * @throws InternalServerErrorException Khi upload thất bại.
   */
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const objectName = this.buildObjectName(file.originalname, folder);

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
        `Không thể upload file ${file.originalname} lên MinIO.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể upload file. Vui lòng thử lại sau.',
      );
    }
  }

  private async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucketName);

    if (!exists) {
      await this.client.makeBucket(this.bucketName);
    }
  }

  private buildObjectName(originalName: string, folder: string): string {
    const extension = extname(originalName);
    const normalizedFolder = folder.replace(/^\/+|\/+$/g, '');

    return `${normalizedFolder}/${randomUUID()}${extension}`;
  }

  private buildEndpointUrl(endpoint: string, port: number): URL {
    const normalizedEndpoint = endpoint.startsWith('http')
      ? endpoint
      : `http://${endpoint}`;

    const endpointUrl = new URL(normalizedEndpoint);
    endpointUrl.port = String(port);

    return endpointUrl;
  }

  private parsePort(port?: string): number {
    const parsedPort = parseInt(port || '9000', 10);

    return Number.isNaN(parsedPort) ? 9000 : parsedPort;
  }
}
