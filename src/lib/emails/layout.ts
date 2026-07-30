export type EmailCta = {
  label: string;
  href: string;
};

type BuildEmailLayoutOptions = {
  title: string;
  previewText?: string;
  greeting?: string;
  bodyHtml: string;
  cta?: EmailCta;
  reflection?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildEmailLayout({
  title,
  previewText,
  greeting,
  bodyHtml,
  cta,
  reflection,
}: BuildEmailLayoutOptions) {
  const safeTitle = escapeHtml(title);
  const safePreviewText = previewText ? escapeHtml(previewText) : "";
  const safeGreeting = greeting ? escapeHtml(greeting) : "";
  const safeReflection = reflection ? escapeHtml(reflection) : "";
  const safeCtaLabel = cta ? escapeHtml(cta.label) : "";
  const safeCtaHref = cta ? escapeHtml(cta.href) : "";

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f5f8;color:#2f2938;font-family:Arial,Helvetica,sans-serif;">
    ${safePreviewText ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${safePreviewText}</div>` : ""}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f6f5f8;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;background:#ffffff;border-collapse:collapse;border:1px solid #ebe8f0;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 28px 18px;border-bottom:1px solid #eeeaf4;background:#ffffff;">
                <div style="color:#5f3fb0;font-size:20px;line-height:1.2;font-weight:700;letter-spacing:2.2px;">SĀRATHI</div>
                <div style="margin-top:5px;color:#7b7385;font-size:12px;line-height:1.4;">Your Personal Vedic Astrology Guide</div>
              </td>
            </tr>
            <tr><td style="height:3px;background:#6e4bc6;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr>
              <td style="padding:34px 34px 18px;">
                <h1 style="margin:0 0 22px;color:#241d2e;font-size:27px;line-height:1.3;font-weight:700;">${safeTitle}</h1>
                ${safeGreeting ? `<p style="margin:0 0 20px;color:#3f3947;font-size:16px;line-height:1.75;">${safeGreeting}</p>` : ""}
                <div style="color:#4a4451;font-size:16px;line-height:1.75;">${bodyHtml}</div>
                ${cta ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0 8px;"><tr><td bgcolor="#6E4BC6" style="border-radius:10px;"><a href="${safeCtaHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 22px;color:#ffffff;background:#6e4bc6;border-radius:10px;font-size:15px;line-height:1;font-weight:700;text-decoration:none;">${safeCtaLabel}</a></td></tr></table>` : ""}
              </td>
            </tr>
            ${safeReflection ? `<tr><td style="padding:10px 34px 30px;"><div style="padding:18px 20px;background:#f8f6fb;border-left:3px solid #6e4bc6;border-radius:8px;"><div style="margin-bottom:6px;color:#6e4bc6;font-size:12px;line-height:1.4;font-weight:700;text-transform:uppercase;letter-spacing:.7px;">A quiet thought</div><div style="color:#5a5264;font-size:14px;line-height:1.7;font-style:italic;">${safeReflection}</div></div></td></tr>` : ""}
            <tr>
              <td style="padding:24px 34px 28px;border-top:1px solid #eeeaf4;background:#fbfafc;">
                <p style="margin:0 0 12px;color:#625b6b;font-size:13px;line-height:1.7;">Need help? Simply reply to this email.</p>
                <p style="margin:0 0 12px;color:#625b6b;font-size:13px;line-height:1.7;">With gratitude,<br /><strong style="color:#2d2637;">Team Sārathi</strong></p>
                <p style="margin:0;color:#9a94a1;font-size:11px;line-height:1.6;">© ${new Date().getFullYear()} Sārathi. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}
