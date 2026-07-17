import { request } from '@/lib/api/core';
import type { ApiResponse, ApiResponseWithMeta } from '@/lib/api/core/api-response';
import { ApiHttpMethod } from '@/lib/api/core/enums/api-method.enum';
import type { InterviewHistoryDetail, InterviewHistoryItem, InterviewHistoryList, InterviewHistoryQuery } from '../types/interview-history.type';

export async function getInterviewHistory(query: InterviewHistoryQuery): Promise<InterviewHistoryList> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (value != null) params.set(key, String(value)); });
  const response = await request<ApiResponseWithMeta<InterviewHistoryItem[]>>(`/interviews/history?${params}`, { method: ApiHttpMethod.GET, auth: true });
  return { items: response.data, meta: response.meta };
}

export async function getInterviewHistoryDetail(sessionId: number | string) {
  const response = await request<ApiResponse<InterviewHistoryDetail>>(`/interviews/history/${sessionId}`, { method: ApiHttpMethod.GET, auth: true });
  return response.data;
}
