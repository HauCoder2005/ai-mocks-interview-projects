import styles from "./mock-tests.module.css";

export function MockTestStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className={styles.summaryCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
