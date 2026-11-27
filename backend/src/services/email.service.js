const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const BRAND = {
  name: "NigerToday",
  accent: "#5b45e0",
  accentDark: "#4a36c4",
  ink: "#172033",
  muted: "#64748b",
  background: "#f4f5fb",
};

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env",
      ),
    );
}

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const renderMessage = (message = "") =>
  String(message)
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;color:${BRAND.muted};font-size:15px;line-height:1.7;">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

const createEmailTemplate = ({
  preheader,
  eyebrow,
  title,
  greeting,
  content,
  code,
  button,
  notice,
}) => {
  const buttonMarkup = button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;"><tr><td align="center" bgcolor="${BRAND.accent}" style="border-radius:12px;"><a href="${escapeHtml(button.url)}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">${escapeHtml(button.label)}</a></td></tr></table>`
    : "";
  const codeMarkup = code
    ? `<div style="margin:26px 0;padding:20px;border:1px dashed #c7c2f5;border-radius:14px;background:#f7f6ff;text-align:center;"><span style="color:${BRAND.accentDark};font-size:32px;font-weight:800;letter-spacing:8px;">${escapeHtml(code)}</span></div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)} - ${BRAND.name}</title>
  </head>
  <body style="margin:0;padding:32px 12px;background:${BRAND.background};font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader || title)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
      <tr>
        <td style="padding:0 0 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.ink};border-radius:18px 18px 0 0;">
            <tr>
              <td style="padding:22px 28px;">
                <span style="display:inline-block;width:34px;height:34px;line-height:34px;border-radius:10px;background:${BRAND.accent};color:#ffffff;text-align:center;font-size:20px;font-weight:800;vertical-align:middle;">N</span>
                <span style="padding-left:10px;color:#ffffff;font-size:20px;font-weight:700;vertical-align:middle;">${BRAND.name}</span>
                <span style="display:block;padding:7px 0 0 46px;color:#cbd5e1;font-size:12px;">Customer subscriptions, made simple</span>
              </td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:0 0 18px 18px;">
            <tr>
              <td style="padding:34px 28px;">
                <p style="margin:0 0 10px;color:${BRAND.accent};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(eyebrow || "NigerToday account")}</p>
                <h1 style="margin:0 0 18px;color:${BRAND.ink};font-size:26px;line-height:1.25;">${escapeHtml(title)}</h1>
                ${greeting ? `<p style="margin:0 0 16px;color:${BRAND.muted};font-size:15px;line-height:1.6;">Hi ${escapeHtml(greeting)},</p>` : ""}
                ${content ? renderMessage(content) : ""}
                ${codeMarkup}
                ${buttonMarkup}
                ${notice ? `<div style="margin-top:26px;padding:14px 16px;border-left:3px solid ${BRAND.accent};background:#f7f6ff;"><p style="margin:0;color:${BRAND.muted};font-size:13px;line-height:1.6;">${escapeHtml(notice)}</p></div>` : ""}
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#94a3b8;text-align:center;font-size:12px;line-height:1.6;">© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const sendEmail = async (to, subject, html, text) => {
  const msg = { from: config.email.from, to, subject, html, text };
  await transport.sendMail(msg);
};

const sendEmailVerification = async (to, otp, fullName) => {
  const subject = `${BRAND.name} email verification code`;
  const html = createEmailTemplate({
    preheader: "Use this code to verify your NigerToday account.",
    eyebrow: "Email verification",
    title: "Verify your email address",
    greeting: fullName || "there",
    content: "Enter this one-time code in NigerToday to verify your email address.",
    code: otp,
    notice: "This code is valid for 3 minutes. If you did not create an account, you can ignore this email.",
  });
  const text = `Hi ${fullName || "there"},\n\nYour NigerToday email verification code is ${otp}. It is valid for 3 minutes.`;
  await sendEmail(to, subject, html, text);
};

const sendResetPasswordEmail = async (to, otp, fullName) => {
  const subject = `${BRAND.name} password reset code`;
  const html = createEmailTemplate({
    preheader: "Use this code to reset your NigerToday password.",
    eyebrow: "Account security",
    title: "Reset your password",
    greeting: fullName || "there",
    content: "We received a request to reset your NigerToday password. Enter this one-time code to continue.",
    code: otp,
    notice: "This code is valid for 3 minutes. If you did not request a password reset, you can ignore this email; your password will remain unchanged.",
  });
  const text = `Hi ${fullName || "there"},\n\nYour NigerToday password reset code is ${otp}. It is valid for 3 minutes. If you did not request this, ignore this email.`;
  await sendEmail(to, subject, html, text);
};

const sendVerificationEmail = async (to, token) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3001").replace(/\/+$/, "");
  const verificationEmailUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const subject = `${BRAND.name} confirm your email`;
  const html = createEmailTemplate({
    preheader: "Confirm your email address for NigerToday.",
    eyebrow: "Email verification",
    title: "Confirm your email",
    content: "Please confirm your email address to finish setting up your NigerToday account.",
    button: { label: "Confirm email address", url: verificationEmailUrl },
    notice: "If you did not create a NigerToday account, you can ignore this email.",
  });
  const text = `Confirm your NigerToday email address by visiting: ${verificationEmailUrl}`;
  await sendEmail(to, subject, html, text);
};

const sendReminderEmail = async (to, messageBody) => {
  const subject = `${BRAND.name} subscription reminder`;
  const html = createEmailTemplate({
    preheader: "A reminder about your NigerToday subscription.",
    eyebrow: "Subscription reminder",
    title: "A note about your subscription",
    content: messageBody,
    notice: "This message was sent by your NigerToday service provider.",
  });
  await sendEmail(to, subject, html, messageBody);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
  sendReminderEmail,
};
