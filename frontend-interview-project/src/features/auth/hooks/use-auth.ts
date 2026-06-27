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
    onSuccess: ({ accessToken, user }) => {
      authStore.setSession(accessToken, user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ accessToken, user }) => {
      authStore.setSession(accessToken, user);
    },
  });

  return {
    ...authState,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation.status,
    registerError: registerMutation.error,
    logout: authStore.clearSession,
  };
}
