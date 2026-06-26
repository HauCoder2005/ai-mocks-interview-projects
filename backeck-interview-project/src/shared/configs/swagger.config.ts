import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { RootConfig } from 'src/config/env.interface';

/*
 * Thiết lập Swagger UI cho toàn bộ ứng dụng.
 * Path và trạng thái bật/tắt được lấy từ cấu hình env hiện có.
 */
export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const configEnv = configService.getOrThrow<RootConfig>('config');

  if (!configEnv.app.swaggerEnabled) {
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI Mock Interview API')
    .setDescription('API documentation for AI Mock Interview Platform')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    normalizeSwaggerPath(configEnv.app.swaggerPath),
    app,
    document,
  );
}

/*
 * Chuẩn hóa Swagger path để tránh double slash hoặc /api/api/doc.
 * Hàm này không tự cộng global prefix vì SWAGGER_PATH đã là path cuối cùng.
 */
function normalizeSwaggerPath(swaggerPath: string): string {
  return swaggerPath.replace(/^\/+/, '').replace(/\/+$/, '');
}
