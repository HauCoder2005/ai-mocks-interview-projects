type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  description = "Please wait while we prepare the data.",
  title = "Loading",
}: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        {description}
      </p>
    </div>
  );
}
