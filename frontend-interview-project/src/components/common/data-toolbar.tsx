import type { ReactNode } from "react";

type DataToolbarProps = {
  title?: string;
  description?: string;
  filters?: ReactNode;
  actions?: ReactNode;
};

export function DataToolbar({
  actions,
  description,
  filters,
  title,
}: DataToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {title ? (
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        ) : null}
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {filters}
        {actions}
      </div>
    </div>
  );
}
