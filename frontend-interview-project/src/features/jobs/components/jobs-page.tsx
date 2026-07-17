"use client";

import { useMemo, useState } from "react";

import { JobCard } from "./job-card";
import { useJobs } from "../hooks/use-jobs";
import styles from "./jobs.module.css";

export function JobsPage() {
  const [keyword, setKeyword] = useState("");
  const [technology, setTechnology] = useState("");
  const [page, setPage] = useState(1);
  const query = useMemo(
    () => ({
      page,
      limit: 12,
      keyword: keyword.trim() || undefined,
      technology: technology.trim() || undefined,
    }),
    [keyword, page, technology],
  );
  const { data, meta, isLoading, errorMessage, refetch } = useJobs(query);

  const total = meta?.total ?? 0;
  const canGoNext = page * 12 < total;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Công việc</p>
          <h1 className={styles.title}>Vị trí đang tuyển</h1>
        </div>
      </header>

      <section className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.label}>Tìm kiếm</span>
          <input
            className={styles.input}
            onChange={(event) => {
              setKeyword(event.target.value);
              setPage(1);
            }}
            placeholder="Title, công ty, nguồn"
            value={keyword}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Công nghệ</span>
          <input
            className={styles.input}
            onChange={(event) => {
              setTechnology(event.target.value);
              setPage(1);
            }}
            placeholder="React, Java, SQL..."
            value={technology}
          />
        </label>
      </section>

      {errorMessage ? (
        <section className={`${styles.panel} ${styles.errorPanel}`} role="alert">
          <p className={styles.error}>Không thể tải danh sách việc làm.</p>
          <button className={styles.button} onClick={() => void refetch()} type="button">
            Thử lại
          </button>
        </section>
      ) : isLoading ? (
        <section className={styles.panel}>
          <p className={styles.muted}>Đang tải danh sách việc làm...</p>
        </section>
      ) : data.length === 0 ? (
        <section className={styles.panel}>
          <p className={styles.muted}>Chưa có việc làm nào được cập nhật.</p>
        </section>
      ) : (
        <div className={styles.grid}>
          {data.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.button}
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          type="button"
        >
          Trước
        </button>
        <button
          className={styles.button}
          disabled={!canGoNext}
          onClick={() => setPage((current) => current + 1)}
          type="button"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
