"use client";

import {
  BriefcaseBusiness,
  ChevronDown,
  CircleUserRound,
  LogOut,
  NotebookText,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import Logo from "@/src/components/common/Logo";

/**
 * Provides the global application navigation shell with a transparent logo,
 * primary route links, and an authenticated-user dropdown trigger.
 *
 * The component uses a soft SaaS-oriented color palette with slate text and
 * lucide-react icons for consistent system iconography.
 */
type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  isDanger?: boolean;
  hasDivider?: boolean;
};

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Trang chủ",
    href: "/",
  },
  {
    label: "Phỏng vấn",
    href: "/interviews",
  },
  {
    label: "Việc làm",
    href: "/jobs",
  },
  {
    label: "Chấm CV",
    href: "/cv-review",
  },
];

const menuItems: MenuItem[] = [
  {
    label: "Thông tin cá nhân",
    href: "/dashboard/profile",
    icon: <UserRound size={17} strokeWidth={2.2} />,
  },
  {
    label: "Các công việc đã quan tâm",
    href: "/dashboard/saved-jobs",
    icon: <BriefcaseBusiness size={17} strokeWidth={2.2} />,
  },
  {
    label: "Các bài đã luyện",
    href: "/dashboard/practice-history",
    icon: <NotebookText size={17} strokeWidth={2.2} />,
  },
  {
    label: "Đăng xuất",
    href: "/login",
    icon: <LogOut size={17} strokeWidth={2.2} />,
    isDanger: true,
    hasDivider: true,
  },
];

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  width: "100%",
  background: "linear-gradient(135deg, #ffffff 0%, #f3f8fe 100%)",
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
  boxShadow: "0 8px 18px -14px rgba(15, 23, 42, 0.18)",
};

const innerStyle: React.CSSProperties = {
  minHeight: "72px",
  padding: "0 28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "32px",
  boxSizing: "border-box",
};

const brandStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

const navigationGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "32px",
  marginLeft: "auto",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "24px",
};

const navLinkStyle: React.CSSProperties = {
  color: "#334155",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: 500,
  fontFamily: "var(--font-be-vietnam), sans-serif",
  lineHeight: 1.4,
  whiteSpace: "nowrap",
};

const rightAreaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "16px",
  marginLeft: "auto",
};

const userMenuWrapperStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-flex",
};

const avatarButtonStyle: React.CSSProperties = {
  border: "1px solid #dbeafe",
  backgroundColor: "#ffffff",
  color: "#334155",
  borderRadius: "999px",
  padding: "5px 9px 5px 5px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: "var(--font-be-vietnam), sans-serif",
  cursor: "pointer",
};

const avatarStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "999px",
  backgroundColor: "#eef6ff",
  color: "#2563eb",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "54px",
  right: 0,
  zIndex: 50,
  width: "260px",
  backgroundColor: "#ffffff",
  color: "#334155",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 18px 36px -12px rgba(15, 23, 42, 0.28)",
  fontFamily: "var(--font-be-vietnam), sans-serif",
  padding: "8px",
};

const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "11px 12px",
  borderRadius: "8px",
  color: "#334155",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  fontFamily: "var(--font-be-vietnam), sans-serif",
  lineHeight: 1.4,
};

const dangerMenuItemStyle: React.CSSProperties = {
  ...menuItemStyle,
  color: "#dc2626",
};

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid #e2e8f0",
  marginTop: "8px",
  paddingTop: "8px",
};

/**
 * Renders the application navbar and manages the user dropdown visibility state.
 *
 * @returns A sticky navigation bar with route links and a user actions dropdown.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAvatarClick = () => {
    setIsOpen((currentValue) => !currentValue);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <Logo width={150} height={44} style={brandStyle} />

        <div style={navigationGroupStyle}>
          <nav aria-label="Điều hướng chính" style={navStyle}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={navLinkStyle}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={rightAreaStyle}>
            <div style={userMenuWrapperStyle}>
              <button
                type="button"
                onClick={handleAvatarClick}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                style={avatarButtonStyle}
              >
                <span style={avatarStyle}>
                  <CircleUserRound size={23} strokeWidth={2.2} />
                </span>
                <ChevronDown size={16} strokeWidth={2.4} />
              </button>

              {isOpen ? (
                <nav aria-label="Tài khoản người dùng" style={dropdownStyle}>
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleMenuItemClick}
                      style={{
                        ...(item.isDanger ? dangerMenuItemStyle : menuItemStyle),
                        ...(item.hasDivider ? dividerStyle : {}),
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
