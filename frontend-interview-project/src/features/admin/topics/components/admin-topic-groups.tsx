"use client";

import { useState } from "react";

import { ConfirmDialog } from "../../shared/confirm-dialog";
import shared from "../../shared/admin-ui.module.css";
import { adminTopicGroupsMock } from "../data/admin-topic-groups.mock";
import type {
  AdminTopicFormInput,
  AdminTopicGroup,
  AdminTopicItem,
} from "../types/admin-topic.type";
import { AdminTopicFormModal } from "./admin-topic-form-modal";
import styles from "./admin-topic-groups.module.css";

type EditingTopic = {
  groupId: string;
  item?: AdminTopicItem;
};

type DeletingTopic = {
  groupId: string;
  item: AdminTopicItem;
};

type AdminTopicGroupsProps = {
  initialGroups?: AdminTopicGroup[];
};

export function AdminTopicGroups({
  initialGroups = adminTopicGroupsMock,
}: AdminTopicGroupsProps) {
  const [groups, setGroups] = useState<AdminTopicGroup[]>(initialGroups);
  const [openGroupIds, setOpenGroupIds] = useState<string[]>([groups[0]?.id ?? ""]);
  const [editingTopic, setEditingTopic] = useState<EditingTopic | undefined>();
  const [deletingTopic, setDeletingTopic] = useState<DeletingTopic | undefined>();

  const toggleGroup = (groupId: string) => {
    setOpenGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId],
    );
  };

  const handleCreate = (groupId: string) => {
    setEditingTopic({ groupId });
  };

  const handleUpdate = (input: AdminTopicFormInput) => {
    setGroups((current) =>
      current.map((group) => {
        const itemsWithoutCurrent = group.items.filter((item) => item.id !== input.id);
        if (group.id !== input.groupId) {
          return { ...group, items: itemsWithoutCurrent };
        }

        return {
          ...group,
          items: [
            ...itemsWithoutCurrent,
            {
              id: input.id,
              name: input.name,
              code: input.code,
              description: input.description,
              status: input.status,
            },
          ],
        };
      }),
    );
    setEditingTopic(undefined);
  };

  const handleDelete = () => {
    if (!deletingTopic) {
      return;
    }

    setGroups((current) =>
      current.map((group) =>
        group.id === deletingTopic.groupId
          ? {
              ...group,
              items: group.items.filter((item) => item.id !== deletingTopic.item.id),
            }
          : group,
      ),
    );
    setDeletingTopic(undefined);
  };

  const handleToggleStatus = (groupId: string, target: AdminTopicItem) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === target.id
                  ? {
                      ...item,
                      status: item.status === "Active" ? "Inactive" : "Active",
                    }
                  : item,
              ),
            }
          : group,
      ),
    );
  };

  return (
    <section className={styles.groups}>
      {groups.map((group) => {
        const isOpen = openGroupIds.includes(group.id);

        return (
          <article className={styles.group} key={group.id}>
            <div
              className={styles.groupHeader}
            >
              <span>
                <h2 className={styles.groupTitle}>{group.title}</h2>
                <p className={shared.muted}>{group.description}</p>
                <span className={styles.groupMeta}>
                  <span className={shared.badge}>{group.items.length} items</span>
                  <span className={`${shared.badge} ${shared.success}`}>
                    {group.status}
                  </span>
                </span>
              </span>
              <span className={shared.buttonRow}>
                <button
                  className={shared.secondaryButton}
                  onClick={() => toggleGroup(group.id)}
                  type="button"
                >
                  {isOpen ? "Close" : "Open"}
                </button>
                <button
                  className={shared.primaryButton}
                  onClick={() => handleCreate(group.id)}
                  type="button"
                >
                  Add item
                </button>
              </span>
            </div>
            {isOpen ? (
              <div className={styles.items}>
                {group.items.map((item) => (
                  <div className={styles.item} key={item.id}>
                    <div>
                      <p className={styles.itemTitle}>{item.name}</p>
                      <p className={styles.itemText}>
                        {item.code} - {item.description}
                      </p>
                      <span
                        className={`${shared.badge} ${
                          item.status === "Active" ? shared.success : shared.warning
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className={shared.buttonRow}>
                      <button
                        className={shared.secondaryButton}
                        onClick={() => setEditingTopic({ groupId: group.id, item })}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className={shared.secondaryButton}
                        onClick={() => handleToggleStatus(group.id, item)}
                        type="button"
                      >
                        {item.status === "Active" ? "Disable" : "Enable"}
                      </button>
                      <button
                        className={shared.dangerButton}
                        onClick={() => setDeletingTopic({ groupId: group.id, item })}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}

      {editingTopic ? (
        <AdminTopicFormModal
          groupId={editingTopic.groupId}
          groups={groups}
          item={editingTopic.item}
          onClose={() => setEditingTopic(undefined)}
          onSubmit={handleUpdate}
        />
      ) : null}
      {deletingTopic ? (
        <ConfirmDialog
          description={`Delete ${deletingTopic.item.name}? This only updates local mock state.`}
          onCancel={() => setDeletingTopic(undefined)}
          onConfirm={handleDelete}
          title="Confirm item delete"
        />
      ) : null}
    </section>
  );
}
