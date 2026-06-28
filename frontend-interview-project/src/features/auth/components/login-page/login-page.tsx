import { LoginForm } from "@/features/auth/components/login-form";

import styles from "./login-page.module.css";

export function LoginPage() {
  return (
    <div>
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.description}>Sign in to continue your interview practice.</p>
      <div className={styles.formWrapper}>
        <LoginForm />
      </div>
    </div>
  );
}
