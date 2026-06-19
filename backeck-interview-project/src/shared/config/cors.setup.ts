import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Thiết lập CORS tập trung cho toàn bộ HTTP API.
 *
 * Cấu hình này chỉ cho phép các origin được khai báo trong biến môi trường để
 * refresh token dạng HttpOnly Cookie không bị gửi kèm từ những domain ngoài ý muốn.
 *
 * @param app Ứng dụng NestJS cần cấu hình CORS.
 * @param configService Service đọc cấu hình môi trường đã được chuẩn hóa.
 */
export function setupCors(
  app: INestApplication,
  configService: ConfigService,
): void {
  const allowedOrigins = configService.get<string[]>('app.corsOrigins') ?? [];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    optionsSuccessStatus: 204,
  });
}
