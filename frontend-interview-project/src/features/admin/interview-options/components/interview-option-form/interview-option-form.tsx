"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  CreateAdminInterviewOptionPayload,
  UpdateAdminInterviewOptionPayload,
} from "@/features/admin/interview-options/api/admin-interview-options.api";
import type {
  AdminInterviewOption,
  InterviewOptionType,
} from "@/features/admin/interview-options/types";
import styles from "./interview-option-form.module.css";

export type InterviewOptionFormValues = CreateAdminInterviewOptionPayload & {
  type: InterviewOptionType;
};

type InterviewOptionFormProps = {
  editingOption?: AdminInterviewOption | null;
  isSubmitting?: boolean;
  values: InterviewOptionFormValues;
  onCancelEdit: () => void;
  onChange: (values: InterviewOptionFormValues) => void;
  onSubmit: (
    type: InterviewOptionType,
    payload: CreateAdminInterviewOptionPayload | UpdateAdminInterviewOptionPayload,
  ) => void;
};

export function InterviewOptionForm({
  editingOption,
  isSubmitting = false,
  onCancelEdit,
  onChange,
  onSubmit,
  values,
}: InterviewOptionFormProps) {
  const isLevel = values.type === "level";
  const isTechnology = values.type === "technology";

  function updateValue(nextValues: Partial<InterviewOptionFormValues>) {
    onChange({ ...values, ...nextValues });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values.type, {
      name: values.name,
      code: values.code,
      slug: values.slug,
      description: values.description,
      displayOrder: values.displayOrder,
      isActive: values.isActive,
    });
  }

  return (
    <Card>
      <CardContent>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="option-type">Option type</Label>
              <Select
                disabled={Boolean(editingOption)}
                id="option-type"
                onChange={(event) =>
                  updateValue({ type: event.target.value as InterviewOptionType })
                }
                value={values.type}
              >
                <option value="position">Position</option>
                <option value="level">Level</option>
                <option value="technology">Technology</option>
                <option value="topic">Topic</option>
              </Select>
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="option-name">Name</Label>
              <Input
                id="option-name"
                onChange={(event) => updateValue({ name: event.target.value })}
                placeholder="Frontend Developer, Senior, React..."
                required
                value={values.name}
              />
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="option-code">Code</Label>
              <Input
                id="option-code"
                onChange={(event) => updateValue({ code: event.target.value })}
                placeholder="FRONTEND, SENIOR, REACT..."
                value={values.code ?? ""}
              />
            </div>
            {isTechnology ? (
              <div className={styles.fieldGroup}>
                <Label htmlFor="option-slug">Slug</Label>
                <Input
                  id="option-slug"
                  onChange={(event) => updateValue({ slug: event.target.value })}
                  placeholder="react"
                  value={values.slug ?? ""}
                />
              </div>
            ) : null}
            {isLevel ? (
              <div className={styles.fieldGroup}>
                <Label htmlFor="option-display-order">Display order</Label>
                <Input
                  id="option-display-order"
                  min="0"
                  onChange={(event) =>
                    updateValue({ displayOrder: Number(event.target.value) || 0 })
                  }
                  type="number"
                  value={values.displayOrder ?? 0}
                />
              </div>
            ) : null}
          </div>
          <div className={styles.fieldGroup}>
            <Label htmlFor="option-description">Description</Label>
            <Textarea
              id="option-description"
              onChange={(event) => updateValue({ description: event.target.value })}
              placeholder="Short description for admin context."
              value={values.description ?? ""}
            />
          </div>
          <label className={styles.checkboxLabel}>
            <input
              checked={values.isActive ?? true}
              onChange={(event) => updateValue({ isActive: event.target.checked })}
              type="checkbox"
            />
            Active
          </label>
          <div className={styles.actions}>
            <Button className={styles.submitButton} isLoading={isSubmitting} type="submit">
              {editingOption ? "Update option" : "Add option"}
            </Button>
            {editingOption ? (
              <Button onClick={onCancelEdit} type="button" variant="outline">
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
