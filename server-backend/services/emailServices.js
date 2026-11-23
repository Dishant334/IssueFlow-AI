import nodemailer from "nodemailer";
import { generateInviteTemplate, generateInviteText } from "../template/inviteTemplate.js";
import { generateResetPasswordTemplate, generateResetPasswordText } from "../template/resetPasswordTemplate.js";
import { consumeMailQuota } from "./mailQuota.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  // fail fast (instead of hanging for minutes) if the host blocks the SMTP connection
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});


// Render's free tier blocks SMTP, so on the server mails go out over HTTPS through Mailjet (MAILJET_API_KEY + MAILJET_SECRET_KEY).
// Without those keys the Gmail SMTP transporter above is used (fine for local development).
const sendMail = async ({ to, subject, text, html }) => {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
    return transporter.sendMail({ from: `"IssueFlow AI Team" <${process.env.EMAIL_USER}>`, to, subject, text, html });
  }
  const auth = Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`).toString("base64");
  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      Messages: [{
        From: { Email: process.env.EMAIL_USER, Name: "IssueFlow AI Team" },
        To: [{ Email: to }],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      }],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw Object.assign(new Error(`Mailjet ${res.status}: ${(await res.text()).slice(0, 200)}`), { code: "MAILJET" });
  return res.json();
};

export const sendInviteEmail = async ({
  to,
  workspaceName,
  inviteLink,
  invitedByName,
}) => {
  await consumeMailQuota();   // stops with MAIL_LIMIT when the daily budget of mails is used
  try {
    const html = generateInviteTemplate({
      workspaceName,
      inviteLink,
      invitedByName,
    });

    const mailOptions = {
      to,
      subject: `${invitedByName} invited you to ${workspaceName} on IssueFlow`,
      text: generateInviteText({ workspaceName, inviteLink, invitedByName }),
      html,
    };

    const info = await sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error.code, error.responseCode, error.message);
    throw new Error("Failed to send invite email");
  }
};


export const sendResetPasswordEmail = async ({ to, name, resetLink }) => {
  await consumeMailQuota();
  try {
    const mailOptions = {
      to,
      subject: "Reset your IssueFlow password",
      text: generateResetPasswordText({ name, resetLink }),
      html: generateResetPasswordTemplate({ name, resetLink }),
    };

    return await sendMail(mailOptions);
  } catch (error) {
    console.error("Reset password email failed:", error.code, error.responseCode, error.message);
    throw new Error("Failed to send reset password email");
  }
};
