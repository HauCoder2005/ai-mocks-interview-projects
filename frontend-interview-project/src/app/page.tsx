import FeaturesSection from "@/src/components/home/FeaturesSection";
import HeroSection from "@/src/components/home/HeroSection";
import TopInterviewsSection from "@/src/components/home/TopInterviewsSection";

import styles from "./page.module.css";

/**
 * Orchestrates the public landing page from focused presentation sections.
 *
 * @returns The home page route composed from single-purpose sections.
 */
export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <HeroSection />
        <FeaturesSection />
        <TopInterviewsSection />
      </div>
    </div>
  );
}
