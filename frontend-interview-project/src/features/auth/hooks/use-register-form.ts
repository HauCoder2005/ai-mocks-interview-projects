"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/api/services/auth";

/*
 * useRegisterForm xử lý logic đăng ký và xác minh OTP ngay trên cùng màn hình.
 *
 * Flow:
 * 1. User nhập thông tin đăng ký.
 * 2. Bấm Đăng ký.
 * 3. Gọi API /auth/register.
 * 4. Nếu backend gửi OTP thành công thì hiện ô nhập OTP bên dưới form.
 * 5. User nhập OTP.
 * 6. Bấm nút xác minh OTP.
 * 7. Gọi API /auth/verify-account.
 * 8. Xác minh thành công thì chuyển về /login.
 */
export function useRegisterForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpCode, setOtpCode] = useState("");

  /*
   * isOtpVisible dùng để điều khiển việc hiển thị ô nhập OTP.
   *
   * false:
   * - chưa đăng ký thành công
   * - chưa hiện ô OTP
   *
   * true:
   * - đăng ký thành công
   * - hiện ô OTP bên dưới form đăng ký
   */
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  /*
   * Validate dữ liệu đăng ký cơ bản ở frontend.
   *
   * Backend vẫn là nơi validate chính.
   * Frontend chỉ kiểm tra nhanh để user không gửi form rỗng.
   */
  const validateRegisterForm = (): boolean => {
    if (!firstName.trim()) {
      setErrorMessage("Vui lòng nhập tên.");
      return false;
    }

    if (!lastName.trim()) {
      setErrorMessage("Vui lòng nhập họ.");
      return false;
    }

    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập email.");
      return false;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage("Vui lòng nhập số điện thoại.");
      return false;
    }

    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu.");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu nhập lại không khớp.");
      return false;
    }

    return true;
  };

  /*
   * handleSubmit chỉ xử lý đăng ký.
   *
   * Sau khi đăng ký thành công:
   * - Không chuyển trang.
   * - Hiện ô nhập OTP.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateRegisterForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password,
        phoneNumber: phoneNumber.trim(),
      });

      setEmail(normalizedEmail);
      setIsOtpVisible(true);
      setSuccessMessage("Đăng ký thành công. Vui lòng nhập mã OTP.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Đăng ký thất bại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * handleVerifyOtpClick xử lý nút xác minh OTP.
   *
   * Hàm này không submit lại form đăng ký.
   * Nó chỉ gọi API /auth/verify-account.
   */
  const handleVerifyOtpClick = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập email.");
      return;
    }

    if (!otpCode.trim()) {
      setErrorMessage("Vui lòng nhập mã OTP.");
      return;
    }

    if (otpCode.trim().length !== 6) {
      setErrorMessage("Mã OTP phải gồm 6 chữ số.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      await authService.verifyAccount({
        email: email.trim().toLowerCase(),
        otpCode: otpCode.trim(),
      });

      setSuccessMessage("Xác minh tài khoản thành công.");

      setTimeout(() => {
        router.replace("/login");
      }, 800);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Xác minh OTP thất bại.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
    otpCode,

    isOtpVisible,
    errorMessage,
    successMessage,
    isSubmitting,
    isVerifyingOtp,

    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    setPassword,
    setConfirmPassword,
    setOtpCode,

    handleSubmit,
    handleVerifyOtpClick,
  };
}