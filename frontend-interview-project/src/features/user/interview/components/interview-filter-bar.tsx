"use client";

import styles from "./interview.module.css";
import { useInterviewOptions } from "../hooks";

export type InterviewFilters = {
  position: string;
  topic: string;
  level: string;
  type: string;
  keyword: string;
};

type InterviewFilterBarProps = {
  filters: InterviewFilters;
  onChange: (filters: InterviewFilters) => void;
};

export function InterviewFilterBar({
  filters,
  onChange,
}: InterviewFilterBarProps) {
  const { levels, positions, topics, isLoading } = useInterviewOptions();

  const setFilter = (key: keyof InterviewFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className={styles.filterBar}>
      <div className={styles.filterGrid}>
        <label className={styles.field}>
          <span className={styles.label}>Vị trí</span>
          <select
            className={styles.select}
            disabled={isLoading}
            onChange={(event) => setFilter("position", event.target.value)}
            value={filters.position}
          >
            <option value="">Tất cả</option>
            {positions.map((option) => (
              <option key={option.id} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Chủ đề</span>
          <select
            className={styles.select}
            disabled={isLoading}
            onChange={(event) => setFilter("topic", event.target.value)}
            value={filters.topic}
          >
            <option value="">Tất cả</option>
            {topics.map((option) => (
              <option key={option.id} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Kinh nghiệm</span>
          <select
            className={styles.select}
            disabled={isLoading}
            onChange={(event) => setFilter("level", event.target.value)}
            value={filters.level}
          >
            <option value="">Tất cả</option>
            {levels.map((option) => (
              <option key={option.id} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Loại phỏng vấn</span>
          <select
            className={styles.select}
            onChange={(event) => setFilter("type", event.target.value)}
            value={filters.type}
          >
            <option value="">Tất cả</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Từ khóa</span>
          <input
            className={styles.input}
            onChange={(event) => setFilter("keyword", event.target.value)}
            placeholder="React, Docker..."
            value={filters.keyword}
          />
        </label>
      </div>
    </section>
  );
}
