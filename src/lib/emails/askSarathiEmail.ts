// FILE: src/lib/emails/askSarathiEmail.ts

import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type AskSarathiEmailOptions = {
  name: string;
  appUrl: string;
  credits: number;
};

export function buildAskSarathiEmail({
  name,
  appUrl,
  credits,
}: AskSarathiEmailOptions) {
  const safeName = escapeHtml(name);
  const safeCredits = Number.isFinite(credits) ? Math.max(0, credits) : 0;

  const askUrl = `${appUrl.replace(/\/$/, "")}/sarathi/chat`;

  const questionLabel =
    safeCredits === 1 ? "question is" : "questions are";

  const subject =
    safeCredits === 1
      ? "Your Ask Sārathi Question is Available"
      : `Your ${safeCredits} Ask Sārathi Questions Are Available`;

  const text = `
Dear ${name},

Thank you for choosing Ask Sārathi.

Your ${safeCredits} ${questionLabel} now available in your account.

You can ask about career, relationships, finances, health, timing, property, travel or any area where you seek greater clarity.

Begin here:

${askUrl}

For the most meaningful guidance, ask one clear question at a time and include relevant context.

With gratitude,

Team Sārathi
`.trim();

  const html = buildEmailLayout({
    title: "Your Questions Are Ready",

    previewText:
      "Your Ask Sārathi credits are now available in your account.",

    greeting: `Dear ${safeName},`,

    bodyHtml: `
<p>
Thank you for choosing <strong>Ask Sārathi</strong>.
</p>

<p>
Your account has been credited with
<strong>${safeCredits} ${
      safeCredits === 1 ? "question" : "questions"
    }</strong>.
</p>

<p>
You can now seek guidance on areas such as:
</p>

<ul style="padding-left:20px;line-height:1.9;">
  <li>Career and professional growth</li>
  <li>Relationships and marriage</li>
  <li>Finances, property and important decisions</li>
  <li>Health and emotional well-being</li>
  <li>Travel, relocation and life timing</li>
</ul>

<p>
For the most meaningful response, ask one clear question at a time and include any context that may help Sārathi understand what you are experiencing.
</p>

<p>
Your birth details should also be accurate, as the quality of the guidance depends on the chart being analysed.
</p>
`,

    cta: {
      label: "Ask Sārathi",
      href: askUrl,
    },

    reflection:
      "The quality of an answer often begins with the honesty and clarity of the question.",
  });

  return {
    subject,
    text,
    html,
  };
}