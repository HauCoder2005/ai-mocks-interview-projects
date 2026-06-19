"use client";

import { AxiosError } from "axios";
import React, { useRef, useState } from "react";

import Button from "@/src/components/common/Button";
import { useUploadCvMutation } from "@/src/hooks/queries/useCv";
import { isValidCvFile } from "@/src/utils/validators";

type BackendErrorResponse = {
  message?: string | string[];
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#ffffff",
  color: "#1e293b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const formStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "520px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#1e293b",
  fontSize: "32px",
  fontWeight: 700,
  lineHeight: 1.2,
};

const uploadAreaStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const labelStyle: React.CSSProperties = {
  color: "#1e293b",
  fontSize: "14px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  color: "#1e293b",
  fontSize: "15px",
  lineHeight: 1.5,
};

const textStyle: React.CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: "15px",
  lineHeight: 1.6,
};

const fileNameStyle: React.CSSProperties = {
  ...textStyle,
  color: "#1e293b",
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  color: "#dc2626",
  fontSize: "14px",
  lineHeight: 1.5,
};

const successStyle: React.CSSProperties = {
  margin: 0,
  color: "#2563eb",
  fontSize: "14px",
  lineHeight: 1.5,
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as BackendErrorResponse | undefined;
    const message = responseData?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (message) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Không thể phân tích CV. Vui lòng thử lại.";
};

export default function CvReviewPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadCvMutation = useUploadCvMutation();

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    uploadCvMutation.reset();
    setSuccessMessage("");

    if (!file) {
      setSelectedFile(null);
      setError("");
      return;
    }

    const validationResult = isValidCvFile(file);

    if (!validationResult.isValid) {
      setSelectedFile(null);
      setError(validationResult.error ?? "File CV không hợp lệ.");
      resetInput();
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Vui lòng chọn file CV hợp lệ trước khi phân tích.");
      return;
    }

    try {
      await uploadCvMutation.mutateAsync({ file: selectedFile });
      setSuccessMessage("CV đã được gửi để phân tích.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    }
  };

  return (
    <main style={pageStyle}>
      <form style={formStyle} onSubmit={handleSubmit} noValidate>
        <h1 style={titleStyle}>Chấm CV</h1>

        <div style={uploadAreaStyle}>
          <label htmlFor="cv-file" style={labelStyle}>
            Tệp CV
          </label>
          <input
            ref={inputRef}
            id="cv-file"
            name="cv-file"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={inputStyle}
          />

          {selectedFile ? (
            <p style={fileNameStyle}>File đã chọn: {selectedFile.name}</p>
          ) : (
            <p style={textStyle}>Chấp nhận file .pdf, .doc, .docx dưới 5MB.</p>
          )}
        </div>

        {error ? <p style={errorStyle}>{error}</p> : null}
        {successMessage ? <p style={successStyle}>{successMessage}</p> : null}

        <Button
          type="submit"
          disabled={!selectedFile}
          isLoading={uploadCvMutation.isPending}
        >
          Phân tích CV
        </Button>
      </form>
    </main>
  );
}
