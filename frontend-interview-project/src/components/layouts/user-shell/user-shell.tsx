import type { ReactNode } from "react";

import { RouteLoadingProvider } from "@/components/common/route-loading-overlay";
import { SiteFooter } from "@/components/layouts/site-footer";
import { UserHeader } from "@/components/layouts/user-header";

import styles from "./user-shell.module.css";

type UserShellProps = {
  children: ReactNode;
};

export function UserShell({ children }: UserShellProps) {
  return (
    <RouteLoadingProvider>
      <div className={styles.shell}>
        <UserHeader />
        <main className={styles.main}>{children}</main>
        <SiteFooter />
      </div>
    </RouteLoadingProvider>
  );
}
