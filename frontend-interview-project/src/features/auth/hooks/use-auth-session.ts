"use client";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";

function isAdminRole(role?: string, roleId?: number, role_id?: number) {
  return role?.toUpperCase() === "ADMIN" || roleId === 2 || role_id === 2;
}

export function useAuthSession() {
  const query = useQuery({
    queryKey: ["auth", "session"],
    queryFn: authApi.getSession,
    retry: false,
  });

  const user = query.data?.user;
  const isAuthenticated = Boolean(user);
  const isAdmin = isAdminRole(user?.role, user?.roleId, user?.role_id);

  return {
    user,
    isLoading: query.isLoading,
    isAuthenticated,
    isAdmin,
    error: query.error,
    refetch: query.refetch,
  };
}
