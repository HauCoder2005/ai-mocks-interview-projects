import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PasswordHashService } from './hashing/password-hash.service';
import { JwtTokenService } from './token/jwt-token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtTokenService, PasswordHashService],
  exports: [JwtTokenService, PasswordHashService],
})
export default class SecurityModule {}
