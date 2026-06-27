import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import styles from "./interview-configuration-page.module.css";

export function InterviewConfigurationPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Candidate Dashboard"
        description="Choose interview settings and start a focused mock interview session."
      />
      <Card>
        <CardContent>
          <p className={styles.description}>
            Interview configuration forms will live in this feature, backed by admin options APIs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
