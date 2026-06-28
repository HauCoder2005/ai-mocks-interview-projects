import { appRoutes } from "@/lib/constants/app-routes";

export function getPostLoginRedirect(role?: string, roleId?: number) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "admin" || roleId === 2) {
    return appRoutes.adminDashboard;
  }

  if (normalizedRole === "user" || normalizedRole === "candidate" || roleId === 1) {
    return appRoutes.userDashboard;
  }

  return appRoutes.adminDashboard;
}
