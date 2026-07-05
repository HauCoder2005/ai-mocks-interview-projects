import type { ReactNode } from "react";

import { UserHeader } from "@/components/layouts/user-header";

import styles from "./user-shell.module.css";

type UserShellProps = {
  children: ReactNode;
};

export function UserShell({ children }: UserShellProps) {
  return (
    <div className={styles.shell}>
      <UserHeader />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
