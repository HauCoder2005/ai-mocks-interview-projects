import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RootConfig } from './config/env.interface';
import { setupSwagger } from './config/swagger.config';
import { setupCors } from './bootstrap/cors.bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const configEnv = configService.getOrThrow<RootConfig>('config');

  app.enableShutdownHooks();

  app.setGlobalPrefix(configEnv.app.globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app);
  setupCors(app);
  await app.listen(configEnv.app.port, configEnv.app.host);

  console.log(
    `Server running at http://${configEnv.app.host}:${configEnv.app.port}/${configEnv.app.globalPrefix}`,
  );
}

void bootstrap();
