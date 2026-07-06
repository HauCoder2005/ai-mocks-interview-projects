import type { AdminQuestionFilters } from "../types/admin-question-bank.type";
import styles from "../../shared/admin-ui.module.css";

type AdminQuestionFilterBarProps = {
  filters: AdminQuestionFilters;
  onChange: (filters: AdminQuestionFilters) => void;
  onCreate: () => void;
  technologies: string[];
  topics: string[];
};

export function AdminQuestionFilterBar({
  filters,
  onChange,
  onCreate,
  technologies,
  topics,
}: AdminQuestionFilterBarProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.label}>Công nghệ</span>
          <select
            className={styles.select}
            onChange={(event) =>
              onChange({ ...filters, technology: event.target.value })
            }
            value={filters.technology}
          >
            {["All", ...technologies].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Độ khó</span>
          <select
            className={styles.select}
            onChange={(event) =>
              onChange({ ...filters, difficulty: event.target.value })
            }
            value={filters.difficulty}
          >
            {["All", "EASY", "MEDIUM", "HARD"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Loại câu hỏi</span>
          <select
            className={styles.select}
            onChange={(event) =>
              onChange({ ...filters, questionType: event.target.value })
            }
            value={filters.questionType}
          >
            {["All", "MCQ", "THEORY", "CODING", "CASE_STUDY"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Chủ đề</span>
          <select
            className={styles.select}
            onChange={(event) => onChange({ ...filters, topic: event.target.value })}
            value={filters.topic}
          >
            {["All", ...topics].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Tìm kiếm</span>
          <input
            className={styles.input}
            onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
            placeholder="Từ khóa câu hỏi"
            value={filters.keyword}
          />
        </label>
        <button className={styles.primaryButton} onClick={onCreate} type="button">
          Thêm câu hỏi
        </button>
      </div>
    </section>
  );
}
