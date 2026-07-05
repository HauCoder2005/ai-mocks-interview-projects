import { interviewFlowFeatures } from "../data/landing-features";
import styles from "./landing.module.css";

export function InterviewFlowSection() {
  return (
    <section className={`${styles.section} ${styles.block}`}>
      <div className={styles.splitSection}>
        <div>
          <p className={styles.sectionKicker}>AI Mock Interview</p>
          <h2 className={styles.sectionTitle}>Phỏng vấn bằng giọng nói như thật</h2>
          <p className={styles.sectionText}>
            Từ setup ngữ cảnh đến voice chat, phiên phỏng vấn được thiết kế để bạn luyện phản xạ và cách trình bày.
          </p>
        </div>
        <div className={styles.flowGrid}>
          {interviewFlowFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className={styles.featureCard} key={feature.title}>
                <span className={styles.cardIcon}>
                  <Icon size={21} />
                </span>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardText}>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
