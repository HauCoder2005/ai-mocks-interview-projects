import Link from "next/link";

import styles from "./interview.module.css";

type SessionSummaryCardProps = {
  averageScore: number;
  lastPractice: string;
  totalSessions: number;
};

export function SessionSummaryCard({
  averageScore,
  lastPractice,
  totalSessions,
}: SessionSummaryCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Luyện tập</p>
          <h1 className={styles.title}>Luyện phỏng vấn cùng AI</h1>
          <p className={styles.subtitle}>
            Tạo phiên phỏng vấn, trả lời bằng văn bản hoặc giọng nói, sau đó nhận góp ý.
          </p>
        </div>
        <Link className={styles.primaryButton} href="/interview/setup">
          Tạo phiên mới
        </Link>
      </div>

      <div className={styles.stats} style={{ marginTop: 20 }}>
        <article className={styles.scoreCard}>
          <p className={styles.muted}>Tổng phiên</p>
          <p className={styles.scoreValue}>{totalSessions}</p>
        </article>
        <article className={styles.scoreCard}>
          <p className={styles.muted}>Điểm trung bình</p>
          <p className={styles.scoreValue}>{averageScore}</p>
        </article>
        <article className={styles.scoreCard}>
          <p className={styles.muted}>Lần gần nhất</p>
          <p className={styles.cardTitle}>{lastPractice}</p>
        </article>
      </div>
    </section>
  );
}
