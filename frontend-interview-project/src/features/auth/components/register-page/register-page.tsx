import { RegisterForm } from "@/features/auth/components/register-form";

import styles from "./register-page.module.css";

export function RegisterPage() {
  return (
    <div>
      <h1 className={styles.title}>Create account</h1>
      <p className={styles.description}>Set up your candidate workspace.</p>
      <div className={styles.formWrapper}>
        <RegisterForm />
      </div>
    </div>
  );
}
