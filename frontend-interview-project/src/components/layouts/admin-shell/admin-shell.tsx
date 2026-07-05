"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BarChart3, FileQuestion, LayoutDashboard, Settings, Users } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { appRoutes } from "@/lib/constants/app-routes";
import { cn } from "@/lib/utils/cn";

import styles from "./admin-shell.module.css";

type AdminShellProps = {
  children: ReactNode;
};

const adminNavItems = [
  { href: appRoutes.adminDashboard, label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: appRoutes.adminQuestionBanks, label: "Ngân hàng câu hỏi", icon: FileQuestion },
  { href: appRoutes.adminInterviewOptions, label: "Tùy chọn phỏng vấn", icon: Settings },
  { href: appRoutes.adminUsers, label: "Người dùng", icon: Users },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Link href={appRoutes.adminDashboard} className={styles.brandLink}>
            <span className={styles.logoMark}>AI</span>
            <span>
              <span className={styles.brandName}>Mock Interview</span>
              <span className={styles.tagline}>Khu vực quản trị</span>
            </span>
          </Link>
        </div>
        <nav className={styles.navigation}>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                className={cn(
                  styles.navigationLink,
                  isActive && styles.navigationLinkActive,
                )}
                href={item.href}
                key={item.href}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <BarChart3 size={16} />
            Quản lý hệ thống
          </p>
          <LogoutButton className={styles.logoutButton} />
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
