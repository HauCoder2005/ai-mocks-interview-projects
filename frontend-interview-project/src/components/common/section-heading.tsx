type SectionHeadingProps = {
  title: string;
  description?: string;
};

export function SectionHeading({ description, title }: SectionHeadingProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
