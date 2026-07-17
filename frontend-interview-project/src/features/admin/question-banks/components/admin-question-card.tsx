import { Pencil, Power, Trash2 } from "lucide-react";

import type { AdminQuestion } from "../types/admin-question-bank.type";
import shared from "../../shared/admin-ui.module.css";
import styles from "../../topics/components/admin-topic-groups.module.css";

type AdminQuestionCardProps = {
  question: AdminQuestion;
  onEdit: (question: AdminQuestion) => void;
  onDelete: (question: AdminQuestion) => void;
  onToggleStatus: (question: AdminQuestion) => void;
};

export function AdminQuestionCard({
  onDelete,
  onEdit,
  onToggleStatus,
  question,
}: AdminQuestionCardProps) {
  return (
    <article className={styles.item}>
      <div>
        <p className={styles.itemTitle}>{question.title}</p>
        <p className={styles.itemText}>{question.content}</p>
        <div className={styles.groupMeta}>
          <span className={shared.badge}>{question.technology?.name ?? "N/A"}</span>
          <span className={shared.badge}>{question.topic?.name ?? "N/A"}</span>
          <span className={shared.badge}>{question.difficulty}</span>
          <span className={shared.badge}>{question.questionType}</span>
          <span className={shared.badge}>{question.options.length} đáp án</span>
          <span className={shared.badge}>
            Đúng:{" "}
            {question.options.find((option) => option.isCorrect)?.content ??
              "Chưa có"}
          </span>
          <span className={shared.badge}>
            Updated {new Date(question.updatedAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>
      <div className={shared.buttonRow}>
        <button
          aria-label="Sửa câu hỏi"
          className={`${shared.iconButton} ${shared.iconButtonNeutral}`}
          onClick={() => onEdit(question)}
          title="Sửa câu hỏi"
          type="button"
        >
          <Pencil size={16} />
        </button>
        <button
          aria-label="Bật/Tắt câu hỏi"
          className={`${shared.iconButton} ${shared.iconButtonWarning}`}
          onClick={() => onToggleStatus(question)}
          title="Bật/Tắt câu hỏi"
          type="button"
        >
          <Power size={16} />
        </button>
        <button
          aria-label="Xóa câu hỏi"
          className={`${shared.iconButton} ${shared.iconButtonDanger}`}
          onClick={() => onDelete(question)}
          title="Xóa câu hỏi"
          type="button"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
