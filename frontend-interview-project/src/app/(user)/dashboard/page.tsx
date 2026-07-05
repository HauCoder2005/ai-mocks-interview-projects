import Link from "next/link";
import { BarChart3, Bot, Clock3, Layers } from "lucide-react";

import styles from "@/features/user/interview/components/simple-user-pages.module.css";

const stats = [
  { title: "Tổng phiên", value: "0", description: "Chưa có phiên luyện tập.", icon: Layers },
  { title: "Điểm trung bình", value: "--", description: "Sẽ hiển thị sau khi AI đánh giá.", icon: BarChart3 },
  { title: "Lần gần nhất", value: "--", description: "Chưa có hoạt động gần đây.", icon: Clock3 },
];

export default function UserDashboardPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Dashboard cá nhân</p>
          <h1 className={styles.title}>Tổng quan luyện phỏng vấn</h1>
          <p className={styles.subtitle}>Theo dõi tiến độ, phiên đã tạo và kết quả đánh giá khi có dữ liệu thật.</p>
        </div>
        <Link className={styles.button} href="/interview/setup">
          <Bot size={17} />
          Phỏng vấn với AI
        </Link>
      </header>

      <section className={styles.grid}>
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article className={styles.card} key={item.title}>
              <span className={styles.icon}><Icon size={20} /></span>
              <p className={styles.statValue}>{item.value}</p>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardText}>{item.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
