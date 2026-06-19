import styles from "@/src/app/page.module.css";

import { features } from "./homeData";

/**
 * Renders the product capability grid for the landing page.
 *
 * @returns A section containing feature cards for the core product workflows.
 */
export default function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Một hệ thống cho toàn bộ hành trình</h2>
        <p className={styles.sectionDescription}>
          Từ luyện nói, sửa CV đến chọn công việc, mọi thứ được gom vào một trải
          nghiệm liền mạch cho ứng viên hiện đại.
        </p>
      </div>
      <div className={styles.featureGrid}>
        {features.map((feature) => (
          <article key={feature.title} className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${feature.iconClassName}`}>
              {feature.icon}
            </div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardText}>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
