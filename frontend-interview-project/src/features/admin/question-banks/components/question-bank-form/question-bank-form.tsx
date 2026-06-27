"use client";

import { useState } from "react";

import { QuestionBankOptionEditor } from "@/features/admin/question-banks/components/question-bank-option-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  QuestionDifficulty,
  QuestionType,
} from "@/features/admin/question-banks/types";
import styles from "./question-bank-form.module.css";

export function QuestionBankForm() {
  const [questionType, setQuestionType] = useState<QuestionType>("MCQ");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("MEDIUM");

  return (
    <form className={styles.form}>
      <Card>
        <CardContent className={styles.content}>
          <div className={styles.fieldGroup}>
            <Label htmlFor="question-title">Question title</Label>
            <Input id="question-title" placeholder="Explain React Server Components" />
          </div>
          <div className={styles.fieldGroup}>
            <Label htmlFor="question-content">Question content</Label>
            <Textarea
              id="question-content"
              placeholder="Write the full interview question or coding prompt."
            />
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="question-type">Type</Label>
              <Select
                id="question-type"
                onChange={(event) => setQuestionType(event.target.value as QuestionType)}
                value={questionType}
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
                onChange={(event) => setDifficulty(event.target.value as QuestionDifficulty)}
                value={difficulty}
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
              <Input id="question-technology" placeholder="React, NestJS, PostgreSQL..." />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="question-topic">Topic</Label>
              <Input id="question-topic" placeholder="Rendering, auth, database..." />
            </div>
          </div>
        </CardContent>
      </Card>
      {questionType === "MCQ" ? <QuestionBankOptionEditor /> : null}
      <Button className={styles.submitButton} type="button">
        Save draft
      </Button>
    </form>
  );
}
