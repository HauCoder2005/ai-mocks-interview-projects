import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function ErrorState({
  action,
  description = "Something went wrong. Please try again.",
  title = "Unable to load data",
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-100 bg-red-50 p-8 text-center">
      <h3 className="text-base font-semibold text-red-700">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-red-600">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
