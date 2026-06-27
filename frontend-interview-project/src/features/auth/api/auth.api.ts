import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/features/auth/types";

export const authApi = {
  login(payload: LoginPayload) {
    return apiRequest<AuthResponse>({
      method: "POST",
      url: apiEndpoints.auth.login,
      data: payload,
    });
  },
  register(payload: RegisterPayload) {
    return apiRequest<AuthResponse>({
      method: "POST",
      url: apiEndpoints.auth.register,
      data: payload,
    });
  },
};
