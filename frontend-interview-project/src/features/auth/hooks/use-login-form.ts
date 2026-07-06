"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CredentialResponse } from "@react-oauth/google";

import { authService } from "@/lib/api/services/auth";
import { saveAuthSession } from "@/lib/auth/auth-session";
import { getRedirectPathByRole } from "@/lib/auth/role-redirect";

export function useLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const completeLogin = (
    responseData: Awaited<ReturnType<typeof authService.login>>["data"],
  ) => {
    saveAuthSession(responseData);
    router.replace(getRedirectPathByRole(responseData.user.roleId));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập email.");
      return;
    }

    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      completeLogin(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Đăng nhập thất bại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setErrorMessage("");

    const idToken = credentialResponse.credential;

    if (!idToken) {
      setErrorMessage("Không nhận được Google ID Token.");
      return;
    }

    setIsGoogleSubmitting(true);

    try {
      const response = await authService.googleLogin({ idToken });
      completeLogin(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Đăng nhập Google thất bại.",
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleGoogleLoginError = () => {
    setErrorMessage("Không thể đăng nhập bằng Google.");
  };

  return {
    email,
    password,
    errorMessage,
    isSubmitting,
    isGoogleSubmitting,
    setEmail,
    setPassword,
    handleSubmit,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  };
}
