import Link from "next/link";

import { appRoutes } from "@/lib/constants/app-routes";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you requested does not exist.</p>
        <Link className="mt-6 inline-flex text-sm font-medium text-slate-950" href={appRoutes.home}>
          Back home
        </Link>
      </div>
    </main>
  );
}
