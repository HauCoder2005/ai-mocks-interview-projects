import type { ReactNode } from "react";

import { AppShell } from "@/components/layouts/app-shell";
import styles from "./public-shell.module.css";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className={styles.shell}>
      <AppShell>{children}</AppShell>
    </div>
  );
}
