/*
 * proxy.ts chạy trước khi người dùng truy cập các route được khai báo trong matcher.
 *
 * File này dùng để bảo vệ các route frontend như:
 * - /admin
 * - /dashboard
 * - /interviews
 * - /practice
 *
 * Nhiệm vụ chính:
 * - Đọc cookie đăng nhập từ request.
 * - Nếu chưa đăng nhập thì redirect về /login.
 * - Nếu đã đăng nhập nhưng sai role thì redirect về trang phù hợp.
 * - Nếu hợp lệ thì cho request đi tiếp.
 *
 * File này không dùng để gọi API nghiệp vụ.
 * Việc gọi backend thật sẽ nằm trong route handler như app/api/.../route.ts.
 */

import { NextResponse, type NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/interviews/:path*", "/practice/:path*"],
};
