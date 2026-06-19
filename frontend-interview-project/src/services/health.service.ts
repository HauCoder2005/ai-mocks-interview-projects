import { axiosClient } from "@/src/lib/api/axiosClient";

export type HealthResponse = {
  status?: string;
  message?: string;
};

export const checkConnection = async (): Promise<HealthResponse | null> => {
  try {
    return await axiosClient.get<HealthResponse>("/health");
  } catch (error) {
    console.error("Backend connection failed", error);
    return null;
  }
};
