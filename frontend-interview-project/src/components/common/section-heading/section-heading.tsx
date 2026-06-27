import styles from "./section-heading.module.css";

type SectionHeadingProps = {
  title: string;
  description?: string;
};

export function SectionHeading({ description, title }: SectionHeadingProps) {
  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
