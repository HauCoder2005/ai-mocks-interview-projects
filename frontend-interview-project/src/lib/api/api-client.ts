import axios, { type AxiosRequestConfig } from "axios";

import { ApiError } from "@/lib/api/api-error";
import { appConfig } from "@/lib/constants/app-config";
import { tokenStorage } from "@/lib/auth/token-storage";
import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/api-response";

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

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "statusCode" in value &&
    "message" in value &&
    "data" in value
  );
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
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
    const response = await apiClient.request<ApiResponse<T> | T>(config);

    if (isApiResponse<T>(response.data)) {
      if (!response.data.success) {
        throw new ApiError(
          response.data.message,
          response.data.statusCode,
          response.data,
        );
      }

      return response.data.data;
    }

    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function apiRequestWithMeta<T>(config: AxiosRequestConfig) {
  try {
    const response = await apiClient.request<ApiResponseWithMeta<T>>(config);

    if (!response.data.success) {
      throw new ApiError(
        response.data.message,
        response.data.statusCode,
        response.data,
      );
    }

    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
