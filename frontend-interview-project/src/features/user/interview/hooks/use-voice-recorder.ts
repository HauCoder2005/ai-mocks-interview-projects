"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const revokeAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }
  }, []);

  const resetRecording = useCallback(() => {
    clearTimer();
    stopStream();
    revokeAudioUrl();
    chunksRef.current = [];
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl("");
    setRecordingTime(0);
    setErrorMessage(null);
  }, [clearTimer, revokeAudioUrl, stopStream]);

  const startRecording = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setErrorMessage("Trình duyệt không hỗ trợ ghi âm.");
      return;
    }

    resetRecording();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const nextAudioUrl = URL.createObjectURL(blob);

        revokeAudioUrl();
        audioUrlRef.current = nextAudioUrl;
        setAudioBlob(blob);
        setAudioUrl(nextAudioUrl);
        stopStream();
        clearTimer();
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((current) => current + 1);
      }, 1000);
    } catch {
      stopStream();
      setIsRecording(false);
      setErrorMessage("Không thể truy cập microphone. Vui lòng cấp quyền ghi âm.");
    }
  }, [clearTimer, resetRecording, revokeAudioUrl, stopStream]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      stopStream();
      clearTimer();
      setIsRecording(false);
    }
  }, [clearTimer, stopStream]);

  useEffect(() => {
    return () => {
      clearTimer();
      stopStream();
      revokeAudioUrl();
    };
  }, [clearTimer, revokeAudioUrl, stopStream]);

  return {
    isRecording,
    audioBlob,
    audioUrl,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
    errorMessage,
  };
}
