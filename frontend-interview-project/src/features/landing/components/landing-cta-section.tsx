import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

import { appRoutes } from "@/lib/constants/app-routes";

import styles from "./landing.module.css";

export function LandingCtaSection() {
  return (
    <section className={`${styles.section} ${styles.ctaSection}`}>
      <div>
        <p className={styles.sectionKicker}>Sẵn sàng luyện tập?</p>
        <h2 className={styles.ctaTitle}>Bắt đầu một phiên phỏng vấn AI hôm nay</h2>
        <p className={styles.ctaText}>
          Chọn ngữ cảnh thật, trả lời bằng giọng nói và để AI hỏi tiếp theo câu trả lời của bạn.
        </p>
      </div>
      <Link className={styles.primaryButton} href={appRoutes.userInterviewSetup}>
        <Bot size={17} />
        Phỏng vấn với AI
        <ArrowRight size={17} />
      </Link>
    </section>
  );
}
