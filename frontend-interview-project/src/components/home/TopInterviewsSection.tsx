import { Bot } from "lucide-react";
import Link from "next/link";

import styles from "@/src/app/page.module.css";

import { interviewCards } from "./homeData";

/**
 * Renders curated mock interview tracks for candidate practice.
 *
 * @returns A section containing interview cards and practice entry points.
 */
export default function TopInterviewsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Top Interviews</h2>
        <p className={styles.sectionDescription}>
          Chọn một bài test phổ biến và bắt đầu luyện tập với phản hồi có thể
          hành động ngay.
        </p>
      </div>
      <div className={styles.interviewGrid}>
        {interviewCards.map((interview) => (
          <article key={interview.title} className={styles.interviewCard}>
            <div className={styles.interviewTop}>
              <div className={styles.smallIcon}>{interview.icon}</div>
              <span className={styles.badge}>{interview.level}</span>
            </div>
            <h3 className={styles.cardTitle}>{interview.title}</h3>
            <p className={styles.cardText}>{interview.description}</p>
            <Link href="/dashboard" className={styles.testButton}>
              Thi thử
              <Bot size={16} strokeWidth={2.4} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
