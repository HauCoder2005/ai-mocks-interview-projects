import { adminStats } from "../data/admin-dashboard.mock";
import { AdminQuickActions } from "./admin-quick-actions";
import { AdminRecentActivityTable } from "./admin-recent-activity-table";
import { AdminRoleDistribution } from "./admin-role-distribution";
import { AdminStatCard } from "./admin-stat-card";
import { AdminUsageChart } from "./admin-usage-chart";
import styles from "../../shared/admin-ui.module.css";

export function AdminDashboardPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>Bảng điều khiển</h1>
          <p className={styles.subtitle}>Quản lý người dùng, bài thi và hoạt động của hệ thống.</p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        {adminStats.map((stat) => (
          <AdminStatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <AdminUsageChart />
      <AdminRoleDistribution />
      <AdminRecentActivityTable />
      <AdminQuickActions />
    </div>
  );
}
