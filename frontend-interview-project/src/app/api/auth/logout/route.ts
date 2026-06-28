import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  deleteAuthCookies,
  getBackendApiUrl,
  jsonResponse,
} from "@/lib/api/server-backend";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken || refreshToken) {
    try {
      await fetch(`${getBackendApiUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(refreshToken ? { refreshToken } : {}),
      });
    } catch {
      // Logout should still clear local HttpOnly cookies if backend is unavailable.
    }
  }

  const response = jsonResponse({ message: "Logout successful" }, 200);
  deleteAuthCookies(response);

  return response;
}
