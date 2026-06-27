import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import { ApiError } from "@/lib/api/api-error";
import { appConfig } from "@/lib/constants/app-config";
import { tokenStorage } from "@/lib/auth/token-storage";

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function toApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const message =
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      "message" in error.response.data
        ? String(error.response.data.message)
        : error.message;

    return new ApiError(message, error.response?.status, error.response?.data);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Unexpected API error");
}

export async function apiRequest<T>(config: AxiosRequestConfig) {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
