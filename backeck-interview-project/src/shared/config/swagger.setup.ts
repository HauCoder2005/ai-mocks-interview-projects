import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Thiết lập tài liệu OpenAPI cho API nội bộ.
 *
 * Swagger được cấu hình ở shared config để bootstrap không chứa chi tiết tạo
 * document, đồng thời mọi module có thể dùng chung Bearer Auth scheme.
 *
 * @param app Ứng dụng NestJS cần gắn Swagger UI.
 * @param configService Service đọc cấu hình môi trường đã được chuẩn hóa.
 */
export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const swaggerPath = normalizeSwaggerPath(
    configService.get<string>('app.swaggerPath') ?? '/api/docs',
  );
  const config = new DocumentBuilder()
    .setTitle('AI Mock Interview Platform API')
    .setDescription(
      'Tài liệu OpenAPI cho hệ thống phỏng vấn thử bằng AI, bao gồm xác thực, quản lý phiên và các module nghiệp vụ.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập access token JWT theo định dạng Bearer.',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, document);
}

function normalizeSwaggerPath(path: string): string {
  return path.replace(/^\/+/, '');
}
