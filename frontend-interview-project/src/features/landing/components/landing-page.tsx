import { BenefitsSection } from "./benefits-section";
import { ExamCardSection } from "./exam-card-section";
import { HowItWorksSection } from "./how-it-works-section";
import { InterviewCategorySection } from "./interview-category-section";
import { InterviewFlowSection } from "./interview-flow-section";
import { LandingCtaSection } from "./landing-cta-section";
import { LandingHero } from "./landing-hero";
import { QuickInterviewFilter } from "./quick-interview-filter";
import { RecentSessionsSection } from "./recent-sessions-section";
import styles from "./landing.module.css";

export function LandingPage() {
  return (
    <div className={styles.page}>
      <LandingHero />
      <QuickInterviewFilter />
      <ExamCardSection />
      <InterviewCategorySection />
      <InterviewFlowSection />
      <HowItWorksSection />
      <BenefitsSection />
      <RecentSessionsSection />
      <LandingCtaSection />
    </div>
  );
}
