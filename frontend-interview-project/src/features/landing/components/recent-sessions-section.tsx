import Link from "next/link";
import { Clock3 } from "lucide-react";

import { appRoutes } from "@/lib/constants/app-routes";

import styles from "./landing.module.css";

export function RecentSessionsSection() {
  return (
    <section className={`${styles.section} ${styles.block}`}>
      <article className={styles.emptyCard}>
        <span className={styles.cardIcon}><Clock3 size={20} /></span>
        <p className={styles.sectionKicker}>Lịch sử luyện tập</p>
        <h2 className={styles.cardTitle}>Bạn chưa có phiên luyện tập nào</h2>
        <p className={styles.emptyText}>
          Sau khi bắt đầu phỏng vấn, lịch sử, trạng thái và kết quả sẽ hiển thị tại đây.
        </p>
        <Link className={styles.primaryButton} href={appRoutes.userInterviewSetup}>
          Tạo phiên đầu tiên
        </Link>
      </article>
    </section>
  );
}
