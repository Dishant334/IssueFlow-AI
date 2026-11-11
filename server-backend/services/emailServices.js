import nodemailer from "nodemailer";
import { generateInviteTemplate, generateInviteText } from "../template/inviteTemplate.js";


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


export const sendInviteEmail = async ({
  to,
  workspaceName,
  inviteLink,
  invitedByName,
}) => {
  try {
    const html = generateInviteTemplate({
      workspaceName,
      inviteLink,
      invitedByName,
    });

    const mailOptions = {
      from: `"IssueFlow AI Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: `${invitedByName} invited you to ${workspaceName} on IssueFlow`,
      text: generateInviteText({ workspaceName, inviteLink, invitedByName }),
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error.code, error.responseCode, error.message);
    throw new Error("Failed to send invite email");
  }
};