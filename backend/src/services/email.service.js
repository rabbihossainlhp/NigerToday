const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}


const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

const sendEmailVerification = async (to, otp, fullName) => {
  console.log("sendEmailVerification", to, otp);
  const subject = "Your NEXMO  verification code";

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#eef2ff; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; padding:0 20px;">
    <div style="background:#111827; padding:32px; text-align:center; border-radius:20px 20px 0 0;">
      <div style="font-size:34px; color:#a5b4fc; font-weight:bold;">N</div>
      <h1 style="margin:10px 0 0; color:#ffffff; font-size:22px;">
        NEXMO TAG
      </h1>
    </div>

    <div style="background:#ffffff; padding:42px 34px; border-radius:0 0 20px 20px;">
      <p style="margin:0 0 10px; color:#64748b; font-size:15px;">
        Hi ${fullName || "there"},
      </p>

      <h2 style="margin:0 0 18px; color:#111827; font-size:28px;">
        One quick step
      </h2>

      <p style="color:#64748b; line-height:1.7; font-size:15px;">
        Enter the code below to confirm your email address and activate your account.
      </p>

      <div style="margin:30px 0; padding:22px; border:2px dashed #818cf8; border-radius:14px; text-align:center;">
        <span style="font-size:34px; font-weight:bold; letter-spacing:10px; color:#4f46e5;">
          ${otp}
        </span>
      </div>

      <p style="color:#ef4444; font-size:13px;">
        This code expires in 3 minutes.
      </p>

      <p style="margin-top:32px; color:#94a3b8; font-size:13px; line-height:1.6;">
        If you did not create an account, you can safely ignore this email.
      </p>
    </div>

    <p style="text-align:center; color:#94a3b8; font-size:12px;">
      © ${new Date().getFullYear()} NEXMO TAG
    </p>
  </div>
</body>
</html>
`;
  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, otp, fullName) => {
  console.log("Password Reset Email", to, otp);
  const subject = "Reset your NEXMO TAG password";

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#fff7ed; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; padding:0 20px;">
    <div style="background:#ffffff; border:1px solid #fed7aa; border-radius:18px; overflow:hidden;">
      <div style="padding:26px 32px; border-bottom:1px solid #ffedd5;">
        <span style="font-size:18px; font-weight:bold; color:#ea580c;">
          NEXMO TAG
        </span>
        <span style="float:right; color:#fb923c; font-size:13px;">
          Security notice
        </span>
      </div>

      <div style="padding:38px 32px;">
        <p style="margin:0 0 8px; color:#78716c; font-size:14px;">
          Hello ${fullName || "there"},
        </p>

        <h1 style="margin:0 0 18px; color:#292524; font-size:27px;">
          Password reset requested
        </h1>

        <p style="color:#78716c; line-height:1.7; font-size:15px;">
          Someone requested a password reset for your account. Use this
          one-time code to continue:
        </p>

        <div style="margin:28px 0; background:#292524; padding:24px; border-radius:12px; text-align:center;">
          <span style="color:#fed7aa; font-size:32px; font-weight:bold; letter-spacing:9px;">
            ${otp}
          </span>
        </div>

        <p style="color:#ea580c; font-size:13px; font-weight:bold;">
          Valid for 3 minutes only.
        </p>

        <div style="margin-top:30px; padding:16px; background:#fff7ed; border-left:4px solid #fb923c;">
          <p style="margin:0; color:#78716c; font-size:13px; line-height:1.6;">
            Did not request this? Your password will remain unchanged.
            Please ignore this message.
          </p>
        </div>
      </div>
    </div>

    <p style="text-align:center; color:#a8a29e; font-size:12px;">
      © ${new Date().getFullYear()} NEXMO TAG
    </p>
  </div>
</body>
</html>
`;
  await sendEmail(to, subject, html);
};


const sendVerificationEmail = async (to, token) => {
  const subject = "Confirm your email address";

  const verificationEmailUrl =
    `http://link-to-app/verify-email?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#f0fdf4; font-family:Arial, sans-serif;">
  <div style="max-width:560px; margin:50px auto; padding:0 20px;">
    <div style="background:#ffffff; padding:42px 36px; border-radius:24px; text-align:center; box-shadow:0 12px 35px rgba(22, 101, 52, 0.08);">
      <div style="width:64px; height:64px; line-height:64px; margin:0 auto 24px; border-radius:50%; background:#dcfce7; color:#16a34a; font-size:30px;">
        ✓
      </div>

      <h1 style="margin:0 0 16px; color:#14532d; font-size:27px;">
        Confirm your email
      </h1>

      <p style="margin:0 auto 30px; max-width:400px; color:#64748b; line-height:1.7; font-size:15px;">
        Please confirm your email address by clicking the button below.
      </p>

      <a
        href="${verificationEmailUrl}"
        style="display:inline-block; padding:15px 28px; background:#16a34a; color:#ffffff; border-radius:999px; text-decoration:none; font-size:15px; font-weight:bold;"
      >
        Confirm email address
      </a>

      <p style="margin:30px 0 0; color:#94a3b8; font-size:12px; line-height:1.6;">
        If you did not create an account, no action is required.
      </p>
    </div>

    <p style="text-align:center; color:#94a3b8; font-size:12px;">
      NEXMO TAG
    </p>
  </div>
</body>
</html>
`;
  await sendEmail(to, subject, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
};
