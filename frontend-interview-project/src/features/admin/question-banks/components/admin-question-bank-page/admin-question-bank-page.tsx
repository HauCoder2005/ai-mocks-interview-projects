"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { useAdminInterviewOptions } from "@/features/admin/interview-options/hooks/use-admin-interview-options";
import {
  createAdminQuestionBank,
  deleteAdminQuestionBank,
  updateAdminQuestionBank,
} from "@/features/admin/question-banks/api/admin-question-bank.api";
import {
  QuestionBankForm,
  type QuestionBankFormValues,
} from "@/features/admin/question-banks/components/question-bank-form";
import { QuestionBankTable } from "@/features/admin/question-banks/components/question-bank-table";
import { useAdminQuestionBanks } from "@/features/admin/question-banks/hooks/use-admin-question-banks";
import type {
  AdminQuestionBank,
  CreateAdminQuestionBankPayload,
  UpdateAdminQuestionBankPayload,
} from "@/features/admin/question-banks/types";
import styles from "./admin-question-bank-page.module.css";

const emptyOptions = [
  { content: "", isCorrect: false, explanation: "" },
  { content: "", isCorrect: false, explanation: "" },
  { content: "", isCorrect: false, explanation: "" },
  { content: "", isCorrect: false, explanation: "" },
];

const emptyFormValues: QuestionBankFormValues = {
  title: "",
  content: "",
  type: "MCQ",
  difficulty: "MEDIUM",
  technologyId: "",
  topicId: "",
  options: emptyOptions,
};

export function AdminQuestionBankPage() {
  const queryClient = useQueryClient();
  const questionBanksQuery = useAdminQuestionBanks();
  const technologiesQuery = useAdminInterviewOptions("technology");
  const topicsQuery = useAdminInterviewOptions("topic");
  const [formValues, setFormValues] = useState<QuestionBankFormValues>(emptyFormValues);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestionBank | null>(null);

  const technologies = useMemo(
    () => (technologiesQuery.data ?? []).map((technology) => ({ ...technology, type: "technology" as const })),
    [technologiesQuery.data],
  );
  const topics = useMemo(
    () => (topicsQuery.data ?? []).map((topic) => ({ ...topic, type: "topic" as const })),
    [topicsQuery.data],
  );

  const invalidateQuestionBanks = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "question-banks"] });

  const saveMutation = useMutation({
    mutationFn: (payload: CreateAdminQuestionBankPayload | UpdateAdminQuestionBankPayload) => {
      if (editingQuestion) {
        return updateAdminQuestionBank(editingQuestion.id, payload);
      }

      return createAdminQuestionBank(payload as CreateAdminQuestionBankPayload);
    },
    onSuccess: () => {
      setEditingQuestion(null);
      setFormValues(emptyFormValues);
      invalidateQuestionBanks();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (question: AdminQuestionBank) => deleteAdminQuestionBank(question.id),
    onSuccess: invalidateQuestionBanks,
  });

  function handleEdit(question: AdminQuestionBank) {
    setEditingQuestion(question);
    setFormValues({
      title: question.title,
      content: question.content,
      type: question.type ?? question.questionType ?? "MCQ",
      difficulty: question.difficulty,
      technologyId: question.technologyId ?? "",
      topicId: question.topicId ?? "",
      options: question.options?.length ? question.options : emptyOptions,
    });
  }

  function handleCancelEdit() {
    setEditingQuestion(null);
    setFormValues(emptyFormValues);
  }

  const isLoading =
    questionBanksQuery.isLoading || technologiesQuery.isLoading || topicsQuery.isLoading;
  const error = questionBanksQuery.error || technologiesQuery.error || topicsQuery.error;
  const questionBanks = questionBanksQuery.data ?? [];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Kho Bài"
        description="Manage reusable MCQ, theory, coding, and case-study questions."
      />
      <section className={styles.section}>
        <SectionHeading
          title={editingQuestion ? "Update question" : "Create question"}
          description="Create question banks using backend topics and technologies."
        />
        <QuestionBankForm
          editingQuestion={editingQuestion}
          isSubmitting={saveMutation.isPending}
          onCancelEdit={handleCancelEdit}
          onChange={setFormValues}
          onSubmit={(payload) => saveMutation.mutate(payload)}
          technologies={technologies}
          topics={topics}
          values={formValues}
        />
      </section>
      <section className={styles.section}>
        <SectionHeading title="Questions" />
        {isLoading ? (
          <LoadingState description="Loading question banks." title="Loading questions" />
        ) : null}
        {error ? (
          <ErrorState
            action={
              <Button onClick={() => invalidateQuestionBanks()} type="button">
                Retry
              </Button>
            }
            description="Unable to load question banks or master data options."
            title="Questions unavailable"
          />
        ) : null}
        {!isLoading && !error && questionBanks.length === 0 ? (
          <EmptyState
            description="Create a question bank item to see it here."
            title="No questions yet"
          />
        ) : null}
        {!isLoading && !error && questionBanks.length > 0 ? (
          <QuestionBankTable
            onDelete={(question) => deleteMutation.mutate(question)}
            onEdit={handleEdit}
            questions={questionBanks}
          />
        ) : null}
      </section>
    </div>
  );
}
