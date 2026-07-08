"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  adminMasterDataService,
  type AdminMasterDataStatusFilter,
  type CreateInterviewLevelRequest,
  type InterviewLevel,
  type InterviewPosition,
  type InterviewTechnology,
  type InterviewTopic,
} from "@/lib/api/services/admin/master-data";
import { AdminModal } from "../../shared/admin-modal";
import { ConfirmDialog } from "../../shared/confirm-dialog";
import styles from "../../shared/admin-ui.module.css";

type AdminOptionKind = "positions" | "levels" | "technologies" | "topics";

type OptionItem =
  | InterviewPosition
  | InterviewLevel
  | InterviewTechnology
  | InterviewTopic;

type OptionForm = {
  name: string;
  code: string;
  slug: string;
  displayOrder: number;
  description: string;
};

const optionTabs: Array<{ kind: AdminOptionKind; label: string }> = [
  { kind: "positions", label: "Positions" },
  { kind: "levels", label: "Levels" },
  { kind: "technologies", label: "Technologies" },
  { kind: "topics", label: "Topics" },
];

function isLevel(item: OptionItem): item is InterviewLevel {
  return "displayOrder" in item;
}

function isTechnology(item: OptionItem): item is InterviewTechnology {
  return "slug" in item;
}

function buildForm(item?: OptionItem): OptionForm {
  return {
    name: item?.name ?? "",
    code: item?.code ?? "",
    slug: item && isTechnology(item) ? item.slug : "",
    displayOrder: item && isLevel(item) ? item.displayOrder : 1,
    description: item?.description ?? "",
  };
}

function compactDescription(description: string) {
  const trimmed = description.trim();
  return trimmed ? trimmed : undefined;
}

