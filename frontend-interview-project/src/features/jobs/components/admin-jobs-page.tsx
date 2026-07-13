"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, LoaderCircle, PauseCircle, PlayCircle } from "lucide-react";

import { jobsApi } from "../api/jobs.api";
import { useJobs } from "../hooks/use-jobs";
import type { JobDto, JobStatus } from "../types/job.type";
import styles from "@/features/admin/shared/admin-ui.module.css";

const pageSize = 20;

export function AdminJobsPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [technology, setTechnology] = useState("");
  const [company, setCompany] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [actionId, setActionId] = useState<number | null>(null);
  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      keyword: keyword.trim() || undefined,
      status: status || undefined,
      technology: technology.trim() || undefined,
      company: company.trim() || undefined,
    }),
    [company, keyword, page, status, technology],
  );
  const { data, meta, isLoading, errorMessage, refetch } = useJobs(query, {
    admin: true,
  });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const total = meta?.total ?? 0;
  const canGoNext = page * pageSize < total;

  const handleStatusChange = async (job: JobDto) => {
    setActionId(job.id);
    try {
      if (job.status === "ACTIVE") {
        await jobsApi.deactivateJob(job.id);
        setToast("Đã tắt việc làm.");
      } else {
        await jobsApi.activateJob(job.id);
        setToast("Đã kích hoạt việc làm.");
      }
      await refetch();
    } catch (error) {
      setToast(
        error instanceof Error ? error.message : "Không thể cập nhật trạng thái.",
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className={styles.page}>
      {toast ? <p className={styles.toast}>{toast}</p> : null}
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>Việc làm đã crawl</h1>
          <p className={styles.subtitle}>
            Dữ liệu được đọc từ bảng jobs qua backend chính.
          </p>
        </div>
      </header>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <label className={styles.field}>
            <span className={styles.label}>Tìm kiếm</span>
            <input
              className={styles.input}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(1);
              }}
              placeholder="Title, công ty, URL"
              value={keyword}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Trạng thái</span>
            <select
              className={styles.select}
              onChange={(event) => {
                setStatus(event.target.value as JobStatus | "");
                setPage(1);
              }}
              value={status}
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Công nghệ</span>
            <input
              className={styles.input}
              onChange={(event) => {
                setTechnology(event.target.value);
                setPage(1);
              }}
              placeholder="React, Java..."
              value={technology}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Công ty</span>
            <input
              className={styles.input}
              onChange={(event) => {
                setCompany(event.target.value);
                setPage(1);
              }}
              placeholder="Tên công ty"
              value={company}
            />
          </label>
        </div>
      </section>

      {errorMessage ? <p className={styles.errorText}>{errorMessage}</p> : null}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Technologies</th>
              <th>Focus Topics</th>
              <th>Status</th>
              <th>Expired</th>
              <th>Updated</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className={styles.tableStateCell} colSpan={9}>
                  Đang tải việc làm...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className={styles.tableStateCell} colSpan={9}>
                  Chưa có việc làm.
                </td>
              </tr>
            ) : (
              data.map((job) => (
                <tr key={job.id}>
                  <td>
                    <p className={styles.tableTitle}>{job.title}</p>
                  </td>
                  <td>{job.company}</td>
                  <td>{job.technologies.join(", ") || "N/A"}</td>
                  <td>{job.focusTopics.join(", ") || "N/A"}</td>
                  <td>
                    <span
                      className={
                        job.status === "ACTIVE"
                          ? styles.badge
                          : `${styles.badge} ${styles.badgeInactive}`
                      }
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>
                    {job.expiredAt
                      ? new Date(job.expiredAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td>{new Date(job.updatedAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <a
                      className={styles.iconButton}
                      href={job.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                      title="Mở nguồn"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </td>
                  <td>
                    <button
                      className={
                        job.status === "ACTIVE"
                          ? `${styles.iconButton} ${styles.iconButtonWarning}`
                          : `${styles.iconButton} ${styles.iconButtonSuccess}`
                      }
                      disabled={actionId === job.id}
                      onClick={() => void handleStatusChange(job)}
                      title={job.status === "ACTIVE" ? "Tắt" : "Kích hoạt"}
                      type="button"
                    >
                      {actionId === job.id ? (
                        <LoaderCircle className={styles.spinIcon} size={16} />
                      ) : job.status === "ACTIVE" ? (
                        <PauseCircle size={16} />
                      ) : (
                        <PlayCircle size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.buttonRow}>
        <button
          className={styles.secondaryButton}
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          type="button"
        >
          Trước
        </button>
        <button
          className={styles.secondaryButton}
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
