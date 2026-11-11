// names are typed by users, so make them safe inside the html
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")

const generateResetPasswordTemplate = ({ name, resetLink }) => {
    const userName = escapeHtml(name || "there")

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your IssueFlow password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

          <tr>
            <td style="padding-bottom:16px;color:#111827;font-size:20px;font-weight:bold;">
              Hi ${userName},
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:20px;color:#374151;font-size:15px;line-height:1.6;">
              We received a request to reset the password of your IssueFlow account.
              Click the button below to choose a new one.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:25px;">
              <a href="${resetLink}"
                 style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:bold;display:inline-block;">
                Reset password
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:20px;color:#6b7280;font-size:13px;line-height:1.5;">
              If the button does not work, copy this link into your browser:<br />
              <a href="${resetLink}" style="color:#2563eb;word-break:break-all;">${resetLink}</a>
            </td>
          </tr>

          <tr>
            <td style="color:#6b7280;font-size:13px;line-height:1.5;">
              This link works for 1 hour and only once.
              If you did not ask for this, you can ignore this email. Your password will stay the same.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html> `
}

// plain text version of the same mail, sending html only is a spam signal
const generateResetPasswordText = ({ name, resetLink }) => {
    return `Hi ${name || "there"},

We received a request to reset the password of your IssueFlow account.

Choose a new password here: ${resetLink}

This link works for 1 hour and only once. If you did not ask for this, you can ignore this email. Your password will stay the same.`
}

export { generateResetPasswordTemplate, generateResetPasswordText }
