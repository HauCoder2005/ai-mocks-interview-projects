"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { LoadingState } from "@/components/common/loading-state";
import { appRoutes } from "@/lib/constants/app-routes";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";

type AdminAuthGuardProps = {
  children: ReactNode;
};

function getErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;

    return typeof status === "number" ? status : undefined;
  }

  return undefined;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const { error, isAdmin, isAuthenticated, isLoading } = useAuthSession();
  const errorStatus = getErrorStatus(error);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || errorStatus === 401) {
      router.replace(appRoutes.login);
      return;
    }

    if (!isAdmin || errorStatus === 403) {
      router.replace(appRoutes.userDashboard);
    }
  }, [errorStatus, isAdmin, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <LoadingState
        description="Checking your admin session."
        title="Loading admin workspace"
      />
    );
  }

  return children;
}
