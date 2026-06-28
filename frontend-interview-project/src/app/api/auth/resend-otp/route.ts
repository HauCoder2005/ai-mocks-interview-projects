import {
  forwardJsonToBackend,
  jsonResponse,
  readBackendResponse,
  readJsonBody,
} from "@/lib/api/server-backend";

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  const backendResponse = await forwardJsonToBackend("/auth/resend-otp", payload);
  const body = await readBackendResponse(backendResponse);
  return jsonResponse(body, backendResponse.status);
}
