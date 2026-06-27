import { PublicShell } from "@/components/layouts/public-shell";
import { LandingPage } from "@/features/landing/components/landing-page";

export default function HomePage() {
  return (
    <PublicShell>
      <LandingPage />
    </PublicShell>
  );
}
