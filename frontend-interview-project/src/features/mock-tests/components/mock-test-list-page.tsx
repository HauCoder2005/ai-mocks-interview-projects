"use client";

import { ClipboardList, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";

import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/common/skeleton";
import { useMockTests } from "@/features/user/mock-tests/hooks";
import { getStoredAccessToken } from "@/lib/auth/auth-storage";
import { mockTestsService } from "@/lib/api/services/mock-tests";
import type { MockTestSummaryDto } from "@/lib/api/services/mock-tests";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

function MockTestGridSkeleton() {
  return (
    <section className={styles.grid} aria-label="Đang tải bài kiểm tra">
      {Array.from({ length: 9 }).map((_, index) => (
        <article className={`${styles.card} ${styles.skeletonCard}`} key={index}>
          <Skeleton className={styles.skeletonCover} />
          <div className={styles.cardBody}>
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonText} />
            <Skeleton className={styles.skeletonTextShort} />
            <div className={styles.meta}>
              <Skeleton className={styles.skeletonBadge} />
              <Skeleton className={styles.skeletonBadge} />
            </div>
          </div>
          <div className={styles.cardActions}>
            <Skeleton className={styles.skeletonButton} />
            <Skeleton className={styles.skeletonButton} />
          </div>
        </article>
      ))}
    </section>
  );
}

export function MockTestListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const limit = Math.max(Number(searchParams.get("limit") ?? 9), 1);
  const keyword = searchParams.get("keyword") ?? "";
  const {
    data: mockTests,
    meta,
    errorMessage,
    isLoading,
    refetch,
  } = useMockTests({ keyword, limit, page });
  const [startingTestId, setStartingTestId] = useState<number | null>(null);
  const [startError, setStartError] = useState("");

  const updateQuery = (nextValues: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const goToDetail = (mockTest: MockTestSummaryDto) => {
    router.push(appRoutes.mockTestDetail(mockTest.slug));
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    mockTest: MockTestSummaryDto,
  ) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToDetail(mockTest);
    }
  };

  const handleStart = async (
    event: MouseEvent<HTMLButtonElement>,
    mockTest: MockTestSummaryDto,
  ) => {
    event.stopPropagation();

    if (!getStoredAccessToken()) {
      router.push(appRoutes.login);
      return;
    }

    setStartingTestId(mockTest.id);
    setStartError("");

    try {
      const response = await mockTestsService.startMockTestAttempt(mockTest.id);
      router.push(appRoutes.mockTestAttempt(response.data.id));
    } catch (requestError) {
      setStartError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể bắt đầu bài kiểm tra.",
      );
    } finally {
      setStartingTestId(null);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Bài kiểm tra trắc nghiệm</p>
            <h1 className={styles.title}>Luyện nhanh kiến thức backend</h1>
            <p className={styles.text}>
              Chọn một bài kiểm tra để làm trắc nghiệm, lưu đáp án và xem kết
              quả sau khi nộp bài.
            </p>
          </div>
          <Link className={styles.secondaryButton} href={appRoutes.userInterviewSetup}>
            Phỏng vấn với AI
          </Link>
        </header>

        <section className={styles.filterBar} aria-label="Bộ lọc bài kiểm tra">
          <label className={styles.searchField}>
            <Search size={18} />
            <input
              onChange={(event) =>
                updateQuery({ keyword: event.target.value, page: 1, limit })
              }
              placeholder="Tìm bài kiểm tra..."
              type="search"
              value={keyword}
            />
          </label>
        </section>

        {errorMessage || startError ? (
          <div className={styles.error}>
            <p>{startError || errorMessage}</p>
            {errorMessage ? (
              <button className={styles.secondaryButton} onClick={refetch} type="button">
                Thử lại
              </button>
            ) : null}
          </div>
        ) : null}
        {isLoading ? <MockTestGridSkeleton /> : null}
        {!isLoading && !mockTests.length ? (
          <section className={styles.panel}>Chưa có bài kiểm tra nào.</section>
        ) : null}
        {!isLoading && mockTests.length ? (
          <section className={styles.grid}>
            {mockTests.map((mockTest) => (
              <article
                className={`${styles.card} ${styles.clickableCard}`}
                key={mockTest.id}
                onClick={() => goToDetail(mockTest)}
                onKeyDown={(event) => handleCardKeyDown(event, mockTest)}
                role="link"
                tabIndex={0}
              >
                <div className={styles.cover}>
                  {mockTest.coverImageUrl ? (
                    <span
                      aria-label={mockTest.title}
                      className={styles.coverImage}
                      role="img"
                      style={{ backgroundImage: `url(${mockTest.coverImageUrl})` }}
                    />
                  ) : (
                    <span className={styles.coverFallback}>
                      <ClipboardList size={46} />
                    </span>
                  )}
                  <span className={`${styles.badge} ${styles.coverBadge}`}>
                    {mockTest.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{mockTest.title}</h2>
                  <p className={styles.cardText}>{mockTest.description}</p>
                  <div className={styles.meta}>
                    <span>{mockTest.totalQuestions} câu</span>
                    <span>{mockTest.durationMinutes ?? "--"} phút</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Link
                    className={styles.primaryButton}
                    href={appRoutes.mockTestDetail(mockTest.slug)}
                    onClick={(event) => event.stopPropagation()}
                  >
                    Xem chi tiết
                  </Link>
                  <button
                    className={styles.secondaryButton}
                    disabled={startingTestId === mockTest.id}
                    onClick={(event) => handleStart(event, mockTest)}
                    type="button"
                  >
                    {startingTestId === mockTest.id ? "Đang tạo..." : "Bắt đầu"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : null}
        {!isLoading && meta?.total ? (
          <Pagination
            itemCount={meta.itemCount}
            limit={meta.limit ?? limit}
            onPageChange={(nextPage) => updateQuery({ page: nextPage, limit })}
            page={meta.page ?? page}
            total={meta.total}
          />
        ) : null}
      </div>
    </main>
  );
}
