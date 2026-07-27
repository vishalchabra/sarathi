import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const emailFrom = process.env.EMAIL_FROM || smtpUser;

if (!smtpHost || !smtpUser || !smtpPass) {
  throw new Error(
    "Missing SMTP configuration. Check SMTP_HOST, SMTP_USER and SMTP_PASS."
  );
}

export const mailer = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: SendEmailOptions) {
  return mailer.sendMail({
    from: `Sārathi <${emailFrom}>`,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}