import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";

import styles from "@/src/app/page.module.css";

/**
 * Renders the landing page hero with primary conversion actions.
 *
 * @returns A hero section containing headline copy, calls to action, and media.
 */
export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}>
          <Sparkles size={16} strokeWidth={2.4} />
          AI-powered career rehearsal
        </div>
        <h1 className={styles.heading}>
          Luyện phỏng vấn như một ứng viên{" "}
          <span className={styles.gradientText}>đã sẵn sàng thắng offer.</span>
        </h1>
        <p className={styles.tagline}>
          AI Mock Interview giúp bạn luyện trả lời, tối ưu CV và tìm đúng cơ
          hội nghề nghiệp bằng một hệ thống đánh giá rõ ràng, hiện đại và đáng
          tin cậy.
        </p>
        <div className={styles.actionRow}>
          <Link href="/register" className={styles.primaryButton}>
            Bắt đầu miễn phí
            <ArrowRight size={18} strokeWidth={2.4} />
          </Link>
          <Link href="/dashboard" className={styles.secondaryButton}>
            Xem Dashboard
            <Play size={17} strokeWidth={2.4} />
          </Link>
        </div>
      </div>

      <div className={styles.heroVisual}>
        <div className={styles.imageFrame}>
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=85"
            alt="Nhóm công nghệ đang chuẩn bị phỏng vấn và làm việc với dữ liệu"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.floatingCard}>
          <h2 className={styles.floatingTitle}>Interview readiness</h2>
          <p className={styles.floatingText}>
            92% câu trả lời được phân tích theo cấu trúc, độ rõ ràng và độ phù
            hợp với vị trí ứng tuyển.
          </p>
        </div>
      </div>
    </section>
  );
}
