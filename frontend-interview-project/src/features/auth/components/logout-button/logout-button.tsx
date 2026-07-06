"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authService } from "@/lib/api/services/auth";
import { clearAuthSession } from "@/lib/auth/auth-storage";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch {
      // Nếu backend chưa có API logout, frontend vẫn phải xóa session cục bộ.
    } finally {
      clearAuthSession();
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <button className={className} disabled={isLoggingOut} onClick={handleLogout} type="button">
      <LogOut size={16} />
      {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
