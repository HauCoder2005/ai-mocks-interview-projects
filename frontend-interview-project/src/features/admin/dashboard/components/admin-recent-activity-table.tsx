import { recentActivities } from "../data/admin-dashboard.mock";
import styles from "../../shared/admin-ui.module.css";

function statusClass(status: string) {
  if (status === "success") return `${styles.badge} ${styles.success}`;
  if (status === "warning") return `${styles.badge} ${styles.warning}`;

  return `${styles.badge} ${styles.danger}`;
}

export function AdminRecentActivityTable() {
  return (
    <section className={styles.panel}>
      <h2 className={styles.cardTitle}>Hoạt động gần đây</h2>
      <div className={styles.tableWrap} style={{ marginTop: 14 }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Hành động</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.length ? (
              recentActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.user}</td>
                  <td>{activity.action}</td>
                  <td>{activity.time}</td>
                  <td>
                    <span className={statusClass(activity.status)}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Chưa có dữ liệu hoạt động từ backend.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
