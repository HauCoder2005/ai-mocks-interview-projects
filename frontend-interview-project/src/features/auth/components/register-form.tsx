"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/lib/constants/app-routes";
import { useAuth } from "@/features/auth/hooks/use-auth";

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
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Full name
        </label>
        <Input
          autoComplete="name"
          id="name"
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <Input
          autoComplete="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
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
          autoComplete="new-password"
          id="password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      {registerError ? <p className="text-sm text-red-600">{registerError.message}</p> : null}
      <Button disabled={registerStatus === "pending"} type="submit">
        {registerStatus === "pending" ? "Creating account..." : "Create account"}
      </Button>
      <Button
        className="w-full"
        onClick={() => router.push(appRoutes.login)}
        type="button"
        variant="secondary"
      >
        Back to login
      </Button>
    </form>
  );
}
