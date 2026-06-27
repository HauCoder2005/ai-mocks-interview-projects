import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import type { AdminDashboardMetric } from "@/features/admin/dashboard/types";

const metrics: AdminDashboardMetric[] = [
  { label: "Question banks", value: "0", description: "Ready for backend data" },
  { label: "Interview options", value: "4", description: "Positions, levels, techs, topics" },
  { label: "Candidates", value: "0", description: "Connected after user API is available" },
];

export function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview for managing AI mock interview configuration and content."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent>
              <p className="text-sm font-medium text-slate-600">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</p>
              <p className="mt-2 text-sm text-slate-500">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
