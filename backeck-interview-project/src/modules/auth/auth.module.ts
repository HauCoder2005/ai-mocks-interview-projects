import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard, RolesGuard } from '../../shared/guards';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * Module xác thực người dùng.
 *
 * Module chỉ lắp ghép controller, service, guards và strategies cần cho các
 * luồng local auth, JWT refresh và Google OAuth.
 */
@Module({
  imports: [PassportModule, JwtModule.register({}), MailModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
