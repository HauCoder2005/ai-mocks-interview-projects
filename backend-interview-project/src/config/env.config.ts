import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { AppEnvironment, RootConfig } from './env.interface';

export const configuration = registerAs('config', (): RootConfig => {
  const appEnv = (process.env.APP_ENV ?? 'development') as AppEnvironment;

  const corsOrigins = process.env.APP_CORS_ORIGINS
    ? process.env.APP_CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : ([
        process.env.CORS_ORIGIN,
        process.env.CLIENT_URL,
        process.env.FRONTEND_URL,
      ].filter(Boolean) as string[]);

  return {
    app: {
      name: process.env.APP_NAME ?? 'ai-mock-interview-api',
      port: Number(process.env.APP_PORT ?? 3000),
      env: appEnv,
      host: process.env.APP_HOST ?? '0.0.0.0',
      globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api',
      corsOrigins,
      clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
      frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
      swaggerPath: process.env.SWAGGER_PATH ?? '/api/doc',
      swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
      isDevelopment: appEnv === 'development',
      isProduction: appEnv === 'production',
    },

    database: {
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: Number(process.env.DATABASE_PORT ?? 3306),
      name: process.env.DATABASE_NAME ?? 'ai_mock_interview',
      user: process.env.DATABASE_USER ?? 'root',
      password: process.env.DATABASE_PASSWORD ?? '',
      url: process.env.DATABASE_URL ?? '',
    },

    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      ttl: Number(process.env.REDIS_TTL ?? 3600),
      password: process.env.REDIS_PASSWORD || undefined,
      db: Number(process.env.REDIS_DB ?? 0),
    },

    minio: {
      endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
      region: process.env.MINIO_REGION || undefined,
      accessKey: process.env.MINIO_ACCESS_KEY || undefined,
      secretKey: process.env.MINIO_SECRET_KEY || undefined,
      bucketName: process.env.MINIO_BUCKET_NAME ?? 'ai-mock-interview',
      interviewAudioBucket:
        process.env.MINIO_INTERVIEW_AUDIO_BUCKET ?? 'interview-audio-bucket',
    },

    speechTranscription: {
      serviceUrl:
        process.env.SPEECH_TRANSCRIPTION_SERVICE_URL ?? 'http://localhost:8001',
      internalServiceToken: process.env.AI_INTERNAL_SERVICE_TOKEN || undefined,
      timeoutMs: Number(process.env.SPEECH_TRANSCRIPTION_TIMEOUT_MS ?? 300000),
    },

    interviewAgent: {
      serviceUrl:
        process.env.INTERVIEW_AGENT_SERVICE_URL ?? 'http://localhost:8002',
      internalServiceToken: process.env.AI_INTERNAL_SERVICE_TOKEN || undefined,
      timeoutMs: Number(process.env.INTERVIEW_AGENT_TIMEOUT_MS ?? 120000),
    },

    jwt: {
      secret: process.env.JWT_SECRET ?? '',
      refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
      accessTokenTtlSeconds: Number(
        process.env.JWT_ACCESS_TOKEN_TTL_SECONDS ?? 900,
      ),
      refreshTokenTtlSeconds: Number(
        process.env.JWT_REFRESH_TOKEN_TTL_SECONDS ?? 604800,
      ),
    },

    auth: {
      bcryptSaltRounds: Number(process.env.AUTH_BCRYPT_SALT_ROUNDS ?? 12),
      otpTtlSeconds: Number(process.env.AUTH_OTP_TTL_SECONDS ?? 300),
      refreshCookieName: process.env.AUTH_REFRESH_COOKIE_NAME ?? 'refreshToken',
      cookieSecure: process.env.AUTH_COOKIE_SECURE === 'true',
      cookiePath: process.env.AUTH_COOKIE_PATH ?? '/',
    },

    mail: {
      host: process.env.MAIL_HOST || undefined,
      port: Number(process.env.MAIL_PORT ?? 587),
      secure: process.env.MAIL_SECURE === 'true',
      user: process.env.MAIL_USER || undefined,
      password: process.env.MAIL_PASSWORD || undefined,
      from: process.env.MAIL_FROM ?? 'AI Mock Interview <no-reply@example.com>',
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || undefined,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || undefined,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || undefined,
    },
  };
});

export const configValidationSchema = Joi.object({
  APP_NAME: Joi.string().default('ai-mock-interview-api'),
  APP_PORT: Joi.number().default(3000),
  APP_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  APP_HOST: Joi.string().default('0.0.0.0'),
  APP_GLOBAL_PREFIX: Joi.string().default('api'),

  APP_CORS_ORIGINS: Joi.string().allow('', null),
  CORS_ORIGIN: Joi.string().allow('', null),
  CLIENT_URL: Joi.string().default('http://localhost:3000'),
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),

  SWAGGER_PATH: Joi.string().default('/api/doc'),
  SWAGGER_ENABLED: Joi.boolean().default(true),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('', null),
  REDIS_DB: Joi.number().default(0),
  REDIS_TTL: Joi.number().default(3600),

  MINIO_ENDPOINT: Joi.string().default('http://localhost:9000'),
  MINIO_REGION: Joi.string().allow('', null),
  MINIO_ACCESS_KEY: Joi.string().allow('', null),
  MINIO_SECRET_KEY: Joi.string().allow('', null),
  MINIO_BUCKET_NAME: Joi.string().default('ai-mock-interview'),
  MINIO_INTERVIEW_AUDIO_BUCKET: Joi.string().default('interview-audio-bucket'),

  SPEECH_TRANSCRIPTION_SERVICE_URL: Joi.string()
    .uri()
    .default('http://localhost:8001'),
  AI_INTERNAL_SERVICE_TOKEN: Joi.string().allow('', null),
  SPEECH_TRANSCRIPTION_TIMEOUT_MS: Joi.number().default(300000),
  INTERVIEW_AGENT_SERVICE_URL: Joi.string()
    .uri()
    .default('http://localhost:8002'),
  INTERVIEW_AGENT_TIMEOUT_MS: Joi.number().default(120000),
  INTERVIEW_AGENT_MODEL: Joi.string().default('qwen3:4b'),
  INTERVIEW_AGENT_PROVIDER: Joi.string().default('ollama'),
  INTERVIEW_AGENT_TEMPERATURE: Joi.number().default(0.25),
  INTERVIEW_AGENT_NUM_CTX: Joi.number().default(4096),
  OLLAMA_BASE_URL: Joi.string().uri().default('http://localhost:11434'),

  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL_SECONDS: Joi.number().default(900),
  JWT_REFRESH_TOKEN_TTL_SECONDS: Joi.number().default(604800),

  AUTH_BCRYPT_SALT_ROUNDS: Joi.number().default(12),
  AUTH_OTP_TTL_SECONDS: Joi.number().default(300),
  AUTH_REFRESH_COOKIE_NAME: Joi.string().default('refreshToken'),
  AUTH_COOKIE_SECURE: Joi.boolean().default(false),
  AUTH_COOKIE_PATH: Joi.string().default('/'),

  MAIL_HOST: Joi.string().allow('', null),
  MAIL_PORT: Joi.number().default(587),
  MAIL_SECURE: Joi.boolean().default(false),
  MAIL_USER: Joi.string().allow('', null),
  MAIL_PASSWORD: Joi.string().allow('', null),
  MAIL_FROM: Joi.string().default('AI Mock Interview <no-reply@example.com>'),

  GOOGLE_CLIENT_ID: Joi.string().allow('', null),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('', null),
  GOOGLE_CALLBACK_URL: Joi.string().allow('', null),
});
