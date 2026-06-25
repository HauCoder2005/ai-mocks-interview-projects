export const renderOtpEmailTemplate = (
  otpCode: string,
  logoUrl: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Xác thực tài khoản</title>
      </head>

      <body style="margin: 0; padding: 0; background-color: #f4f8fc; font-family: Arial, Helvetica, sans-serif; color: #0f172a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f8fc; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border: 1px solid #dbeafe; border-radius: 4px; overflow: hidden;">
                <tr>
                  <td align="center" style="padding: 36px 40px 20px 40px;">
                    <img
                      src="${logoUrl}"
                      alt="AI Mock Interview"
                      width="72"
                      height="72"
                      style="display: block; object-fit: contain; margin: 0 auto 18px auto;"
                    />

                    <h1 style="margin: 0; font-size: 24px; line-height: 32px; font-weight: 700; color: #0f172a;">
                      Xác thực tài khoản
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 8px 40px 0 40px;">
                    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #334155;">
                      Xin chào,
                    </p>

                    <p style="margin: 0; font-size: 15px; line-height: 24px; color: #334155;">
                      Bạn vừa yêu cầu mã OTP để xác thực tài khoản AI Mock Interview.
                      Vui lòng sử dụng mã bên dưới để hoàn tất quá trình xác thực.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 28px 40px 24px 40px;">
                    <div style="background-color: #f8fbff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 22px 16px; text-align: center;">
                      <span style="font-size: 34px; line-height: 42px; font-weight: 700; letter-spacing: 10px; color: #2563eb;">
                        ${otpCode}
                      </span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 0 40px 34px 40px;">
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #64748b;">
                      Mã này sẽ hết hạn trong
                      <strong style="color: #0f172a;">5 phút</strong>.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 40px 30px 40px;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 20px; color: #475569;">
                      <strong>Cảnh báo bảo mật:</strong>
                      Tuyệt đối không chia sẻ mã này với bất kỳ ai, kể cả nhân viên của chúng tôi.
                      Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.
                    </p>

                    <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 20px; color: #64748b;">
                      © 2026 AI Mock Interview. Mọi quyền được bảo lưu.
                    </p>

                    <p style="margin: 0; font-size: 13px; line-height: 20px;">
                      <a href="#" style="color: #2563eb; text-decoration: none;">Trung tâm hỗ trợ</a>
                      <span style="color: #94a3b8;"> · </span>
                      <a href="#" style="color: #2563eb; text-decoration: none;">Chính sách bảo mật</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
