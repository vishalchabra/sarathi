// FILE: src/lib/emails/consultationEmail.ts

import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type ConsultationEmailOptions = {
  name: string;
  appUrl: string;
  consultationDate?: string | null;
  consultationTime?: string | null;
  timezone?: string | null;
};

export function buildConsultationEmail({
  name,
  appUrl,
  consultationDate,
  consultationTime,
  timezone,
}: ConsultationEmailOptions) {
  const safeName = escapeHtml(name);

  const consultationUrl = `${appUrl.replace(/\/$/, "")}/sarathi/consultation`;

  const dateLine =
    consultationDate && consultationTime
      ? `${consultationDate} at ${consultationTime}${
          timezone ? ` (${timezone})` : ""
        }`
      : consultationDate
        ? consultationDate
        : null;

  const subject = dateLine
    ? `Your Sārathi Consultation is Confirmed for ${consultationDate}`
    : "Your Sārathi Consultation Request is Confirmed";

  const text = `
Dear ${name},

Thank you for booking a personal consultation with Sārathi.

${
  dateLine
    ? `Your consultation is scheduled for ${dateLine}.`
    : "Your consultation request has been received successfully."
}

Please ensure your birth details are accurate and keep your most important questions ready before the session.

You can review your consultation details here:

${consultationUrl}

For the most meaningful discussion, we recommend focusing on two or three important areas rather than trying to cover everything at once.

With gratitude,

Team Sārathi
`.trim();

  const html = buildEmailLayout({
    title: dateLine
      ? "Your Consultation is Confirmed"
      : "Your Consultation Request is Confirmed",

    previewText: dateLine
      ? `Your Sārathi consultation is scheduled for ${dateLine}.`
      : "Your personal consultation request has been received successfully.",

    greeting: `Dear ${safeName},`,

    bodyHtml: `
<p>
Thank you for booking a personal consultation with <strong>Sārathi</strong>.
</p>

${
  dateLine
    ? `
<p>
Your consultation is scheduled for:
</p>

<div style="
  margin:24px 0;
  padding:20px;
  border:1px solid #e8e1f2;
  border-radius:14px;
  background:#faf8fd;
">
  <p style="margin:0;font-size:17px;font-weight:700;color:#24183d;">
    ${escapeHtml(dateLine)}
  </p>
</div>
`
    : `
<p>
Your consultation request has been received successfully. Our team will share the confirmed date and time with you.
</p>
`
}

<h2 style="margin-top:36px;color:#24183d;">
Before the consultation
</h2>

<ul style="padding-left:20px;line-height:1.9;">
  <li>Confirm that your birth date, birth time and birth place are accurate.</li>
  <li>Keep your most important questions ready.</li>
  <li>Focus on two or three meaningful areas rather than trying to cover everything at once.</li>
  <li>Join from a quiet place where you can speak comfortably.</li>
</ul>

<p>
A consultation is most valuable when approached with openness, patience and a clear intention.
</p>
`,

    cta: {
      label: "View Consultation Details",
      href: consultationUrl,
    },

    reflection:
      "Clarity often arrives when we stop asking every question and begin listening deeply to the right one.",
  });

  return {
    subject,
    text,
    html,
  };
}