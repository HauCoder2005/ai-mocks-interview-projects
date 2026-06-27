"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPostLoginRedirect } from "@/lib/auth/auth-redirect";
import { appRoutes } from "@/lib/constants/app-routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import styles from "./login-form.module.css";

export function LoginForm() {
  const router = useRouter();
  const { login, loginError, loginStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = await login({ email, password });
    router.push(getPostLoginRedirect(session.user.role));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <Label htmlFor="email">Email</Label>
        <Input
          autoComplete="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>
      <div className={styles.fieldGroup}>
        <Label htmlFor="password">Password</Label>
        <Input
          autoComplete="current-password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <FieldError message={loginError?.message} />
      <Button fullWidth isLoading={loginStatus === "pending"} type="submit">
        Sign in
      </Button>
      <Button
        fullWidth
        onClick={() => router.push(appRoutes.register)}
        type="button"
        variant="secondary"
      >
        Create account
      </Button>
    </form>
  );
}
