import { EmptyState } from "@/components/common/empty-state";
import type { InterviewLevelDto } from "@/lib/api/services/interview/interview-options/interview-options.dto";

import { InterviewTypeCard } from "./interview-type-card";
import styles from "./interview.module.css";

type RandomInterviewGridProps = {
  items: InterviewLevelDto[];
};

export function RandomInterviewGrid({ items }: RandomInterviewGridProps) {
  if (!items.length) {
    return (
      <EmptyState
        title="Chưa có bài phỏng vấn"
        description="Backend chưa có dữ liệu bài thi phù hợp. Khi có dữ liệu thật, danh sách sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <section className={styles.grid}>
      {items.map((item) => (
        <InterviewTypeCard item={item} key={item.id} />
      ))}
    </section>
  );
}
