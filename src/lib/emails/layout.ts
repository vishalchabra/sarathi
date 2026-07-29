// FILE: src/lib/emails/layout.ts

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
    .replace(/"/g, "&quot;")
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
  const safePreviewText = previewText
    ? escapeHtml(previewText)
    : "";
  const safeGreeting = greeting
    ? escapeHtml(greeting)
    : "";
  const safeReflection = reflection
    ? escapeHtml(reflection)
    : "";

  const safeCtaLabel = cta
    ? escapeHtml(cta.label)
    : "";

  const safeCtaHref = cta
    ? escapeHtml(cta.href)
    : "";

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <title>${safeTitle}</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f8f6fc;
      color: #1f2937;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    ${
      safePreviewText
        ? `
          <div
            style="
              display: none;
              max-height: 0;
              overflow: hidden;
              opacity: 0;
              color: transparent;
              line-height: 1px;
              font-size: 1px;
            "
          >
            ${safePreviewText}
          </div>
        `
        : ""
    }

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width: 100%;
        background-color: #f8f6fc;
        border-collapse: collapse;
      "
    >
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 100%;
              max-width: 640px;
              background-color: #ffffff;
              border-collapse: collapse;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 8px 30px rgba(76, 55, 120, 0.08);
            "
          >
            <tr>
              <td
                align="center"
                style="
                  padding: 34px 28px 26px;
                  background-color: #6e4bc6;
                "
              >
                <div
                  style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 28px;
                    line-height: 1.2;
                    font-weight: 700;
                    letter-spacing: 2px;
                  "
                >
                  SĀRATHI
                </div>

                <div
                  style="
                    margin-top: 8px;
                    color: #eee8ff;
                    font-size: 14px;
                    line-height: 1.5;
                  "
                >
                  Your Personal Vedic Astrology Guide
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 38px 36px 18px;">
                <h1
                  style="
                    margin: 0 0 22px;
                    color: #24183d;
                    font-size: 29px;
                    line-height: 1.3;
                    font-weight: 700;
                  "
                >
                  ${safeTitle}
                </h1>

                ${
                  safeGreeting
                    ? `
                      <p
                        style="
                          margin: 0 0 20px;
                          color: #374151;
                          font-size: 16px;
                          line-height: 1.75;
                        "
                      >
                        ${safeGreeting}
                      </p>
                    `
                    : ""
                }

                <div
                  style="
                    color: #374151;
                    font-size: 16px;
                    line-height: 1.75;
                  "
                >
                  ${bodyHtml}
                </div>

                ${
                  cta
                    ? `
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="margin: 30px 0 10px;"
                      >
                        <tr>
                          <td
                            align="center"
                            bgcolor="#6E4BC6"
                            style="
                              border-radius: 999px;
                            "
                          >
                            <a
                              href="${safeCtaHref}"
                              target="_blank"
                              rel="noopener noreferrer"
                              style="
                                display: inline-block;
                                padding: 14px 26px;
                                color: #ffffff;
                                background-color: #6e4bc6;
                                border-radius: 999px;
                                font-size: 15px;
                                line-height: 1;
                                font-weight: 700;
                                text-decoration: none;
                              "
                            >
                              ${safeCtaLabel}
                            </a>
                          </td>
                        </tr>
                      </table>
                    `
                    : ""
                }
              </td>
            </tr>

            ${
              safeReflection
                ? `
                  <tr>
                    <td style="padding: 12px 36px 30px;">
                      <div
                        style="
                          padding: 22px;
                          background-color: #f4f0fb;
                          border-left: 4px solid #6e4bc6;
                          border-radius: 12px;
                        "
                      >
                        <div
                          style="
                            margin-bottom: 8px;
                            color: #6e4bc6;
                            font-size: 13px;
                            line-height: 1.4;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.8px;
                          "
                        >
                          Today's Reflection
                        </div>

                        <div
                          style="
                            color: #4b3c63;
                            font-size: 15px;
                            line-height: 1.7;
                            font-style: italic;
                          "
                        >
                          ${safeReflection}
                        </div>
                      </div>
                    </td>
                  </tr>
                `
                : ""
            }

            <tr>
              <td
                style="
                  padding: 26px 36px 32px;
                  border-top: 1px solid #ede9f5;
                  background-color: #fcfbfe;
                "
              >
                <p
                  style="
                    margin: 0 0 14px;
                    color: #4b5563;
                    font-size: 14px;
                    line-height: 1.7;
                  "
                >
                  Need help? Reply to this email or contact
                  <a
                    href="mailto:support@asksarathi.com"
                    style="
                      color: #6e4bc6;
                      font-weight: 700;
                      text-decoration: none;
                    "
                  >
                    support@asksarathi.com
                  </a>.
                </p>

                <p
                  style="
                    margin: 0 0 14px;
                    color: #4b5563;
                    font-size: 14px;
                    line-height: 1.7;
                  "
                >
                  With gratitude,<br />
                  <strong style="color: #24183d;">
                    Team Sārathi
                  </strong>
                </p>

                <p
                  style="
                    margin: 0;
                    color: #9ca3af;
                    font-size: 12px;
                    line-height: 1.6;
                  "
                >
                  © ${new Date().getFullYear()} Sārathi. All rights reserved.
                </p>
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