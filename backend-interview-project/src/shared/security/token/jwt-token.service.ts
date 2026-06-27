import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtConfig } from '../../../config/env.interface';
import {
  JwtTokenOptions,
  JwtTokenTtlSeconds,
} from './jwt-token-options.interface';

@Injectable()
export class JwtTokenService {
  private readonly tokenOptions: JwtTokenOptions;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    const jwtConfig = configService.getOrThrow<JwtConfig>('config.jwt');

    this.tokenOptions = {
      accessTokenSignOptions: {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.accessTokenTtlSeconds,
      },

      refreshTokenSignOptions: {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshTokenTtlSeconds,
      },

      accessTokenVerifyOptions: {
        secret: jwtConfig.secret,
      },

      refreshTokenVerifyOptions: {
        secret: jwtConfig.refreshSecret,
      },

      ttlSeconds: {
        accessToken: jwtConfig.accessTokenTtlSeconds,
        refreshToken: jwtConfig.refreshTokenTtlSeconds,
      },
    };
  }

  signAccessToken<TPayload extends object>(payload: TPayload): Promise<string> {
    return this.jwtService.signAsync(
      payload,
      this.tokenOptions.accessTokenSignOptions,
    );
  }

  signRefreshToken<TPayload extends object>(
    payload: TPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(
      payload,
      this.tokenOptions.refreshTokenSignOptions,
    );
  }

  verifyAccessToken<TPayload extends object>(token: string): Promise<TPayload> {
    return this.jwtService.verifyAsync<TPayload>(
      token,
      this.tokenOptions.accessTokenVerifyOptions,
    );
  }

  verifyRefreshToken<TPayload extends object>(
    token: string,
  ): Promise<TPayload> {
    return this.jwtService.verifyAsync<TPayload>(
      token,
      this.tokenOptions.refreshTokenVerifyOptions,
    );
  }

  getTokenTtlSeconds(): JwtTokenTtlSeconds {
    return this.tokenOptions.ttlSeconds;
  }
}
