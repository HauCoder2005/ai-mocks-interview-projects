import { landingBenefits } from "../data/landing-features";
import styles from "./landing.module.css";

export function BenefitsSection() {
  return (
    <section className={`${styles.section} ${styles.block}`}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionKicker}>Lợi ích</p>
          <h2 className={styles.sectionTitle}>Chuẩn bị phỏng vấn có chiến lược</h2>
          <p className={styles.sectionText}>
            Không chỉ trả lời câu hỏi, bạn còn luyện cách nói rõ, đúng trọng tâm và có bằng chứng.
          </p>
        </div>
      </div>
      <div className={styles.benefitGrid}>
        {landingBenefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article className={styles.featureCard} key={benefit.title}>
              <span className={styles.cardIcon}>
                <Icon size={21} />
              </span>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardText}>{benefit.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
