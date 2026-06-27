import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";

export function MockInterviewPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Practice"
        description="Run the mock interview flow after candidate configuration is complete."
      />
      <EmptyState
        title="Mock interview flow is ready for implementation"
        description="Voice, transcript, scoring, and feedback UI can be added inside this feature."
      />
    </div>
  );
}
