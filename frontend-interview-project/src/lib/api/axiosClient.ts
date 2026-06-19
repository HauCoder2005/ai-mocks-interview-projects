import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

type ApiClient = Omit<AxiosInstance, "get" | "post" | "put" | "patch" | "delete"> & {
  get<TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  post<TResponse = unknown, TPayload = unknown>(
    url: string,
    data?: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  put<TResponse = unknown, TPayload = unknown>(
    url: string,
    data?: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  patch<TResponse = unknown, TPayload = unknown>(
    url: string,
    data?: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  delete<TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
    }

    return Promise.reject(error);
  },
);

export const axiosClient = axiosInstance as unknown as ApiClient;
