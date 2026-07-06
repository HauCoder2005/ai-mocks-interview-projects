import Link from "next/link";

import { appRoutes } from "@/lib/constants/app-routes";

import styles from "./site-footer.module.css";

const productLinks = [
  { label: "Phỏng vấn AI", href: appRoutes.userInterviewSetup },
  { label: "Bài kiểm tra", href: appRoutes.mockTests },
  { label: "Hồ sơ", href: appRoutes.userResumes },
  { label: "Công việc", href: appRoutes.userJobs },
];

const resourceLinks = [
  { label: "Hướng dẫn", href: appRoutes.home },
  { label: "Câu hỏi thường gặp", href: appRoutes.home },
  { label: "Blog", href: appRoutes.home },
  { label: "Liên hệ", href: "mailto:support@mockinterview.dev" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Facebook", href: "https://www.facebook.com" },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link className={styles.brand} href={appRoutes.home}>
            <span className={styles.logoMark}>AI</span>
            <span>
              <span className={styles.brandName}>Mock Interview</span>
              <span className={styles.brandMeta}>Luyện phỏng vấn</span>
            </span>
          </Link>
          <p className={styles.description}>
            Nền tảng luyện phỏng vấn AI, kiểm tra kiến thức và cải thiện kỹ năng
            trả lời cho lập trình viên.
          </p>
        </div>

        <div className={styles.column}>
          <h2>Sản phẩm</h2>
          {productLinks.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.column}>
          <h2>Tài nguyên</h2>
          {resourceLinks.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.column}>
          <h2>Liên hệ</h2>
          <a href="mailto:support@mockinterview.dev">support@mockinterview.dev</a>
          {socialLinks.map((item) => (
            <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        © 2026 Mock Interview. All rights reserved.
      </div>
    </footer>
  );
}
