'use client';
import { useCallback, useEffect, useState } from 'react';
import { getInterviewHistory } from '../api/interview-history.api';
import type { InterviewHistoryItem, InterviewHistoryStatus } from '../types/interview-history.type';
import type { ApiListMeta } from '@/lib/api/core/api-response';

export function useInterviewHistory() {
  const [data, setData] = useState<InterviewHistoryItem[]>([]);
  const [meta, setMeta] = useState<ApiListMeta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<InterviewHistoryStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const result = await getInterviewHistory({ page, limit: 10, status: status || undefined }); setData(result.items); setMeta(result.meta); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể tải lịch sử phỏng vấn.'); }
    finally { setLoading(false); }
  }, [page, status]);
  useEffect(() => {
    let active = true;
    getInterviewHistory({ page, limit: 10, status: status || undefined })
      .then((result) => {
        if (!active) return;
        setData(result.items);
        setMeta(result.meta);
        setError('');
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Không thể tải lịch sử phỏng vấn.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, status]);
  return { data, meta, page, setPage, status, setStatus, loading, error, refetch: load };
}
