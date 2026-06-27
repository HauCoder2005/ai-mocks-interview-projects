import styles from "./pricing-section.module.css";

export function PricingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready for team plans</h2>
          <p className={styles.description}>
            Pricing can be connected later without changing route structure. The landing feature
            already owns this section.
          </p>
        </div>
      </div>
    </section>
  );
}
