export type AppEnvironment = 'development' | 'test' | 'staging' | 'production';

export interface AppConfig {
  name: string;
  port: number;
  env: AppEnvironment;
  host: string;
  globalPrefix: string;
  corsOrigins: string[];
  clientUrl: string;
  frontendUrl: string;
  swaggerPath: string;
  swaggerEnabled: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  url: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  ttl: number;
  password?: string;
  db: number;
}

export interface MinioConfig {
  endpoint: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
  bucketName: string;
  interviewAudioBucket: string;
}

export interface SpeechTranscriptionConfig {
  serviceUrl: string;
  internalServiceToken?: string;
  timeoutMs: number;
}

export interface InterviewAgentConfig {
  serviceUrl: string;
  internalServiceToken?: string;
  timeoutMs: number;
}

export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
}

export interface AuthConfig {
  bcryptSaltRounds: number;
  otpTtlSeconds: number;
  refreshCookieName: string;
  cookieSecure: boolean;
  cookiePath: string;
}

export interface MailConfig {
  host?: string;
  port: number;
  secure: boolean;
  user?: string;
  password?: string;
  from: string;
}

export interface GoogleConfig {
  clientId?: string;
  clientSecret?: string;
  callbackUrl?: string;
}

export interface RootConfig {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  minio: MinioConfig;
  speechTranscription: SpeechTranscriptionConfig;
  interviewAgent: InterviewAgentConfig;
  jwt: JwtConfig;
  auth: AuthConfig;
  mail: MailConfig;
  google: GoogleConfig;
}
