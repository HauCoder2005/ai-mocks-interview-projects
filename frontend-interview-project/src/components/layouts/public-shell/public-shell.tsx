import type { ReactNode } from "react";

import { UserHeader } from "@/components/layouts/user-header";

import styles from "./public-shell.module.css";

type PublicShellProps = {
  children: ReactNode;
};

/*
 * PublicShell là layout dùng cho các trang public.
 *
 * Ví dụ:
 * - /
 * - landing page
 * - trang giới thiệu
 *
 * Layout này khác AuthShell.
 *
 * AuthShell dùng cho:
 * - /login
 * - /register
 *
 * PublicShell dùng cho:
 * - trang chủ
 * - các trang người dùng chưa cần đăng nhập
 */
export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className={styles.shell}>
      <UserHeader />
      <main>{children}</main>
    </div>
  );
}
