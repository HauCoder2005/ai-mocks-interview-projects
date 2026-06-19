/**
 * Defines the standard backend response envelope used by the authentication API.
 *
 * @param TData - Business payload type carried by the response envelope.
 * @returns A typed API envelope contract containing metadata and payload data.
 */
export interface ApiResponseEnvelope<TData> {
  statusCode?: number;
  message?: string;
  data: TData;
}

/**
 * Defines the request contract for local email and password authentication.
 *
 * @param email - Candidate email address used as the login identifier.
 * @param password - Candidate password used for local authentication.
 * @returns A typed login request payload accepted by the login endpoint.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Defines the authenticated user profile returned by the backend.
 *
 * @param id - Unique user identifier from the persistence layer.
 * @param email - Email address associated with the authenticated account.
 * @param fullName - Display name assembled from backend profile fields.
 * @param role - Role name used for frontend authorization decisions.
 * @param isVerified - Verification state of the authenticated account.
 * @returns A typed authenticated user profile contract.
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  fullName: string;
  role: "user" | "admin";
  isVerified: boolean;
}

/**
 * Defines the successful login payload returned by the authentication endpoint.
 *
 * @param accessToken - Primary JWT access token used for authenticated API calls.
 * @param token - Backward-compatible token field for legacy response shapes.
 * @param tokenType - Optional token type supplied by the backend.
 * @param expiresIn - Optional access token lifetime in seconds.
 * @param user - Optional authenticated user profile supplied by the backend.
 * @returns A typed login response payload contract.
 */
export interface LoginResponseData {
  accessToken?: string;
  token?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: AuthenticatedUser;
}

/**
 * Defines the complete response contract for the login endpoint.
 *
 * @param data - Login payload carried by the backend response envelope.
 * @returns A typed login response envelope.
 */
export type LoginResponse = ApiResponseEnvelope<LoginResponseData>;

/**
 * Defines configuration options accepted by the login mutation hook.
 *
 * @param redirectTo - Optional route path used after successful authentication.
 * @returns A typed options contract for the login mutation hook.
 */
export interface UseLoginMutationOptions {
  redirectTo?: string;
}
