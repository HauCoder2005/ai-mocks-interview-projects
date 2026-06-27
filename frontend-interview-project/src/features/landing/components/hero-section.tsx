import Link from "next/link";

import { appRoutes } from "@/lib/constants/app-routes";

export function HeroSection() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid min-h-[520px] max-w-6xl content-center gap-8 px-4 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
            AI Mock Interview Platform
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Practice interviews with structured AI guidance.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Configure interview scenarios, manage question banks, and help candidates prepare for
            real technical conversations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
              href={appRoutes.register}
            >
              Start practicing
            </Link>
            <Link
              className="inline-flex h-10 items-center rounded-md border border-slate-700 px-4 text-sm font-medium text-white transition hover:bg-slate-900"
              href={appRoutes.login}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
