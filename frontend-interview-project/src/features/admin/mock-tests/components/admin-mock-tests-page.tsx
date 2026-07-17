"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Link,
  LoaderCircle,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";

import { adminMockTestsService } from "@/lib/api/services/admin/mock-tests";
import type {
  CreateMockTestRequest,
  MockTest,
} from "@/lib/api/services/admin/mock-tests";
import { adminQuestionBanksService } from "@/lib/api/services/admin/question-banks";
import type { AdminQuestionBankDto } from "@/lib/api/services/admin/question-banks";
import { AdminModal } from "../../shared/admin-modal";
import { ConfirmDialog } from "../../shared/confirm-dialog";
import styles from "../../shared/admin-ui.module.css";

type PendingAction =
  | { type: "delete"; item: MockTest }
  | { type: "publish"; item: MockTest }
  | { type: "archive"; item: MockTest };

type MockTestForm = CreateMockTestRequest;

const emptyForm: MockTestForm = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  durationMinutes: 30,
};

function buildForm(item?: MockTest): MockTestForm {
  return {
    title: item?.title ?? "",
    slug: item?.slug ?? "",
    description: item?.description ?? "",
    coverImageUrl: item?.coverImageUrl ?? "",
    durationMinutes: item?.durationMinutes ?? 30,
  };
}

function compactMockTestForm(form: MockTestForm): MockTestForm {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description?.trim() || undefined,
    coverImageUrl: form.coverImageUrl?.trim() || undefined,
    durationMinutes: Number(form.durationMinutes) || undefined,
  };
}

