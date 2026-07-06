"use client";

import { useEffect, useMemo, useState } from "react";

import { adminQuestionBanksService } from "@/lib/api/services/admin/question-banks";
import type {
  InterviewTechnologyDto,
  InterviewTopicDto,
} from "@/lib/api/services/interview/interview-options";
import { interviewOptionsService } from "@/lib/api/services/interview/interview-options";
import { ConfirmDialog } from "../../shared/confirm-dialog";
import styles from "../../shared/admin-ui.module.css";
import type {
  AdminQuestion,
  AdminQuestionFilters,
  AdminQuestionFormInput,
} from "../types/admin-question-bank.type";
import { AdminQuestionFilterBar } from "./admin-question-filter-bar";
import { AdminQuestionFormModal } from "./admin-question-form-modal";
import { AdminQuestionGroupList } from "./admin-question-group-list";

export function AdminQuestionBanksPage() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [technologies, setTechnologies] = useState<InterviewTechnologyDto[]>([]);
  const [topics, setTopics] = useState<InterviewTopicDto[]>([]);
  const [filters, setFilters] = useState<AdminQuestionFilters>({
    technology: "All",
    difficulty: "All",
    questionType: "All",
    topic: "All",
    keyword: "",
  });
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | undefined>();
  const [deletingQuestion, setDeletingQuestion] = useState<AdminQuestion | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      adminQuestionBanksService.getQuestionBanks(),
      interviewOptionsService.getInterviewTechnologies(),
      interviewOptionsService.getInterviewTopics(),
    ])
      .then(([questionResponse, technologyResponse, topicResponse]) => {
        if (!isMounted) return;
        setQuestions(questionResponse.data);
        setTechnologies(technologyResponse.data);
        setTopics(topicResponse.data);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Không thể tải ngân hàng câu hỏi.",
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredQuestions = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return questions.filter((question) => {
      const keywordMatch =
        !keyword ||
        `${question.title} ${question.content} ${question.expectedAnswer ?? ""}`
          .toLowerCase()
          .includes(keyword);
      const technologyMatch =
        filters.technology === "All" ||
        question.technology?.name === filters.technology;
      const difficultyMatch =
        filters.difficulty === "All" || question.difficulty === filters.difficulty;
      const typeMatch =
        filters.questionType === "All" ||
        question.questionType === filters.questionType;
      const topicMatch =
        filters.topic === "All" || question.topic?.name === filters.topic;

      return (
        keywordMatch &&
        technologyMatch &&
        difficultyMatch &&
        typeMatch &&
        topicMatch
      );
    });
  }, [filters, questions]);

  const handleCreate = () => {
    setEditingQuestion(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = async (input: AdminQuestionFormInput) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = editingQuestion
        ? await adminQuestionBanksService.updateQuestionBank(
            editingQuestion.id,
            input,
          )
        : await adminQuestionBanksService.createQuestionBank(input);

      setQuestions((current) =>
        editingQuestion
          ? current.map((question) =>
              question.id === editingQuestion.id ? response.data : question,
            )
          : [response.data, ...current],
      );
      setIsModalOpen(false);
      setEditingQuestion(undefined);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu câu hỏi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingQuestion) {
      return;
    }

    setError("");
    try {
      await adminQuestionBanksService.deleteQuestionBank(deletingQuestion.id);
      setQuestions((current) =>
        current.filter((question) => question.id !== deletingQuestion.id),
      );
      setDeletingQuestion(undefined);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể xóa câu hỏi.",
      );
    }
  };

  const handleToggleStatus = () => {
    setError("Backend hiện chưa có endpoint bật/tắt câu hỏi.");
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>Ngân hàng câu hỏi</h1>
          <p className={styles.subtitle}>
            Quản lý câu hỏi, đáp án trắc nghiệm và đáp án đúng từ dữ liệu thật
            trong backend.
          </p>
        </div>
      </header>

      <AdminQuestionFilterBar
        filters={filters}
        onChange={setFilters}
        onCreate={handleCreate}
        technologies={technologies.map((technology) => technology.name)}
        topics={topics.map((topic) => topic.name)}
      />

      {error ? <p className={styles.errorText}>{error}</p> : null}
      {isLoading ? (
        <section className={styles.panel}>
          <h2 className={styles.cardTitle}>Đang tải câu hỏi...</h2>
          <p className={styles.muted}>Vui lòng chờ trong giây lát.</p>
        </section>
      ) : (
        <AdminQuestionGroupList
          onDelete={setDeletingQuestion}
          onEdit={(question) => {
            setEditingQuestion(question);
            setIsModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          questions={filteredQuestions}
        />
      )}

      {isModalOpen ? (
        <AdminQuestionFormModal
          isSubmitting={isSubmitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          question={editingQuestion}
          technologies={technologies}
          topics={topics}
        />
      ) : null}
      {deletingQuestion ? (
        <ConfirmDialog
          description={`Xóa câu hỏi "${deletingQuestion.title}"? Các đáp án của câu hỏi sẽ bị xóa cascade.`}
          onCancel={() => setDeletingQuestion(undefined)}
          onConfirm={handleDelete}
          title="Xác nhận xóa câu hỏi"
        />
      ) : null}
    </div>
  );
}
