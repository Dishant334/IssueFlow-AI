// workspace and user names are typed by users, so make them safe inside the html
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")

const generateInviteTemplate= ({workspaceName,inviteLink,invitedByName})=>{
    const workspace = escapeHtml(workspaceName)
    const inviter = escapeHtml(invitedByName || "A teammate")

    return  `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${inviter} invited you to ${workspace}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

          <tr>
            <td style="padding-bottom:16px;color:#111827;font-size:20px;font-weight:bold;">
              Hi there,
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:20px;color:#374151;font-size:15px;line-height:1.6;">
              <strong>${inviter}</strong> has invited you to join the workspace
              <strong>${workspace}</strong> on IssueFlow, where the team plans projects and tracks tasks together.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:25px;">
              <a href="${inviteLink}"
                 style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:bold;display:inline-block;">
                Join ${workspace}
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:20px;color:#6b7280;font-size:13px;line-height:1.5;">
              If the button does not work, copy this link into your browser:<br />
              <a href="${inviteLink}" style="color:#2563eb;word-break:break-all;">${inviteLink}</a>
            </td>
          </tr>

          <tr>
            <td style="color:#6b7280;font-size:13px;line-height:1.5;">
              This invitation expires in 7 days.
              If you were not expecting it, you can ignore this email and nothing will happen.
            </td>
          </tr>

        </table>

        <table width="500" cellpadding="0" cellspacing="0" style="margin-top:15px;">
          <tr>
            <td align="center" style="font-size:12px;color:#9ca3af;line-height:1.5;">
              You received this email because ${inviter} entered your address to invite you to IssueFlow.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html> `}

// plain text version of the same mail, sending html only is a spam signal
const generateInviteText= ({workspaceName,inviteLink,invitedByName})=>{
    return `Hi there,

${invitedByName || "A teammate"} has invited you to join the workspace "${workspaceName}" on IssueFlow, where the team plans projects and tracks tasks together.

Join here: ${inviteLink}

This invitation expires in 7 days. If you were not expecting it, you can ignore this email and nothing will happen.`
}

export {generateInviteTemplate,generateInviteText}
