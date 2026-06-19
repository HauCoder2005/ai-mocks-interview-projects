import React from "react";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  color: "#1e293b",
  fontSize: "14px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  boxSizing: "border-box",
  color: "#1e293b",
  fontSize: "15px",
  lineHeight: 1.5,
  outline: "none",
  padding: "12px 14px",
  width: "100%",
};

const errorStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "13px",
  lineHeight: 1.4,
  margin: 0,
};

export default function InputField({
  error,
  id,
  label,
  style,
  ...props
}: InputFieldProps) {
  const inputId = id ?? props.name;

  return (
    <div style={wrapperStyle}>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
      </label>
      <input
        {...props}
        id={inputId}
        style={{
          ...inputStyle,
          ...style,
        }}
      />
      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  );
}
