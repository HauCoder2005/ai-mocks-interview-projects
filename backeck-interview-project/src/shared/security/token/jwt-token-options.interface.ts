import {
  JwtSignOptions,
  JwtVerifyOptions,
} from '@nestjs/jwt';

export interface JwtTokenTtlSeconds {
  accessToken: number;
  refreshToken: number;
}

export interface JwtTokenOptions {
  accessTokenSignOptions: JwtSignOptions;
  refreshTokenSignOptions: JwtSignOptions;
  accessTokenVerifyOptions: JwtVerifyOptions;
  refreshTokenVerifyOptions: JwtVerifyOptions;
  ttlSeconds: JwtTokenTtlSeconds;
}