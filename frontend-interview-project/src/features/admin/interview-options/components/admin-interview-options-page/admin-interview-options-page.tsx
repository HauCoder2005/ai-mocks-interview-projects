import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InterviewOptionForm } from "@/features/admin/interview-options/components/interview-option-form";
import { InterviewOptionTable } from "@/features/admin/interview-options/components/interview-option-table";
import type { InterviewOptionType } from "@/features/admin/interview-options/types";
import styles from "./admin-interview-options-page.module.css";

const optionTypes: Array<{ type: InterviewOptionType; label: string; description: string }> = [
  { type: "position", label: "Positions", description: "Frontend, Backend, Full-stack..." },
  { type: "level", label: "Levels", description: "Intern, Junior, Middle, Senior..." },
  { type: "technology", label: "Technologies", description: "React, Node.js, NestJS..." },
  { type: "topic", label: "Topics", description: "System design, performance, testing..." },
];

export function AdminInterviewOptionsPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Interview Options"
        description="Configure the option sets used by candidate interview setup flows."
      />
      <section className={styles.section}>
        <SectionHeading
          title="Create master data"
          description="Add positions, levels, technologies, and topics before building question banks."
        />
        <InterviewOptionForm />
      </section>
      <div className={styles.optionGrid}>
        {optionTypes.map((option) => (
          <Card key={option.type}>
            <CardContent>
              <div className={styles.optionSummary}>
                <div>
                  <h2 className={styles.optionTitle}>{option.label}</h2>
                  <p className={styles.optionDescription}>{option.description}</p>
                </div>
                <Badge>{option.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className={styles.section}>
        <SectionHeading title="Current options" />
        <InterviewOptionTable />
      </section>
    </div>
  );
}
