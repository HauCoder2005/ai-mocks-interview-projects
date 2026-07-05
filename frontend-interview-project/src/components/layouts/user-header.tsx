"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ChevronDown,
  Code2,
  FileText,
  Home,
  Layers,
  LayoutDashboard,
  Menu,
  Mic,
  Shuffle,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { getStoredAccessToken, getStoredAuthUser } from "@/lib/auth/auth-storage";
import { appRoutes } from "@/lib/constants/app-routes";

import styles from "./user-header.module.css";

const navItems = [
  { href: appRoutes.home, label: "Trang chủ", icon: Home },
  { href: appRoutes.userInterview, label: "Phỏng vấn", icon: Mic, hasDropdown: true },
  { href: appRoutes.userJobs, label: "Công việc", icon: Briefcase },
  { href: appRoutes.userResumes, label: "Hồ sơ", icon: FileText },
  { href: appRoutes.userInterviews, label: "Phiên của tôi", icon: Layers },
  { href: appRoutes.userDashboard, label: "Dashboard", icon: LayoutDashboard },
];

const dropdownItems = [
  {
    href: "/interview?type=technical",
    title: "Phỏng vấn kỹ thuật",
    description: "API, database, framework và xử lý tình huống kỹ thuật.",
    icon: Code2,
  },
  {
    href: "/interview?type=behavioral",
    title: "Phỏng vấn hành vi",
    description: "STAR, teamwork, ownership và cách giải quyết xung đột.",
    icon: UsersRound,
  },
  {
    href: "/interview?type=mixed",
    title: "Phỏng vấn tổng hợp",
    description: "Kết hợp kỹ thuật, sản phẩm và cách làm việc.",
    icon: Layers,
  },
  {
    href: "/interview?mode=random",
    title: "Câu hỏi ngẫu nhiên",
    description: "Luyện phản xạ với các câu hỏi linh hoạt.",
    icon: Shuffle,
  },
  {
    href: "/interview?group=position",
    title: "Theo vị trí công việc",
    description: "Backend, Frontend, Fullstack, DevOps và Mobile.",
    icon: Briefcase,
  },
  {
    href: "/interview?group=level",
    title: "Theo kinh nghiệm",
    description: "Intern đến Senior với độ khó phù hợp.",
    icon: UserRound,
  },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
                : pathname.startsWith(item.href);

            if (item.hasDropdown) {
              return (
                <div className={styles.navItem} key={item.href}>
                  <button
                    className={`${styles.navButton} ${active ? styles.active : ""}`}
                    onClick={() => setDropdownOpen((current) => !current)}
                    type="button"
                  >
                    <Icon size={16} />
                    {item.label}
                    <ChevronDown className={styles.chevron} size={15} />
                  </button>
                  <div
                    className={`${styles.dropdown} ${
                      dropdownOpen ? styles.dropdownOpen : ""
                    }`}
                  >
                    {dropdownItems.map((dropdownItem) => {
                      const DropdownIcon = dropdownItem.icon;

                      return (
                        <Link
                          className={styles.dropdownLink}
                          href={dropdownItem.href}
                          key={dropdownItem.href}
                        >
                          <span className={styles.dropdownIcon}>
                            <DropdownIcon size={18} />
                          </span>
                          <span>
                            <span className={styles.dropdownTitle}>
                              {dropdownItem.title}
                            </span>
                            <span className={styles.dropdownText}>
                              {dropdownItem.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                className={`${styles.navLink} ${active ? styles.active : ""}`}
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
