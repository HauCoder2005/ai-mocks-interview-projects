import Link from "next/link";
import { appRoutes } from "@/lib/constants/app-routes";
import type { SubmitMockTestResult } from "../types/mock-test.type";
import { MockTestStatCard } from "./mock-test-stat-card";
import styles from "./mock-tests.module.css";

export function MockTestResult({ result }: { result: SubmitMockTestResult }) {
  return (
    <>
      <section className={styles.scorePanel}>
        <MockTestStatCard label="Tổng số câu" value={result.totalQuestions} />
        <MockTestStatCard label="Số câu đúng" value={result.correctCount} />
        <MockTestStatCard label="Số câu sai" value={result.wrongCount} />
        <MockTestStatCard label="Điểm / Tỷ lệ" value={`${result.score} / ${result.percentage}%`} />
      </section>
      <div className={styles.resultActions}>
        <Link className={styles.secondaryButton} href={appRoutes.mockTests}>Quay lại danh sách bài kiểm tra</Link>
      </div>
    </>
  );
}
