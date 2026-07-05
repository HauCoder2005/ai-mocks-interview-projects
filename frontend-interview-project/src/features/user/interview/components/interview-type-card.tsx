import Link from "next/link";
import { BarChart3 } from "lucide-react";

import type { InterviewLevelDto } from "@/lib/api/services/interview/interview-options/interview-options.dto";
import { appRoutes } from "@/lib/constants/app-routes";

import styles from "./interview.module.css";

type InterviewTypeCardProps = {
  item: InterviewLevelDto;
};

export function InterviewTypeCard({ item }: InterviewTypeCardProps) {
  const setupHref = `${appRoutes.userInterviewSetup}?levelId=${item.id}`;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.icon}>
          <BarChart3 size={20} />
        </span>

        <span className={styles.badge}>
          {item.isActive ? "Đang bật" : "Tạm tắt"}
        </span>
      </div>

      <div>
        <h3 className={styles.cardTitle}>{item.name}</h3>

        <p className={styles.cardText}>
          {item.description ?? "Cấp độ này chưa có mô tả."}
        </p>
      </div>

      <div className={styles.metaGrid}>
        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>Mã cấp độ</span>
          <span className={styles.metaValue}>{item.code}</span>
        </span>

        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>Thứ tự hiển thị</span>
          <span className={styles.metaValue}>{item.displayOrder}</span>
        </span>

        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>Trạng thái</span>
          <span className={styles.metaValue}>
            {item.isActive ? "Hoạt động" : "Không hoạt động"}
          </span>
        </span>
      </div>

      <div className={styles.cardFooter}>
        <Link className={styles.primaryButton} href={setupHref}>
          Chọn cấp độ
        </Link>
      </div>
    </article>
  );
}