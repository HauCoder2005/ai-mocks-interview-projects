import Link from "next/link";
import type { ReactNode } from "react";

import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./user-shell.module.css";

type UserShellProps = {
  children: ReactNode;
};

const userNavItems = [
  { href: appRoutes.userDashboard, label: "Dashboard" },
  { href: appRoutes.userInterviews, label: "Interviews" },
  { href: appRoutes.userPractice, label: "Practice" },
];

export function UserShell({ children }: UserShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={appRoutes.userDashboard} className={styles.brand}>
            Candidate Workspace
          </Link>
          <nav className={styles.navigation}>
            {userNavItems.map((item) => (
              <Link className={styles.navigationLink} href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
