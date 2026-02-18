const generateInviteTemplate= ({workspaceName,inviteLink})=>{
    return  `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Workspace Invitation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0;color:#111827;">You're Invited 🎉</h2>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:20px;color:#374151;font-size:15px;line-height:1.6;">
              You’ve been invited to join the workspace:
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:25px;">
              <div style="font-size:18px;font-weight:bold;color:#111827;background:#f3f4f6;padding:12px 20px;border-radius:6px;display:inline-block;">
                ${workspaceName}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:30px;">
              <a href="${inviteLink}" 
                 style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:bold;display:inline-block;">
                Accept Invitation
              </a>
            </td>
          </tr>

          <tr>
            <td style="color:#6b7280;font-size:13px;line-height:1.5;">
              This invitation will expire in <strong>7 days</strong>.
              If you did not expect this invite, you can safely ignore this email.
            </td>
          </tr>

        </table>

        <table width="500" cellpadding="0" cellspacing="0" style="margin-top:15px;">
          <tr>
            <td align="center" style="font-size:12px;color:#9ca3af;">
              © 2026 Your Project Name. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html> `}

export {generateInviteTemplate}