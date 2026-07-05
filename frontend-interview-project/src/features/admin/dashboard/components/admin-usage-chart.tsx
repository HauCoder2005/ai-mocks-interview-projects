import { loginActivity } from "../data/admin-dashboard.mock";
import shared from "../../shared/admin-ui.module.css";
import styles from "./admin-usage-chart.module.css";

export function AdminUsageChart() {
  const maxLogins = Math.max(1, ...loginActivity.map((item) => item.logins));
  const maxNewUsers = Math.max(1, ...loginActivity.map((item) => item.newUsers));

  return (
    <section className={styles.chartGrid}>
      <div className={shared.panel}>
        <h2 className={shared.cardTitle}>Đăng nhập 7 ngày</h2>
        <p className={shared.muted}>Số lượt đăng nhập thành công của người dùng web.</p>
        <div className={styles.bars}>
          {loginActivity.map((item) => (
            <div className={styles.barItem} key={item.day}>
              <div
                className={styles.bar}
                style={{ height: `${(item.logins / maxLogins) * 100}%` }}
                title={`${item.logins} lượt đăng nhập`}
              />
              <span className={styles.day}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={shared.panel}>
        <h2 className={shared.cardTitle}>Người dùng mới</h2>
        <p className={shared.muted}>Biểu đồ ngắn cho số đăng ký trong tuần.</p>
        <div className={styles.miniBars}>
          {loginActivity.map((item) => (
            <span
              className={styles.miniBar}
              key={item.day}
              style={{ height: `${(item.newUsers / maxNewUsers) * 100}%` }}
              title={`${item.newUsers} người dùng mới`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
