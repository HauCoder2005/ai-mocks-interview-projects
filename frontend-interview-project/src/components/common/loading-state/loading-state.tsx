import styles from "./loading-state.module.css";

type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  description = "Please wait while we prepare the data.",
  title = "Loading",
}: LoadingStateProps) {
  return (
    <div className={styles.loadingState}>
      <div className={styles.spinner} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
