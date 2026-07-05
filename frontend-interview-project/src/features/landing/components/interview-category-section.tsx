import Link from "next/link";
import { Bot, FileCheck2, Mic } from "lucide-react";

import { appRoutes } from "@/lib/constants/app-routes";

import styles from "./landing.module.css";

const categories = [
  {
    title: "Phỏng vấn AI",
    description: "Tạo phiên hội thoại bằng giọng nói và nhận câu hỏi tiếp theo.",
    href: appRoutes.userInterviewSetup,
    icon: Mic,
  },
  {
    title: "Luyện kiến thức nền",
    description: "Làm bài trắc nghiệm ngắn trước khi vào buổi phỏng vấn.",
    href: appRoutes.userPractice,
    icon: FileCheck2,
  },
  {
    title: "Theo dõi phiên của tôi",
    description: "Xem trạng thái và lịch sử luyện tập khi có dữ liệu phiên.",
    href: appRoutes.userInterviews,
    icon: Bot,
  },
];

export function InterviewCategorySection() {
  return (
    <section className={`${styles.section} ${styles.block}`}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionKicker}>Chọn hướng</p>
          <h2 className={styles.sectionTitle}>Chọn hướng luyện tập</h2>
          <p className={styles.sectionText}>
            Các lối vào chính để bắt đầu nhanh, từ ôn kiến thức đến phỏng vấn AI.
          </p>
        </div>
      </div>
      <div className={styles.categoryGrid}>
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link className={styles.categoryCard} href={category.href} key={category.title}>
              <span className={styles.cardIcon}>
                <Icon size={22} />
              </span>
              <h3 className={styles.cardTitle}>{category.title}</h3>
              <p className={styles.cardText}>{category.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
