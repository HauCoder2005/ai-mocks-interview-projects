"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { appRoutes } from "@/lib/constants/app-routes";
import Image from "next/image";
import styles from "./admin-shell.module.css";

type AdminShellProps = {
  children: ReactNode;
};

const adminNavItems = [
  { href: appRoutes.adminDashboard, label: "Thống Kê" },
  { href: appRoutes.adminQuestionBanks, label: "Kho Câu Hỏi" },
  { href: appRoutes.adminInterviewOptions, label: "Phỏng Vấn" },
  { href: appRoutes.adminUsers, label: "Người dùng" },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Link href={appRoutes.adminDashboard} className={styles.brandLink}>
            <Image
              src="/images/logo.png"
              alt="Admin Logo"
              width={120}
              height={120}
              priority
            />
          </Link>
          <p className={styles.tagline}>AI Mock Interview Platform</p>
        </div>
        <nav className={styles.navigation}>
          {adminNavItems.map((item) => {
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
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Admin workspace</p>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
