import type { MockTestListItem } from "../types/mock-test.type";
import styles from "./mock-tests.module.css";

export function MockTestCard({ mockTest, onStart }: { mockTest: MockTestListItem; onStart: (id: number) => void }) {
  return (
    <article className={`${styles.card} ${styles.clickableCard}`}>
      <div className={styles.cardBody}>
        <span className={styles.badge}>{mockTest.status}</span>
        <h2 className={styles.cardTitle}>{mockTest.title}</h2>
        <p className={styles.cardText}>{mockTest.description}</p>
        <div className={styles.meta}>
          <span>{mockTest.totalQuestions} câu</span>
          <span>{mockTest.durationMinutes ?? "--"} phút</span>
          {mockTest.level ? <span>{mockTest.level.name}</span> : null}
          {mockTest.position ? <span>{mockTest.position.name}</span> : null}
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.primaryButton} onClick={() => onStart(mockTest.id)} type="button">Bắt đầu làm bài</button>
      </div>
    </article>
  );
}
