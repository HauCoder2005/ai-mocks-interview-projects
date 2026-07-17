"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getStoredAccessToken } from "@/lib/auth/auth-storage";
import { appRoutes } from "@/lib/constants/app-routes";
import { useMockTestDetail, useSubmitMockTest } from "../hooks";
import { buildSubmitPayload } from "../utils/mock-test-answer.util";
import { getAnsweredCount } from "../utils/mock-test-score.util";
import { MockTestEmptyState } from "./mock-test-empty-state";
import { MockTestErrorState } from "./mock-test-error-state";
import { MockTestHeader } from "./mock-test-header";
import { MockTestLoading } from "./mock-test-loading";
import { MockTestQuestionCard } from "./mock-test-question-card";
import { MockTestResult } from "./mock-test-result";
import { MockTestSidebar } from "./mock-test-sidebar";
import styles from "./mock-tests.module.css";

export function MockTestDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { mockTest, loading, error, refetch } = useMockTestDetail(id);
  const { submit, submitting, result, error: submitError } = useSubmitMockTest(id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const questionRefs = useRef<Array<HTMLElement | null>>([]);
  const answeredCount = getAnsweredCount(selectedAnswers);

  const handleSubmit = async () => {
    if (submitting || result) return;
    if (!getStoredAccessToken()) return router.push(appRoutes.login);
    const nextResult = await submit(buildSubmitPayload(selectedAnswers));
    if (nextResult) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToQuestion = (index: number) => {
    setActiveQuestionIndex(index);
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {loading ? <MockTestLoading detail /> : null}
        {!loading && error ? <MockTestErrorState message={error} onRetry={refetch} /> : null}
        {submitError ? <MockTestErrorState message={submitError} /> : null}
        {mockTest ? (
          <>
            <MockTestHeader
              answeredCount={answeredCount}
              isResult={Boolean(result)}
              mockTest={mockTest}
            />
            {!mockTest.questions.length ? <MockTestEmptyState detail /> : null}
            {result ? <MockTestResult result={result} /> : null}
            {mockTest.questions.length ? (
              <section className={styles.questionLayout}>
                <div className={styles.reviewList}>
                  {mockTest.questions.map((question, index) => (
                    <div key={question.id} ref={(node) => { questionRefs.current[index] = node; }}>
                      <MockTestQuestionCard question={question} questionIndex={index} selectedAnswerId={selectedAnswers[question.id]} result={result?.questions.find((item) => item.questionId === question.id)} onSelectAnswer={(answerId) => setSelectedAnswers((current) => ({ ...current, [question.id]: answerId }))} />
                    </div>
                  ))}
                </div>
                <MockTestSidebar
                  activeQuestionIndex={activeQuestionIndex}
                  answeredCount={answeredCount}
                  durationMinutes={mockTest.durationMinutes}
                  onExpire={handleSubmit}
                  onJumpToQuestion={jumpToQuestion}
                  onSubmit={handleSubmit}
                  questions={mockTest.questions}
                  result={result}
                  selectedAnswers={selectedAnswers}
                  submitting={submitting}
                />
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
