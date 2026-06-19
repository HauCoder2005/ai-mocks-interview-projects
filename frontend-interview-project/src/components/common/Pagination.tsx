import React from "react";

import Button from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const wrapperStyle: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  gap: "16px",
  justifyContent: "space-between",
};

const textStyle: React.CSSProperties = {
  color: "#1e293b",
  fontSize: "14px",
  fontWeight: 500,
  margin: 0,
};

export default function Pagination({
  currentPage,
  onPageChange,
  totalPages,
}: PaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const handlePreviousClick = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav aria-label="Pagination" style={wrapperStyle}>
      <Button
        disabled={isFirstPage}
        onClick={handlePreviousClick}
        variant="outline"
      >
        Prev
      </Button>
      <p style={textStyle}>
        Trang {currentPage} / {totalPages}
      </p>
      <Button disabled={isLastPage} onClick={handleNextClick} variant="outline">
        Next
      </Button>
    </nav>
  );
}
