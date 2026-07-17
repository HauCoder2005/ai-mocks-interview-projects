"use client";

import { useState } from "react";
import { submitMockTest as submitRequest } from "../api/mock-tests.api";
import type { SubmitMockTestPayload, SubmitMockTestResult } from "../types/mock-test.type";

export function useSubmitMockTest(mockTestId: string) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitMockTestResult | null>(null);
  const [error, setError] = useState("");

  const submit = async (payload: SubmitMockTestPayload) => {
    setSubmitting(true);
    setError("");
    try {
      const nextResult = await submitRequest(mockTestId, payload);
      setResult(nextResult);
      return nextResult;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể nộp bài.");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, result, error };
}
