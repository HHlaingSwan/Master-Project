export const EmailTemplate = (body) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 50px 20px;">
                <table role="presentation" style="max-width: 560px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px 40px; text-align: center;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                            <svg style="width: 40px; height: 40px;" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Reset Your Password</h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 45px 40px 35px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0; color: #333333; font-size: 17px; font-weight: 600;">Hello there,</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 30px;">
                                        <p style="margin: 0; color: #555555; font-size: 16px; line-height: 1.8;">
                                            We received a request to reset your password. No worries! Click the button below to create a new secure password for your account.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 25px 0 40px;">
                                        <a href="{resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 50px; font-size: 17px; font-weight: 600; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 30px;">
                                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 22px; border-left: 4px solid #667eea;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding-bottom: 8px;">
                                                        <p style="margin: 0; color: #333333; font-size: 14px; font-weight: 600;">
                                                            <span style="color: #667eea;">💡</span> Security Reminder
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                                            If you didn't request this password reset, please ignore this email safely or contact our support team if something feels wrong.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-radius: 10px; padding: 15px; text-align: center;">
                                            <tr>
                                                <td>
                                                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                                                        <strong>⏱️</strong> This reset link will expire in <strong>1 hour</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8fafc; padding: 35px 40px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                                            Need assistance? <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Contact our Support Team</a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: #cbd5e1; font-size: 12px;">
                                            © 2024 Your Company. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table role="presentation" style="max-width: 560px; width: 100%; border-collapse: collapse; margin-top: 25px;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                You're receiving this email because a password reset was requested for your account.
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

export const generateResetPasswordEmail = (resetLink) => {
  const resetLinkTemplate = resetLink || "{resetLink}";
  return EmailTemplate(`
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding-bottom: 30px; text-align: center;">
                <div style="width: 90px; height: 90px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 24px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 15px 35px rgba(102, 126, 234, 0.35);">
                    <svg style="width: 45px; height: 45px;" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 30px; text-align: center;">
                <h2 style="margin: 0; color: #1e293b; font-size: 30px; font-weight: 700;">Password Reset</h2>
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 25px;">
                <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.8; text-align: center;">
                    We received a request to reset your password. No worries, we've got you covered! Click the button below to create a new password:
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 35px 0 40px; text-align: center;">
                <a href="${resetLinkTemplate}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 20px 55px; border-radius: 50px; font-size: 18px; font-weight: 600; box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);">
                    Reset Password Now
                </a>
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 22px; text-align: center; border: 1px solid #fbbf24;">
                    <p style="margin: 0; color: #92400e; font-size: 15px;">
                        <strong>⏰</strong> This link will expire in <strong>1 hour</strong> for your security
                    </p>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 20px;">
                <div style="background: #f1f5f9; border-radius: 10px; padding: 18px; text-align: center;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">
                        🛡️ Didn't request this? Simply ignore this email - your password is safe!
                    </p>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center;">
                    Need help? Reply to this email or contact <a href="#" style="color: #667eea; text-decoration: none;">support@yourcompany.com</a>
                </p>
            </td>
        </tr>
    </table>
  `);
};
