"use client";

import { DashboardCharts } from "@/components/common/dashboard-charts";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingState } from "@/components/common/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import type { AdminDashboardMetric } from "@/features/admin/dashboard/types";
import { useAdminDashboard } from "@/features/admin/dashboard/hooks/use-admin-dashboard";
import styles from "./admin-dashboard-page.module.css";

export function AdminDashboardPage() {
  const {
    positions,
    levels,
    technologies,
    topics,
    questionBanks,
    summary,
    isLoading,
    error,
    refetch,
  } = useAdminDashboard();

  const metrics: AdminDashboardMetric[] = [
    { label: "Positions", value: String(summary.totalPositions), description: "Master data" },
    { label: "Levels", value: String(summary.totalLevels), description: "Master data" },
    {
      label: "Technologies",
      value: String(summary.totalTechnologies),
      description: "Master data",
    },
    { label: "Topics", value: String(summary.totalTopics), description: "Master data" },
    {
      label: "Question Banks",
      value: String(summary.totalQuestionBanks),
      description: "Admin content",
    },
    { label: "MCQ Questions", value: String(summary.totalMcqQuestions), description: "" },
    { label: "Theory Questions", value: String(summary.totalTheoryQuestions), description: "" },
    { label: "Coding Questions", value: String(summary.totalCodingQuestions), description: "" },
    {
      label: "Case Study Questions",
      value: String(summary.totalCaseStudyQuestions),
      description: "",
    },
  ];

  const questionTypeData = [
    { name: "MCQ", value: summary.totalMcqQuestions },
    { name: "Theory", value: summary.totalTheoryQuestions },
    { name: "Coding", value: summary.totalCodingQuestions },
    { name: "Case Study", value: summary.totalCaseStudyQuestions },
  ];

  const userVisitData = [
    { name: "Users", value: summary.totalUsers },
    { name: "Visits", value: summary.totalVisits },
  ];

  const hasData =
    positions.length > 0 ||
    levels.length > 0 ||
    technologies.length > 0 ||
    topics.length > 0 ||
    questionBanks.length > 0;

  if (isLoading) {
    return <LoadingState description="Loading admin dashboard data." title="Loading dashboard" />;
  }

  if (error) {
    return (
      <ErrorState
        action={
          <Button onClick={() => refetch()} type="button">
            Retry
          </Button>
        }
        description="Unable to load admin dashboard data from backend."
        title="Dashboard unavailable"
      />
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Admin Dashboard"
        description="Overview for managing AI mock interview configuration and content."
      />
      {!hasData ? (
        <EmptyState
          description="Create master data or question banks to populate the dashboard."
          title="No admin data yet"
        />
      ) : null}
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
      <DashboardCharts
        questionTypeData={questionTypeData}
        userVisitData={userVisitData}
        visitsNote="Chưa có dữ liệu truy cập từ backend"
      />
    </div>
  );
}
