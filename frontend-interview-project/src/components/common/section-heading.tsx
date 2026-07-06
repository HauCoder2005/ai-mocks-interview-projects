import type { ReactNode } from "react";

import styles from "./section-heading.module.css";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({
  action,
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div className={styles.heading}>
      <div>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
