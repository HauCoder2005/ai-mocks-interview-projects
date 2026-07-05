"use client";

import Link from "next/link";

import { appRoutes } from "@/lib/constants/app-routes";
import { useInterviewOptions } from "../hooks";

import styles from "./interview.module.css";
import { RandomInterviewGrid } from "./random-interview-grid";

export function UserInterviewPage() {
  const {
    levels,
    isLoading,
    errorMessage,
    fetchDataInterviewOptions,
  } = useInterviewOptions();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Thư viện phỏng vấn</p>
          <h1 className={styles.title}>Chọn dạng bài phỏng vấn</h1>
        </div>

        <div className={styles.buttonRow}>
          <Link className={styles.secondaryButton} href="/interview?mode=random">
            Câu hỏi ngẫu nhiên
          </Link>

          <Link className={styles.primaryButton} href={appRoutes.userInterviewSetup}>
            Phỏng vấn với AI
          </Link>
        </div>
      </header>

      {isLoading ? (
        <section className={styles.card}>
          <p className={styles.cardText}>Đang tải dữ liệu phỏng vấn...</p>
        </section>
      ) : null}

      {!isLoading && errorMessage ? (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Không thể tải dữ liệu</h2>

          <p className={styles.cardText}>{errorMessage}</p>

          <button
            className={styles.secondaryButton}
            onClick={fetchDataInterviewOptions}
            type="button"
          >
            Tải lại
          </button>
        </section>
      ) : null}

      {!isLoading && !errorMessage ? (
        <RandomInterviewGrid items={levels} />
      ) : null}
    </div>
  );
}