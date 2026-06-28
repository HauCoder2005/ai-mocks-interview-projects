/*
 * Cấu hình cookie dùng cho authentication.
 *
 * access_token:
 * - Lưu access token để gọi các API cần đăng nhập.
 *
 * refresh_token:
 * - Lưu refresh token để xin access token mới khi access token hết hạn.
 *
 * httpOnly:
 * - Không cho JavaScript phía browser đọc token.
 *
 * secure:
 * - Production dùng HTTPS thì bật true.
 * - Development localhost thì để false.
 *
 * sameSite: "lax":
 * - Giảm rủi ro CSRF cơ bản.
 *
 * path: "/":
 * - Cookie có hiệu lực trên toàn bộ ứng dụng.
 */

export const AUTH_COOKIE_NAMES = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};