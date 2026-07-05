"use client";

import { useId, useState } from "react";

import { AdminModal } from "../../shared/admin-modal";
import shared from "../../shared/admin-ui.module.css";
import type {
  AdminTopicFormInput,
  AdminTopicGroup,
  AdminTopicItem,
} from "../types/admin-topic.type";

type AdminTopicFormModalProps = {
  groups: AdminTopicGroup[];
  groupId: string;
  item?: AdminTopicItem;
  onClose: () => void;
  onSubmit: (input: AdminTopicFormInput) => void;
};

export function AdminTopicFormModal({
  groupId,
  groups,
  item,
  onClose,
  onSubmit,
}: AdminTopicFormModalProps) {
  const generatedId = useId();
  const [form, setForm] = useState<AdminTopicFormInput>({
    id: item?.id ?? generatedId,
    groupId,
    name: item?.name ?? "",
    code: item?.code ?? "",
    description: item?.description ?? "",
    status: item?.status ?? "Active",
  });

  return (
    <AdminModal
      footer={
        <button
          className={shared.primaryButton}
          onClick={() => onSubmit(form)}
          type="button"
        >
          Save item
        </button>
      }
      onClose={onClose}
      title={item ? "Edit item" : "Add item"}
    >
      <label className={shared.field}>
        <span className={shared.label}>Group</span>
        <select
          className={shared.select}
          onChange={(event) => setForm({ ...form, groupId: event.target.value })}
          value={form.groupId}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
      </label>
      <div className={shared.twoColumn}>
        <label className={shared.field}>
          <span className={shared.label}>Name</span>
          <input
            className={shared.input}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            value={form.name}
          />
        </label>
        <label className={shared.field}>
          <span className={shared.label}>Code / slug</span>
          <input
            className={shared.input}
            onChange={(event) => setForm({ ...form, code: event.target.value })}
            value={form.code}
          />
        </label>
      </div>
      <label className={shared.field}>
        <span className={shared.label}>Description</span>
        <textarea
          className={shared.textarea}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          value={form.description}
        />
      </label>
      <label className={shared.field}>
        <span className={shared.label}>Status</span>
        <select
          className={shared.select}
          onChange={(event) =>
            setForm({
              ...form,
              status: event.target.value as AdminTopicFormInput["status"],
            })
          }
          value={form.status}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </label>
    </AdminModal>
  );
}
