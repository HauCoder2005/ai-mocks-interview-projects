"use client";

import { useCallback, useEffect, useState } from "react";

import { mockTestsService } from "@/lib/api/services/mock-tests";
import type { MockTestSummaryDto } from "@/lib/api/services/mock-tests";

type UseMockTestsQuery = {
  keyword?: string;
  page?: number;
  limit?: number;
};

export function useMockTests(query: UseMockTestsQuery = { limit: 24 }) {
  const keyword = query.keyword;
  const page = query.page;
  const limit = query.limit;
  const [data, setData] = useState<MockTestSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await mockTestsService.getMockTests({
        keyword,
        page,
        limit,
      });
      setData(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải bài kiểm tra.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [keyword, limit, page]);

  useEffect(() => {
    let isMounted = true;

    mockTestsService
      .getMockTests({ keyword, page, limit })
      .then((response) => {
        if (!isMounted) return;
        setData(response.data);
      })
      .catch((error) => {
        if (!isMounted) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Không thể tải bài kiểm tra.",
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [keyword, limit, page]);

  return {
    data,
    isLoading,
    errorMessage,
    refetch,
  };
}
