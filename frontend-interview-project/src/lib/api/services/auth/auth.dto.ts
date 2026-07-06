/*
* DTO gửi lên backend khi đăng ký tài khoản.
 *
 * Khớp với RegisterDto bên backend:
 * - firstName
 * - lastName
 * - email
 * - password
 * - phoneNumber
 */
export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

/*
 * DTO gửi lên backend khi đăng nhập.
 *
 * Backend thường nhận:
 * - email
 * - password
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/*
 * DTO gửi lên backend khi xác minh tài khoản.
 *
 * Khớp với VerifyAccountDto bên backend:
 * - email
 * - otpCode
 *
 * Lưu ý:
 * Backend yêu cầu otpCode là mã 6 chữ số.
 * Frontend có thể check UI cơ bản, nhưng backend vẫn validate chính.
 */
export interface VerifyAccountRequestDto {
  email: string;
  otpCode: string;
}

/*
 * DTO gửi lên backend khi đăng nhập bằng Google.
 *
 * credential là Google ID Token do Google trả về ở frontend.
 * Backend sẽ dùng token này để verify với Google,
 * sau đó tìm hoặc tạo user trong database.
 */
export interface GoogleLoginRequestDto {
  idToken: string;
}

export interface AuthUserDto {
  id: number;
  roleId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  headline: string;
  currentPosition: string;
  yearsOfExperience: number;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl?: string | null;
  isVerified?: boolean;
}

export interface AuthLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  user: AuthUserDto;
}
