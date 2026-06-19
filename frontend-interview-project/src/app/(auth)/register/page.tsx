"use client";

import { KeyRound, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AuthCard from "@/src/components/auth/AuthCard";
import AuthTextField from "@/src/components/auth/AuthTextField";
import GoogleAuthButton from "@/src/components/auth/GoogleAuthButton";
import { getAuthErrorMessage } from "@/src/components/auth/auth-error.util";
import styles from "@/src/components/auth/Auth.module.css";
import {
  useRegisterMutation,
  useVerifyEmailMutation,
} from "@/src/hooks/queries/useAuth";
import { isValidEmail, isValidPassword } from "@/src/utils/validators";

type RegisterFormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

type RegisterFormErrors = Partial<
  Record<keyof RegisterFormState | "submit", string>
>;

/**
 * Renders the inline-expanding registration page, submits user details to request an OTP,
 * reveals the OTP input in the same form after successful registration, verifies the account,
 * and redirects verified users to the login page.
 *
 * @returns A Vietnamese registration form with inline OTP verification.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [form, setForm] = useState<RegisterFormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const registerMutation = useRegisterMutation();
  const verifyEmailMutation = useVerifyEmailMutation();

  const validateRegisterForm = (): RegisterFormErrors => {
    const nextErrors: RegisterFormErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ tên.";
    }

    if (!isValidEmail(form.email)) {
      nextErrors.email = "Email không hợp lệ.";
    }

    if (!isValidPassword(form.password)) {
      nextErrors.password = "Mật khẩu phải có tối thiểu 6 ký tự.";
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    return nextErrors;
  };

  const validateOtpForm = (): RegisterFormErrors => {
    const nextErrors: RegisterFormErrors = {};

    if (!form.otp.trim()) {
      nextErrors.otp = "Vui lòng nhập mã OTP.";
    }

    if (!isValidEmail(form.email)) {
      nextErrors.email = "Email không hợp lệ.";
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

  const handleRegisterSubmit = async () => {
    const validationErrors = validateRegisterForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setErrors({});
      setIsOtpSent(true);
    } catch (error) {
      setErrors({
        submit: getAuthErrorMessage(
          error,
          "Không thể đăng ký. Vui lòng thử lại.",
        ),
      });
    }
  };

  const handleOtpSubmit = async () => {
    const validationErrors = validateOtpForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync({
        email: form.email.trim(),
        otp: form.otp.trim(),
      });
      router.push("/login");
    } catch (error) {
      setErrors({
        submit: getAuthErrorMessage(
          error,
          "Không thể xác minh email. Vui lòng thử lại.",
        ),
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isOtpSent) {
      await handleOtpSubmit();
      return;
    }

    await handleRegisterSubmit();
  };

  const handleEditInformation = () => {
    setErrors({});
    setIsOtpSent(false);
    setForm((currentForm) => ({
      ...currentForm,
      otp: "",
    }));
  };

  const isSubmitting = registerMutation.isPending || verifyEmailMutation.isPending;
  const isIdentityLocked = isOtpSent || isSubmitting;

  return (
    <AuthCard
      title="Tạo tài khoản"
      subtitle={
        isOtpSent
          ? "Nhập mã OTP đã được gửi đến email của bạn để hoàn tất đăng ký."
          : "Bắt đầu luyện phỏng vấn và tối ưu hồ sơ ứng tuyển của bạn."
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <AuthTextField
          label="Họ tên"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Nguyễn Văn An"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
          disabled={isIdentityLocked}
          icon={<User size={20} strokeWidth={2.2} />}
        />

        <AuthTextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isIdentityLocked}
          icon={<Mail size={20} strokeWidth={2.2} />}
        />

        <AuthTextField
          label="Mật khẩu"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Tối thiểu 6 ký tự"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isIdentityLocked}
          icon={<Lock size={20} strokeWidth={2.2} />}
        />

        <AuthTextField
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isIdentityLocked}
          icon={<Lock size={20} strokeWidth={2.2} />}
        />

        {isOtpSent ? (
          <AuthTextField
            label="Mã OTP"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Nhập mã OTP"
            value={form.otp}
            onChange={handleChange}
            error={errors.otp}
            disabled={verifyEmailMutation.isPending}
            icon={<KeyRound size={20} strokeWidth={2.2} />}
          />
        ) : null}

        {errors.submit ? (
          <p className={styles.submitError}>{errors.submit}</p>
        ) : null}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Đang xử lý..."
            : isOtpSent
              ? "Xác thực tài khoản"
              : "Đăng ký"}
        </button>

        {isOtpSent ? (
          <p className={styles.footerText}>
            Cần thay đổi email?{" "}
            <button
              type="button"
              className={styles.footerLink}
              onClick={handleEditInformation}
              disabled={verifyEmailMutation.isPending}
            >
              Quay lại sửa thông tin
            </button>
          </p>
        ) : (
          <>
            <div className={styles.divider}>hoặc</div>

            <GoogleAuthButton>Đăng ký bằng Google</GoogleAuthButton>

            <p className={styles.footerText}>
              Đã có tài khoản?{" "}
              <Link href="/login" className={styles.footerLink}>
                Đăng nhập
              </Link>
            </p>
          </>
        )}
      </form>
    </AuthCard>
  );
}
