import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import type { AdminDashboardMetric } from "@/features/admin/dashboard/types";
import styles from "./admin-dashboard-page.module.css";

const metrics: AdminDashboardMetric[] = [
  { label: "Kho Bài", value: "0", description: "" },
  { label: "Phỏng Vấn", value: "4", description: "" },
  { label: "Người Dùng", value: "0", description: "" },
];

export function AdminDashboardPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Admin Dashboard"
        description="Overview for managing AI mock interview configuration and content."
      />
      <div className={styles.metrics}>
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent>
              <p className={styles.metricLabel}>{metric.label}</p>
              <p className={styles.metricValue}>{metric.value}</p>
              <p className={styles.metricDescription}>{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
