// FILE: src/lib/emails/dataEngineEmail.ts

import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type DataEngineEmailOptions = {
  name: string;
  appUrl: string;
};

export function buildDataEngineEmail({
  name,
  appUrl,
}: DataEngineEmailOptions) {
  const safeName = escapeHtml(name);

  const dataEngineUrl = `${appUrl.replace(/\/$/, "")}/sarathi/data-engine`;

  const subject = "Your Sārathi Data Engine Subscription is Active";

  const text = `
Dear ${name},

Thank you for subscribing to the Sārathi Data Engine.

Your subscription is now active.

You can now explore detailed Vedic astrology tools, including charts, dashas, divisional charts, KP analysis, yogas, strengths, transits, Upagrahas and much more.

Open the Data Engine here:

${dataEngineUrl}

We recommend beginning with the Foundations and Charts sections before moving into deeper analytical systems.

With gratitude,

Team Sārathi
`.trim();

  const html = buildEmailLayout({
    title: "Your Data Engine Access is Active",

    previewText:
      "Your Sārathi Data Engine subscription is now active and ready to explore.",

    greeting: `Dear ${safeName},`,

    bodyHtml: `
<p>
Thank you for subscribing to the <strong>Sārathi Data Engine</strong>.
</p>

<p>
Your subscription is now active, giving you access to a comprehensive suite of Vedic astrology tools.
</p>

<h2 style="margin-top:36px;color:#24183d;">
What you can explore
</h2>

<ul style="padding-left:20px;line-height:1.9;">
  <li>Birth charts and planetary placements</li>
  <li>Vimshottari dasha timelines and timing analysis</li>
  <li>Divisional charts and Vargas</li>
  <li>Bhava Chalit and KP analysis</li>
  <li>Planetary strengths, yogas and functional roles</li>
  <li>Transits, Upagrahas, Arudhas and advanced systems</li>
</ul>

<p>
For the best experience, begin with the <strong>Foundations</strong> and <strong>Charts</strong> sections before moving into deeper analytical tools.
</p>

<p>
The Data Engine is designed to support thoughtful analysis rather than rushed conclusions. Take your time, compare layers, and allow the chart to reveal its larger pattern.
</p>
`,

    cta: {
      label: "Open the Data Engine",
      href: dataEngineUrl,
    },

    reflection:
      "A chart becomes meaningful when individual placements are understood as part of one connected story.",
  });

  return {
    subject,
    text,
    html,
  };
}