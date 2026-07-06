/*
 * Bảo vệ route frontend theo cookie accessToken/authRole.
 * Backend API vẫn là nơi kiểm tra bảo mật thật bằng JWT/guard.
 */

import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE_NAMES } from "@/lib/api/core/auth-cookie";
import { AUTH_ROLE_COOKIE_NAME } from "@/lib/auth/auth-cookie-names";
import { getRedirectPathByRole } from "@/lib/auth/role-redirect";
import { isAdminRole } from "@/lib/auth/roles";

const publicAuthRoutes = ["/login", "/register"];

const userProtectedRoutes = [
  "/interview",
  "/practice",
  "/interviews",
  "/dashboard",
  "/jobs",
  "/resumes",
];

function isRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

function readToken(request: NextRequest) {
  return (
    request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ??
    request.cookies.get("accessToken")?.value ??
    request.cookies.get("access_token")?.value ??
    request.cookies.get("token")?.value ??
    request.cookies.get("authToken")?.value ??
    null
  );
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const payload = token.split(".")[1];

  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readRole(request: NextRequest, token: string | null) {
  const cookieRole =
    request.cookies.get(AUTH_ROLE_COOKIE_NAME)?.value ??
    request.cookies.get("authRole")?.value;

  if (cookieRole) return cookieRole;
  if (!token) return null;

  const payload = decodeJwtPayload(token);

  return payload?.roleId ?? payload?.role_id ?? payload?.role ?? null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = readToken(request);
  const role = readRole(request, token);

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isUserPath = isRoute(pathname, userProtectedRoutes);
  const isPublicAuthPath = isRoute(pathname, publicAuthRoutes);

  if (!token) {
    if (isAdminPath || isUserPath) {
      return redirectTo(request, "/login");
    }

    return NextResponse.next();
  }

  if (isPublicAuthPath) {
    return redirectTo(
      request,
      getRedirectPathByRole(role as string | number | null),
    );
  }

  if (isAdminPath && !isAdminRole(role)) {
    return redirectTo(request, getRedirectPathByRole(role as string | number | null));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/interview",
    "/interview/:path*",
    "/interviews",
    "/interviews/:path*",
    "/practice",
    "/practice/:path*",
    "/jobs",
    "/jobs/:path*",
    "/resumes",
    "/resumes/:path*",
    "/login",
    "/register",
  ],
};
