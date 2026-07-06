"use client";

import styles from "./pagination.module.css";

type PaginationProps = {
  page: number;
  limit: number;
  total: number;
  itemCount?: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

const ellipsis = "ellipsis";

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getPageItems(page: number, totalPages: number, siblingCount: number) {
  const totalVisible = siblingCount * 2 + 5;

  if (totalPages <= totalVisible) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblingCount * 2), ellipsis, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, ellipsis, ...range(totalPages - (2 + siblingCount * 2), totalPages)];
  }

  return [1, ellipsis, ...range(leftSibling, rightSibling), ellipsis, totalPages];
}

export function Pagination({
  page,
  limit,
  total,
  itemCount,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  if (!Number.isFinite(totalPages) || totalPages <= 1) return null;

  const safePage = Math.min(Math.max(page, 1), totalPages);
  const firstItem = (safePage - 1) * limit + 1;
  const lastItem = Math.min((safePage - 1) * limit + (itemCount ?? limit), total);

  return (
    <nav className={styles.pagination} aria-label="Phân trang">
      <p className={styles.summary}>
        Hiển thị {firstItem}-{lastItem} trong {total} bài kiểm tra
      </p>
      <div className={styles.controls}>
        <button
          className={styles.button}
          disabled={safePage === 1}
          onClick={() => onPageChange(safePage - 1)}
          type="button"
        >
          Trước
        </button>
        {getPageItems(safePage, totalPages, siblingCount).map((item, index) =>
          item === ellipsis ? (
            <span className={styles.ellipsis} key={`${item}-${index}`}>
              ...
            </span>
          ) : (
            <button
              aria-current={item === safePage ? "page" : undefined}
              className={`${styles.pageButton} ${
                item === safePage ? styles.active : ""
              }`}
              key={item}
              onClick={() => onPageChange(Number(item))}
              type="button"
            >
              {item}
            </button>
          ),
        )}
        <button
          className={styles.button}
          disabled={safePage === totalPages}
          onClick={() => onPageChange(safePage + 1)}
          type="button"
        >
          Sau
        </button>
      </div>
    </nav>
  );
}
