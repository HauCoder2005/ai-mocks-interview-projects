"use client";

import { useRouter } from "next/navigation";
import { Code2, Database, Mic, Play, ServerCog } from "lucide-react";

import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./landing.module.css";

const quickPracticeItems = [
  {
    title: "Frontend React",
    description: "Luyện hook, component, rendering và cách giải thích trade-off.",
    icon: Code2,
  },
  {
    title: "Backend NestJS",
    description: "Chuẩn bị module, service, database và API design.",
    icon: ServerCog,
  },
  {
    title: "Database",
    description: "Ôn transaction, index, relation và Prisma workflow.",
    icon: Database,
  },
  {
    title: "Voice interview",
    description: "Vào thẳng phiên phỏng vấn AI bằng giọng nói.",
    icon: Mic,
  },
];

export function QuickInterviewFilter() {
  const router = useRouter();

  const handleStart = () => {
    router.push(appRoutes.userInterviewSetup);
  };

  return (
    <section className={`${styles.section} ${styles.block}`}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Các dạng bài luyện</h2>
        </div>
        <button className={styles.primaryButton} onClick={handleStart} type="button">
          <Play size={16} />
          Tạo phiên AI
        </button>
      </div>

      <div className={styles.quickGrid}>
        {quickPracticeItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className={styles.quickCard}
              key={item.title}
              onClick={handleStart}
              type="button"
            >
              <span className={styles.cardIcon}>
                <Icon size={21} />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
