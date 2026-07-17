import { Skeleton } from "@/components/common/skeleton";
import styles from "./mock-tests.module.css";

export function MockTestLoading({ detail = false }: { detail?: boolean }) {
  return (
    <section className={detail ? styles.reviewList : styles.grid} aria-label="Đang tải bài kiểm tra">
      {Array.from({ length: detail ? 3 : 9 }).map((_, index) => (
        <article className={styles.card} key={index}>
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonText} />
          <Skeleton className={styles.skeletonOption} />
        </article>
      ))}
    </section>
  );
}
