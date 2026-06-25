import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PasswordHashService } from './hashing/password-hash.service';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtTokenService } from './token/jwt-token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtTokenService, PasswordHashService, JwtAccessGuard, RolesGuard],
  exports: [JwtTokenService, PasswordHashService, JwtAccessGuard, RolesGuard],
})
export default class SecurityModule {}
