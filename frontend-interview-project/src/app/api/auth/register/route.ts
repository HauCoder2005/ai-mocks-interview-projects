import {
  forwardJsonToBackend,
  jsonResponse,
  readBackendResponse,
  readJsonBody,
  stripAuthTokens,
} from "@/lib/api/server-backend";

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  const backendResponse = await forwardJsonToBackend("/auth/register", payload);
  const body = await readBackendResponse(backendResponse);

  return jsonResponse(stripAuthTokens(body), backendResponse.status);
}