export function AdminMockTestsPage() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [questions, setQuestions] = useState<AdminQuestionBankDto[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editingItem, setEditingItem] = useState<MockTest | undefined>();
  const [attachingItem, setAttachingItem] = useState<MockTest | undefined>();
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [mockTestResponse, questionResponse] = await Promise.all([
        adminMockTestsService.getMockTests({ limit: 100 }),
        adminQuestionBanksService.getQuestionBanks(),
      ]);
      setMockTests(mockTestResponse.data);
      setQuestions(questionResponse.data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tải danh sách mock tests.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredMockTests = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return mockTests;

    return mockTests.filter((mockTest) =>
      `${mockTest.title} ${mockTest.slug} ${mockTest.description ?? ""}`
        .toLowerCase()
        .includes(normalizedKeyword),
    );
  }, [keyword, mockTests]);

  const handleSubmit = async (form: MockTestForm) => {
    const input = compactMockTestForm(form);
    if (!input.title || !input.slug) {
      setError("Title và slug là bắt buộc.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      if (editingItem) {
        await adminMockTestsService.updateMockTest(editingItem.id, input);
      } else {
        await adminMockTestsService.createMockTest(input);
      }
      setToast(editingItem ? "Đã cập nhật mock test." : "Đã tạo mock test.");
      setIsFormOpen(false);
      setEditingItem(undefined);
      await loadData();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu mock test.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePendingAction = async () => {
    if (!pendingAction) return;

    setError("");
    setIsActionSubmitting(true);
    try {
      if (pendingAction.type === "delete") {
        await adminMockTestsService.deleteMockTest(pendingAction.item.id);
        setToast("Đã xóa mock test.");
      }
      if (pendingAction.type === "publish") {
        await adminMockTestsService.publishMockTest(pendingAction.item.id);
        setToast("Đã publish mock test.");
      }
      if (pendingAction.type === "archive") {
        await adminMockTestsService.archiveMockTest(pendingAction.item.id);
        setToast("Đã archive mock test.");
      }
      setPendingAction(undefined);
      await loadData();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể cập nhật mock test.",
      );
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleAttach = async () => {
    if (!attachingItem || selectedQuestionIds.length === 0) return;

    setIsSubmitting(true);
    setError("");
    try {
      await adminMockTestsService.attachQuestions(attachingItem.id, {
        questionBankIds: selectedQuestionIds,
      });
      setToast("Đã gắn câu hỏi vào mock test.");
      setAttachingItem(undefined);
      setSelectedQuestionIds([]);
      await loadData();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể gắn câu hỏi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {toast ? <p className={styles.toast}>{toast}</p> : null}
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>Quản lý đề thi</h1>
        </div>
      </header>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <label className={styles.field}>
            <span className={styles.label}>Tìm kiếm</span>
            <input
              className={styles.input}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Title, slug, mô tả"
              value={keyword}
            />
          </label>
          <button
            className={styles.primaryButton}
            onClick={() => {
              setEditingItem(undefined);
              setIsFormOpen(true);
            }}
            type="button"
          >
            Tạo mock test
          </button>
        </div>
      </section>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      {isLoading ? (
        <section className={styles.panel}>
          <h2 className={styles.cardTitle}>Đang tải mock tests...</h2>
          <p className={styles.muted}>Vui lòng chờ trong giây lát.</p>
        </section>
      ) : filteredMockTests.length === 0 ? (
        <section className={styles.panel}>
          <h2 className={styles.cardTitle}>Chưa có đề kiểm tra</h2>
        </section>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Thời lượng</th>
                <th>Câu hỏi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredMockTests.map((mockTest) => (
                <tr key={mockTest.id}>
                  <td>
                    <strong>{mockTest.title}</strong>
                    <p className={styles.muted}>{mockTest.description ?? ""}</p>
                  </td>
                  <td>{mockTest.slug}</td>
                  <td>{mockTest.durationMinutes ?? "-"} phút</td>
                  <td>{mockTest.totalQuestions}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        mockTest.status === "ARCHIVED" ? styles.badgeInactive : ""
                      }`}
                    >
                      {mockTest.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.buttonRow}>
                      <button
                        aria-label="Sửa"
                        className={`${styles.iconButton} ${styles.iconButtonNeutral}`}
                        onClick={() => {
                          setEditingItem(mockTest);
                          setIsFormOpen(true);
                        }}
                        title="Sửa"
                        type="button"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label="Gắn câu hỏi"
                        className={`${styles.iconButton} ${styles.iconButtonNeutral}`}
                        onClick={() => {
                          setAttachingItem(mockTest);
                          setSelectedQuestionIds([]);
                        }}
                        title="Gắn câu hỏi"
                        type="button"
                      >
                        <Link size={16} />
                      </button>
                      {mockTest.status !== "PUBLISHED" ? (
                        <button
                          aria-label="Publish"
                          className={`${styles.iconButton} ${styles.iconButtonSuccess}`}
                          disabled={
                            isActionSubmitting &&
                            pendingAction?.type === "publish" &&
                            pendingAction.item.id === mockTest.id
                          }
                          onClick={() =>
                            setPendingAction({ type: "publish", item: mockTest })
                          }
                          title="Publish"
                          type="button"
                        >
                          {isActionSubmitting &&
                          pendingAction?.type === "publish" &&
                          pendingAction.item.id === mockTest.id ? (
                            <LoaderCircle
                              className={styles.spinIcon}
                              size={16}
                            />
                          ) : (
                            <Send size={16} />
                          )}
                        </button>
                      ) : null}
                      {mockTest.status !== "ARCHIVED" ? (
                        <button
                          aria-label="Archive"
                          className={`${styles.iconButton} ${styles.iconButtonWarning}`}
                          disabled={
                            isActionSubmitting &&
                            pendingAction?.type === "archive" &&
                            pendingAction.item.id === mockTest.id
                          }
                          onClick={() =>
                            setPendingAction({ type: "archive", item: mockTest })
                          }
                          title="Archive"
                          type="button"
                        >
                          {isActionSubmitting &&
                          pendingAction?.type === "archive" &&
                          pendingAction.item.id === mockTest.id ? (
                            <LoaderCircle
                              className={styles.spinIcon}
                              size={16}
                            />
                          ) : (
                            <Archive size={16} />
                          )}
                        </button>
                      ) : null}
                      <button
                        aria-label="Xóa"
                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                        disabled={
                          isActionSubmitting &&
                          pendingAction?.type === "delete" &&
                          pendingAction.item.id === mockTest.id
                        }
                        onClick={() =>
                          setPendingAction({ type: "delete", item: mockTest })
                        }
                        title="Xóa"
                        type="button"
                      >
                        {isActionSubmitting &&
                        pendingAction?.type === "delete" &&
                        pendingAction.item.id === mockTest.id ? (
                          <LoaderCircle className={styles.spinIcon} size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen ? (
        <MockTestFormModal
          initialForm={editingItem ? buildForm(editingItem) : emptyForm}
          isSubmitting={isSubmitting}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          title={editingItem ? "Sửa mock test" : "Tạo mock test"}
        />
      ) : null}

      {attachingItem ? (
        <AdminModal
          footer={
            <button
              className={styles.primaryButton}
              disabled={isSubmitting || selectedQuestionIds.length === 0}
              onClick={handleAttach}
              type="button"
            >
              {isSubmitting ? "Đang gắn..." : "Lưu câu hỏi"}
            </button>
          }
          onClose={() => setAttachingItem(undefined)}
          title={`Gắn câu hỏi: ${attachingItem.title}`}
        >
          {questions.length === 0 ? (
            <p className={styles.muted}>Chưa có câu hỏi trong ngân hàng.</p>
          ) : (
            <div className={styles.grid}>
              {questions.map((question) => (
                <label className={styles.radioLabel} key={question.id}>
                  <input
                    checked={selectedQuestionIds.includes(question.id)}
                    onChange={(event) =>
                      setSelectedQuestionIds((current) =>
                        event.target.checked
                          ? [...current, question.id]
                          : current.filter((id) => id !== question.id),
                      )
                    }
                    type="checkbox"
                  />
                  {question.title}
                </label>
              ))}
            </div>
          )}
        </AdminModal>
      ) : null}

      {pendingAction ? (
        <ConfirmDialog
          confirmLabel={
            isActionSubmitting
              ? "Đang xử lý..."
              : pendingAction.type === "delete"
                ? "Delete"
                : pendingAction.type === "publish"
                  ? "Publish"
                  : "Archive"
          }
          description={`Xác nhận ${pendingAction.type} "${pendingAction.item.title}"?`}
          isConfirming={isActionSubmitting}
          onCancel={() => setPendingAction(undefined)}
          onConfirm={handlePendingAction}
          title="Xác nhận thao tác"
        />
      ) : null}
    </div>
  );
}

function MockTestFormModal({
  initialForm,
  isSubmitting,
  onClose,
  onSubmit,
  title,
}: {
  initialForm: MockTestForm;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (form: MockTestForm) => void;
  title: string;
}) {
  const [form, setForm] = useState<MockTestForm>(initialForm);

  return (
    <AdminModal
      footer={
        <button
          className={styles.primaryButton}
          disabled={isSubmitting}
          onClick={() => onSubmit(form)}
          type="button"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu mock test"}
        </button>
      }
      onClose={onClose}
      title={title}
    >
      <div className={styles.twoColumn}>
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            className={styles.input}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            value={form.title}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Slug</span>
          <input
            className={styles.input}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
            value={form.slug}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Cover image URL</span>
          <input
            className={styles.input}
            onChange={(event) =>
              setForm({ ...form, coverImageUrl: event.target.value })
            }
            value={form.coverImageUrl ?? ""}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Duration minutes</span>
          <input
            className={styles.input}
            min={1}
            onChange={(event) =>
              setForm({
                ...form,
                durationMinutes: Number(event.target.value),
              })
            }
            type="number"
            value={form.durationMinutes ?? ""}
          />
        </label>
      </div>
      <label className={styles.field}>
        <span className={styles.label}>Description</span>
        <textarea
          className={styles.textarea}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          value={form.description ?? ""}
        />
      </label>
    </AdminModal>
  );
}
