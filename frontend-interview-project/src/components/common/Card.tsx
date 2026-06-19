import React from "react";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  padding: "24px",
};

const titleStyle: React.CSSProperties = {
  color: "#1e293b",
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: 1.4,
  margin: "0 0 16px",
};

export default function Card({ children, style, title }: CardProps) {
  return (
    <section
      style={{
        ...cardStyle,
        ...style,
      }}
    >
      {title ? <h2 style={titleStyle}>{title}</h2> : null}
      {children}
    </section>
  );
}
