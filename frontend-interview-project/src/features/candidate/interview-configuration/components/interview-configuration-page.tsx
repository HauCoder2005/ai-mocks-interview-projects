import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";

export function InterviewConfigurationPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Candidate Dashboard"
        description="Choose interview settings and start a focused mock interview session."
      />
      <Card>
        <CardContent>
          <p className="text-sm text-slate-600">
            Interview configuration forms will live in this feature, backed by admin options APIs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
