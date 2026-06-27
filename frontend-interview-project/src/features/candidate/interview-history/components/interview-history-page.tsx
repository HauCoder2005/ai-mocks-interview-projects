import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";

export function InterviewHistoryPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Interviews"
        description="Review completed mock interview sessions and feedback."
      />
      <EmptyState
        title="No interview history yet"
        description="Completed sessions will appear here after the mock interview API is connected."
      />
    </div>
  );
}
