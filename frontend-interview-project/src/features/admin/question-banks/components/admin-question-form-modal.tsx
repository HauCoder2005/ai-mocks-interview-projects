"use client";

import { useMemo, useState } from "react";

import type {
  InterviewTechnologyDto,
  InterviewTopicDto,
} from "@/lib/api/services/interview/interview-options";
import { AdminModal } from "../../shared/admin-modal";
import shared from "../../shared/admin-ui.module.css";
import type {
  AdminQuestion,
  AdminQuestionFormInput,
} from "../types/admin-question-bank.type";

type AdminQuestionFormModalProps = {
  question?: AdminQuestion;
  technologies: InterviewTechnologyDto[];
  topics: InterviewTopicDto[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (input: AdminQuestionFormInput) => void;
};

const defaultOptions = ["", "", "", ""].map((content, index) => ({
  content,
  isCorrect: index === 0,
  displayOrder: index + 1,
}));

function buildInitialForm(
  question: AdminQuestion | undefined,
  technologies: InterviewTechnologyDto[],
  topics: InterviewTopicDto[],
): AdminQuestionFormInput {
  return {
    title: question?.title ?? "",
    content: question?.content ?? "",
    technologyId: question?.technology?.id ?? technologies[0]?.id ?? 1,
    topicId: question?.topic?.id ?? topics[0]?.id ?? 1,
    questionType: question?.questionType ?? "MCQ",
    difficulty: question?.difficulty ?? "EASY",
    expectedAnswer: question?.expectedAnswer ?? "",
    options:
      question?.questionType === "MCQ" && question.options.length >= 2
        ? question.options.map((option, index) => ({
            content: option.content,
            isCorrect: option.isCorrect,
            displayOrder: index + 1,
          }))
        : defaultOptions,
  };
}

export function AdminQuestionFormModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  question,
  technologies,
  topics,
}: AdminQuestionFormModalProps) {
  const [form, setForm] = useState<AdminQuestionFormInput>(() =>
    buildInitialForm(question, technologies, topics),
  );
  const [error, setError] = useState("");

  const isMcq = form.questionType === "MCQ";

  const validationError = useMemo(() => {
    if (!form.title.trim()) return "Vui lòng nhập tiêu đề câu hỏi.";
    if (!form.content.trim()) return "Vui lòng nhập nội dung câu hỏi.";
    if (!form.technologyId) return "Vui lòng chọn công nghệ.";
    if (!form.topicId) return "Vui lòng chọn chủ đề.";

    if (!isMcq) return "";

    const options = form.options ?? [];
    if (options.length < 2) return "MCQ cần tối thiểu 2 đáp án.";
    if (options.some((option) => !option.content.trim())) {
      return "Nội dung đáp án không được để trống.";
    }
    if (options.filter((option) => option.isCorrect).length !== 1) {
      return "Vui lòng chọn đúng 1 đáp án đúng.";
    }

    return "";
  }, [form, isMcq]);

  const updateOption = (
    index: number,
    value: Partial<NonNullable<AdminQuestionFormInput["options"]>[number]>,
  ) => {
    const options = [...(form.options ?? defaultOptions)];
    options[index] = { ...options[index], ...value };
    setForm({ ...form, options });
  };

  const removeOption = (index: number) => {
    const nextOptions = (form.options ?? []).filter((_, itemIndex) => itemIndex !== index);
    const hasCorrect = nextOptions.some((option) => option.isCorrect);

    setForm({
      ...form,
      options: nextOptions.map((option, itemIndex) => ({
        ...option,
        isCorrect: hasCorrect ? option.isCorrect : itemIndex === 0,
        displayOrder: itemIndex + 1,
      })),
    });
  };

  const setCorrectOption = (index: number) => {
    setForm({
      ...form,
      options: (form.options ?? []).map((option, itemIndex) => ({
        ...option,
        isCorrect: itemIndex === index,
      })),
    });
  };

  const handleSubmit = () => {
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit({
      ...form,
      expectedAnswer: form.expectedAnswer?.trim() || undefined,
      options: isMcq
        ? (form.options ?? []).map((option, index) => ({
            content: option.content.trim(),
            isCorrect: option.isCorrect,
            displayOrder: index + 1,
          }))
        : [],
    });
  };

  return (
    <AdminModal
      description="Tạo câu hỏi cho ngân hàng đề. Với MCQ, hãy nhập các đáp án và chọn đúng 1 đáp án đúng."
      footer={
        <button
          className={shared.primaryButton}
          disabled={isSubmitting}
          onClick={handleSubmit}
          type="button"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu câu hỏi"}
        </button>
      }
      onClose={onClose}
      title={question ? "Sửa câu hỏi" : "Thêm câu hỏi"}
    >
      <label className={shared.field}>
        <span className={shared.label}>Tiêu đề câu hỏi</span>
        <input
          className={shared.input}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          value={form.title}
        />
      </label>
      <label className={shared.field}>
        <span className={shared.label}>Nội dung câu hỏi</span>
        <textarea
          className={shared.textarea}
          onChange={(event) => setForm({ ...form, content: event.target.value })}
          value={form.content}
        />
      </label>
      <div className={shared.twoColumn}>
        <label className={shared.field}>
          <span className={shared.label}>Công nghệ</span>
          <select
            className={shared.select}
            onChange={(event) =>
              setForm({ ...form, technologyId: Number(event.target.value) })
            }
            value={form.technologyId}
          >
            {technologies.map((technology) => (
              <option key={technology.id} value={technology.id}>
                {technology.name}
              </option>
            ))}
          </select>
        </label>
        <label className={shared.field}>
          <span className={shared.label}>Chủ đề</span>
          <select
            className={shared.select}
            onChange={(event) =>
              setForm({ ...form, topicId: Number(event.target.value) })
            }
            value={form.topicId}
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className={shared.field}>
          <span className={shared.label}>Độ khó</span>
          <select
            className={shared.select}
            onChange={(event) =>
              setForm({
                ...form,
                difficulty: event.target
                  .value as AdminQuestionFormInput["difficulty"],
              })
            }
            value={form.difficulty}
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </label>
        <label className={shared.field}>
          <span className={shared.label}>Loại câu hỏi</span>
          <select
            className={shared.select}
            onChange={(event) =>
              setForm({
                ...form,
                questionType: event.target
                  .value as AdminQuestionFormInput["questionType"],
                options:
                  event.target.value === "MCQ" ? form.options ?? defaultOptions : [],
              })
            }
            value={form.questionType}
          >
            <option value="MCQ">MCQ</option>
            <option value="THEORY">THEORY</option>
            <option value="CODING">CODING</option>
            <option value="CASE_STUDY">CASE_STUDY</option>
          </select>
        </label>
      </div>
      <label className={shared.field}>
        <span className={shared.label}>Đáp án kỳ vọng</span>
        <textarea
          className={shared.textarea}
          onChange={(event) =>
            setForm({ ...form, expectedAnswer: event.target.value })
          }
          value={form.expectedAnswer ?? ""}
        />
      </label>

      {isMcq ? (
        <section className={shared.optionPanel}>
          <div className={shared.optionHeader}>
            <div>
              <h3 className={shared.cardTitle}>Đáp án trắc nghiệm</h3>
              <p className={shared.muted}>
                Nhập tối thiểu 2 đáp án và chọn đúng 1 đáp án đúng.
              </p>
            </div>
            <button
              className={shared.secondaryButton}
              onClick={() =>
                setForm({
                  ...form,
                  options: [
                    ...(form.options ?? []),
                    {
                      content: "",
                      isCorrect: false,
                      displayOrder: (form.options?.length ?? 0) + 1,
                    },
                  ],
                })
              }
              type="button"
            >
              Thêm đáp án
            </button>
          </div>
          <div className={shared.optionList}>
            {(form.options ?? []).map((option, index) => (
              <div className={shared.optionRow} key={index}>
                <label className={shared.radioLabel}>
                  <input
                    checked={option.isCorrect}
                    name="correct-option"
                    onChange={() => setCorrectOption(index)}
                    type="radio"
                  />
                  Đáp án đúng
                </label>
                <label className={shared.field}>
                  <span className={shared.label}>
                    Đáp án {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    className={shared.input}
                    onChange={(event) =>
                      updateOption(index, { content: event.target.value })
                    }
                    value={option.content}
                  />
                </label>
                {(form.options?.length ?? 0) > 2 ? (
                  <button
                    className={shared.dangerButton}
                    onClick={() => removeOption(index)}
                    type="button"
                  >
                    Xóa
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {error || validationError ? (
        <p className={shared.errorText}>{error || validationError}</p>
      ) : null}
    </AdminModal>
  );
}
