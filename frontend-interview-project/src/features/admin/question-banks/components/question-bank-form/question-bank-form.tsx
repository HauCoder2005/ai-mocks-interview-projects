"use client";

import type { FormEvent } from "react";

import { QuestionBankOptionEditor } from "@/features/admin/question-banks/components/question-bank-option-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AdminInterviewOption } from "@/features/admin/interview-options/types";
import type {
  AdminQuestionBank,
  CreateAdminQuestionBankPayload,
  QuestionBankOption,
  QuestionDifficulty,
  QuestionType,
  UpdateAdminQuestionBankPayload,
} from "@/features/admin/question-banks/types";
import styles from "./question-bank-form.module.css";

export type QuestionBankFormValues = {
  title: string;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  technologyId: string;
  topicId: string;
  options: QuestionBankOption[];
};

type QuestionBankFormProps = {
  editingQuestion?: AdminQuestionBank | null;
  isSubmitting?: boolean;
  technologies: AdminInterviewOption[];
  topics: AdminInterviewOption[];
  values: QuestionBankFormValues;
  onCancelEdit: () => void;
  onChange: (values: QuestionBankFormValues) => void;
  onSubmit: (payload: CreateAdminQuestionBankPayload | UpdateAdminQuestionBankPayload) => void;
};

export function QuestionBankForm({
  editingQuestion,
  isSubmitting = false,
  onCancelEdit,
  onChange,
  onSubmit,
  technologies,
  topics,
  values,
}: QuestionBankFormProps) {
  function updateValue(nextValues: Partial<QuestionBankFormValues>) {
    onChange({ ...values, ...nextValues });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      title: values.title,
      content: values.content,
      type: values.type,
      difficulty: values.difficulty,
      technologyId: values.technologyId,
      topicId: values.topicId,
      options: values.type === "MCQ" ? values.options : [],
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Card>
        <CardContent className={styles.content}>
          <div className={styles.fieldGroup}>
            <Label htmlFor="question-title">Question title</Label>
            <Input
              id="question-title"
              onChange={(event) => updateValue({ title: event.target.value })}
              placeholder="Explain React Server Components"
              required
              value={values.title}
            />
          </div>
          <div className={styles.fieldGroup}>
            <Label htmlFor="question-content">Question content</Label>
            <Textarea
              id="question-content"
              onChange={(event) => updateValue({ content: event.target.value })}
              placeholder="Write the full interview question or coding prompt."
              required
              value={values.content}
            />
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="question-type">Type</Label>
              <Select
                id="question-type"
                onChange={(event) => updateValue({ type: event.target.value as QuestionType })}
                value={values.type}
              >
                <option value="MCQ">MCQ</option>
                <option value="THEORY">Theory</option>
                <option value="CODING">Coding</option>
                <option value="CASE_STUDY">Case study</option>
              </Select>
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="question-difficulty">Difficulty</Label>
              <Select
                id="question-difficulty"
                onChange={(event) =>
                  updateValue({ difficulty: event.target.value as QuestionDifficulty })
                }
                value={values.difficulty}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </Select>
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="question-technology">Technology</Label>
              <Select
                id="question-technology"
                onChange={(event) => updateValue({ technologyId: event.target.value })}
                required
                value={values.technologyId}
              >
                <option value="">Select technology</option>
                {technologies.map((technology) => (
                  <option key={technology.id} value={technology.id}>
                    {technology.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="question-topic">Topic</Label>
              <Select
                id="question-topic"
                onChange={(event) => updateValue({ topicId: event.target.value })}
                required
                value={values.topicId}
              >
                <option value="">Select topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {values.type === "MCQ" ? (
        <QuestionBankOptionEditor
          onChange={(options) => updateValue({ options })}
          options={values.options}
        />
      ) : null}
      <div className={styles.actions}>
        <Button className={styles.submitButton} isLoading={isSubmitting} type="submit">
          {editingQuestion ? "Update question" : "Create question"}
        </Button>
        {editingQuestion ? (
          <Button onClick={onCancelEdit} type="button" variant="outline">
            Cancel edit
          </Button>
        ) : null}
      </div>
    </form>
  );
}
