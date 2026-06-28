import {
  addAuthenticatedFlag,
  forwardJsonToBackend,
  getTokenValue,
  jsonResponse,
  readBackendResponse,
  readJsonBody,
  setAuthCookies,
  stripAuthTokens,
} from "@/lib/api/server-backend";

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  const backendResponse = await forwardJsonToBackend("/auth/login", payload);
  const body = await readBackendResponse(backendResponse);
  const hasSession = Boolean(getTokenValue(body, ["accessToken", "access_token", "token"]));
  const browserBody = hasSession
    ? addAuthenticatedFlag(stripAuthTokens(body))
    : stripAuthTokens(body);
  const response = jsonResponse(browserBody, backendResponse.status);

  if (backendResponse.ok) {
    setAuthCookies(response, body);
  }

  return response;
}
