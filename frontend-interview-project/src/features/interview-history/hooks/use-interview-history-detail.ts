'use client';
import { useEffect, useState } from 'react';
import { getInterviewHistoryDetail } from '../api/interview-history.api';
import type { InterviewHistoryDetail } from '../types/interview-history.type';
export function useInterviewHistoryDetail(sessionId: string) {
  const [data, setData] = useState<InterviewHistoryDetail | null>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { let active = true; getInterviewHistoryDetail(sessionId).then((value) => { if (active) setData(value); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : 'Không thể tải chi tiết phiên.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [sessionId]);
  return { data, loading, error };
}
