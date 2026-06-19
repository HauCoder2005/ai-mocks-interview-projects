import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { LoggerService } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { setupCors } from './shared/config/cors.setup';
import { setupSwagger } from './shared/config/swagger.setup';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { GlobalValidationPipe } from './shared/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  const globalPrefix = configService.get<string>('app.globalPrefix');

  app.useLogger(logger);
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(
    new HttpExceptionFilter(
      logger,
      configService.get<string>('app.env') ?? 'development',
    ),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }

  setupCors(app, configService);
  setupSwagger(app, configService);

  await app.listen(
    configService.get<number>('app.port') ?? 8080,
    configService.get<string>('app.host') ?? '0.0.0.0',
  );
}
void bootstrap();
