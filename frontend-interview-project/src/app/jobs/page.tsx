"use client";

import React, { useState } from "react";

import Button from "@/src/components/common/Button";
import { type Job, useJobsQuery } from "@/src/hooks/queries/useJobs";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#ffffff",
  color: "#1e293b",
  padding: "56px 24px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "960px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#1e293b",
  fontSize: "36px",
  fontWeight: 700,
  lineHeight: 1.2,
};

const mutedTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: "15px",
  lineHeight: 1.6,
};

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const jobTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#1e293b",
  fontSize: "21px",
  fontWeight: 700,
  lineHeight: 1.35,
};

const metaStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.5,
};

const paginationStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
};

const statusStyle: React.CSSProperties = {
  color: "#1e293b",
  fontSize: "16px",
  margin: 0,
  padding: "28px 0",
};

const errorStyle: React.CSSProperties = {
  ...statusStyle,
  color: "#dc2626",
};

const getCompanyName = (job: Job): string => {
  return job.companyName ?? job.company ?? "Chưa cập nhật";
};

export default function JobsPage() {
  const [page, setPage] = useState<number>(1);
  const { data, isError, isLoading } = useJobsQuery({ page });

  const jobs = data?.data ?? [];
  const currentPage = data?.meta.page ?? page;
  const totalPages = Math.max(data?.meta.totalPages ?? 1, 1);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePreviousClick = () => {
    if (canGoPrevious) {
      setPage((previousPage) => previousPage - 1);
    }
  };

  const handleNextClick = () => {
    if (canGoNext) {
      setPage((previousPage) => previousPage + 1);
    }
  };

  if (isLoading) {
    return (
      <main style={pageStyle}>
        <section style={contentStyle}>
          <p style={statusStyle}>Đang tải dữ liệu...</p>
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main style={pageStyle}>
        <section style={contentStyle}>
          <p style={errorStyle}>
            Không thể tải dữ liệu
          </p>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={contentStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Việc làm</h1>
          <p style={mutedTextStyle}>
            Danh sách công việc đang được cập nhật từ hệ thống.
          </p>
        </header>

        <div style={listStyle}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <article key={job.id} style={cardStyle}>
                <h2 style={jobTitleStyle}>
                  {job.title ?? "Vị trí chưa cập nhật"}
                </h2>
                <div style={metaStyle}>
                  <span>{getCompanyName(job)}</span>
                  {job.location ? <span>{job.location}</span> : null}
                  {job.employmentType ? <span>{job.employmentType}</span> : null}
                  {job.salary ? <span>{job.salary}</span> : null}
                </div>
                {job.description ? (
                  <p style={mutedTextStyle}>{job.description}</p>
                ) : null}
              </article>
            ))
          ) : (
            <p style={statusStyle}>Chưa có công việc phù hợp.</p>
          )}
        </div>

        <nav aria-label="Phân trang" style={paginationStyle}>
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousClick}
            disabled={!canGoPrevious}
          >
            Trang trước
          </Button>
          <p style={mutedTextStyle}>
            Trang {currentPage} / {totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleNextClick}
            disabled={!canGoNext}
          >
            Trang sau
          </Button>
        </nav>
      </section>
    </main>
  );
}
