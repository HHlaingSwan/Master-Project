import nodemailer from "nodemailer";
import { generateResetPasswordEmail } from "./EmailTamplete.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.MAILTRAP_PORT || 2525,
    auth: {
      user: process.env.MAILTRAP_USER || "3120332020001",
      pass: process.env.MAILTRAP_PASS || "3120332020001",
    },
  });
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const htmlContent = generateResetPasswordEmail(resetLink);

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: '"Tech Company" <noreply@techcompany.com>',
      to: email,
      subject: "Password Reset Request",
      html: htmlContent,
    });

    console.log("Password reset email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: '"Tech Company" <noreply@techcompany.com>',
      to: email,
      subject: "Welcome to Tech Company!",
      html: `
        <!DOCTYPE html>
        <html>
        <head><title>Welcome</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Welcome ${name}!</h1>
          <p>Thanks for joining us.</p>
        </body>
        </html>
      `,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
