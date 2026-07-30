import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type WelcomeEmailOptions = {
  name: string;
  appUrl: string;
};

export function buildWelcomeEmail({ name }: WelcomeEmailOptions) {
  const safeName = escapeHtml(name);
  const subject = "Welcome to Sārathi — Your Personal Vedic Astrology Guide";
  const text = `Dear ${name},\n\nThank you for joining Sārathi.\n\nWe created Sārathi with a simple belief: astrology should bring clarity, not confusion.\n\nWith Sārathi, you can explore:\n\n• Your personalised Life Report\n• Ask Sārathi for focused guidance\n• The professional Data Engine\n• One-to-one astrology consultations\n\nWe hope Sārathi becomes a trusted companion whenever you seek clarity.\n\nWith gratitude,\n\nTeam Sārathi`;

  const html = buildEmailLayout({
    title: "Welcome to Sārathi",
    previewText: "Thank you for joining Sārathi. Your journey toward greater clarity begins today.",
    greeting: `Dear ${safeName},`,
    bodyHtml: `<p>Thank you for joining <strong>Sārathi</strong>.</p><p>We created Sārathi with a simple belief: <strong>astrology should bring clarity, not confusion.</strong></p><p>Whether you are seeking guidance in your career, relationships, finances, health or spiritual journey, we are honoured to be part of that journey.</p><h2 style="margin:32px 0 14px;color:#2d2637;font-size:20px;">What you can explore</h2><ul style="padding-left:20px;line-height:1.85;"><li><strong>Life Report</strong> — understand the major themes of your birth chart.</li><li><strong>Ask Sārathi</strong> — seek focused guidance about your life and timing.</li><li><strong>Data Engine</strong> — explore charts, dashas, Vargas, KP analysis and advanced systems.</li><li><strong>Consultations</strong> — receive one-to-one guidance when you need deeper insight.</li></ul><p>We hope Sārathi becomes a trusted companion whenever you seek clarity.</p>`,
    reflection: "Every journey begins with a question. Wisdom begins with the willingness to seek an answer.",
  });

  return { subject, text, html };
}
