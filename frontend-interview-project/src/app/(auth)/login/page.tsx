import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-950">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to continue your interview practice.</p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
