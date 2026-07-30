import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type AskSarathiEmailOptions = {
  name: string;
  appUrl: string;
  credits: number;
};

export function buildAskSarathiEmail({ name, credits }: AskSarathiEmailOptions) {
  const safeName = escapeHtml(name);
  const safeCredits = Number.isFinite(credits) ? Math.max(0, credits) : 0;
  const questionWord = safeCredits === 1 ? "question" : "questions";
  const subject = safeCredits === 1 ? "Your Ask Sārathi Question is Available" : `Your ${safeCredits} Ask Sārathi Questions Are Available`;
  const text = `Dear ${name},\n\nThank you for choosing Ask Sārathi.\n\nYour account has been credited with ${safeCredits} ${questionWord}.\n\nFor the most meaningful guidance, ask one clear question at a time and include any relevant context.\n\nPlease sign in to your Sārathi account to begin.\n\nWith gratitude,\n\nTeam Sārathi`;

  const html = buildEmailLayout({
    title: "Your Ask Sārathi Credits Are Ready",
    previewText: "Your Ask Sārathi credits are now available in your account.",
    greeting: `Dear ${safeName},`,
    bodyHtml: `<p>Thank you for choosing <strong>Ask Sārathi</strong>.</p><p>Your account has been credited with <strong>${safeCredits} ${questionWord}</strong>.</p><p>For the most meaningful guidance, ask one clear question at a time and include any context that may help Sārathi understand what you are experiencing.</p><p>Please sign in to your Sārathi account whenever you are ready to begin.</p>`,
    reflection: "The quality of an answer often begins with the honesty and clarity of the question.",
  });

  return { subject, text, html };
}
