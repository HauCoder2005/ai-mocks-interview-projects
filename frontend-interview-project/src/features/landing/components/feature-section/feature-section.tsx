import type { LandingFeature } from "@/features/landing/types";
import styles from "./feature-section.module.css";

const features: LandingFeature[] = [
  {
    title: "Role-based interview setup",
    description: "Prepare flows by position, seniority, technology, and topic.",
  },
  {
    title: "Admin question banks",
    description: "Keep interview content organized for repeatable evaluation.",
  },
  {
    title: "Candidate practice workspace",
    description: "Guide candidates from configuration to practice and history.",
  },
];

export function FeatureSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {features.map((feature) => (
          <article className={styles.featureCard} key={feature.title}>
            <h2 className={styles.title}>{feature.title}</h2>
            <p className={styles.description}>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
