import { apiRequest } from "@/lib/api/api-client";
import type {
  AuthResult,
  AuthSession,
  AuthTokenResponse,
  AuthUser,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  VerifyAccountPayload,
} from "@/features/auth/types";

const authRoutes = {
  register: "/api/auth/register",
  login: "/api/auth/login",
  session: "/api/auth/session",
  verifyAccount: "/api/auth/verify-account",
  resendOtp: "/api/auth/resend-otp",
  refreshToken: "/api/auth/refresh-token",
  logout: "/api/auth/logout",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  googleLogin: "/api/auth/google-login",
};

type RawAuthResponse = AuthTokenResponse & {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  user?: AuthUser;
  account?: AuthUser;
};

function normalizeUser(user: AuthUser | undefined): AuthUser | undefined {
  if (!user) {
    return undefined;
  }

  return {
    ...user,
    roleId: user.roleId ?? user.role_id,
  };
}

function normalizeAuthResponse(response: RawAuthResponse | null | undefined): AuthSession {
  if (!response) {
    return {};
  }

  return {
    user: normalizeUser(response.user ?? response.account),
    message: response.message,
    authenticated: response.authenticated,
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const response = await apiRequest<RawAuthResponse>({
    method: "POST",
    url: authRoutes.register,
    data: payload,
  });

  return normalizeAuthResponse(response);
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const response = await apiRequest<RawAuthResponse>({
    method: "POST",
    url: authRoutes.login,
    data: payload,
  });

  return normalizeAuthResponse(response);
}

export async function getSession(): Promise<AuthSession> {
  const response = await apiRequest<RawAuthResponse>({
    method: "GET",
    url: authRoutes.session,
  });

  return normalizeAuthResponse(response);
}

export async function verifyAccount(payload: VerifyAccountPayload): Promise<AuthSession> {
  const response = await apiRequest<RawAuthResponse>({
    method: "POST",
    url: authRoutes.verifyAccount,
    data: payload,
  });

  return normalizeAuthResponse(response);
}

export async function resendOtp(payload: ResendOtpPayload): Promise<AuthResult> {
  const response = await apiRequest<RawAuthResponse>({
    method: "POST",
    url: authRoutes.resendOtp,
    data: payload,
  });

  return normalizeAuthResponse(response);
}

export async function refreshToken(payload: RefreshTokenPayload) {
  const response = await apiRequest<RawAuthResponse>({
    method: "POST",
    url: authRoutes.refreshToken,
    data: payload,
  });

  return normalizeAuthResponse(response);
}

export function logout() {
  return apiRequest<void>({
    method: "POST",
    url: authRoutes.logout,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiRequest<void>({
    method: "POST",
    url: authRoutes.forgotPassword,
    data: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<void>({
    method: "POST",
    url: authRoutes.resetPassword,
    data: payload,
  });
}

export async function googleLogin(payload: GoogleLoginPayload) {
  const response = await apiRequest<RawAuthResponse>({
    method: "POST",
    url: authRoutes.googleLogin,
    data: payload,
  });

  return normalizeAuthResponse(response);
}

export const authApi = {
  register,
  login,
  getSession,
  verifyAccount,
  resendOtp,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
};
