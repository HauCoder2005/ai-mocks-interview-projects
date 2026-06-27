import Link from "next/link";

import { appRoutes } from "@/lib/constants/app-routes";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.description}>The page you requested does not exist.</p>
        <Link className={styles.link} href={appRoutes.home}>
          Back home
        </Link>
      </div>
    </main>
  );
}
