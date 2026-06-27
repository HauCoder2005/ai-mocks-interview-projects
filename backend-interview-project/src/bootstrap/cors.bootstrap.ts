import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/env.interface';

/*
 * Cấu hình CORS cho toàn bộ backend.
 *
 * CORS dùng để cho phép frontend ở domain/port khác gọi API backend.
 * Ví dụ frontend NextJS chạy ở http://localhost:3000,
 * backend NestJS chạy ở http://localhost:8080 thì browser xem đây là khác origin.
 *
 * Hàm này không đọc process.env trực tiếp.
 * Thay vào đó, nó lấy AppConfig thông qua ConfigService để dùng lại cấu hình
 * đã được chuẩn hóa trong env.config.ts.
 *
 * appConfig.corsOrigins là danh sách frontend được phép gọi API.
 * Nếu corsOrigins rỗng thì fallback về clientUrl và frontendUrl.
 *
 * credentials: true cho phép gửi cookie hoặc Authorization header.
 * allowedHeaders có Authorization để frontend gửi access token dạng Bearer token.
 * OPTIONS được bật để browser thực hiện preflight request trước các request thật.
 */

export function setupCors(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('config.app');

  const allowedOrigins =
    appConfig.corsOrigins.length > 0
      ? appConfig.corsOrigins
      : [appConfig.clientUrl, appConfig.frontendUrl].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });
}
