import type { MockTestListItem } from "../types/mock-test.type";
import { MockTestCard } from "./mock-test-card";
import styles from "./mock-tests.module.css";

export function MockTestList({ items, onStart }: { items: MockTestListItem[]; onStart: (id: number) => void }) {
  return <section className={styles.grid}>{items.map((item) => <MockTestCard key={item.id} mockTest={item} onStart={onStart} />)}</section>;
}
