import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/env.interface';

/*
 * Chuẩn hóa origin để tránh lỗi so sánh sai.
 * Ví dụ:
 * http://localhost:3000/
 * sẽ thành:
 * http://localhost:3000
 * Lý do:
 * Browser gửi Origin không có dấu "/" cuối.
 * Nếu env có dấu "/" cuối thì CORS sẽ không match.
 */
const normalizeOrigin = (origin?: string): string | null => {
  if (!origin) {
    return null;
  }
  const normalizedOrigin = origin.trim().replace(/\/+$/, '');
  return normalizedOrigin || null;
};

/*
 * Lấy danh sách origin được phép gọi backend.
 * Nguồn lấy từ:
 * - APP_CORS_ORIGINS
 * - CLIENT_URL
 * - FRONTEND_URL
 * Hàm này cũng loại bỏ:
 * - giá trị rỗng
 * - dấu "/" cuối
 * - origin bị trùng
 */
const resolveAllowedOrigins = (appConfig: AppConfig): string[] => {
  const origins = [
    ...(appConfig.corsOrigins ?? []),
    appConfig.clientUrl,
    appConfig.frontendUrl,
  ]
    .map(normalizeOrigin)
    .filter((origin): origin is string => Boolean(origin));
  return Array.from(new Set(origins));
};

/*
 * Cấu hình CORS cho toàn bộ backend.
 * Frontend và backend chạy khác port thì khác origin.
 * Ví dụ:
 * Frontend: http://localhost:3000
 * Backend:  http://localhost:8080
 * Backend phải cho phép origin frontend gọi API.
 * Danh sách origin được phép lấy từ env,
 * không hard-code trong code để sau này deploy chỉ cần đổi env.
 */
export function setupCors(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('config.app');
  const allowedOrigins = resolveAllowedOrigins(appConfig);
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
    optionsSuccessStatus: 204,
  });
}
