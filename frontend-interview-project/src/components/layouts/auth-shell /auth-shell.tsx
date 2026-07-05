 import type { ReactNode } from "react";

import "./auth-shell.module.css";

/*
 * AuthShell là layout dùng chung cho các trang authentication.
 *
 * Layout này chỉ dựng khung giao diện:
 * - Bên trái: logo + nội dung giới thiệu.
 * - Bên phải: form login/register.
 *
 * Phần chữ animation chỉ chạy ở dòng ngắn,
 * không chạy cả câu dài để tránh bị xuống nhiều dòng xấu.
 */
interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="auth-shell">
      <section className="auth-shell-left">
        <div className="auth-brand">
          <div className="auth-logo-frame">
            <img
              className="auth-logo-image"
              src="/images/logo-nobackground.png"
              alt="AI Mock Interview logo"
            />
          </div>
        </div>

        <div className="auth-hero">
          <p className="auth-hero-kicker">AI Mock Interview</p>

          <h1 className="auth-hero-title">
            Luyện phỏng vấn nhanh,
            <br />
            thông minh hơn cùng AI
          </h1>

          <div className="auth-typewriter-line">
            <span className="auth-typewriter-text">Cùng AI Interview</span>
          </div>

          <p className="auth-hero-description">
            Chuẩn bị câu trả lời, luyện tập kỹ năng phỏng vấn cùng AI và theo
            dõi tiến độ của bạn một cách rõ ràng.
          </p>
        </div>
      </section>

      <section className="auth-shell-right">{children}</section>
    </main>
  );
}