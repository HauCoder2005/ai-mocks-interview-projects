"use client";

import Link from "next/link";

import { useMockTests } from "@/features/user/mock-tests/hooks";
import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./mock-tests.module.css";

export function MockTestListPage() {
  const {
    data: mockTests,
    errorMessage,
    isLoading,
    refetch,
  } = useMockTests({ limit: 24 });

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
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

        {errorMessage ? (
          <div className={styles.error}>
            <p>{errorMessage}</p>
            <button className={styles.secondaryButton} onClick={refetch} type="button">
              Thử lại
            </button>
          </div>
        ) : null}
        {isLoading ? (
          <section className={styles.panel}>Đang tải bài kiểm tra...</section>
        ) : null}
        {!isLoading && !mockTests.length ? (
          <section className={styles.panel}>Chưa có bài kiểm tra nào.</section>
        ) : null}
        <section className={styles.grid}>
          {mockTests.map((mockTest) => (
            <article className={styles.card} key={mockTest.id}>
              <h2 className={styles.cardTitle}>{mockTest.title}</h2>
              <p className={styles.text}>{mockTest.description}</p>
              <div className={styles.meta}>
                <span className={styles.badge}>{mockTest.totalQuestions} câu</span>
                <span className={styles.badge}>
                  {mockTest.durationMinutes ?? "--"} phút
                </span>
              </div>
              <div className={styles.actions}>
                <Link
                  className={styles.primaryButton}
                  href={appRoutes.mockTestDetail(mockTest.slug)}
                >
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
