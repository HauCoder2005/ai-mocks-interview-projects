/**

* JWT TOKEN INTERFACES
*
* File này định nghĩa kiểu dữ liệu đầu vào và đầu ra
* cho service chịu trách nhiệm tạo JWT token.
*
* GenerateJwtTokenInput:
* * Là dữ liệu mà AuthService truyền vào JwtTokenService sau khi user đăng nhập thành công.
* * Dữ liệu này thường được lấy từ database.
* * Không nên truyền password, hashPassword hoặc dữ liệu nhạy cảm vào đây.
*
* Flow sử dụng:
* 1. User đăng nhập thành công.
* 2. AuthService lấy user từ database.
* 3. AuthService truyền userId, email, role vào JwtTokenService.
* 4. JwtTokenService chuyển dữ liệu này thành JwtPayload.
* 5. JwtTokenService ký JwtPayload để tạo accessToken và refreshToken.
*
* Vì sao không dùng thẳng JwtPayload làm input?
* * Trong hệ thống của mình, user thường có field `id`.
* * Trong JWT convention, payload thường dùng field `sub`.
* * Vì vậy ta tách input và payload ra cho rõ nghĩa:
* GenerateJwtTokenInput.userId -> JwtPayload.sub
*
* JwtTokenPair:
* * Là kết quả trả về sau khi tạo token thành công.
*
* Ý nghĩa các field trong JwtTokenPair:
* * accessToken:
* Token ngắn hạn, frontend dùng để gọi API protected.
*
* * refreshToken:
* Token dài hạn, dùng để xin accessToken mới.
* Nên lưu refreshToken trong httpOnly cookie.
*
* * accessTokenExpiresIn:
* Thời gian sống của accessToken, tính bằng giây.
* Ví dụ: 900 giây = 15 phút.
*
* * refreshTokenExpiresIn:
* Thời gian sống của refreshToken, tính bằng giây.
* Ví dụ: 604800 giây = 7 ngày.
*
* * refreshTokenJti:
* Mã định danh riêng của refreshToken.
* Sau này có thể lưu jti này vào Redis để hỗ trợ logout,
* revoke token hoặc refresh token rotation.
*
* Có thể thay đổi interface này không?
* * Có thể.
* * Nhưng khi đổi tên field hoặc thêm/xóa field,
* bạn phải sửa lại toàn bộ nơi đang sử dụng nó.
  */

export interface GenerateJwtTokenInput {
  userId: string;
  email: string;
  role: string;
}

export interface JwtTokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  refreshTokenJti: string;
}
