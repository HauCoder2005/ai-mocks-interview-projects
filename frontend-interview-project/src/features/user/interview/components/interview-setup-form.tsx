"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AlertCircle, LoaderCircle, RotateCcw } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { appRoutes } from "@/lib/constants/app-routes";

import { useCandidateInterviewSession, useInterviewOptions } from "../hooks";

import styles from "./interview.module.css";

export function InterviewSetupForm() {
  const router = useRouter();
  const {
    levels,
    positions,
    technologies,
    topics,
    isLoading,
    errorMessage,
    fetchDataInterviewOptions,
  } = useInterviewOptions();
  const {
    errorMessage: startError,
    isStarting,
    startSession,
  } = useCandidateInterviewSession();

  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [selectedTechnologyId, setSelectedTechnologyId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const canStart =
    selectedLevelId &&
    selectedPositionId;

  const hasRequiredOptions =
    levels.length > 0 &&
    positions.length > 0;

  const selectedLevel = levels.find(
    (level) => String(level.id) === selectedLevelId,
  );
  const selectedPosition = positions.find(
    (position) => String(position.id) === selectedPositionId,
  );
  const selectedTechnology = technologies.find(
    (technology) => String(technology.id) === selectedTechnologyId,
  );
  const selectedTopic = topics.find(
    (topic) => String(topic.id) === selectedTopicId,
  );

  const handleStartSession = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canStart) {
      return;
    }

    try {
      const session = await startSession({
        levelId: Number(selectedLevelId),
        positionId: Number(selectedPositionId),
      });
      const sessionId = String(session.sessionId ?? session.id);
      const sessionContext = {
        positionId: Number(selectedPositionId),
        levelId: Number(selectedLevelId),
        technologyId: selectedTechnologyId ? Number(selectedTechnologyId) : null,
        topicId: selectedTopicId ? Number(selectedTopicId) : null,
        positionName: selectedPosition?.name ?? "",
        levelName: selectedLevel?.name ?? "",
        technologyName: selectedTechnology?.name ?? "",
        topicName: selectedTopic?.name ?? "",
        interviewType: "TECHNICAL",
      };

      sessionStorage.setItem(
        `interview-session-context:${sessionId}`,
        JSON.stringify(sessionContext),
      );

      router.push(`${appRoutes.userInterview}/sessions/${sessionId}`);
    } catch {
      // Error state is handled by useCandidateInterviewSession.
    }
  };

  if (isLoading) {
    return (
      <section className={styles.setupCard}>
        <div className={styles.loadingState}>
          <LoaderCircle className={styles.loadingIcon} size={22} />
          <span>Đang tải dữ liệu phỏng vấn...</span>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className={styles.setupCard}>
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>
            <AlertCircle size={20} />
            <span>Không thể tải dữ liệu phỏng vấn</span>
          </div>

          <p className={styles.cardText}>{errorMessage}</p>

          <button
            className={styles.secondaryButton}
            onClick={fetchDataInterviewOptions}
            type="button"
          >
            <RotateCcw size={16} />
            Tải lại
          </button>
        </div>
      </section>
    );
  }

  if (!hasRequiredOptions) {
    return (
      <section className={styles.setupCard}>
        <EmptyState
          title="Chưa có dữ liệu phỏng vấn"
          description="Backend chưa trả đủ cấp độ hoặc vị trí. Khi có dữ liệu thật, form setup sẽ hiển thị tại đây."
          action={
            <button
              className={styles.secondaryButton}
              onClick={fetchDataInterviewOptions}
              type="button"
            >
              <RotateCcw size={16} />
              Tải lại
            </button>
          }
        />
      </section>
    );
  }

  return (
    <section className={styles.setupCard}>
      <div className={styles.setupHeader}>
        <div>
          <h2 className={styles.cardTitle}>Tùy chỉnh phỏng vấn</h2>
          <p className={styles.cardText}>
            Chọn đúng cấp độ, vị trí, công nghệ và chủ đề để bắt đầu phiên luyện tập phù hợp.
          </p>
        </div>
        <span className={styles.sourceBadge}>Dữ liệu từ hệ thống</span>
      </div>

      <form className={styles.setupForm} onSubmit={handleStartSession}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Cấp độ</span>

            <select
              className={styles.select}
              value={selectedLevelId}
              onChange={(event) => setSelectedLevelId(event.target.value)}
            >
              <option value="">Chọn cấp độ...</option>

              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Vị trí</span>

            <select
              className={styles.select}
              value={selectedPositionId}
              onChange={(event) => setSelectedPositionId(event.target.value)}
            >
              <option value="">Chọn vị trí...</option>

              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Công nghệ</span>

            <select
              className={styles.select}
              value={selectedTechnologyId}
              onChange={(event) => setSelectedTechnologyId(event.target.value)}
            >
              <option value="">Chọn công nghệ...</option>

              {technologies.map((technology) => (
                <option key={technology.id} value={technology.id}>
                  {technology.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Chủ đề</span>

            <select
              className={styles.select}
              value={selectedTopicId}
              onChange={(event) => setSelectedTopicId(event.target.value)}
            >
              <option value="">Chọn chủ đề...</option>

              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.summaryBox}>
          <div>
            <p className={styles.summaryLabel}>Trạng thái</p>
            <p className={styles.summaryText}>
              {startError ||
              (canStart
                ? "Đã chọn đủ thông tin bắt buộc. Công nghệ/chủ đề dùng cho ngữ cảnh AI."
                : "Vui lòng chọn cấp độ và vị trí để bắt đầu.")}
            </p>
          </div>

          <button
            className={styles.primaryButton}
            disabled={!canStart || isStarting}
            type="submit"
          >
            {isStarting ? "Đang tạo phiên..." : "Bắt đầu phỏng vấn"}
          </button>
        </div>
      </form>
    </section>
  );
}
