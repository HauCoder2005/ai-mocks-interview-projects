"use client";

import { useCallback, useEffect, useState } from "react";

import { mockTestsService } from "@/lib/api/services/mock-tests";
import type { MockTestAttemptDto } from "@/lib/api/services/mock-tests";

export function useMockTestAttempt(attemptId: string) {
  const [data, setData] = useState<MockTestAttemptDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await mockTestsService.getMockTestAttempt(attemptId);
      setData(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải lượt làm bài.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    let isMounted = true;

    mockTestsService
      .getMockTestAttempt(attemptId)
      .then((response) => {
        if (!isMounted) return;
        setData(response.data);
      })
      .catch((error) => {
        if (!isMounted) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Không thể tải lượt làm bài.",
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  return {
    data,
    setData,
    isLoading,
    errorMessage,
    setErrorMessage,
    refetch,
  };
}
