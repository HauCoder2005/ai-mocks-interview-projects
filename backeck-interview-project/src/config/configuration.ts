const numberFromEnv = (
  value: string | undefined,
  defaultValue: number,
): number => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
};

const booleanFromEnv = (
  value: string | undefined,
  defaultValue: boolean,
): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  return ['true', '1', 'yes'].includes(value.toLowerCase());
};

const csvFromEnv = (value: string | undefined): string[] =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export default () => ({
  app: {
    name: process.env.APP_NAME || 'ai-mock-interview-api',
    port: numberFromEnv(process.env.APP_PORT, 8080),
    host: process.env.APP_HOST || '0.0.0.0',
    env: process.env.APP_ENV || 'development',
    globalPrefix: process.env.APP_GLOBAL_PREFIX || 'api',
    swaggerPath: process.env.SWAGGER_PATH || '/api/docs',
    corsOrigins: csvFromEnv(
      process.env.CORS_ORIGIN ||
        process.env.CLIENT_URL ||
        process.env.APP_CORS_ORIGINS,
    ),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: numberFromEnv(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    db: numberFromEnv(process.env.REDIS_DB, 0),
    ttl: numberFromEnv(
      process.env.REDIS_TTL_MS,
      numberFromEnv(process.env.REDIS_TTL, 3600) * 1000,
    ),
  },
  storage: {
    endpoint: process.env.MINIO_ENDPOINT,
    region: process.env.MINIO_REGION || 'us-east-1',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME || 'interview-cv-bucket',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenTtlSeconds: numberFromEnv(
      process.env.JWT_ACCESS_TOKEN_TTL_SECONDS,
      15 * 60,
    ),
    refreshTokenTtlSeconds: numberFromEnv(
      process.env.JWT_REFRESH_TOKEN_TTL_SECONDS,
      7 * 24 * 60 * 60,
    ),
  },
  auth: {
    bcryptSaltRounds: numberFromEnv(process.env.AUTH_BCRYPT_SALT_ROUNDS, 12),
    otpTtlSeconds: numberFromEnv(process.env.AUTH_OTP_TTL_SECONDS, 5 * 60),
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: numberFromEnv(process.env.MAIL_PORT, 587),
    secure: booleanFromEnv(process.env.MAIL_SECURE, false),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
  cookie: {
    refreshTokenName: process.env.AUTH_REFRESH_COOKIE_NAME || 'refreshToken',
    secure: booleanFromEnv(process.env.AUTH_COOKIE_SECURE, true),
    path: process.env.AUTH_COOKIE_PATH || '/',
  },
  googleOAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
});
