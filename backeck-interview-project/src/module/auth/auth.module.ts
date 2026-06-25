import { Module } from '@nestjs/common';

import { RedisModule } from 'src/infrastructure/cache/redis/redis.module';
import MailModule from 'src/infrastructure/mail/mail.module';
import SecurityModule from 'src/shared/security/security.module';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, SecurityModule, RedisModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
