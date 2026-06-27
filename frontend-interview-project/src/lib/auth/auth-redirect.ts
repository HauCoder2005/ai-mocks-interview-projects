import { appRoutes } from "@/lib/constants/app-routes";

export function getPostLoginRedirect(role?: string) {
  return role === "admin" ? appRoutes.adminDashboard : appRoutes.userDashboard;
}
