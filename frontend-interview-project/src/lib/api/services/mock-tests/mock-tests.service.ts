import { request } from "@/lib/api/core";
import { ApiHttpMethod } from "@/lib/api/core/enums/api-method.enum";

import type {
  MockTestAnswerResponse,
  MockTestAttemptListResponse,
  MockTestAttemptResponse,
  MockTestDetailResponse,
  MockTestListResponse,
  MockTestResultResponse,
  MockTestSubmitResponse,
  SubmitMockTestRequest,
  SubmitMockTestResponse,
  SubmitMockTestAnswerRequest,
} from "./mock-tests.dto";

type MockTestQuery = {
  keyword?: string;
  technologyId?: number;
  topicId?: number;
  difficulty?: string;
  page?: number;
  limit?: number;
};

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

export const mockTestsService = {
  getMockTests(query?: MockTestQuery): Promise<MockTestListResponse> {
    return request<MockTestListResponse>(`/mock-tests${buildQueryString(query)}`, {
      method: ApiHttpMethod.GET,
    });
  },

  getMockTestDetail(id: number | string): Promise<MockTestDetailResponse> {
    return request<MockTestDetailResponse>(`/mock-tests/${id}`, {
      method: ApiHttpMethod.GET,
    });
  },

  submitMockTest(
    id: number | string,
    input: SubmitMockTestRequest,
  ): Promise<SubmitMockTestResponse> {
    return request<SubmitMockTestResponse>(`/mock-tests/${id}/submit`, {
      method: ApiHttpMethod.POST,
      auth: true,
      body: JSON.stringify(input),
    });
  },

  startMockTestAttempt(mockTestId: number): Promise<MockTestAttemptResponse> {
    return request<MockTestAttemptResponse>(
      `/mock-tests/${mockTestId}/attempts/start`,
      {
        method: ApiHttpMethod.POST,
        auth: true,
      },
    );
  },

  getMockTestAttempt(attemptId: number | string): Promise<MockTestAttemptResponse> {
    return request<MockTestAttemptResponse>(`/mock-tests/attempts/${attemptId}`, {
      method: ApiHttpMethod.GET,
      auth: true,
    });
  },

  submitMockTestAnswer(
    attemptId: number | string,
    input: SubmitMockTestAnswerRequest,
  ): Promise<MockTestAnswerResponse> {
    return request<MockTestAnswerResponse>(
      `/mock-tests/attempts/${attemptId}/answers`,
      {
        method: ApiHttpMethod.POST,
        auth: true,
        body: JSON.stringify(input),
      },
    );
  },

  submitMockTestAttempt(attemptId: number | string): Promise<MockTestSubmitResponse> {
    return request<MockTestSubmitResponse>(
      `/mock-tests/attempts/${attemptId}/submit`,
      {
        method: ApiHttpMethod.POST,
        auth: true,
      },
    );
  },

  getMockTestResult(attemptId: number | string): Promise<MockTestResultResponse> {
    return request<MockTestResultResponse>(
      `/mock-tests/attempts/${attemptId}/result`,
      {
        method: ApiHttpMethod.GET,
        auth: true,
      },
    );
  },

  getMyMockTestAttempts(): Promise<MockTestAttemptListResponse> {
    return request<MockTestAttemptListResponse>("/mock-tests/my-attempts", {
      method: ApiHttpMethod.GET,
      auth: true,
    });
  },
};
