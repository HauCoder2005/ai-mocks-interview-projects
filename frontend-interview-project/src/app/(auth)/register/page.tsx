import { RegisterForm } from "@/features/auth/components/register-form";
import type { Metadata } from "next";
import Link from "next/link";

/*
 * Đây là page route thật của Next.js cho màn hình đăng ký.
 *
 * URL thật:
 * /register
 *
 * Hiện tại trang này chỉ là giao diện tạm thời
 * để tránh lỗi module not found trong quá trình làm login trước.
 *
 * Sau này khi làm đăng ký thật, file này sẽ render:
 *
 * <RegisterForm />
 *
 * Component RegisterForm sẽ nằm ở:
 *
 * src/features/auth/components/register-form
 */
export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <RegisterForm />;
}