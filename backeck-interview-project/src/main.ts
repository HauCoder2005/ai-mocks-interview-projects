import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { RootConfig } from './config/env.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const configEnv = configService.getOrThrow<RootConfig>('config');

  app.enableShutdownHooks();

  app.setGlobalPrefix(configEnv.app.globalPrefix);

  await app.listen(configEnv.app.port, configEnv.app.host);

  console.log(
    `Server running at http://${configEnv.app.host}:${configEnv.app.port}/${configEnv.app.globalPrefix}`,
  );
}

void bootstrap();