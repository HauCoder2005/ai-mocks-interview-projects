import Link from "next/link";
import type { ReactNode } from "react";

import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./app-shell.module.css";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={appRoutes.home} className={styles.brand}>
            AI Mock Interview
          </Link>
          <nav className={styles.navigation}>
            <Link className={styles.navigationLink} href={appRoutes.login}>
              Login
            </Link>
            <Link className={styles.navigationLink} href={appRoutes.register}>
              Register
            </Link>
            <Link className={styles.navigationLink} href={appRoutes.adminDashboard}>
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
