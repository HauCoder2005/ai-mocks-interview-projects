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
import styles from "./register-form.module.css";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    registerError,
    registerStatus,
    resendOtp,
    resendOtpError,
    resendOtpStatus,
    verifyAccount,
    verifyAccountError,
    verifyAccountStatus,
  } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResendMessage("");
    setSuccessMessage("");

    try {
      await register({ email, name, password });
      setRegisteredEmail(email);
      setSuccessMessage("Mã OTP đã được gửi đến email của bạn.");
    } catch {
      // React Query exposes the backend error through registerError.
    }
  }

  async function handleVerifyOtp() {
    setSuccessMessage("");
    setResendMessage("");

    try {
      const session = await verifyAccount({ email: registeredEmail, otp });

      if (session.authenticated || session.user) {
        router.push(
          getPostLoginRedirect(session.user?.role, session.user?.roleId),
        );
        return;
      }

      setSuccessMessage("Tài khoản đã xác thực, bạn có thể đăng nhập.");
    } catch {
      // React Query exposes the backend error through verifyAccountError.
    }
  }

  async function handleResendOtp() {
    setSuccessMessage("");
    setResendMessage("");

    try {
      await resendOtp({ email: registeredEmail });
      setResendMessage("Mã OTP mới đã được gửi đến email của bạn.");
    } catch {
      // React Query exposes the backend error through resendOtpError.
    }
  }

  return (
    <div className={styles.form}>
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
        <Button
          fullWidth
          isLoading={registerStatus === "pending"}
          type="submit"
        >
          Create account
        </Button>
      </form>

      {registeredEmail ? (
        <section className={styles.otpSection}>
          <div>
            <h2 className={styles.otpTitle}>Verify your account</h2>
            <p className={styles.otpDescription}>
              Mã OTP đã được gửi đến email của bạn.
            </p>
          </div>
          <div className={styles.fieldGroup}>
            <Label htmlFor="otp">OTP</Label>
            <Input
              autoComplete="one-time-code"
              id="otp"
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter OTP"
              value={otp}
            />
          </div>
          <FieldError
            message={verifyAccountError?.message || resendOtpError?.message}
          />
          {successMessage ? (
            <p className={styles.successMessage}>{successMessage}</p>
          ) : null}
          {resendMessage ? (
            <p className={styles.successMessage}>{resendMessage}</p>
          ) : null}
          <div className={styles.otpActions}>
            <Button
              fullWidth
              isLoading={verifyAccountStatus === "pending"}
              onClick={handleVerifyOtp}
              type="button"
            >
              Xác thực tài khoản
            </Button>
            <Button
              fullWidth
              isLoading={resendOtpStatus === "pending"}
              onClick={handleResendOtp}
              type="button"
              variant="secondary"
            >
              Gửi lại OTP
            </Button>
          </div>
        </section>
      ) : null}

      <Button
        fullWidth
        onClick={() => router.push(appRoutes.login)}
        type="button"
        variant="secondary"
      >
        Back to login
      </Button>
    </div>
  );
}
