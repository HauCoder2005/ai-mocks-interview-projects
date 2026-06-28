import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE,
  getAuthPayload,
  getBackendApiUrl,
  jsonResponse,
  readBackendResponse,
  stripAuthTokens,
} from "@/lib/api/server-backend";
import type { AuthUser } from "@/features/auth/types";

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeJwtUser(token: string): AuthUser | undefined {
  const [, payload] = token.split(".");

  if (!payload) {
    return undefined;
  }

  try {
    const decoded = JSON.parse(decodeBase64Url(payload)) as Record<string, unknown>;
    const roleId = decoded.roleId ?? decoded.role_id;

    return {
      id:
        typeof decoded.sub === "string" || typeof decoded.sub === "number"
          ? decoded.sub
          : undefined,
      email: typeof decoded.email === "string" ? decoded.email : undefined,
      role: typeof decoded.role === "string" ? decoded.role : undefined,
      roleId: typeof roleId === "number" ? roleId : undefined,
      role_id: typeof roleId === "number" ? roleId : undefined,
    };
  } catch {
    return undefined;
  }
}

function getUserFromBody(body: unknown): AuthUser | undefined {
  const payload = getAuthPayload(body);

  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  if ("user" in payload && typeof payload.user === "object" && payload.user !== null) {
    return payload.user as AuthUser;
  }

  return payload as AuthUser;
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return jsonResponse({ message: "Missing access token" }, 401);
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (backendResponse.ok) {
    const body = await readBackendResponse(backendResponse);
    const user = getUserFromBody(stripAuthTokens(body));

    return jsonResponse({ user }, 200);
  }

  if (![404, 405].includes(backendResponse.status)) {
    const body = await readBackendResponse(backendResponse);

    return jsonResponse(stripAuthTokens(body), backendResponse.status);
  }

  const user = decodeJwtUser(accessToken);

  if (!user) {
    return jsonResponse({ message: "Unable to read session" }, 401);
  }

  return jsonResponse({ user }, 200);
}
