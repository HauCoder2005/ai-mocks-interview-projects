import { roleDistribution } from "../data/admin-dashboard.mock";
import shared from "../../shared/admin-ui.module.css";
import styles from "./admin-usage-chart.module.css";

export function AdminRoleDistribution() {
  const total = roleDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className={shared.panel}>
      <h2 className={shared.cardTitle}>Tỷ lệ vai trò</h2>
      <p className={shared.muted}>Tỷ lệ tài khoản USER và ADMIN.</p>
      <div className={styles.summaryGrid}>
        {roleDistribution.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.role}>
              <div className={shared.pageHeader}>
                <strong>{item.role}</strong>
                <span className={shared.badge}>{percent}%</span>
              </div>
              <div className={styles.progress}>
                <div className={styles.progressFill} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
