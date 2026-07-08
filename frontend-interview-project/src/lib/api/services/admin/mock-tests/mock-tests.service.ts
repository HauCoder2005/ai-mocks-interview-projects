import { request } from "@/lib/api/core";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";

import type {
  AttachMockTestQuestionsRequest,
  CreateMockTestRequest,
  MockTestListResponse,
  MockTestQuery,
  MockTestResponse,
  UpdateMockTestRequest,
} from "./mock-tests.dto";

const ADMIN_MOCK_TESTS_PATH = "/admin/mock-tests";

function buildQueryString(query?: MockTestQuery) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export const adminMockTestsService = {
  getMockTests(query?: MockTestQuery): Promise<MockTestListResponse> {
    return request<MockTestListResponse>(
      `${ADMIN_MOCK_TESTS_PATH}${buildQueryString(query)}`,
      {
        method: ApiHttpMethod.GET,
        auth: true,
      },
    );
  },

  getMockTestById(id: number): Promise<MockTestResponse> {
    return request<MockTestResponse>(`${ADMIN_MOCK_TESTS_PATH}/${id}`, {
      method: ApiHttpMethod.GET,
      auth: true,
    });
  },

  createMockTest(input: CreateMockTestRequest): Promise<MockTestResponse> {
    return request<MockTestResponse>(ADMIN_MOCK_TESTS_PATH, {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  updateMockTest(
    id: number,
    input: UpdateMockTestRequest,
  ): Promise<MockTestResponse> {
    return request<MockTestResponse>(`${ADMIN_MOCK_TESTS_PATH}/${id}`, {
      method: ApiHttpMethod.PATCH,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  deleteMockTest(id: number): Promise<MockTestResponse> {
    return request<MockTestResponse>(`${ADMIN_MOCK_TESTS_PATH}/${id}`, {
      method: ApiHttpMethod.DELETE,
      auth: true,
    });
  },

  publishMockTest(id: number): Promise<MockTestResponse> {
    return request<MockTestResponse>(`${ADMIN_MOCK_TESTS_PATH}/${id}/publish`, {
      method: ApiHttpMethod.PATCH,
      auth: true,
    });
  },

  archiveMockTest(id: number): Promise<MockTestResponse> {
    return request<MockTestResponse>(`${ADMIN_MOCK_TESTS_PATH}/${id}/archive`, {
      method: ApiHttpMethod.PATCH,
      auth: true,
    });
  },

  attachQuestions(
    id: number,
    input: AttachMockTestQuestionsRequest,
  ): Promise<MockTestResponse> {
    return request<MockTestResponse>(`${ADMIN_MOCK_TESTS_PATH}/${id}/questions`, {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(input),
    });
  },
};
