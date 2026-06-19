import { axiosClient } from "@/src/lib/api/axiosClient";

import type { LoginRequest, LoginResponse } from "../types/auth.types";

/**
 * Defines immutable endpoint paths used by the authentication API service.
 *
 * @param login - Endpoint path used to exchange local credentials for a token.
 * @returns A readonly endpoint map for authentication API calls.
 */
export const AUTH_API_ENDPOINTS = {
  login: "/auth/login",
} as const;

/**
 * Sends local login credentials to the backend authentication endpoint.
 *
 * @param payload - Strictly typed email and password login request body.
 * @returns A promise resolving to the backend login response envelope.
 */
export const login = (payload: LoginRequest): Promise<LoginResponse> => {
  return axiosClient.post<LoginResponse, LoginRequest>(
    AUTH_API_ENDPOINTS.login,
    payload,
  );
};
