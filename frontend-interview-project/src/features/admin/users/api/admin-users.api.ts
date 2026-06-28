import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";

export type AdminUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
};

export function getAdminUsers() {
  return apiRequest<AdminUser[]>({
    method: "GET",
    url: apiEndpoints.admin.users,
  });
}