export function AdminInterviewOptionsPage() {
  const [activeKind, setActiveKind] = useState<AdminOptionKind>("positions");
  const [items, setItems] = useState<OptionItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminMasterDataStatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editingItem, setEditingItem] = useState<OptionItem | undefined>();
  const [statusItem, setStatusItem] = useState<OptionItem | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response =
        activeKind === "positions"
          ? await adminMasterDataService.getPositions()
          : activeKind === "levels"
            ? await adminMasterDataService.getLevels()
            : activeKind === "technologies"
              ? await adminMasterDataService.getTechnologies(statusFilter)
              : await adminMasterDataService.getTopics(statusFilter);

      setItems(response.data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tải dữ liệu tùy chọn phỏng vấn.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeKind, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadItems]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const localStatusMatch =
        activeKind === "technologies" ||
        activeKind === "topics" ||
        statusFilter === "all" ||
        (statusFilter === "active" ? item.isActive : !item.isActive);
      const keywordMatch =
        !normalizedKeyword ||
        `${item.name} ${item.code} ${item.description ?? ""}`
          .toLowerCase()
          .includes(normalizedKeyword);

      return localStatusMatch && keywordMatch;
    });
  }, [activeKind, items, keyword, statusFilter]);

  const handleSubmit = async (form: OptionForm) => {
    const baseInput = {
      name: form.name.trim(),
      code: form.code.trim(),
      description: compactDescription(form.description),
    };

    if (!baseInput.name || !baseInput.code) {
      setError("Tên và code là bắt buộc.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (activeKind === "positions") {
        if (editingItem) {
          await adminMasterDataService.updatePosition(editingItem.id, baseInput);
        } else {
          await adminMasterDataService.createPosition(baseInput);
        }
      }

      if (activeKind === "levels") {
        const levelInput: CreateInterviewLevelRequest = {
          ...baseInput,
          displayOrder: Number(form.displayOrder) || 1,
        };
        if (editingItem) {
          await adminMasterDataService.updateLevel(editingItem.id, levelInput);
        } else {
          await adminMasterDataService.createLevel(levelInput);
        }
      }

      if (activeKind === "technologies") {
        const technologyInput = {
          ...baseInput,
          slug: form.slug.trim(),
        };
        if (!technologyInput.slug) {
          setError("Slug là bắt buộc với Technology.");
          setIsSubmitting(false);
          return;
        }
        if (editingItem) {
          await adminMasterDataService.updateTechnology(
            editingItem.id,
            technologyInput,
          );
        } else {
          await adminMasterDataService.createTechnology(technologyInput);
        }
      }

      if (activeKind === "topics") {
        if (editingItem) {
          await adminMasterDataService.updateTopic(editingItem.id, baseInput);
        } else {
          await adminMasterDataService.createTopic(baseInput);
        }
      }

      setToast(editingItem ? "Đã cập nhật tùy chọn." : "Đã tạo tùy chọn mới.");
      setIsModalOpen(false);
      setEditingItem(undefined);
      await loadItems();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu tùy chọn.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusItem) return;

    setError("");

    try {
      if (activeKind === "positions") {
        await (statusItem.isActive
          ? adminMasterDataService.deactivatePosition(statusItem.id)
          : adminMasterDataService.activatePosition(statusItem.id));
      }
      if (activeKind === "levels") {
        await (statusItem.isActive
          ? adminMasterDataService.deactivateLevel(statusItem.id)
          : adminMasterDataService.activateLevel(statusItem.id));
      }
      if (activeKind === "technologies") {
        await (statusItem.isActive
          ? adminMasterDataService.deactivateTechnology(statusItem.id)
          : adminMasterDataService.activateTechnology(statusItem.id));
      }
      if (activeKind === "topics") {
        await (statusItem.isActive
          ? adminMasterDataService.deactivateTopic(statusItem.id)
          : adminMasterDataService.activateTopic(statusItem.id));
      }

      setToast(statusItem.isActive ? "Đã deactivate." : "Đã activate.");
      setStatusItem(undefined);
      await loadItems();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể cập nhật trạng thái.",
      );
    }
  };

  return (
    <div className={styles.page}>
      {toast ? <p className={styles.toast}>{toast}</p> : null}
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>Tùy chọn phỏng vấn</h1>
          <p className={styles.subtitle}>
            Quản lý positions, levels, technologies và topics bằng API admin.
          </p>
        </div>
      </header>

      <div className={styles.tabs}>
        {optionTabs.map((tab) => (
          <button
            className={`${styles.tabButton} ${
              activeKind === tab.kind ? styles.tabButtonActive : ""
            }`}
            key={tab.kind}
            onClick={() => {
              setActiveKind(tab.kind);
              setKeyword("");
              setStatusFilter("all");
            }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <label className={styles.field}>
            <span className={styles.label}>Tìm kiếm</span>
            <input
              className={styles.input}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tên, code, mô tả"
              value={keyword}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Trạng thái</span>
            <select
              className={styles.select}
              onChange={(event) =>
                setStatusFilter(event.target.value as AdminMasterDataStatusFilter)
              }
              value={statusFilter}
            >
              <option value="all">Tất cả</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <button
            className={styles.primaryButton}
            onClick={() => {
              setEditingItem(undefined);
              setIsModalOpen(true);
            }}
            type="button"
          >
            Tạo mới
          </button>
        </div>
      </section>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      {isLoading ? (
        <section className={styles.panel}>
          <h2 className={styles.cardTitle}>Đang tải dữ liệu...</h2>
          <p className={styles.muted}>Vui lòng chờ trong giây lát.</p>
        </section>
      ) : filteredItems.length === 0 ? (
        <section className={styles.panel}>
          <h2 className={styles.cardTitle}>Chưa có dữ liệu phù hợp</h2>
          <p className={styles.muted}>Thử đổi từ khóa hoặc bộ lọc trạng thái.</p>
        </section>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Code</th>
                {activeKind === "technologies" ? <th>Slug</th> : null}
                {activeKind === "levels" ? <th>Order</th> : null}
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.code}</td>
                  {activeKind === "technologies" ? (
                    <td>{isTechnology(item) ? item.slug : ""}</td>
                  ) : null}
                  {activeKind === "levels" ? (
                    <td>{isLevel(item) ? item.displayOrder : ""}</td>
                  ) : null}
                  <td>{item.description ?? "Không có mô tả"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        item.isActive ? "" : styles.badgeInactive
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.buttonRow}>
                      <button
                        className={styles.secondaryButton}
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        type="button"
                      >
                        Sửa
                      </button>
                      <button
                        className={
                          item.isActive ? styles.dangerButton : styles.primaryButton
                        }
                        onClick={() => setStatusItem(item)}
                        type="button"
                      >
                        {item.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen ? (
        <OptionFormModal
          initialForm={buildForm(editingItem)}
          isLevel={activeKind === "levels"}
          isSubmitting={isSubmitting}
          isTechnology={activeKind === "technologies"}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingItem ? "Sửa tùy chọn" : "Tạo tùy chọn"}
        />
      ) : null}

      {statusItem ? (
        <ConfirmDialog
          confirmLabel={statusItem.isActive ? "Deactivate" : "Activate"}
          description={`Xác nhận ${
            statusItem.isActive ? "deactivate" : "activate"
          } "${statusItem.name}"?`}
          onCancel={() => setStatusItem(undefined)}
          onConfirm={handleToggleStatus}
          title="Xác nhận đổi trạng thái"
        />
      ) : null}
    </div>
  );
}

function OptionFormModal({
  initialForm,
  isLevel,
  isSubmitting,
  isTechnology,
  onClose,
  onSubmit,
  title,
}: {
  initialForm: OptionForm;
  isLevel: boolean;
  isSubmitting: boolean;
  isTechnology: boolean;
  onClose: () => void;
  onSubmit: (form: OptionForm) => void;
  title: string;
}) {
  const [form, setForm] = useState<OptionForm>(initialForm);

  return (
    <AdminModal
      footer={
        <button
          className={styles.primaryButton}
          disabled={isSubmitting}
          onClick={() => onSubmit(form)}
          type="button"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      }
      onClose={onClose}
      title={title}
    >
      <div className={styles.twoColumn}>
        <label className={styles.field}>
          <span className={styles.label}>Tên</span>
          <input
            className={styles.input}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            value={form.name}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Code</span>
          <input
            className={styles.input}
            onChange={(event) => setForm({ ...form, code: event.target.value })}
            value={form.code}
          />
        </label>
        {isTechnology ? (
          <label className={styles.field}>
            <span className={styles.label}>Slug</span>
            <input
              className={styles.input}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              value={form.slug}
            />
          </label>
        ) : null}
        {isLevel ? (
          <label className={styles.field}>
            <span className={styles.label}>Display order</span>
            <input
              className={styles.input}
              min={1}
              onChange={(event) =>
                setForm({ ...form, displayOrder: Number(event.target.value) })
              }
              type="number"
              value={form.displayOrder}
            />
          </label>
        ) : null}
      </div>
      <label className={styles.field}>
        <span className={styles.label}>Mô tả</span>
        <textarea
          className={styles.textarea}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          value={form.description}
        />
      </label>
    </AdminModal>
  );
}
