import { FeatureSection } from "@/features/landing/components/feature-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { PricingSection } from "@/features/landing/components/pricing-section";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <PricingSection />
    </>
  );
}
