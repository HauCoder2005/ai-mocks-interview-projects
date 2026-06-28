
/*
 * server-backend.ts dùng cho phía server của Next.js.
 *
 * File này có nhiệm vụ tạo URL backend thật để route handler của Next.js
 * gọi sang backend NestJS.
 *
 * Không dùng file này trực tiếp trong UI component.
 *
 * Ví dụ:
 * - Frontend gọi: /api/auth/login
 * - Next.js route handler dùng file này để gọi backend thật:
 *   http://localhost:8080/api/auth/login
 *
 * File này cũng định nghĩa tên cookie token và helper tạo Authorization header
 * để các route handler gọi API cần đăng nhập.
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL;
if (!BACKEND_API_URL) throw Error('No search or find env url!');

export const createBackendServerUrl = () => {
    
}