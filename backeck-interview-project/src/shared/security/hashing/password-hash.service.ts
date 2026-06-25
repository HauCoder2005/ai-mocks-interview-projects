import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthConfig } from 'src/config/env.interface';

@Injectable()
export class PasswordHashService {
  private readonly passwordHashSaltRounds: number;

  constructor(private readonly configService: ConfigService) {
    const authConfig = this.configService.getOrThrow<AuthConfig>('config.auth');
    this.passwordHashSaltRounds = authConfig.bcryptSaltRounds;
  }

  generatePasswordHash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.passwordHashSaltRounds);
  }

  verifyPasswordHash(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
