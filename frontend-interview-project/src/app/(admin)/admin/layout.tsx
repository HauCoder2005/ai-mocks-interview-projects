/**
 * Defines the protected admin route shell used to isolate RBAC-oriented pages
 * from public and authentication route segments.
 *
 * @returns A sticky-sidebar layout that wraps nested administrative pages.
 */
import {
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./layout.module.css";

/**
 * Defines the props accepted by the admin route layout.
 *
 * @param children - Route segment content rendered inside the protected admin shell.
 * @returns A typed props contract for the admin layout component.
 */
interface AdminLayoutProps {
  /**
   * Route segment content rendered inside the protected admin shell.
   */
  children: ReactNode;
}

/**
 * Defines a single navigation entry in the admin sidebar.
 *
 * @param label - Stable navigation label displayed in the admin sidebar.
 * @param href - Route path targeted by the sidebar link.
 * @param Icon - Lucide icon component used to visually identify the route.
 * @param isActive - Active state used by the foundational overview route.
 * @returns A typed sidebar navigation item contract.
 */
interface AdminNavigationItem {
  /**
   * Stable navigation label displayed in the admin sidebar.
   */
  label: string;
  /**
   * Route path targeted by the sidebar link.
   */
  href: string;
  /**
   * Lucide icon component used to visually identify the route.
   */
  Icon: LucideIcon;
  /**
   * Active state used by the foundational overview route.
   */
  isActive?: boolean;
}

const navigationItems: AdminNavigationItem[] = [
  {
    label: "Tổng quan",
    href: "/admin",
    Icon: LayoutDashboard,
    isActive: true,
  },
  {
    label: "Người dùng",
    href: "/admin/users",
    Icon: Users,
  },
  {
    label: "Mẫu phỏng vấn",
    href: "/admin/templates",
    Icon: FileText,
  },
  {
    label: "Cài đặt hệ thống",
    href: "/admin/settings",
    Icon: Settings,
  },
];

/**
 * Provides the shared admin application shell with a sticky sidebar and a main
 * content viewport for RBAC-protected administrative routes.
 *
 * @param props - Layout props supplied by the Next.js App Router.
 * @param props.children - Nested admin route content rendered in the main viewport.
 * @returns The foundational admin layout for overview and management pages.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <section className={styles.adminShell} aria-label="Khu vực quản trị">
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.eyebrow}>Admin Console</p>
          <h2 className={styles.sidebarTitle}>Codeser Interview</h2>
        </div>

        <nav className={styles.navList} aria-label="Điều hướng quản trị">
          {navigationItems.map(({ label, href, Icon, isActive }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${
                isActive ? styles.navLinkActive : ""
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={2.2} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <p className={styles.footerLabel}>RBAC Guard</p>
          <p className={styles.footerText}>
            Khu vực này được thiết kế cho vai trò admin và sẵn sàng gắn guard
            xác thực khi có session store.
          </p>
        </div>
      </aside>

      <div className={styles.content} role="main">
        {children}
      </div>
    </section>
  );
}
