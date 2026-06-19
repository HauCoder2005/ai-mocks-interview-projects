/**
 * Defines the generic backend response envelope used when a global backend response interceptor wraps payloads.
 *
 * @param TData - Business payload type carried by the response envelope.
 * @returns A typed backend response envelope.
 */
export interface ApiResponse<TData> {
  statusCode?: number;
  message?: string;
  data: TData;
}

/**
 * Defines the message response returned by non-token authentication endpoints.
 *
 * @param message - Human-readable backend message describing the operation result.
 * @returns A typed message response payload.
 */
export interface MessageResponse {
  message: string;
}

/**
 * Defines the registration request payload accepted by the backend.
 *
 * @param fullName - Candidate display name submitted during registration.
 * @param email - Candidate email address submitted during registration.
 * @param password - Candidate password submitted during registration.
 * @param confirmPassword - Password confirmation submitted during registration.
 * @returns A typed registration request payload.
 */
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Defines the email verification request payload accepted by the backend.
 *
 * @param email - Candidate email address associated with the verification code.
 * @param otp - One-time password sent by the backend through the verification channel.
 * @returns A typed email verification request payload.
 */
export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

/**
 * Defines the login request payload accepted by the backend.
 *
 * @param email - Candidate email address used as the login identifier.
 * @param password - Candidate password used for local authentication.
 * @returns A typed login request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Defines the authenticated user profile returned by token-producing endpoints.
 *
 * @param id - Unique user identifier from the backend persistence layer.
 * @param email - Email address associated with the authenticated account.
 * @param fullName - Display name assembled from backend profile fields.
 * @param role - Role name used by the frontend for authorization decisions.
 * @param isVerified - Verification state of the authenticated account.
 * @returns A typed authenticated user profile.
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  fullName: string;
  role: "user" | "admin";
  isVerified: boolean;
}

/**
 * Defines the token response returned by login and refresh endpoints.
 *
 * @param accessToken - JWT access token used for authenticated API calls.
 * @param tokenType - Token type returned by the backend.
 * @param expiresIn - Access token lifetime in seconds.
 * @param user - Authenticated user profile returned by the backend.
 * @returns A typed authentication token response payload.
 */
export interface AuthTokenResponse {
  accessToken: string;
  tokenType: "Bearer" | string;
  expiresIn: number;
  user: AuthenticatedUser;
}

/**
 * Defines all backend response shapes accepted by service normalizers.
 *
 * @param TData - Payload type returned directly or wrapped by the backend.
 * @returns A backend response shape that may be raw or enveloped.
 */
export type BackendResponse<TData> = TData | ApiResponse<TData>;

/**
 * Defines the options accepted by the Google OAuth redirect utility.
 *
 * @param callbackUrl - Optional frontend URL used by future UI layers after OAuth completion.
 * @returns A typed Google OAuth redirect options object.
 */
export interface GoogleRedirectOptions {
  callbackUrl?: string;
}
