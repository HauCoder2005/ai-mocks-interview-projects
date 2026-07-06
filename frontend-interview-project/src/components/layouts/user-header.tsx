"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ClipboardList,
  ChevronDown,
  FileText,
  Home,
  Layers,
  LayoutDashboard,
  Menu,
  Mic,
} from "lucide-react";
import { useEffect, useState } from "react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { getStoredAccessToken, getStoredAuthUser } from "@/lib/auth/auth-storage";
import { appRoutes } from "@/lib/constants/app-routes";

import styles from "./user-header.module.css";

const navItems = [
  { href: appRoutes.home, label: "Trang chủ", icon: Home },
  { href: appRoutes.userInterviewSetup, label: "Phỏng vấn AI", icon: Mic },
  { href: appRoutes.mockTests, label: "Bài kiểm tra", icon: ClipboardList },
  { href: appRoutes.userJobs, label: "Công việc", icon: Briefcase },
  { href: appRoutes.userResumes, label: "Hồ sơ", icon: FileText },
  { href: appRoutes.userInterviews, label: "Phiên của tôi", icon: Layers },
  { href: appRoutes.userDashboard, label: "Dashboard", icon: LayoutDashboard },
];

type HeaderUser = {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
};

function getDisplayName(user: HeaderUser | null) {
  if (!user) return "Người dùng";

  return (
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Người dùng"
  );
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}

export function UserHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setIsAuthenticated(Boolean(getStoredAccessToken()));
      setUser(getStoredAuthUser() as HeaderUser | null);
    });
  }, [pathname]);

  const displayName = getDisplayName(user);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href={appRoutes.home}>
          <span className={styles.logoMark}>AI</span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Mock Interview</span>
            <span className={styles.brandMeta}>Luyện phỏng vấn</span>
          </span>
        </Link>

        <button
          aria-label="Mở menu"
          className={styles.menuButton}
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <Menu size={20} />
        </button>

        <nav
          aria-label="Điều hướng người dùng"
          className={`${styles.nav} ${isOpen ? styles.mobileOpen : ""}`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === appRoutes.home
                ? pathname === item.href
                : item.href === appRoutes.userInterviewSetup
                  ? pathname.startsWith("/interview")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                href={item.href}
                key={item.href}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={`${styles.actions} ${isOpen ? styles.mobileOpen : ""}`}>
          {isAuthenticated ? (
            <div className={styles.account}>
              <button
                className={styles.avatarButton}
                onClick={() => setAccountOpen((current) => !current)}
                type="button"
              >
                <span className={styles.avatar}>{getInitial(displayName)}</span>
                <span className={styles.accountName}>{displayName}</span>
                <ChevronDown size={15} />
              </button>
              {accountOpen ? (
                <div className={styles.accountMenu}>
                  <Link href={appRoutes.userDashboard}>Dashboard cá nhân</Link>
                  <Link href={appRoutes.userResumes}>Hồ sơ xin việc</Link>
                  <Link href={appRoutes.userInterviews}>Phiên phỏng vấn</Link>
                  <LogoutButton className={styles.logoutButton} />
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link className={styles.ghostLink} href={appRoutes.login}>
                Đăng nhập
              </Link>
              <Link className={styles.outlineLink} href={appRoutes.register}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
