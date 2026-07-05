"use client";

import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/*
 * AppProviders là nơi gom các provider dùng chung toàn frontend.
 *
 * ThemeProvider:
 * - Quản lý theme giao diện.
 *
 * QueryProvider:
 * - Quản lý React Query nếu dự án dùng query/mutation.
 *
 * GoogleOAuthProvider:
 * - Cung cấp Google OAuth context cho toàn app.
 * - Nhờ provider này, LoginForm có thể dùng đăng nhập Google.
 *
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID:
 * - Là Google Client ID dùng phía frontend.
 * - Biến này được phép public vì client id không phải secret.
 *
 * Lưu ý:
 * - Không bao giờ đưa GOOGLE_CLIENT_SECRET lên frontend.
 */
export function AppProviders({ children }: AppProvidersProps) {
  if (!googleClientId) {
    throw new Error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}