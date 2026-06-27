import Link from "next/link";
import type { ReactNode } from "react";

import { appRoutes } from "@/lib/constants/app-routes";

type UserShellProps = {
  children: ReactNode;
};

const userNavItems = [
  { href: appRoutes.userDashboard, label: "Dashboard" },
  { href: appRoutes.userInterviews, label: "Interviews" },
  { href: appRoutes.userPractice, label: "Practice" },
];

export function UserShell({ children }: UserShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href={appRoutes.userDashboard} className="font-semibold">
            Candidate Workspace
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            {userNavItems.map((item) => (
              <Link className="hover:text-slate-950" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
