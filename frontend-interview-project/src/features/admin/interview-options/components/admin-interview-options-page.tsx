"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  LoaderCircle,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  adminMasterDataService,
  type AdminMasterDataStatusFilter,
  type CreateInterviewLevelRequest,
  type InterviewLevel,
  type InterviewPosition,
  type InterviewTechnology,
  type InterviewTopic,
} from "@/lib/api/services/admin/master-data";
import { getStoredAuthRole } from "@/lib/auth/auth-session";
import { isAdminRole } from "@/lib/auth/roles";
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

type ToastState = {
  message: string;
  tone: "success" | "error";
};

type CatalogConfig = {
  title: string;
  description: string;
};

const optionTabs: Array<{ kind: AdminOptionKind; label: string }> = [
  { kind: "positions", label: "Positions" },
  { kind: "levels", label: "Levels" },
  { kind: "technologies", label: "Technologies" },
  { kind: "topics", label: "Topics" },
];

const catalogConfigs: Record<AdminOptionKind, CatalogConfig> = {
  positions: {
    title: "Quản lý vị trí phỏng vấn",
    description: ".",
  },
  levels: {
    title: "Quản lý cấp bậc",
    description: "",
  },
  technologies: {
    title: "Quản lý công nghệ",
    description: "",
  },
  topics: {
    title: "Quản lý chủ đề",
    description: "",
  },
};

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

function isValidCatalogCode(code: string) {
  return /^[A-Z0-9_]+$/.test(code);
}

function getColumnCount(kind: AdminOptionKind) {
  if (kind === "levels" || kind === "technologies") return 6;
  return 5;
}

type AdminInterviewOptionsPageProps = {
  catalogKind?: AdminOptionKind;
};

