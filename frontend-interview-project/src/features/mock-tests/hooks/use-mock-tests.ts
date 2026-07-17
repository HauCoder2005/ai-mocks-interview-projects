"use client";

import { useCallback, useEffect, useState } from "react";
import { getPublishedMockTests } from "../api/mock-tests.api";
import type { MockTestListItem } from "../types/mock-test.type";
import type { ApiListMeta } from "@/lib/api/core/api-response";

export function useMockTests(initialLimit = 9) {
  const [data, setData] = useState<MockTestListItem[]>([]);
  const [meta, setMeta] = useState<ApiListMeta | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeywordState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getPublishedMockTests({ page, limit: initialLimit, keyword });
      setData(result.items);
      setMeta(result.meta);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải bài kiểm tra.");
    } finally {
      setLoading(false);
    }
  }, [initialLimit, keyword, page]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setLoading(true);
    });
    getPublishedMockTests({ page, limit: initialLimit, keyword })
      .then((result) => {
        if (!active) return;
        setData(result.items);
        setMeta(result.meta);
        setError("");
      })
      .catch((reason) => {
        if (!active) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Không thể tải bài kiểm tra.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialLimit, keyword, page]);

  const setKeyword = (value: string) => {
    setKeywordState(value);
    setPage(1);
  };

  return { data, meta, loading, error, refetch: load, page, setPage, keyword, setKeyword };
}
