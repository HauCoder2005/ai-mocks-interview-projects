import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { QuestionBankForm } from "@/features/admin/question-banks/components/question-bank-form";
import { QuestionBankTable } from "@/features/admin/question-banks/components/question-bank-table";
import styles from "./admin-question-bank-page.module.css";

export function AdminQuestionBankPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Kho Bài"
        description="Manage reusable MCQ, theory, coding, and case-study questions."
      />
      <section className={styles.section}>
        <SectionHeading title="Create question" description="Feature-owned form placeholder." />
        <QuestionBankForm />
      </section>
      <section className={styles.section}>
        <SectionHeading title="Questions" />
        <QuestionBankTable />
      </section>
    </div>
  );
}
