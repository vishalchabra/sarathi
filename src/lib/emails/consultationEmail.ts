import { buildEmailLayout } from "./layout";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type ConsultationEmailOptions = {
  name: string;
  appUrl: string;
  consultationDate?: string | null;
  consultationTime?: string | null;
  timezone?: string | null;
};

export function buildConsultationEmail({ name, consultationDate, consultationTime, timezone }: ConsultationEmailOptions) {
  const safeName = escapeHtml(name);
  const dateLine = consultationDate && consultationTime ? `${consultationDate} at ${consultationTime}${timezone ? ` (${timezone})` : ""}` : consultationDate || null;
  const subject = dateLine ? `Your Sārathi Consultation is Confirmed for ${consultationDate}` : "We Received Your Sārathi Consultation Request";
  const text = `Dear ${name},\n\nThank you for booking a personal consultation with Sārathi.\n\n${dateLine ? `Your consultation is scheduled for ${dateLine}.` : "Your consultation request has been received successfully."}\n\n${dateLine ? "Please keep your most important questions ready before the session." : "Our team will review your details and contact you with the earliest available consultation slot."}\n\nFor the most meaningful discussion, focus on two or three important areas rather than trying to cover everything at once.\n\nWith gratitude,\n\nTeam Sārathi`;

  const html = buildEmailLayout({
    title: dateLine ? "Your Consultation is Confirmed" : "We Received Your Consultation Request",
    previewText: dateLine ? `Your Sārathi consultation is scheduled for ${dateLine}.` : "Your personal consultation request has been received successfully.",
    greeting: `Dear ${safeName},`,
    bodyHtml: `<p>Thank you for booking a personal consultation with <strong>Sārathi</strong>.</p>${dateLine ? `<div style="margin:22px 0;padding:18px 20px;border:1px solid #e7e2ee;border-radius:10px;background:#faf9fc;"><div style="margin-bottom:5px;color:#756d7f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Consultation schedule</div><div style="color:#2d2637;font-size:17px;line-height:1.5;font-weight:700;">${escapeHtml(dateLine)}</div></div>` : `<p>Your consultation request has been received successfully. Our team will review your details and contact you with the earliest available consultation slot.</p>`}<h2 style="margin:32px 0 14px;color:#2d2637;font-size:20px;">Before the consultation</h2><ul style="padding-left:20px;line-height:1.85;"><li>Confirm that your birth details are accurate.</li><li>Keep your most important questions ready.</li><li>Focus on two or three meaningful areas.</li><li>Join from a quiet place where you can speak comfortably.</li></ul>`,
    reflection: "Clarity often arrives when we stop asking every question and begin listening deeply to the right one.",
  });

  return { subject, text, html };
}
