"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  activateAdminInterviewLevel,
  activateAdminInterviewPosition,
  activateAdminInterviewTechnology,
  activateAdminInterviewTopic,
  createAdminInterviewLevel,
  createAdminInterviewPosition,
  createAdminInterviewTechnology,
  createAdminInterviewTopic,
  deactivateAdminInterviewLevel,
  deactivateAdminInterviewPosition,
  deactivateAdminInterviewTechnology,
  deactivateAdminInterviewTopic,
  updateAdminInterviewLevel,
  updateAdminInterviewPosition,
  updateAdminInterviewTechnology,
  updateAdminInterviewTopic,
  type CreateAdminInterviewOptionPayload,
  type UpdateAdminInterviewOptionPayload,
} from "@/features/admin/interview-options/api/admin-interview-options.api";
import {
  InterviewOptionForm,
  type InterviewOptionFormValues,
} from "@/features/admin/interview-options/components/interview-option-form";
import { InterviewOptionTable } from "@/features/admin/interview-options/components/interview-option-table";
import { useAdminInterviewOptions } from "@/features/admin/interview-options/hooks/use-admin-interview-options";
import type {
  AdminInterviewOption,
  InterviewOptionType,
} from "@/features/admin/interview-options/types";
import styles from "./admin-interview-options-page.module.css";

const optionTypes: Array<{ type: InterviewOptionType; label: string; description: string }> = [
  { type: "position", label: "Positions", description: "Frontend, Backend, Full-stack..." },
  { type: "level", label: "Levels", description: "Intern, Junior, Middle, Senior..." },
  { type: "technology", label: "Technologies", description: "React, Node.js, NestJS..." },
  { type: "topic", label: "Topics", description: "System design, performance, testing..." },
];

const emptyFormValues: InterviewOptionFormValues = {
  type: "position",
  name: "",
  code: "",
  slug: "",
  description: "",
  displayOrder: 0,
  isActive: true,
};

const createByType = {
  position: createAdminInterviewPosition,
  level: createAdminInterviewLevel,
  technology: createAdminInterviewTechnology,
  topic: createAdminInterviewTopic,
};

const updateByType = {
  position: updateAdminInterviewPosition,
  level: updateAdminInterviewLevel,
  technology: updateAdminInterviewTechnology,
  topic: updateAdminInterviewTopic,
};

const activateByType = {
  position: activateAdminInterviewPosition,
  level: activateAdminInterviewLevel,
  technology: activateAdminInterviewTechnology,
  topic: activateAdminInterviewTopic,
};

const deactivateByType = {
  position: deactivateAdminInterviewPosition,
  level: deactivateAdminInterviewLevel,
  technology: deactivateAdminInterviewTechnology,
  topic: deactivateAdminInterviewTopic,
};

function withType(options: AdminInterviewOption[] | undefined, type: InterviewOptionType) {
  return (options ?? []).map((option) => ({ ...option, type }));
}

export function AdminInterviewOptionsPage() {
  const queryClient = useQueryClient();
  const positionsQuery = useAdminInterviewOptions("position");
  const levelsQuery = useAdminInterviewOptions("level");
  const technologiesQuery = useAdminInterviewOptions("technology");
  const topicsQuery = useAdminInterviewOptions("topic");
  const [formValues, setFormValues] = useState<InterviewOptionFormValues>(emptyFormValues);
  const [editingOption, setEditingOption] = useState<AdminInterviewOption | null>(null);

  const options = useMemo(
    () => [
      ...withType(positionsQuery.data, "position"),
      ...withType(levelsQuery.data, "level"),
      ...withType(technologiesQuery.data, "technology"),
      ...withType(topicsQuery.data, "topic"),
    ],
    [levelsQuery.data, positionsQuery.data, technologiesQuery.data, topicsQuery.data],
  );

  const invalidateOptions = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "interview-options"] });

  const saveMutation = useMutation({
    mutationFn: ({
      payload,
      type,
    }: {
      type: InterviewOptionType;
      payload: CreateAdminInterviewOptionPayload | UpdateAdminInterviewOptionPayload;
    }) => {
      if (editingOption) {
        return updateByType[type](editingOption.id, payload);
      }

      return createByType[type](payload as CreateAdminInterviewOptionPayload);
    },
    onSuccess: () => {
      setEditingOption(null);
      setFormValues(emptyFormValues);
      invalidateOptions();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      action,
      option,
    }: {
      action: "activate" | "deactivate";
      option: AdminInterviewOption;
    }) => {
      const handler = action === "activate" ? activateByType[option.type] : deactivateByType[option.type];

      return handler(option.id);
    },
    onSuccess: invalidateOptions,
  });

  const isLoading =
    positionsQuery.isLoading ||
    levelsQuery.isLoading ||
    technologiesQuery.isLoading ||
    topicsQuery.isLoading;
  const error =
    positionsQuery.error || levelsQuery.error || technologiesQuery.error || topicsQuery.error;

  function handleEdit(option: AdminInterviewOption) {
    setEditingOption(option);
    setFormValues({
      type: option.type,
      name: option.name,
      code: option.code ?? "",
      slug: option.slug ?? "",
      description: option.description ?? "",
      displayOrder: option.displayOrder ?? 0,
      isActive: option.isActive,
    });
  }

  function handleCancelEdit() {
    setEditingOption(null);
    setFormValues(emptyFormValues);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Interview Options"
        description="Configure the option sets used by candidate interview setup flows."
      />
      <section className={styles.section}>
        <SectionHeading
          title={editingOption ? "Update master data" : "Create master data"}
          description="Add positions, levels, technologies, and topics before building question banks."
        />
        <InterviewOptionForm
          editingOption={editingOption}
          isSubmitting={saveMutation.isPending}
          onCancelEdit={handleCancelEdit}
          onChange={setFormValues}
          onSubmit={(type, payload) => saveMutation.mutate({ type, payload })}
          values={formValues}
        />
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
        {isLoading ? (
          <LoadingState description="Loading admin master data." title="Loading options" />
        ) : null}
        {error ? (
          <ErrorState
            action={
              <Button onClick={() => invalidateOptions()} type="button">
                Retry
              </Button>
            }
            description="Unable to load admin master data."
            title="Options unavailable"
          />
        ) : null}
        {!isLoading && !error && options.length === 0 ? (
          <EmptyState
            description="Create positions, levels, technologies, or topics to see them here."
            title="No options yet"
          />
        ) : null}
        {!isLoading && !error && options.length > 0 ? (
          <InterviewOptionTable
            onActivate={(option) => statusMutation.mutate({ action: "activate", option })}
            onDeactivate={(option) => statusMutation.mutate({ action: "deactivate", option })}
            onEdit={handleEdit}
            options={options}
          />
        ) : null}
      </section>
    </div>
  );
}
