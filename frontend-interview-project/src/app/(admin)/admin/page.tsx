/**
 * Defines the foundational admin dashboard overview route with typed local
 * presentation data for metrics and recent operational activity.
 *
 * @returns A production-ready administrative overview page.
 */
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";

import styles from "./page.module.css";

/**
 * Defines one executive metric rendered in the admin overview grid.
 *
 * @param label - Stable metric label displayed above the value.
 * @param value - High-level metric value formatted for dashboard scanning.
 * @param trend - Short contextual trend text shown under the primary value.
 * @param Icon - Lucide icon component associated with the metric domain.
 * @returns A typed metric card data contract.
 */
interface MetricCardItem {
  /**
   * Stable metric label displayed above the value.
   */
  label: string;
  /**
   * High-level metric value formatted for dashboard scanning.
   */
  value: string;
  /**
   * Short contextual trend text shown under the primary value.
   */
  trend: string;
  /**
   * Lucide icon component associated with the metric domain.
   */
  Icon: LucideIcon;
}

/**
 * Defines one recent system activity rendered in the admin overview table.
 *
 * @param id - Unique activity identifier used as a stable table row key.
 * @param entity - Administrative domain affected by the activity.
 * @param action - Human-readable action recorded by the system.
 * @param actor - Actor responsible for the activity.
 * @param time - Localized activity timestamp shown to administrators.
 * @param status - Current processing or audit status of the activity.
 * @returns A typed system log table row contract.
 */
interface SystemLogItem {
  /**
   * Unique activity identifier used as a stable table row key.
   */
  id: string;
  /**
   * Administrative domain affected by the activity.
   */
  entity: string;
  /**
   * Human-readable action recorded by the system.
   */
  action: string;
  /**
   * Actor responsible for the activity.
   */
  actor: string;
  /**
   * Localized activity timestamp shown to administrators.
   */
  time: string;
  /**
   * Current processing or audit status of the activity.
   */
  status: string;
}

const metrics: MetricCardItem[] = [
  {
    label: "Tổng người dùng",
    value: "12,480",
    trend: "+18.4% trong 30 ngày",
    Icon: Users,
  },
  {
    label: "Phỏng vấn đang hoạt động",
    value: "842",
    trend: "+96 phiên hôm nay",
    Icon: Timer,
  },
  {
    label: "Tỷ lệ hoàn thành",
    value: "78.6%",
    trend: "+4.2% so với tuần trước",
    Icon: CheckCircle2,
  },
];

const systemLogs: SystemLogItem[] = [
  {
    id: "LOG-1048",
    entity: "User Management",
    action: "Cấp quyền admin cho tài khoản nội bộ",
    actor: "admin@codeser.io",
    time: "09:42",
    status: "Đã ghi nhận",
  },
  {
    id: "LOG-1047",
    entity: "Interview Templates",
    action: "Cập nhật bộ câu hỏi Frontend React",
    actor: "content@codeser.io",
    time: "09:18",
    status: "Đã xuất bản",
  },
  {
    id: "LOG-1046",
    entity: "CV Review",
    action: "Đồng bộ tiêu chí chấm điểm hồ sơ",
    actor: "system",
    time: "08:55",
    status: "Hoàn tất",
  },
  {
    id: "LOG-1045",
    entity: "Job Matching",
    action: "Làm mới chỉ số phù hợp việc làm",
    actor: "system",
    time: "08:31",
    status: "Hoàn tất",
  },
];

/**
 * Renders the foundational admin overview page with executive metrics and a
 * recent system activity table for operational monitoring.
 *
 * @returns The admin dashboard overview route for RBAC-enabled administrators.
 */
export default function AdminDashboardPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <p className={styles.eyebrow}>Dashboard Overview</p>
          <h1 className={styles.title}>Xin chào, Admin</h1>
          <p className={styles.description}>
            Theo dõi tình trạng hệ thống, người dùng, nội dung phỏng vấn và các
            hoạt động quan trọng trong nền tảng AI Mock Interview.
          </p>
        </div>
        <div className={styles.statusBadge}>
          <Activity size={18} strokeWidth={2.2} />
          <span>Hệ thống ổn định</span>
        </div>
      </header>

      <section className={styles.metricsGrid} aria-label="Chỉ số quản trị">
        {metrics.map(({ label, value, trend, Icon }) => (
          <article className={styles.metricCard} key={label}>
            <div className={styles.metricIcon}>
              <Icon size={24} strokeWidth={2.2} />
            </div>
            <div className={styles.metricContent}>
              <p className={styles.metricLabel}>{label}</p>
              <p className={styles.metricValue}>{value}</p>
              <p className={styles.metricTrend}>{trend}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.tableSection} aria-labelledby="system-logs">
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle} id="system-logs">
              Recent Activities
            </h2>
            <p className={styles.tableSubtitle}>
              Nhật ký vận hành gần nhất từ các module quản trị cốt lõi.
            </p>
          </div>
          <BarChart3
            className={styles.tableHeaderIcon}
            size={24}
            strokeWidth={2.2}
          />
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Phân hệ</th>
                <th>Hoạt động</th>
                <th>Người thực hiện</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {systemLogs.map(({ id, entity, action, actor, time, status }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td className={styles.entityCell}>{entity}</td>
                  <td>{action}</td>
                  <td>{actor}</td>
                  <td>{time}</td>
                  <td>
                    <span className={styles.status}>{status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
