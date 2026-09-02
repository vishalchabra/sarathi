// FILE: src/app/sarathi/contact/page.tsx
import Link from "next/link";
import { createSEO } from "@/lib/seo";
export const metadata = createSEO({
  title: "Contact Sārathi Support",
  description:
    "Contact Sārathi for product support, account questions, report access, technical issues, privacy requests, feedback or business enquiries.",
  path: "/sarathi/contact",
  keywords: [
    "Contact Sārathi",
    "Sārathi Support",
    "Astrology Platform Support",
    "Life Report Support",
    "Ask Sārathi Support",
    "Vedic Astrology Help",
  ],
});
const supportEmail = "support@sarathiyourguide.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen astro-bg text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="text-sm text-slate-700 hover:text-slate-900">
            ← Back to Sārathi
          </Link>

          <div className="flex items-center gap-4">
            <Link className="text-sm text-slate-700 hover:text-slate-900" href="/sarathi/privacy">
              Privacy
            </Link>
            <Link className="text-sm text-slate-700 hover:text-slate-900" href="/sarathi/terms">
              Terms
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-14 pt-10">
        <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold text-slate-700">
          Contact Sārathi
        </div>

        <h1 className="mt-5 text-3xl font-semibold md:text-4xl">
          How can we help?
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          For support, feedback, account questions, privacy requests, or business
          enquiries, please contact us using the details below.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <ContactCard
            title="General support"
            text="For product questions, technical issues, login problems, report access, or feature feedback."
          />

          <ContactCard
            title="Privacy and data requests"
            text="For requests related to data access, correction, deletion, or privacy-related concerns."
          />
        </div>

        <div className="mt-8 rounded-2xl astro-card p-6 text-sm leading-7 text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            Email
          </h2>

          <p className="mt-2">
            Please contact us at{" "}
            <span className="font-medium text-slate-900">{supportEmail}</span>.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            What to include
          </h2>

          <ul className="mt-2 ml-5 list-disc space-y-2">
            <li>Your account email, if relevant.</li>
            <li>A short description of your request or issue.</li>
            <li>The page or feature where the issue occurred.</li>
            <li>Any screenshot, error message, browser, or device details that may help us investigate.</li>
          </ul>

          <p className="mt-6 text-sm text-slate-600">
            We aim to review support requests as soon as reasonably possible.
            Response times may vary depending on request volume and the nature of
            the enquiry.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/sarathi/individual/login?next=/sarathi/chat"
              className="inline-flex rounded-full bg-[#6E4BC6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
            >
              Ask Sārathi →
            </Link>

            <Link
              href="/sarathi/faqs"
              className="inline-flex rounded-full border border-[color:var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/80"
            >
              View FAQs
            </Link>
          </div>
        </div>

        <footer className="mt-12 border-t border-[color:var(--border)] pt-6 text-xs text-slate-600">
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-slate-900" href="/sarathi/about">
              About
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/privacy">
              Privacy
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/terms">
              Terms
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}

function ContactCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/60 p-5">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-700">{text}</p>
    </div>
  );
}