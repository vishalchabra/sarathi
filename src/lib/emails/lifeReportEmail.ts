import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

type LifeReportEmailOptions = { name: string; appUrl: string };

export function buildLifeReportEmail({ name, appUrl }: LifeReportEmailOptions) {
  const safeName = escapeHtml(name);
  const reportUrl = `${appUrl.replace(/\/$/, "")}/sarathi/life-report`;
  const subject = "Your Sārathi Life Report Access is Active";
  const text = `Dear ${name},\n\nThank you for purchasing your Sārathi Life Report.\n\nYour access is now active.\n\nBefore generating your report, please carefully confirm your birth date, exact birth time and birth place. These details directly affect the analysis.\n\nGenerate your Life Report here:\n\n${reportUrl}\n\nWith gratitude,\n\nTeam Sārathi`;
  const html = buildEmailLayout({
    title: "Your Life Report Access is Active",
    previewText: "Your Sārathi Life Report access is active. Confirm your birth details and begin your personalised analysis.",
    greeting: `Dear ${safeName},`,
    bodyHtml: `<p>Thank you for choosing the <strong>Sārathi Life Report</strong>.</p><p>Your access is now active and your personalised report is ready to be generated.</p><p>Before you begin, please carefully confirm your:</p><ul style="padding-left:20px;line-height:1.85;"><li>Date of birth</li><li>Exact birth time</li><li>Birth place</li></ul><p>These details form the foundation of your chart and directly influence the accuracy of the analysis.</p>`,
    cta: { label: "Generate Life Report", href: reportUrl },
    reflection: "A birth chart does not limit your path. It helps you understand the energies with which you walk it.",
  });
  return { subject, text, html };
}
