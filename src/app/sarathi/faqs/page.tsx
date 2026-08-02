import Link from "next/link";
import { createSEO } from "@/lib/seo";
export const metadata = createSEO({
  title: "Frequently Asked Questions | Sārathi",
  description:
    "Find answers about Sārathi, AI-powered Vedic astrology, Life Reports, Ask Sārathi, the Astrologer Data Engine, pricing, privacy and how the platform works.",
  path: "/sarathi/faqs",
  keywords: [
    "Astrology FAQ",
    "Vedic Astrology Questions",
    "Life Report FAQ",
    "Ask Sarathi",
    "AI Astrology FAQ",
    "Astrologer Data Engine",
    "Birth Chart Questions",
  ],
});
const faqs = [
  {
    q: "What is Sārathi?",
    a: "Sārathi is an astrology-based guidance platform that helps individuals understand life timing and helps astrologers organize chart data in one place.",
  },
  {
    q: "Is Sārathi only for individuals?",
    a: "No. Sārathi has two journeys: one for individuals through Life Report and Ask Sārathi, and one for astrologers through the Astrologer Data Engine.",
  },
  {
    q: "Does Sārathi predict my future?",
    a: "Sārathi gives timing, tendencies, themes and guidance. It does not remove free will or claim absolute certainty.",
  },
  {
    q: "Is this fear-based astrology?",
    a: "No. Sārathi is designed to avoid fear, doom language and emotional pressure. The aim is clarity, not anxiety.",
  },
  {
    q: "What is the Life Report?",
    a: "The Life Report explains your chart, major timing cycles, current phase, strengths, challenges and practical guidance in simple language.",
  },
  {
    q: "What is Ask Sārathi?",
    a: "Ask Sārathi is a chat experience where you can ask specific questions about career, money, relationships, property, health, timing and inner growth.",
  },
  {
    q: "What is the Astrologer Data Engine?",
    a: "It is a professional workspace for astrologers that organizes chart data, dashas, transits, vargas, Panchang, strengths, utilities and judgment layers.",
  },
  {
    q: "Is my birth data private?",
    a: "Yes. Birth details are sensitive, and Sārathi is being built with privacy and account-based access in mind.",
  },
];

export default function FAQsPage() {
  return (
    <main className="min-h-screen astro-bg text-slate-900">
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <Link href="/sarathi" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to Sārathi
        </Link>

        <div className="mt-10">
          <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold text-slate-700">
            FAQs
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Questions before you begin
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
            Here are the most common questions about Sārathi, Life Report, Ask
            Sārathi, and the Astrologer Data Engine.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-2xl astro-card p-6">
              <h2 className="text-base font-semibold text-slate-900">
                {item.q}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-[color:var(--border)] bg-white/70 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            Ready to start?
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/sarathi/individual"
              className="rounded-full bg-[#6E4BC6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
            >
              For Individuals
            </Link>

            <Link
              href="/sarathi/astrologers"
              className="rounded-full border border-[color:var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/80"
            >
              For Astrologers
            </Link>

            <Link
              href="/sarathi/contact"
              className="rounded-full border border-[color:var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/80"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}