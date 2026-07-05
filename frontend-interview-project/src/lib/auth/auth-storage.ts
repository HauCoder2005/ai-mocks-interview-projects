"use client";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const AUTH_USER_KEY = "authUser";
export const AUTH_ROLE_KEY = "authRole";

export type AuthUserLike = {
  id?: string | number | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: string | number | null;
  roleId?: string | number | null;
  role_id?: string | number | null;
  [key: string]: unknown;
};

type SaveAuthSessionInput = {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: AuthUserLike | null;
};

const maxAge = 60 * 60 * 24;

const tokenKeysToClear = [
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_ROLE_KEY,
  "access_token",
  "refresh_token",
  "token",
  "authToken",
  "jwt",
];

function isClient() {
  return typeof window !== "undefined";
}

function getRoleFromUser(user: AuthUserLike | null | undefined) {
  return user?.role ?? user?.roleId ?? user?.role_id ?? null;
}

function setCookie(name: string, value: string) {
  if (!isClient()) return;

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (!isClient()) return;

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function readCookie(name: string) {
  if (!isClient()) return null;

  const match = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

export function saveAuthSession({
  accessToken,
  refreshToken,
  user,
}: SaveAuthSessionInput) {
  if (!isClient()) return;

  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    setCookie(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setCookie(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  const role = getRoleFromUser(user);

  if (role !== null && role !== undefined) {
    localStorage.setItem(AUTH_ROLE_KEY, String(role));
    setCookie(AUTH_ROLE_KEY, String(role));
  }
}

export function clearAuthSession() {
  if (!isClient()) return;

  tokenKeysToClear.forEach((key) => {
    localStorage.removeItem(key);
    removeCookie(key);
  });
}

export function getStoredAccessToken() {
  if (!isClient()) return null;

  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    readCookie(ACCESS_TOKEN_KEY) ??
    readCookie("access_token") ??
    null
  );
}

export function getStoredAuthRole() {
  if (!isClient()) return null;

  return localStorage.getItem(AUTH_ROLE_KEY) ?? readCookie(AUTH_ROLE_KEY);
}

export function getStoredAuthUser(): AuthUserLike | null {
  if (!isClient()) return null;

  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUserLike;
  } catch {
    return null;
  }
}
