"use client";

import {
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { authService } from "@/src/services/auth.service";
import type {
  AuthTokenResponse,
  GoogleRedirectOptions,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  VerifyEmailRequest,
} from "@/src/types/auth.types";

/**
 * Defines the browser cookie key used to store the access token.
 *
 * @param value - Static cookie name used by the HTTP request interceptor.
 * @returns The access token cookie name.
 */
const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

/**
 * Defines the browser cookie lifetime used for persisted access tokens.
 *
 * @param value - Static cookie lifetime measured in days.
 * @returns The access token cookie expiration period in days.
 */
const ACCESS_TOKEN_COOKIE_MAX_AGE_IN_DAYS = 7;

/**
 * Defines the route used after successful administrator login.
 *
 * @param value - Static route path for authenticated administrators.
 * @returns The administrator post-login redirect path.
 */
const ADMIN_LOGIN_SUCCESS_REDIRECT_PATH = "/admin/dashboard";

/**
 * Defines the route used after successful candidate login.
 *
 * @param value - Static route path for authenticated candidates.
 * @returns The candidate post-login redirect path.
 */
const USER_LOGIN_SUCCESS_REDIRECT_PATH = "/dashboard";

/**
 * Defines the route used after successful logout.
 *
 * @param value - Static route path for anonymous users.
 * @returns The post-logout redirect path.
 */
const LOGOUT_SUCCESS_REDIRECT_PATH = "/login";

/**
 * Defines the backward-compatible login payload alias used by existing screens.
 *
 * @param email - Candidate email address used as the login identifier.
 * @param password - Candidate password used for local authentication.
 * @returns A typed login payload compatible with existing screens.
 */
export type LoginPayload = LoginRequest;

/**
 * Defines the backward-compatible registration payload alias used by existing screens.
 *
 * @param fullName - Candidate display name submitted during registration.
 * @param email - Candidate email address submitted during registration.
 * @param password - Candidate password submitted during registration.
 * @param confirmPassword - Password confirmation submitted during registration.
 * @returns A typed registration payload compatible with existing screens.
 */
export type RegisterPayload = RegisterRequest;

/**
 * Defines the backward-compatible registration response alias used by existing screens.
 *
 * @param message - Human-readable backend message describing the registration result.
 * @returns A typed registration response payload.
 */
export type RegisterResponse = MessageResponse;

/**
 * Defines the backward-compatible login response alias used by existing screens.
 *
 * @param accessToken - JWT access token used for authenticated API calls.
 * @param tokenType - Token type returned by the backend.
 * @param expiresIn - Access token lifetime in seconds.
 * @param user - Authenticated user profile returned by the backend.
 * @returns A typed authentication token response.
 */
export type LoginResponse = AuthTokenResponse;

/**
 * Persists an access token in a browser cookie for authenticated API requests.
 *
 * @param token - JWT access token returned by the backend.
 * @returns Nothing.
 */
const persistAccessToken = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_COOKIE_NAME, token, {
    expires: ACCESS_TOKEN_COOKIE_MAX_AGE_IN_DAYS,
    sameSite: "lax",
  });
};

/**
 * Removes the access token from browser-managed client storage.
 *
 * @param data - No runtime input is required.
 * @returns Nothing.
 */
const clearAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
};

/**
 * Resolves the authenticated landing route from the backend role claim.
 *
 * @param response - Authentication response returned by the login endpoint.
 * @returns The role-specific route used for client-side navigation.
 */
const resolveLoginRedirectPath = (response: AuthTokenResponse): string => {
  if (response.user.role === "admin") {
    return ADMIN_LOGIN_SUCCESS_REDIRECT_PATH;
  }

  return USER_LOGIN_SUCCESS_REDIRECT_PATH;
};

/**
 * Executes the registration mutation and returns the backend OTP message to the UI.
 *
 * @param data - No hook configuration is required.
 * @returns A TanStack Query mutation result for the registration operation.
 */
export const useRegisterMutation = (): UseMutationResult<
  MessageResponse,
  Error,
  RegisterRequest
> => {
  return useMutation<MessageResponse, Error, RegisterRequest>({
    mutationFn: authService.register,
  });
};

/**
 * Executes the email verification mutation and returns the backend message to the UI.
 *
 * @param data - No hook configuration is required.
 * @returns A TanStack Query mutation result for the email verification operation.
 */
export const useVerifyEmailMutation = (): UseMutationResult<
  MessageResponse,
  Error,
  VerifyEmailRequest
> => {
  return useMutation<MessageResponse, Error, VerifyEmailRequest>({
    mutationFn: authService.verifyEmail,
  });
};

/**
 * Executes the login mutation, persists the access token, and redirects after success.
 *
 * @param data - No hook configuration is required.
 * @returns A TanStack Query mutation result for the login operation.
 */
export const useLoginMutation = (): UseMutationResult<
  AuthTokenResponse,
  Error,
  LoginRequest
> => {
  const router = useRouter();

  return useMutation<AuthTokenResponse, Error, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: (response) => {
      persistAccessToken(response.accessToken);
      router.push(resolveLoginRedirectPath(response));
    },
  });
};

/**
 * Executes the refresh mutation and persists the renewed access token after success.
 *
 * @param data - No hook configuration is required.
 * @returns A TanStack Query mutation result for the token refresh operation.
 */
export const useRefreshTokenMutation = (): UseMutationResult<
  AuthTokenResponse,
  Error,
  void
> => {
  return useMutation<AuthTokenResponse, Error, void>({
    mutationFn: authService.refresh,
    onSuccess: (response) => {
      persistAccessToken(response.accessToken);
    },
  });
};

/**
 * Executes the logout mutation, clears client token state, and redirects after success.
 *
 * @param data - No hook configuration is required.
 * @returns A TanStack Query mutation result for the logout operation.
 */
export const useLogoutMutation = (): UseMutationResult<
  MessageResponse,
  Error,
  void
> => {
  const router = useRouter();

  return useMutation<MessageResponse, Error, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAccessToken();
      router.push(LOGOUT_SUCCESS_REDIRECT_PATH);
    },
  });
};

/**
 * Returns a browser redirect function for Google OAuth authentication.
 *
 * @param data - No hook configuration is required.
 * @returns A callback that starts Google OAuth through standard browser navigation.
 */
export const useGoogleAuthRedirect = (): ((
  options?: GoogleRedirectOptions,
) => void) => {
  return authService.redirectToGoogle;
};
