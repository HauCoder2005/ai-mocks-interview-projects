import type { LandingFeature } from "@/features/landing/types";

const features: LandingFeature[] = [
  {
    title: "Role-based interview setup",
    description: "Prepare flows by position, seniority, technology, and topic.",
  },
  {
    title: "Admin question banks",
    description: "Keep interview content organized for repeatable evaluation.",
  },
  {
    title: "Candidate practice workspace",
    description: "Guide candidates from configuration to practice and history.",
  },
];

export function FeatureSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article className="rounded-lg border border-slate-200 bg-white p-6" key={feature.title}>
            <h2 className="text-lg font-semibold text-slate-950">{feature.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
