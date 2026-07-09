"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Code2,
  FileQuestion,
  LayoutDashboard,
  ListOrdered,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { appRoutes } from "@/lib/constants/app-routes";
import { cn } from "@/lib/utils/cn";

import styles from "./admin-shell.module.css";

type AdminShellProps = {
  children: ReactNode;
};

type AdminNavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  activePatterns?: string[];
  children?: AdminNavItem[];
};

const adminNavItems: AdminNavItem[] = [
  {
    href: appRoutes.adminDashboard,
    label: "Bảng điều khiển",
    icon: LayoutDashboard,
    activePatterns: [appRoutes.admin, appRoutes.adminDashboard],
  },
  {
    label: "Quản lý phỏng vấn",
    icon: BriefcaseBusiness,
    children: [
      {
        href: appRoutes.adminInterviewTechnologies,
        label: "Công nghệ phỏng vấn",
        icon: Code2,
        activePatterns: [appRoutes.adminInterviewTechnologies],
      },
      {
        href: appRoutes.adminInterviewTopics,
        label: "Chủ đề phỏng vấn",
        icon: Tags,
        activePatterns: [appRoutes.adminInterviewTopics],
      },
      {
        href: appRoutes.adminInterviewLevels,
        label: "Cấp bậc phỏng vấn",
        icon: ListOrdered,
        activePatterns: [appRoutes.adminInterviewLevels],
      },
      {
        href: appRoutes.adminInterviewPositions,
        label: "Vị trí phỏng vấn",
        icon: BriefcaseBusiness,
        activePatterns: [appRoutes.adminInterviewPositions],
      },
      {
        href: appRoutes.adminQuestionBanks,
        label: "Ngân hàng câu hỏi",
        icon: FileQuestion,
        activePatterns: [appRoutes.adminQuestionBanks],
      },
      {
        href: appRoutes.adminMockTests,
        label: "Quản lý đề phỏng vấn",
        icon: ClipboardList,
        activePatterns: [appRoutes.adminMockTests],
      },
    ],
  },
  {
    href: appRoutes.adminUsers,
    label: "Người dùng",
    icon: Users,
    activePatterns: [appRoutes.adminUsers],
  },
];

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isActivePath(pathname: string, item: AdminNavItem) {
  const patterns = item.activePatterns ?? (item.href ? [item.href] : []);

  return patterns.some((pattern) => {
    if (pattern === appRoutes.admin) {
      return pathname === appRoutes.admin;
    }

    return matchesPath(pathname, pattern);
  });
}

function isGroupActive(pathname: string, children: AdminNavItem[] = []) {
  return children.some((child) => isActivePath(pathname, child));
}

function getActiveGroupLabels(pathname: string) {
  return adminNavItems
    .filter((item) => item.children?.length)
    .filter((item) => isGroupActive(pathname, item.children))
    .map((item) => item.label);
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  const [expandedGroups, setExpandedGroups] = useState<string[]>(() =>
    getActiveGroupLabels(pathname),
  );

  useEffect(() => {
    const activeGroupLabels = getActiveGroupLabels(pathname);

    if (activeGroupLabels.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setExpandedGroups((current) => {
        const next = new Set(current);

        for (const label of activeGroupLabels) {
          next.add(label);
        }

        return Array.from(next);
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

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
            const hasChildren = Boolean(item.children?.length);

            if (hasChildren) {
              const groupActive = isGroupActive(pathname, item.children);
              const isOpen = expandedGroups.includes(item.label);
              const ChevronIcon = isOpen ? ChevronUp : ChevronDown;

              return (
                <div className={styles.navigationGroup} key={item.label}>
                  <button
                    aria-expanded={isOpen}
                    className={cn(
                      styles.navigationLink,
                      styles.navigationGroupButton,
                      groupActive && styles.navigationLinkActive,
                    )}
                    onClick={() => toggleGroup(item.label)}
                    type="button"
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                    <ChevronIcon
                      className={styles.navigationChevron}
                      size={16}
                    />
                  </button>

                  {isOpen ? (
                    <div className={styles.navigationChildren}>
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActivePath(pathname, child);

                        return child.href ? (
                          <Link
                            className={cn(
                              styles.navigationChildLink,
                              childActive && styles.navigationChildLinkActive,
                            )}
                            href={child.href}
                            key={child.href}
                          >
                            <ChildIcon size={15} />
                            <span>{child.label}</span>
                          </Link>
                        ) : null;
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            const isActive = isActivePath(pathname, item);

            return (
              <Link
                className={cn(
                  styles.navigationLink,
                  isActive && styles.navigationLinkActive,
                )}
                href={item.href ?? appRoutes.adminDashboard}
                key={item.href ?? item.label}
              >
                <Icon size={17} />
                <span>{item.label}</span>
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
