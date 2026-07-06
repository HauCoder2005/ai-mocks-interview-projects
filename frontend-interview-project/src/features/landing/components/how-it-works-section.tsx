import { howItWorksSteps } from "../data/landing-features";
import styles from "./landing.module.css";

export function HowItWorksSection() {
  return (
    <section className={`${styles.section} ${styles.block}`}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionKicker}>Quy trình</p>
          <h2 className={styles.sectionTitle}>Cách hoạt động</h2>
          <p className={styles.sectionText}>
            Ba bước ngắn gọn để tạo một phiên luyện tập có ngữ cảnh.
          </p>
        </div>
      </div>
      <div className={styles.stepGrid}>
        {howItWorksSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article className={styles.stepCard} key={step.title}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <span className={styles.stepIcon}>
                <Icon size={22} />
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
