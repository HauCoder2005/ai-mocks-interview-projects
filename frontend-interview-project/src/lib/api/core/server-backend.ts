import "server-only";

/*
 * backend-server.ts dùng cho phía server của Next.js.
 *
 * Đây là file cấu hình trung tâm để Next.js server gọi sang backend NestJS thật.
 *
 * File này KHÔNG dùng trực tiếp trong UI component.
 * Nghĩa là các component React, page client, form, table... không import file này.
 *
 * Lý do:
 * - File này dùng biến môi trường BACKEND_API_URL.
 * - File này chạy ở server Next.js.
 * - File này có import "server-only" để tránh bị import nhầm vào phía browser.
 *
 * Flow tổng quát:
 *
 * UI user/admin
 *   -> gọi route nội bộ của Next.js, ví dụ: /api/auth/login
 *
 * Next.js route handler
 *   -> dùng backend-server.ts để tạo URL backend thật
 *   -> gọi sang NestJS backend
 *
 * NestJS backend
 *   -> xử lý nghiệp vụ
 *   -> trả response về Next.js route handler
 *
 * Next.js route handler
 *   -> trả response cuối cùng về UI
 *
 * Ví dụ login:
 *
 * 1. Frontend gọi:
 *    /api/auth/login
 *
 * 2. Next.js route handler dùng:
 *    createBackendServerUrl("/auth/login")
 *
 * 3. URL backend thật được tạo ra:
 *    http://localhost:8080/api/auth/login
 *
 * 4. Next.js gọi backend NestJS bằng fetch.
 *
 * File này có thể dùng cho nhiều nhóm API, không chỉ auth:
 * - /auth/login
 * - /auth/logout
 * - /auth/refresh-token
 * - /admin/interview-master-data/positions
 * - /admin/interview-question-banks
 * - /candidate/interviews
 *
 * File này KHÔNG tự set cookie.
 * Việc set cookie sẽ nằm ở route handler, ví dụ:
 * app/api/auth/login/route.ts
 *
 * File này KHÔNG tự check role admin/user.
 * Backend NestJS mới là nơi kiểm tra JWT và phân quyền cuối cùng.
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("Missing BACKEND_API_URL environment variable");
}

/*
 * Tạo URL backend thật từ BACKEND_API_URL và path truyền vào.
 *
 * BACKEND_API_URL lấy từ file .env.local.
 *
 * Ví dụ .env.local:
 * BACKEND_API_URL=http://localhost:8080/api
 *
 * Nếu gọi:
 * createBackendServerUrl("/auth/login")
 *
 * Kết quả:
 * http://localhost:8080/api/auth/login
 *
 * Nếu gọi:
 * createBackendServerUrl("auth/login")
 *
 * Kết quả vẫn là:
 * http://localhost:8080/api/auth/login
 *
 * Hàm này xử lý 2 việc nhỏ:
 *
 * 1. Xóa dấu "/" ở cuối BACKEND_API_URL nếu có.
 *
 * Ví dụ:
 * http://localhost:8080/api/
 *
 * sẽ thành:
 * http://localhost:8080/api
 *
 * Mục đích là tránh URL bị dư dấu "//".
 *
 * 2. Đảm bảo path luôn có dấu "/" ở đầu.
 *
 * Ví dụ:
 * auth/login
 *
 * sẽ thành:
 * /auth/login
 *
 * Nhờ vậy khi ghép URL sẽ luôn đúng.
 */
export const createBackendServerUrl = (path: string): string => {
  const baseUrl = BACKEND_API_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};

/*
 * Tạo Authorization header để gọi các API cần đăng nhập.
 *
 * Backend NestJS thường kiểm tra JWT thông qua header:
 *
 * Authorization: Bearer <accessToken>
 *
 * Ví dụ nếu accessToken là:
 * abc123
 *
 * Hàm này sẽ trả về:
 * {
 *   Authorization: "Bearer abc123"
 * }
 *
 * Dùng cho các API cần đăng nhập như:
 * - /auth/me
 * - /admin/interview-master-data/positions
 * - /admin/interview-question-banks
 * - /candidate/interviews
 *
 * Nếu không truyền accessToken, hàm trả về object rỗng:
 * {}
 *
 * Điều này giúp các API public như login/register không bị gắn Authorization.
 */
export const createBackendAuthHeaders = (accessToken?: string): HeadersInit => {
  if (!accessToken) {
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

/*
 * Tạo header JSON chuẩn để Next.js server gọi backend NestJS.
 *
 * Hầu hết API trong dự án gửi dữ liệu dạng JSON.
 * Vì vậy cần header:
 *
 * Content-Type: application/json
 *
 * Ví dụ khi login:
 *
 * fetch(createBackendServerUrl("/auth/login"), {
 *   method: "POST",
 *   headers: createBackendJsonHeaders(),
 *   body: JSON.stringify({
 *     email: "admin@gmail.com",
 *     password: "123456"
 *   })
 * })
 *
 * Kết quả headers lúc này:
 * {
 *   "Content-Type": "application/json"
 * }
 *
 * Nếu API cần đăng nhập, truyền accessToken vào:
 *
 * createBackendJsonHeaders("abc123")
 *
 * Kết quả:
 * {
 *   "Content-Type": "application/json",
 *   Authorization: "Bearer abc123"
 * }
 *
 * Nhờ vậy route handler không cần tự viết lặp lại headers nhiều lần.
 */
export const createBackendJsonHeaders = (accessToken?: string): HeadersInit => {
  return {
    "Content-Type": "application/json",
    ...createBackendAuthHeaders(accessToken),
  };
};
