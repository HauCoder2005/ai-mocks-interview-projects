"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPostLoginRedirect } from "@/lib/auth/auth-redirect";
import { appRoutes } from "@/lib/constants/app-routes";
import { useAuth } from "@/features/auth/hooks/use-auth";

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
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
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
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <Input
          autoComplete="current-password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      {loginError ? <p className="text-sm text-red-600">{loginError.message}</p> : null}
      <Button disabled={loginStatus === "pending"} type="submit">
        {loginStatus === "pending" ? "Signing in..." : "Sign in"}
      </Button>
      <Button
        className="w-full"
        onClick={() => router.push(appRoutes.register)}
        type="button"
        variant="secondary"
      >
        Create account
      </Button>
    </form>
  );
}
