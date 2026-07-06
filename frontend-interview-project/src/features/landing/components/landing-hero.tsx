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
        <h1 className={styles.title}>
          Luyện phỏng vấn và kiểm tra kiến thức backend
        </h1>
        <p className={styles.subtitle}>
          Chọn bài kiểm tra, luyện trắc nghiệm, sau đó phỏng vấn với AI bằng
          giọng nói để nhận phản hồi theo ngữ cảnh.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href={appRoutes.mockTests}>
            <ClipboardList size={17} />
            Làm bài kiểm tra
          </Link>
          <Link className={styles.secondaryButton} href={appRoutes.userInterviewSetup}>
            <Bot size={17} />
            Phỏng vấn với AI
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
