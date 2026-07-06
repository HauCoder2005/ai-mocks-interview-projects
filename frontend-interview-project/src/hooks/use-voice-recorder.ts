"use client";

import { useCallback, useRef, useState } from "react";

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    chunksRef.current = [];
    setAudioBlob(null);
    setAudioUrl("");
    setError("");
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError("Your browser does not support voice recording.");
      return;
    }

    resetRecording();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone permission is required to record your answer.");
    }
  }, [resetRecording]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return {
    audioBlob,
    audioUrl,
    error,
    isRecording,
    resetRecording,
    startRecording,
    stopRecording,
  };
}
