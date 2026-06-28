"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { authStore } from "@/features/auth/stores/auth.store";

export function useAuth() {
  const authState = authStore.useAuthState();

  useEffect(() => {
    authStore.hydrateFromStorage();
  }, []);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user }) => {
      authStore.setUser(user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
  });

  const verifyAccountMutation = useMutation({
    mutationFn: authApi.verifyAccount,
    onSuccess: ({ user }) => {
      authStore.setUser(user);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: authApi.resendOtp,
  });

  return {
    ...authState,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation.status,
    registerError: registerMutation.error,
    verifyAccount: verifyAccountMutation.mutateAsync,
    verifyAccountStatus: verifyAccountMutation.status,
    verifyAccountError: verifyAccountMutation.error,
    resendOtp: resendOtpMutation.mutateAsync,
    resendOtpStatus: resendOtpMutation.status,
    resendOtpError: resendOtpMutation.error,
    logout: authStore.clearSession,
  };
}
