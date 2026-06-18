export const AUTH_CONSTANTS = {
  OTP_LENGTH: 6,
  REDIS_KEYS: {
    verifyOtp: (userId: number) => `otp:verify:${userId}`,
    refreshToken: (userId: number) => `refresh:${userId}`,
  },
} as const;
