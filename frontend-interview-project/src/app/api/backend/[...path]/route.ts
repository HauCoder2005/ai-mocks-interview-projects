import { type NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, getBackendApiUrl } from "@/lib/api/server-backend";

type BackendRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyBackendRequest(request: NextRequest, context: BackendRouteContext) {
  const { path } = await context.params;
  const backendPath = path.map(encodeURIComponent).join("/");
  const search = request.nextUrl.search;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  headers.set("Accept", "application/json");

  if (path[0] === "admin" && !accessToken) {
    return NextResponse.json(
      { message: "Missing admin access token" },
      { status: 401 },
    );
  }

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const method = request.method;
  const hasBody = !["GET", "HEAD"].includes(method);
  const backendResponse = await fetch(`${getBackendApiUrl()}/${backendPath}${search}`, {
    method,
    headers,
    body: hasBody ? await request.text() : undefined,
  });
  const responseHeaders = new Headers();
  const backendContentType = backendResponse.headers.get("content-type");

  if (backendContentType) {
    responseHeaders.set("Content-Type", backendContentType);
  }

  const responseBody = [204, 304].includes(backendResponse.status)
    ? null
    : await backendResponse.text();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export function GET(request: NextRequest, context: BackendRouteContext) {
  return proxyBackendRequest(request, context);
}

export function POST(request: NextRequest, context: BackendRouteContext) {
  return proxyBackendRequest(request, context);
}

export function PATCH(request: NextRequest, context: BackendRouteContext) {
  return proxyBackendRequest(request, context);
}

export function DELETE(request: NextRequest, context: BackendRouteContext) {
  return proxyBackendRequest(request, context);
}
