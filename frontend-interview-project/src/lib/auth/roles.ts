export const USER_ROLE = 1;
export const ADMIN_ROLE = 2;

export function isAdminRole(role: unknown): boolean {
  return role === ADMIN_ROLE || role === "2" || role === "ADMIN" || role === "admin";
}

export function isUserRole(role: unknown): boolean {
  return role === USER_ROLE || role === "1" || role === "USER" || role === "user";
}
