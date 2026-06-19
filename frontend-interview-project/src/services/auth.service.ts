import { axiosClient } from "@/src/lib/api/axiosClient";
import type {
  ApiResponse,
  AuthTokenResponse,
  BackendResponse,
  GoogleRedirectOptions,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  VerifyEmailRequest,
} from "@/src/types/auth.types";

/**
 * Defines endpoint paths used by the authentication service.
 *
 * @param register - Endpoint path used to create a candidate account and send OTP.
 * @param verifyEmail - Endpoint path used to verify an email OTP.
 * @param login - Endpoint path used to exchange credentials for an access token.
 * @param refresh - Endpoint path used to exchange the HttpOnly refresh cookie for a new access token.
 * @param logout - Endpoint path used to clear backend session state and cookies.
 * @param google - Endpoint path used to start browser-based Google OAuth.
 * @returns A readonly map of authentication endpoint paths.
 */
const AUTH_ENDPOINTS = {
  register: "/auth/register",
  verifyEmail: "/auth/verify-email",
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  google: "/auth/google",
} as const;

/**
 * Determines whether a backend payload uses the standard response envelope.
 *
 * @param payload - Backend response payload returned by the HTTP client.
 * @returns True when the payload contains a standard envelope data property.
 */
const isApiResponse = <TData>(
  payload: BackendResponse<TData>,
): payload is ApiResponse<TData> => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload
  );
};

/**
 * Resolves raw or enveloped backend payloads to a business data payload.
 *
 * @param payload - Backend response payload returned by the HTTP client.
 * @returns The normalized business data payload.
 */
const unwrapResponse = <TData>(payload: BackendResponse<TData>): TData => {
  return isApiResponse(payload) ? payload.data : payload;
};

/**
 * Resolves raw or enveloped message responses to a stable message payload.
 *
 * @param payload - Backend message response returned by the HTTP client.
 * @returns The normalized message response payload.
 */
const unwrapMessageResponse = (
  payload: BackendResponse<MessageResponse | null>,
): MessageResponse => {
  if (isApiResponse(payload)) {
    return payload.data ?? { message: payload.message ?? "Thành công." };
  }

  return payload ?? { message: "Thành công." };
};

/**
 * Builds an absolute Google OAuth URL from the configured backend base URL.
 *
 * @param options - Optional OAuth redirect configuration.
 * @param options.callbackUrl - Optional frontend callback URL reserved for future OAuth state handling.
 * @returns The absolute or relative URL used to start Google OAuth.
 */
const buildGoogleAuthUrl = (options: GoogleRedirectOptions = {}): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const searchParams = new URLSearchParams();

  if (options.callbackUrl) {
    searchParams.set("callbackUrl", options.callbackUrl);
  }

  const queryString = searchParams.toString();
  const path = `${normalizedBaseUrl}${AUTH_ENDPOINTS.google}`;

  return queryString ? `${path}?${queryString}` : path;
};

/**
 * Provides strictly typed authentication API methods.
 *
 * @param register - Method that creates a candidate account and sends OTP.
 * @param verifyEmail - Method that verifies a candidate email OTP.
 * @param login - Method that exchanges credentials for an access token.
 * @param refresh - Method that exchanges the HttpOnly refresh cookie for a new access token.
 * @param logout - Method that clears backend session state and cookies.
 * @param redirectToGoogle - Method that starts Google OAuth through browser navigation.
 * @returns An authentication service facade for UI and query layers.
 */
export const authService = {
  /**
   * Sends registration data to the backend registration endpoint.
   *
   * @param data - Strictly typed account registration payload.
   * @returns A promise resolving to the typed message response payload.
   */
  async register(data: RegisterRequest): Promise<MessageResponse> {
    const response = await axiosClient.post<
      BackendResponse<MessageResponse | null>,
      RegisterRequest
    >(AUTH_ENDPOINTS.register, data);

    return unwrapMessageResponse(response);
  },

  /**
   * Sends email verification data to the backend verification endpoint.
   *
   * @param data - Strictly typed email and OTP verification payload.
   * @returns A promise resolving to the typed message response payload.
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<MessageResponse> {
    const response = await axiosClient.post<
      BackendResponse<MessageResponse | null>,
      VerifyEmailRequest
    >(AUTH_ENDPOINTS.verifyEmail, data);

    return unwrapMessageResponse(response);
  },

  /**
   * Sends login credentials to the backend authentication endpoint.
   *
   * @param data - Strictly typed email and password login payload.
   * @returns A promise resolving to the typed authentication token response.
   */
  async login(data: LoginRequest): Promise<AuthTokenResponse> {
    const response = await axiosClient.post<
      BackendResponse<AuthTokenResponse>,
      LoginRequest
    >(AUTH_ENDPOINTS.login, data, {
      withCredentials: true,
    });

    return unwrapResponse(response);
  },

  /**
   * Requests a new access token using the backend-managed HttpOnly refresh cookie.
   *
   * @param data - No request body is required for refresh.
   * @returns A promise resolving to the typed authentication token response.
   */
  async refresh(): Promise<AuthTokenResponse> {
    const response = await axiosClient.post<BackendResponse<AuthTokenResponse>>(
      AUTH_ENDPOINTS.refresh,
      undefined,
      {
        withCredentials: true,
      },
    );

    return unwrapResponse(response);
  },

  /**
   * Requests backend logout and refresh-cookie cleanup.
   *
   * @param data - No request body is required for logout.
   * @returns A promise resolving to the typed message response payload.
   */
  async logout(): Promise<MessageResponse> {
    const response = await axiosClient.post<
      BackendResponse<MessageResponse | null>
    >(AUTH_ENDPOINTS.logout, undefined, {
      withCredentials: true,
    });

    return unwrapMessageResponse(response);
  },

  /**
   * Starts Google OAuth by assigning the browser location to the backend OAuth endpoint.
   *
   * @param options - Optional redirect configuration for future OAuth state handling.
   * @returns Nothing.
   */
  redirectToGoogle(options: GoogleRedirectOptions = {}): void {
    if (typeof window !== "undefined") {
      window.location.assign(buildGoogleAuthUrl(options));
    }
  },
};
