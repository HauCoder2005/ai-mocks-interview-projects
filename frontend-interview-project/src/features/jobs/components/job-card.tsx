import { ExternalLink } from "lucide-react";

import type { JobDto } from "../types/job.type";
import styles from "./jobs.module.css";

type JobCardProps = {
  job: JobDto;
};

export function JobCard({ job }: JobCardProps) {
  return (
    <article className={styles.card}>
      <div>
        <h2 className={styles.cardTitle}>{job.title}</h2>
        <p className={styles.company}>{job.company}</p>
      </div>

      {job.technologies.length > 0 ? (
        <div className={styles.chips}>
          {job.technologies.map((technology) => (
            <span className={styles.chip} key={technology}>
              {technology}
            </span>
          ))}
        </div>
      ) : null}

      <p className={styles.meta}>
        Hết hạn: {job.expiredAt ? new Date(job.expiredAt).toLocaleDateString("vi-VN") : "Chưa rõ"}
      </p>

      <a
        className={styles.link}
        href={job.sourceUrl}
        rel="noreferrer"
        target="_blank"
      >
        Xem nguồn
        <ExternalLink size={15} />
      </a>
    </article>
  );
}
