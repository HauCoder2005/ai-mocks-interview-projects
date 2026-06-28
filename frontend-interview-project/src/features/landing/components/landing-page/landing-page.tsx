import { FeatureSection } from "@/features/landing/components/feature-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { PricingSection } from "@/features/landing/components/pricing-section";
import styles from "./landing-page.module.css";

export function LandingPage() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <FeatureSection />
      <PricingSection />
    </div>
  );
}
