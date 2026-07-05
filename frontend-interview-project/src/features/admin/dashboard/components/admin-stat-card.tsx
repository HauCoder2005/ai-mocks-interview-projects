import type { AdminStat } from "../types/admin-dashboard.type";
import styles from "../../shared/admin-ui.module.css";

type AdminStatCardProps = {
  stat: AdminStat;
};

export function AdminStatCard({ stat }: AdminStatCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>{stat.label}</h3>
      <p className={styles.value}>{stat.value}</p>
      <p className={styles.muted}>{stat.description}</p>
    </article>
  );
}
