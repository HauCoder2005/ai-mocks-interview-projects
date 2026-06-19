import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  isLoading?: boolean;
}

const baseStyle: React.CSSProperties = {
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
  lineHeight: 1.4,
  padding: "12px 20px",
  transition: "opacity 160ms ease, background-color 160ms ease",
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: {
    backgroundColor: "#2563eb",
    border: "1px solid #2563eb",
    color: "#ffffff",
  },
  outline: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#2563eb",
  },
  ghost: {
    backgroundColor: "transparent",
    border: "1px solid transparent",
    color: "#2563eb",
  },
};

const disabledStyle: React.CSSProperties = {
  cursor: "not-allowed",
  opacity: 0.6,
};

export default function Button({
  children,
  disabled,
  isLoading = false,
  style,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...(isDisabled ? disabledStyle : {}),
        ...style,
      }}
    >
      {isLoading ? "Đang xử lý..." : children}
    </button>
  );
}
