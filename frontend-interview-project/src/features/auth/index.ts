/**
 * Exposes the public authentication feature API surface.
 *
 * @param exports - Authentication services, hooks, utilities, and type contracts.
 * @returns The stable import boundary for the authentication feature.
 */
export { login, AUTH_API_ENDPOINTS } from "./api/auth.api";
export { useLoginMutation } from "./queries/use-login-mutation";
export {
  ACCESS_TOKEN_COOKIE_MAX_AGE_IN_DAYS,
  ACCESS_TOKEN_COOKIE_NAME,
  clearAccessToken,
  persistAccessToken,
  resolveAccessToken,
} from "./utils/auth-token.util";
export type {
  ApiResponseEnvelope,
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  UseLoginMutationOptions,
} from "./types/auth.types";
