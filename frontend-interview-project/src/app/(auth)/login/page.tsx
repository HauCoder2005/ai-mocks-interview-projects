"use client";

import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import AuthCard from "@/src/components/auth/AuthCard";
import AuthTextField from "@/src/components/auth/AuthTextField";
import GoogleAuthButton from "@/src/components/auth/GoogleAuthButton";
import { getAuthErrorMessage } from "@/src/components/auth/auth-error.util";
import styles from "@/src/components/auth/Auth.module.css";
import { useLoginMutation } from "@/src/hooks/queries/useAuth";
import { isValidEmail, isValidPassword } from "@/src/utils/validators";

type LoginFormState = {
  email: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormState | "submit", string>>;

/**
 * Renders the login page and connects validated credentials to the login mutation.
 *
 * @returns A Vietnamese login form with shared authentication layout and controls.
 */
export default function LoginPage() {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const loginMutation = useLoginMutation();

  const validateForm = (): LoginFormErrors => {
    const nextErrors: LoginFormErrors = {};

    if (!isValidEmail(form.email)) {
      nextErrors.email = "Email không hợp lệ.";
    }

    if (!isValidPassword(form.password)) {
      nextErrors.password = "Mật khẩu phải có tối thiểu 6 ký tự.";
    }

    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
      submit: undefined,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: form.email.trim(),
        password: form.password,
      });
    } catch (error) {
      setErrors({
        submit: getAuthErrorMessage(
          error,
          "Không thể đăng nhập. Vui lòng thử lại.",
        ),
      });
    }
  };

  return (
    <AuthCard
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại với Codeser Interview."
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <AuthTextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail size={20} strokeWidth={2.2} />}
        />

        <AuthTextField
          label="Mật khẩu"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock size={20} strokeWidth={2.2} />}
        />

        <div className={styles.rowBetween}>
          <Link href="/forgot-password" className={styles.helperLink}>
            Quên mật khẩu?
          </Link>
        </div>

        {errors.submit ? (
          <p className={styles.submitError}>{errors.submit}</p>
        ) : null}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className={styles.divider}>hoặc</div>

        <GoogleAuthButton>Đăng nhập bằng Google</GoogleAuthButton>

        <p className={styles.footerText}>
          Bạn chưa có tài khoản?{" "}
          <Link href="/register" className={styles.footerLink}>
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
