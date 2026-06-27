import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-950">Create account</h1>
      <p className="mt-2 text-sm text-slate-600">Set up your candidate workspace.</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}
