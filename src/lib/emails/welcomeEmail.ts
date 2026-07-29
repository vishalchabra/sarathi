// FILE: src/lib/emails/welcomeEmail.ts

import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type WelcomeEmailOptions = {
  name: string;
  appUrl: string;
};

export function buildWelcomeEmail({
  name,
  appUrl,
}: WelcomeEmailOptions) {
  const safeName = escapeHtml(name);

  const subject = "Welcome to Sārathi — Your Personal Vedic Astrology Guide";

  const text = `
Dear ${name},

Thank you for joining Sārathi.

We created Sārathi with a simple belief: astrology should bring clarity, not confusion.

With Sārathi you can:

• Generate your Life Report
• Ask personal astrology questions
• Explore the Data Engine
• Book a personal consultation

Begin your journey here:

${appUrl}

With gratitude,

Team Sārathi
`.trim();

  const html = buildEmailLayout({
    title: "Your Journey Begins Here",

    previewText:
      "Thank you for joining Sārathi. Your journey toward greater clarity begins today.",

    greeting: `Dear ${safeName},`,

    bodyHtml: `
<p>
Thank you for joining <strong>Sārathi</strong>.
</p>

<p>
We created Sārathi with a simple belief:
<strong>astrology should bring clarity, not confusion.</strong>
</p>

<p>
Whether you're seeking guidance in your career, relationships,
finances, health or spiritual journey, we're honoured to be a part
of that journey.
</p>

<h2 style="margin-top:36px;color:#24183d;">
Here's what you can explore
</h2>

<ul style="padding-left:20px;line-height:1.9;">
<li><strong>Life Report</strong> — Discover the major themes of your birth chart.</li>

<li><strong>Ask Sārathi</strong> — Ask personal questions about your life and timing.</li>

<li><strong>Data Engine</strong> — Explore professional charts, dashas, yogas, KP analysis, Vargas, Upagrahas and much more.</li>

<li><strong>Consultations</strong> — Book one-to-one guidance whenever you need deeper insights.</li>
</ul>

<p>
We hope Sārathi becomes a trusted companion whenever you seek clarity.
</p>
`,

    cta: {
      label: "Explore Sārathi",
      href: appUrl,
    },

    reflection:
      "Every journey begins with a question. Wisdom begins with the willingness to seek an answer.",
  });

  return {
    subject,
    text,
    html,
  };
}