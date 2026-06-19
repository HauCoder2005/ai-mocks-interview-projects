import Cookies from "js-cookie";

import type { LoginResponse } from "../types/auth.types";

/**
 * Defines the browser cookie key used to store the access token.
 *
 * @param value - Static cookie name used by request interceptors.
 * @returns The access token cookie name.
 */
export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

/**
 * Defines the browser cookie lifetime for persisted access tokens.
 *
 * @param value - Static cookie lifetime measured in days.
 * @returns The access token cookie expiration period in days.
 */
export const ACCESS_TOKEN_COOKIE_MAX_AGE_IN_DAYS = 7;

/**
 * Resolves the access token from supported backend login response shapes.
 *
 * @param response - Login response envelope returned by the backend.
 * @returns The resolved access token string.
 * @throws Error when the backend response does not contain a usable token.
 */
export const resolveAccessToken = (response: LoginResponse): string => {
  const token = response.data.accessToken ?? response.data.token;

  if (!token) {
    throw new Error("Login response does not contain an access token.");
  }

  return token;
};

/**
 * Persists an access token in a browser cookie for authenticated requests.
 *
 * @param token - JWT access token returned by the backend.
 * @returns Nothing.
 */
export const persistAccessToken = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_COOKIE_NAME, token, {
    expires: ACCESS_TOKEN_COOKIE_MAX_AGE_IN_DAYS,
    sameSite: "lax",
  });
};

/**
 * Removes the persisted access token from the browser.
 *
 * @param _ - No runtime input is required.
 * @returns Nothing.
 */
export const clearAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
};
