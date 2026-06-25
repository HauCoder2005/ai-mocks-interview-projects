/**
 * JWT PAYLOAD / AUTH USER
 *
 * JwtPayload là phần dữ liệu được backend nhúng vào bên trong JWT token.
 *
 * Flow hoạt động:
 * 1. User gửi email/password lên API đăng nhập.
 * 2. Backend kiểm tra thông tin đăng nhập trong database.
 * 3. Nếu đăng nhập hợp lệ, backend tạo JwtPayload.
 * 4. JwtPayload được ký bằng JWT_SECRET hoặc JWT_REFRESH_SECRET để tạo token.
 * 5. Frontend nhận accessToken và gửi token này lên backend khi gọi API protected.
 * 6. Backend verify token, sau đó lấy payload ra để biết user là ai và có quyền gì.
 *
 * Ý nghĩa các field trong JwtPayload:
 * * sub:
 * Viết tắt của subject.
 * Đây là id của user sở hữu token.
 * Dùng `sub` vì đây là convention phổ biến trong JWT.
 *
 * * email:
 * Email của user.
 * Dùng để nhận diện nhanh user trong quá trình xử lý request.
 * Không nên xem email trong token là nguồn dữ liệu tuyệt đối cho nghiệp vụ quan trọng.
 * Nếu cần dữ liệu mới nhất, hãy query lại user từ database.
 *
 * * role:
 * Quyền của user trong hệ thống.
 * Dùng để phân quyền API, ví dụ USER, ADMIN.
 *
 * * jti:
 * Viết tắt của JWT ID.
 * Đây là mã định danh riêng của token.
 * Thường dùng cho refresh token để hỗ trợ logout, revoke token,
 * hoặc kiểm tra refresh token session trong Redis.
 * Dấu `?` nghĩa là field này không bắt buộc.
 *
 * JwtAuthUser là dữ liệu user sau khi JWT token đã được verify thành công.
 *
 * Payload trong token thường dùng `sub`.
 * Nhưng khi đưa vào request.user, ta chuyển `sub` thành `id`
 * để code nghiệp vụ dễ đọc hơn.
 *
 * Ví dụ:
 * * payload.sub -> request.user.id
 *
 * Lưu ý bảo mật:
 * * Payload không phải là dữ liệu user gửi lên lúc đăng nhập.
 * * Payload là dữ liệu backend tạo ra sau khi đăng nhập thành công.
 * * Tuyệt đối không đưa password, hashPassword hoặc dữ liệu nhạy cảm vào payload.
 * * Frontend có thể decode token để hiển thị UI,
 * nhưng phân quyền thật sự vẫn phải được kiểm tra ở backend.
 */

export interface JwtPayload {
  sub: number;
  email: string;
  roleId: number;
  jti?: string;
}

export interface JwtAuthUser {
  id: number;
  email: string;
  roleId: number;
  jti?: string;
}
