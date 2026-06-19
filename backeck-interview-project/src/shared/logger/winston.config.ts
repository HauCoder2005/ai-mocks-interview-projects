import * as winston from 'winston';

const { colorize, combine, errors, json, printf, timestamp } = winston.format;
const isProduction = process.env.APP_ENV === 'production';

const developmentFormat = combine(
  errors({ stack: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  colorize({ all: true }),
  printf(({ context, level, message, stack, timestamp: loggedAt }) => {
    const resolvedContext =
      typeof context === 'string' && context.length > 0 ? ` {${context}}` : '';
    const resolvedMessage =
      typeof stack === 'string' && stack.length > 0 ? stack : String(message);
    const resolvedTimestamp = String(loggedAt);
    const resolvedLevel = String(level);

    return `[${resolvedTimestamp}] [${resolvedLevel}]: ${resolvedMessage}${resolvedContext}`;
  }),
);

const productionFormat = combine(errors({ stack: true }), timestamp(), json());

export const winstonLoggerConfig: winston.LoggerOptions = {
  level: isProduction ? 'info' : 'debug',
  levels: winston.config.npm.levels,
  format: isProduction ? productionFormat : developmentFormat,
  transports: [
    new winston.transports.Console({
      format: isProduction ? productionFormat : developmentFormat,
    }),
  ],
};
