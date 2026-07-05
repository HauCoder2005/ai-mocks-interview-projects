import Link from "next/link";
import { Bot, ClipboardList, Sparkles } from "lucide-react";

import { appRoutes } from "@/lib/constants/app-routes";

import { HeroSlider } from "./hero-slider";
import styles from "./landing.module.css";

export function LandingHero() {
  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <div>
        <p className={styles.eyebrow}>
          <Sparkles size={15} />
          Nền tảng luyện phỏng vấn AI
        </p>
        <h1 className={styles.title}>Luyện phỏng vấn cùng AI</h1>
        <p className={styles.subtitle}>
          Chọn vị trí, cấp độ và chủ đề. Trả lời bằng giọng nói hoặc văn bản, nhận phản hồi và câu hỏi tiếp theo theo ngữ cảnh.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href={appRoutes.userInterviewSetup}>
            <Bot size={17} />
            Phỏng vấn với AI
          </Link>
          <Link className={styles.secondaryButton} href="#exam-cards">
            <ClipboardList size={17} />
            Xem bài kiểm tra
          </Link>
        </div>
        <div className={styles.heroStats}>
          <span>
            <strong>4 bước</strong>
            Voice interview
          </span>
          <span>
            <strong>6 chủ đề</strong>
            Trắc nghiệm nền
          </span>
          <span>
            <strong>AI chat</strong>
            Hỏi tiếp theo ngữ cảnh
          </span>
        </div>
      </div>

      <HeroSlider />
    </section>
  );
}
