import type { ReactNode } from "react";

import styles from "./auth-shell.module.css";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className={styles.shell}>
      <section className={styles.panel}>{children}</section>
    </main>
  );
}
