import nodemailer from "nodemailer";
import { generateInviteTemplate } from "../template/inviteTemplate.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
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
      from: "ISSUEFLOW AI Team" ,
      to,
      subject: `You're invited to join ${workspaceName}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send invite email");
  }
};