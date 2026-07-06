export function getRedirectPathByRole(
  role: string | number | null | undefined,
) {
  if (role === 2 || role === "2" || role === "ADMIN" || role === "admin") {
    return "/admin/dashboard";
  }

  return "/";
}
