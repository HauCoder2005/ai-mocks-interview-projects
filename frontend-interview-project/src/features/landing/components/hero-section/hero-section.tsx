import Link from "next/link";

import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            AI Mock Interview Platform
          </p>
          <h1 className={styles.title}>
            Practice interviews with structured AI guidance.
          </h1>
          <p className={styles.description}>
            Configure interview scenarios, manage question banks, and help candidates prepare for
            real technical conversations.
          </p>
          <div className={styles.actions}>
            <Link
              className={styles.primaryAction}
              href={appRoutes.register}
            >
              Start practicing
            </Link>
            <Link
              className={styles.secondaryAction}
              href={appRoutes.login}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
