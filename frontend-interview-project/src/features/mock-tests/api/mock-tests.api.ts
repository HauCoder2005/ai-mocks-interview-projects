import { request } from "@/lib/api/core";
import type { ApiResponse, ApiResponseWithMeta } from "@/lib/api/core/api-response";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";
import type {
  MockTestDetail,
  MockTestListItem,
  MockTestListResponse,
  MockTestQuery,
  SubmitMockTestPayload,
  SubmitMockTestResult,
} from "../types/mock-test.type";

function queryString(params?: MockTestQuery) {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  return search.size ? `?${search}` : "";
}

export async function getPublishedMockTests(
  params?: MockTestQuery,
): Promise<MockTestListResponse> {
  const response = await request<ApiResponseWithMeta<MockTestListItem[]>>(
    `/mock-tests${queryString(params)}`,
    { method: ApiHttpMethod.GET },
  );

  return { items: response.data, meta: response.meta ?? null };
}

export async function getPublishedMockTestDetail(
  id: number | string,
): Promise<MockTestDetail> {
  const response = await request<ApiResponse<MockTestDetail>>(`/mock-tests/${id}`, {
    method: ApiHttpMethod.GET,
  });
  return response.data;
}

export async function submitMockTest(
  id: number | string,
  payload: SubmitMockTestPayload,
): Promise<SubmitMockTestResult> {
  const response = await request<ApiResponse<SubmitMockTestResult>>(
    `/mock-tests/${id}/submit`,
    {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}
