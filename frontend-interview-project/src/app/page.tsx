import { AppShell } from "@/components/layouts/app-shell";
import { LandingPage } from "@/features/landing/components/landing-page";

export default function HomePage() {
  return (
    <AppShell>
      <LandingPage />
    </AppShell>
  );
}
