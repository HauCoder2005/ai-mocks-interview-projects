"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { AlertCircle, LoaderCircle, Play, RotateCcw, XCircle } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { appRoutes } from "@/lib/constants/app-routes";
import { candidateInterviewSessionService } from "@/lib/api/services/interview/candidate-interview-session";
import type { ActiveInterviewSessionData } from "@/lib/api/services/interview/candidate-interview-session";

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
    conflictingSession,
    isStarting,
    startSession,
  } = useCandidateInterviewSession();

  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [selectedTechnologyId, setSelectedTechnologyId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [activeSession, setActiveSession] =
    useState<ActiveInterviewSessionData | null>(null);
  const [isLoadingActive, setIsLoadingActive] = useState(true);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [isResuming, setIsResuming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadActiveSession = useCallback(async () => {
    setIsLoadingActive(true);
    setActiveError(null);
    try {
      const response = await candidateInterviewSessionService.getActiveSession();
      setActiveSession(response.data);
    } catch (error) {
      setActiveError(
        error instanceof Error
          ? error.message
          : "Không thể kiểm tra phiên đang hoạt động.",
      );
    } finally {
      setIsLoadingActive(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadActiveSession());
  }, [loadActiveSession]);

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

      router.push(appRoutes.userInterviewSession(sessionId));
    } catch {
      // A concurrent create may win after the initial GET. Refetch the full
      // active-session card instead of retrying the POST.
      if (conflictingSession || !activeSession) {
        await loadActiveSession();
      }
    }
  };

  const handleResume = async () => {
    if (!activeSession || isResuming) return;
    setIsResuming(true);
    setActiveError(null);
    try {
      if (activeSession.status === "PENDING") {
        await candidateInterviewSessionService.startCreatedSession(
          activeSession.sessionId,
        );
      }
      router.push(appRoutes.userInterviewSession(activeSession.sessionId));
    } catch (error) {
      setActiveError(
        error instanceof Error
          ? error.message
          : "Không thể tiếp tục phiên phỏng vấn.",
      );
      setIsResuming(false);
    }
  };

  const handleCancel = async () => {
    if (!activeSession || isCancelling) return;
    const confirmed = window.confirm(
      "Bạn có chắc muốn hủy phiên phỏng vấn này không? Phiên sẽ được lưu trong lịch sử với trạng thái Đã hủy.",
    );
    if (!confirmed) return;

    setIsCancelling(true);
    setActiveError(null);
    try {
      await candidateInterviewSessionService.cancelSession(activeSession.sessionId);
      await loadActiveSession();
    } catch (error) {
      setActiveError(
        error instanceof Error ? error.message : "Không thể hủy phiên phỏng vấn.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoadingActive) {
    return (
      <section className={styles.setupCard}>
        <div className={styles.loadingState}>
          <LoaderCircle className={styles.loadingIcon} size={22} />
          <span>Đang kiểm tra phiên phỏng vấn hiện tại...</span>
        </div>
      </section>
    );
  }

  if (activeSession) {
    return (
      <section className={`${styles.setupCard} ${styles.activeSessionCard}`}>
        <div className={styles.activeSessionHeader}>
          <div>
            <p className={styles.eyebrow}>Phiên đang mở</p>
            <h2 className={styles.cardTitle}>
              Bạn đang có một phiên phỏng vấn chưa hoàn thành.
            </h2>
          </div>
          <span className={styles.sourceBadge}>
            {activeSession.status === "PENDING" ? "Chưa bắt đầu" : "Đang thực hiện"}
          </span>
        </div>
        <div className={styles.activeSessionMeta}>
          <div><span>Vị trí</span><strong>{activeSession.position.name}</strong></div>
          <div><span>Cấp bậc</span><strong>{activeSession.level.name}</strong></div>
          <div><span>Tiến độ</span><strong>{activeSession.answeredQuestionCount}/{activeSession.questionCount} câu</strong></div>
          <div><span>Thời điểm tạo</span><strong>{new Date(activeSession.createdAt).toLocaleString("vi-VN")}</strong></div>
        </div>
        {activeError ? <div className={styles.errorAlert}>{activeError}</div> : null}
        <div className={styles.activeSessionActions}>
          <button className={styles.primaryButton} disabled={isResuming || isCancelling} onClick={handleResume} type="button">
            <Play size={17} />
            {isResuming ? "Đang mở phiên..." : activeSession.status === "PENDING" ? "Bắt đầu" : "Tiếp tục phiên"}
          </button>
          <button className={styles.dangerButton} disabled={isResuming || isCancelling} onClick={handleCancel} type="button">
            <XCircle size={17} />
            {isCancelling ? "Đang hủy..." : "Hủy phiên hiện tại"}
          </button>
        </div>
      </section>
    );
  }

  if (activeError) {
    return (
      <section className={styles.setupCard}>
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}><AlertCircle size={20} /><span>Không thể kiểm tra phiên hiện tại</span></div>
          <p className={styles.cardText}>{activeError}</p>
          <button className={styles.secondaryButton} onClick={loadActiveSession} type="button"><RotateCcw size={16} />Tải lại</button>
        </div>
      </section>
    );
  }

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
          <p className={styles.eyebrow}>Phỏng vấn AI</p>
          <h2 className={styles.cardTitle}>Tùy chỉnh phỏng vấn</h2>
          <p className={styles.cardText}>
            Chọn cấp độ, vị trí, công nghệ và chủ đề để bắt đầu phiên luyện tập phù hợp.
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
