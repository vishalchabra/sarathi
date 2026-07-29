// FILE: src/lib/emails/lifeReportEmail.ts

import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type LifeReportEmailOptions = {
  name: string;
  appUrl: string;
};

export function buildLifeReportEmail({
  name,
  appUrl,
}: LifeReportEmailOptions) {
  const safeName = escapeHtml(name);

  const reportUrl = `${appUrl.replace(/\/$/, "")}/sarathi/life-report`;

  const subject = "Your Sārathi Life Report is Ready to Begin";

  const text = `
Dear ${name},

Thank you for purchasing your Sārathi Life Report.

Your access is now active.

You can begin by entering or confirming your birth details and generating your personalised report.

Generate your Life Report here:

${reportUrl}

Please review your birth date, birth time and birth place carefully before generating the report, as these details directly affect the analysis.

With gratitude,

Team Sārathi
`.trim();

  const html = buildEmailLayout({
    title: "Your Life Report Awaits",

    previewText:
      "Your Sārathi Life Report access is active. Confirm your birth details and begin your personalised analysis.",

    greeting: `Dear ${safeName},`,

    bodyHtml: `
<p>
Thank you for choosing the <strong>Sārathi Life Report</strong>.
</p>

<p>
Your access is now active, and your personalised report is ready to be generated.
</p>

<p>
Before you begin, please take a moment to carefully confirm your:
</p>

<ul style="padding-left:20px;line-height:1.9;">
  <li>Date of birth</li>
  <li>Exact birth time</li>
  <li>Birth place</li>
</ul>

<p>
These details form the foundation of your chart and directly influence the accuracy of the analysis.
</p>

<h2 style="margin-top:36px;color:#24183d;">
What your Life Report explores
</h2>

<ul style="padding-left:20px;line-height:1.9;">
  <li>Your core nature and life direction</li>
  <li>Career, finances and professional growth</li>
  <li>Relationships and emotional patterns</li>
  <li>Strengths, challenges and important life themes</li>
  <li>Current and upcoming planetary periods</li>
</ul>

<p>
Take your time while reading the report. Some insights may resonate immediately, while others may become clearer as life unfolds.
</p>
`,

    cta: {
      label: "Generate Your Life Report",
      href: reportUrl,
    },

    reflection:
      "A birth chart does not limit your path. It helps you understand the energies with which you walk it.",
  });

  return {
    subject,
    text,
    html,
  };
}