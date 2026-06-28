export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface GoogleLoginPayload {
  token: string;
}

export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  roleId?: number;
  role_id?: number;
}

export interface AuthResult {
  user?: AuthUser;
  message?: string;
  authenticated?: boolean;
}

export interface AuthSession extends AuthResult {
  user?: AuthUser;
}

export interface AuthTokenResponse extends AuthSession {
  accessToken?: string;
  refreshToken?: string;
}

export type AuthResponse = AuthTokenResponse;