export function AdminInterviewOptionsPage({
  catalogKind,
}: AdminInterviewOptionsPageProps = {}) {
  const [activeKind, setActiveKind] = useState<AdminOptionKind>(
    catalogKind ?? "positions",
  );
  const [items, setItems] = useState<OptionItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminMasterDataStatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [editingItem, setEditingItem] = useState<OptionItem | undefined>();
  const [statusItem, setStatusItem] = useState<OptionItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<OptionItem | undefined>();
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const isSingleCatalogPage = Boolean(catalogKind);
  const activeCatalogConfig = catalogConfigs[activeKind];

  useEffect(() => {
    if (catalogKind) {
      const timer = window.setTimeout(() => {
        setActiveKind(catalogKind);
        setKeyword("");
        setStatusFilter("all");
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [catalogKind]);

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
              ? await adminMasterDataService.getTechnologies()
              : await adminMasterDataService.getTopics();

      setItems(response.data);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Không thể tải dữ liệu tùy chọn phỏng vấn.";
      setError(message);
      setToast({ message, tone: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [activeKind]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadItems]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCanDelete(isAdminRole(getStoredAuthRole()));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const localStatusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" ? item.isActive : !item.isActive);
      const keywordMatch =
        !normalizedKeyword ||
        `${item.name} ${item.code} ${item.description ?? ""}`
          .toLowerCase()
          .includes(normalizedKeyword);

      return localStatusMatch && keywordMatch;
    });
  }, [items, keyword, statusFilter]);

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

    if (!isValidCatalogCode(baseInput.code)) {
      setError("Code phải viết hoa, không dấu và dùng underscore.");
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

      setToast({
        message: editingItem ? "Đã cập nhật tùy chọn." : "Đã tạo tùy chọn mới.",
        tone: "success",
      });
      setIsModalOpen(false);
      setEditingItem(undefined);
      await loadItems();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu tùy chọn.";
      setError(message);
      setToast({ message, tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusItem) return;

    setError("");
    setIsStatusSubmitting(true);

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

      setToast({
        message: statusItem.isActive ? "Đã vô hiệu hóa." : "Đã kích hoạt.",
        tone: "success",
      });
      setStatusItem(undefined);
      await loadItems();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Không thể cập nhật trạng thái.";
      setError(message);
      setToast({ message, tone: "error" });
    } finally {
      setIsStatusSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setError("");
    setIsDeleting(true);

    try {
      if (activeKind === "positions") {
        await adminMasterDataService.deletePosition(deletingItem.id);
      }
      if (activeKind === "levels") {
        await adminMasterDataService.deleteLevel(deletingItem.id);
      }
      if (activeKind === "technologies") {
        await adminMasterDataService.deleteTechnology(deletingItem.id);
      }
      if (activeKind === "topics") {
        await adminMasterDataService.deleteTopic(deletingItem.id);
      }

      setToast({ message: `Đã xóa "${deletingItem.name}".`, tone: "success" });
      setDeletingItem(undefined);
      await loadItems();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Không thể xóa tùy chọn.";
      setError(message);
      setToast({ message, tone: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const columnCount = getColumnCount(activeKind);

  return (
    <div className={styles.page}>
      {toast ? (
        <p
          className={`${styles.toast} ${
            toast.tone === "error" ? styles.toastError : ""
          }`}
        >
          {toast.message}
        </p>
      ) : null}
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>ADMIN</p>
          <h1 className={styles.title}>
            {isSingleCatalogPage
              ? activeCatalogConfig.title
              : "Quản lý dữ liệu phỏng vấn"}
          </h1>
          <p className={styles.subtitle}>
            {isSingleCatalogPage
              ? activeCatalogConfig.description
              : "Quản lý positions, levels, technologies và topics dùng cho phỏng vấn."}
          </p>
        </div>
      </header>

      {!isSingleCatalogPage ? (
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
      ) : null}

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

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Code</th>
              {activeKind === "technologies" ? <th>Slug</th> : null}
              {activeKind === "levels" ? <th>Display Order</th> : null}
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className={styles.tableStateCell} colSpan={columnCount}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className={styles.tableStateCell} colSpan={columnCount}>
                  Không thể tải dữ liệu.
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td className={styles.tableStateCell} colSpan={columnCount}>
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
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
                        aria-label="Sửa"
                        className={`${styles.iconButton} ${styles.iconButtonNeutral}`}
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        title="Sửa"
                        type="button"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label={item.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        className={
                          item.isActive
                            ? `${styles.iconButton} ${styles.iconButtonWarning}`
                            : `${styles.iconButton} ${styles.iconButtonSuccess}`
                        }
                        onClick={() => setStatusItem(item)}
                        title={item.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        type="button"
                      >
                        {isStatusSubmitting && statusItem?.id === item.id ? (
                          <LoaderCircle className={styles.spinIcon} size={16} />
                        ) : item.isActive ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>
                      {canDelete ? (
                        <button
                          aria-label="Xóa"
                          className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                          disabled={isDeleting && deletingItem?.id === item.id}
                          onClick={() => setDeletingItem(item)}
                          title="Xóa"
                          type="button"
                        >
                          {isDeleting && deletingItem?.id === item.id ? (
                            <LoaderCircle
                              className={styles.spinIcon}
                              size={16}
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
          confirmLabel={
            isStatusSubmitting
              ? "Đang xử lý..."
              : statusItem.isActive
                ? "Vô hiệu hóa"
                : "Kích hoạt"
          }
          description={`Xác nhận ${
            statusItem.isActive ? "vô hiệu hóa" : "kích hoạt"
          } "${statusItem.name}"?`}
          isConfirming={isStatusSubmitting}
          onCancel={() => setStatusItem(undefined)}
          onConfirm={handleToggleStatus}
          title="Xác nhận đổi trạng thái"
        />
      ) : null}

      {deletingItem ? (
        <ConfirmDialog
          confirmLabel={isDeleting ? "Đang xóa..." : "Xóa"}
          description={`Bạn có chắc muốn xóa ${deletingItem.name} không?`}
          isConfirming={isDeleting}
          onCancel={() => setDeletingItem(undefined)}
          onConfirm={handleDelete}
          title="Xác nhận xóa"
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
  const validationError = useMemo(() => {
    if (!form.name.trim()) return "Tên là bắt buộc.";
    if (!form.code.trim()) return "Code là bắt buộc.";
    if (!isValidCatalogCode(form.code.trim())) {
      return "Code phải viết hoa, không dấu và dùng underscore.";
    }
    if (isTechnology && !form.slug.trim()) return "Slug là bắt buộc.";
    if (isLevel && (!Number.isFinite(form.displayOrder) || form.displayOrder < 1)) {
      return "Display order phải lớn hơn hoặc bằng 1.";
    }

    return "";
  }, [form, isLevel, isTechnology]);

  return (
    <AdminModal
      footer={
        <button
          className={styles.primaryButton}
          disabled={isSubmitting || Boolean(validationError)}
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
            onChange={(event) =>
              setForm({
                ...form,
                code: event.target.value
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-zA-Z0-9]+/g, "_")
                  .replace(/^_+|_+$/g, "")
                  .toUpperCase(),
              })
            }
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
      {validationError ? (
        <p className={styles.errorText}>{validationError}</p>
      ) : null}
    </AdminModal>
  );
}
