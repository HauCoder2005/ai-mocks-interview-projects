"use client";

import { useCallback, useEffect, useState } from "react";
import { getPublishedMockTestDetail } from "../api/mock-tests.api";
import type { MockTestDetail } from "../types/mock-test.type";

export function useMockTestDetail(mockTestId: string) {
  const [mockTest, setMockTest] = useState<MockTestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setMockTest(await getPublishedMockTestDetail(mockTestId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải bài kiểm tra.");
    } finally {
      setLoading(false);
    }
  }, [mockTestId]);

  useEffect(() => {
    let active = true;
    getPublishedMockTestDetail(mockTestId)
      .then((detail) => {
        if (!active) return;
        setMockTest(detail);
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
  }, [mockTestId]);
  return { mockTest, loading, error, refetch: load };
}
