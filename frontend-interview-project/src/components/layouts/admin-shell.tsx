"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";
import { appRoutes } from "@/lib/constants/app-routes";

type AdminShellProps = {
  children: ReactNode;
};

const adminNavItems = [
  { href: appRoutes.adminDashboard, label: "Dashboard" },
  { href: appRoutes.adminQuestionBanks, label: "Question Banks" },
  { href: appRoutes.adminInterviewOptions, label: "Interview Options" },
  { href: appRoutes.adminUsers, label: "Users" },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-slate-800 bg-slate-950 text-white lg:min-h-screen lg:border-b-0">
        <div className="border-b border-slate-800 p-5">
          <Link href={appRoutes.adminDashboard} className="text-lg font-semibold">
            Admin Portal
          </Link>
          <p className="mt-1 text-xs text-slate-400">AI Mock Interview Platform</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white",
                  isActive && "bg-slate-800 text-white",
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
      <div className="min-w-0">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <p className="text-sm font-medium text-slate-600">Admin workspace</p>
        </header>
        <main className="mx-auto w-full max-w-6xl p-6">{children}</main>
      </div>
    </div>
  );
}
