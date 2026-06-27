"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appRoutes } from "@/lib/constants/app-routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import styles from "./register-form.module.css";

export function RegisterForm() {
  const router = useRouter();
  const { register, registerError, registerStatus } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await register({ email, name, password });
    router.push(appRoutes.userDashboard);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <Label htmlFor="name">Full name</Label>
        <Input
          autoComplete="name"
          id="name"
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
      </div>
      <div className={styles.fieldGroup}>
        <Label htmlFor="email">Email</Label>
        <Input
          autoComplete="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div className={styles.fieldGroup}>
        <Label htmlFor="password">Password</Label>
        <Input
          autoComplete="new-password"
          id="password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <FieldError message={registerError?.message} />
      <Button fullWidth isLoading={registerStatus === "pending"} type="submit">
        Create account
      </Button>
      <Button
        fullWidth
        onClick={() => router.push(appRoutes.login)}
        type="button"
        variant="secondary"
      >
        Back to login
      </Button>
    </form>
  );
}
