import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type DialogProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  title?: string;
  children: ReactNode;
};

export function Dialog({ children, className, open, title, ...props }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div
        className={cn(
          "w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        {...props}
      >
        {title ? (
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
