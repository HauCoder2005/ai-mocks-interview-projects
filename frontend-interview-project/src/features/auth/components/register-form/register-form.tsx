"use client";

import Link from "next/link";

import { useRegisterForm } from "@/features/auth/hooks";

import "./register-form.module.css";

/*
 * RegisterForm là giao diện đăng ký.
 *
 * Điểm đặc biệt:
 * - Form đăng ký vẫn hiển thị bình thường.
 * - Sau khi đăng ký thành công, ô nhập OTP sẽ xổ ra ngay bên dưới.
 * - Nút xác minh OTP nằm bên cạnh ô OTP.
 */
export function RegisterForm() {
  const {
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
  } = useRegisterForm();

  return (
    <section className="register-card">
      <div className="register-header">
        <p className="register-eyebrow">Create account</p>

        <h2 className="register-title">Đăng ký</h2>

        <p className="register-description">
          Tạo tài khoản để bắt đầu luyện phỏng vấn cùng AI.
        </p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-grid">
          <label className="register-field">
            <span>Tên</span>

            <input
              className="register-input"
              type="text"
              placeholder="Hậu"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>

          <label className="register-field">
            <span>Họ</span>

            <input
              className="register-input"
              type="text"
              placeholder="Huỳnh"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
        </div>

        <label className="register-field">
          <span>Email</span>

          <input
            className="register-input"
            type="email"
            placeholder="candidate@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="register-field">
          <span>Số điện thoại</span>

          <input
            className="register-input"
            type="tel"
            placeholder="0901234567"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </label>

        <label className="register-field">
          <span>Mật khẩu</span>

          <input
            className="register-input"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <label className="register-field">
          <span>Nhập lại mật khẩu</span>

          <input
            className="register-input"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>

        <button
          className="register-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {isOtpVisible ? (
          <div className="register-otp-box">
            <label className="register-field">
              <span>Mã OTP</span>

              <div className="register-otp-row">
                <input
                  className="register-input register-otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                />

                <button
                  className="register-otp-button"
                  type="button"
                  disabled={isVerifyingOtp}
                  onClick={handleVerifyOtpClick}
                  aria-label="Xác minh OTP"
                >
                  <span aria-hidden="true">✓</span>
                </button>
              </div>
            </label>
          </div>
        ) : null}

        {errorMessage ? <p className="register-error">{errorMessage}</p> : null}

        {successMessage ? (
          <p className="register-success">{successMessage}</p>
        ) : null}
      </form>

      <p className="register-footer-text">
        Đã có tài khoản?{" "}
        <Link className="register-link" href="/login">
          Đăng nhập
        </Link>
      </p>
    </section>
  );
}
