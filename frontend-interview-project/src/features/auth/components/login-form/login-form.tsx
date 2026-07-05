"use client";

import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useLoginForm } from "@/features/auth/hooks";

import "./login-form.module.css";
import { GoogleIcon } from "@/components/ui/google-icon/google-icon";

/*
 * LoginForm là component giao diện cho chức năng đăng nhập.
 *
 * GoogleIcon:
 * - Chỉ dùng để hiển thị icon G đẹp.
 *
 * GoogleLogin:
 * - Vẫn là nút thật của Google.
 * - Được đặt phủ lên icon G nhưng ẩn đi bằng CSS.
 * - Khi user bấm vào icon G, thực chất là bấm vào GoogleLogin.
 */
export function LoginForm() {
  const {
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
  } = useLoginForm();

  return (
    <section className="login-card">
      <div className="login-header">
        <p className="login-eyebrow">Welcome back</p>

        <h2 className="login-title">Đăng nhập</h2>

        <p className="login-description">
          Nhập email và mật khẩu để tiếp tục sử dụng hệ thống.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-field">
          <span>Email</span>

          <input
            className="login-input"
            type="email"
            placeholder="candidate@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="login-field">
          <span>Mật khẩu</span>

          <input
            className="login-input"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

        <button
          className="login-submit-button"
          type="submit"
          disabled={isSubmitting || isGoogleSubmitting}
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="login-footer-text">
        Chưa có tài khoản?{" "}
        <Link className="login-link" href="/register">
          Đăng ký
        </Link>
      </p>

      <div className="login-google-compact">
        <span className="login-google-label">Hoặc đăng nhập với Google</span>

        <div className="login-google-action">
          <div className="login-google-visible">
            <GoogleIcon />
          </div>

          <div className="login-google-click-layer">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              type="icon"
              shape="circle"
              theme="outline"
              size="large"
            />
          </div>
        </div>

        {isGoogleSubmitting ? (
          <p className="login-google-loading">Đang xử lý Google...</p>
        ) : null}
      </div>
    </section>
  );
}