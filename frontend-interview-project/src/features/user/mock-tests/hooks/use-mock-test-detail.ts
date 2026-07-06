"use client";

import { useCallback, useEffect, useState } from "react";

import { mockTestsService } from "@/lib/api/services/mock-tests";
import type { MockTestDetailDto } from "@/lib/api/services/mock-tests";

export function useMockTestDetail(slug: string) {
  const [data, setData] = useState<MockTestDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await mockTestsService.getMockTestBySlug(slug);
      setData(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải chi tiết bài kiểm tra.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    let isMounted = true;

    mockTestsService
      .getMockTestBySlug(slug)
      .then((response) => {
        if (!isMounted) return;
        setData(response.data);
      })
      .catch((error) => {
        if (!isMounted) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải chi tiết bài kiểm tra.",
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    data,
    isLoading,
    errorMessage,
    refetch,
  };
}
