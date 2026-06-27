import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { RootConfig } from './env.interface';

/*
 * Thiết lập Swagger cho toàn bộ ứng dụng.
 * Swagger path và trạng thái bật tắt vẫn đọc từ env config hiện tại.
 */
export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const configEnv = configService.getOrThrow<RootConfig>('config');

  if (!configEnv.app.swaggerEnabled) {
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI Mock Interview API')
    .setDescription('API documentation for AI Mock Interview backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(configEnv.app.swaggerPath, app, document);
}
