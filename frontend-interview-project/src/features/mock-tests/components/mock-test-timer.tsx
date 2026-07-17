"use client";

import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/mock-test-time.util";
import styles from "./mock-tests.module.css";

type Props = {
  durationMinutes: number | null;
  stopped: boolean;
  onExpire: () => void;
};

export function MockTestTimer({ durationMinutes, stopped, onExpire }: Props) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(durationMinutes ?? 30, 1) * 60,
  );
  const expiredRef = useRef(false);

  useEffect(() => {
    if (stopped || remainingSeconds <= 0) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [remainingSeconds, stopped]);

  useEffect(() => {
    if (remainingSeconds !== 0 || stopped || expiredRef.current) return;
    expiredRef.current = true;
    onExpire();
  }, [onExpire, remainingSeconds, stopped]);

  const urgency =
    remainingSeconds <= 60
      ? styles.timerCritical
      : remainingSeconds <= 300
        ? styles.timerWarning
        : "";

  return (
    <div className={`${styles.timerBlock} ${urgency}`} aria-live="polite">
      <span>Thời gian còn lại</span>
      <strong>{formatTime(remainingSeconds)}</strong>
      {remainingSeconds <= 300 && !stopped ? (
        <small>{remainingSeconds <= 60 ? "Sắp hết giờ" : "Thời gian đang còn ít"}</small>
      ) : null}
    </div>
  );
}
