import styles from "./skeleton.module.css";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className ?? ""}`} />;
}
