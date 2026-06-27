import Link from "next/link";
import type { ReactNode } from "react";

import { appRoutes } from "@/lib/constants/app-routes";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href={appRoutes.home} className="font-semibold">
            AI Mock Interview
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link className="hover:text-slate-950" href={appRoutes.login}>
              Login
            </Link>
            <Link className="hover:text-slate-950" href={appRoutes.register}>
              Register
            </Link>
            <Link className="hover:text-slate-950" href={appRoutes.adminDashboard}>
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
