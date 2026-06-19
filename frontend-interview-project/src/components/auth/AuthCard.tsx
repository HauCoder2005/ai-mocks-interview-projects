import type { ReactNode } from "react";

import Logo from "@/src/components/common/Logo";

import styles from "./Auth.module.css";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * Renders the shared authentication card used by login and registration screens.
 *
 * @param props - Authentication card content and heading data.
 * @param props.title - Primary card title displayed below the logo.
 * @param props.subtitle - Supporting text displayed below the title.
 * @param props.children - Form content rendered inside the shared card.
 * @returns A centered authentication page with a reusable white card shell.
 */
export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-title">
        <header className={styles.header}>
          <Logo width={168} height={48} className={styles.logoLink} />
          <h1 id="auth-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        {children}
      </section>
    </main>
  );
}
