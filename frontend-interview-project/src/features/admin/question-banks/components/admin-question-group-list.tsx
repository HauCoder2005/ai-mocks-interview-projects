"use client";

import { useState } from "react";

import { AdminQuestionCard } from "./admin-question-card";
import type { AdminQuestion } from "../types/admin-question-bank.type";
import shared from "../../shared/admin-ui.module.css";
import styles from "../../topics/components/admin-topic-groups.module.css";

type AdminQuestionGroupListProps = {
  questions: AdminQuestion[];
  onEdit: (question: AdminQuestion) => void;
  onDelete: (question: AdminQuestion) => void;
  onToggleStatus: (question: AdminQuestion) => void;
};

export function AdminQuestionGroupList({
  onDelete,
  onEdit,
  onToggleStatus,
  questions,
}: AdminQuestionGroupListProps) {
  const topics = Array.from(
    new Set(questions.map((question) => question.topic?.name ?? "Chưa phân loại")),
  );
  const [openTopics, setOpenTopics] = useState<string[]>([topics[0] ?? ""]);

  if (!questions.length) {
    return (
      <section className={shared.panel}>
        <h2 className={shared.cardTitle}>No questions found</h2>
        <p className={shared.muted}>Điều chỉnh bộ lọc hoặc tạo câu hỏi mới.</p>
      </section>
    );
  }

  return (
    <section className={styles.groups}>
      {topics.map((topic) => {
        const groupQuestions = questions.filter(
          (question) => (question.topic?.name ?? "Chưa phân loại") === topic,
        );
        const isOpen = openTopics.includes(topic);

        return (
          <article className={styles.group} key={topic}>
            <div
              className={styles.groupHeader}
            >
              <span>
                <h2 className={styles.groupTitle}>{topic}</h2>
                <p className={shared.muted}>Nhóm câu hỏi theo chủ đề.</p>
                <span className={shared.badge}>{groupQuestions.length} câu hỏi</span>
              </span>
              <button
                className={shared.secondaryButton}
                onClick={() =>
                  setOpenTopics((current) =>
                    current.includes(topic)
                      ? current.filter((item) => item !== topic)
                      : [...current, topic],
                  )
                }
                type="button"
              >
                {isOpen ? "Đóng" : "Mở"}
              </button>
            </div>
            {isOpen ? (
              <div className={styles.items}>
                {groupQuestions.map((question) => (
                  <AdminQuestionCard
                    key={question.id}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    question={question}
                  />
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
