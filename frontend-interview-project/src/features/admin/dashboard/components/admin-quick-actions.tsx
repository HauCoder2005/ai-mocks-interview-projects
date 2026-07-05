import Link from "next/link";

import { quickActions } from "../data/admin-dashboard.mock";
import styles from "../../shared/admin-ui.module.css";

export function AdminQuickActions() {
  return (
    <section className={styles.panel}>
      <h2 className={styles.cardTitle}>Thao tác nhanh</h2>
      <div className={styles.statsGrid} style={{ marginTop: 14 }}>
        {quickActions.map((action) => (
          <Link className={styles.card} href={action.href} key={action.label}>
            <h3 className={styles.cardTitle}>{action.label}</h3>
            <p className={styles.muted}>{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
