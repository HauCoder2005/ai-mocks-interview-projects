import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { QuestionBankForm } from "@/features/admin/question-banks/components/question-bank-form";
import { QuestionBankTable } from "@/features/admin/question-banks/components/question-bank-table";

export function AdminQuestionBankPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Question Banks"
        description="Manage reusable technical, behavioral, coding, and system-design questions."
      />
      <section className="grid gap-4">
        <SectionHeading title="Create question" description="Feature-owned form placeholder." />
        <QuestionBankForm />
      </section>
      <section className="grid gap-4">
        <SectionHeading title="Questions" />
        <QuestionBankTable />
      </section>
    </div>
  );
}
