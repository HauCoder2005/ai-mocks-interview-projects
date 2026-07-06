import Link from "next/link";
import { Bot, Code2, MessageSquareText } from "lucide-react";

import styles from "@/features/user/interview/components/simple-user-pages.module.css";
import { appRoutes } from "@/lib/constants/app-routes";

const practiceItems = [
  {
    title: "Câu hỏi kỹ thuật",
    description: "Luyện cách giải thích concept và trade-off.",
    href: appRoutes.userInterviewSetup,
    icon: Code2,
  },
  {
    title: "Câu hỏi hành vi",
    description: "Chuẩn bị câu chuyện theo STAR.",
    href: appRoutes.userInterviewSetup,
    icon: MessageSquareText,
  },
  {
    title: "Phiên AI đầy đủ",
    description: "Tạo phiên có ngữ cảnh và nhận góp ý.",
    href: appRoutes.userInterviewSetup,
    icon: Bot,
  },
];

export default function UserPracticePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Luyện tập</p>
          <h1 className={styles.title}>Chọn cách luyện phù hợp</h1>
          <p className={styles.subtitle}>Bắt đầu nhanh bằng một dạng bài hoặc tạo phiên phỏng vấn với AI.</p>
        </div>
        <Link className={styles.button} href={appRoutes.userInterviewSetup}>
          Xem dạng bài
        </Link>
      </header>

      <section className={styles.grid}>
        {practiceItems.map((item) => {
          const Icon = item.icon;

          return (
            <article className={styles.card} key={item.title}>
              <span className={styles.icon}><Icon size={20} /></span>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardText}>{item.description}</p>
              <Link className={styles.button} href={item.href}>Bắt đầu</Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}
