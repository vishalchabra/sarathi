import Link from "next/link";
import { createSEO } from "@/lib/seo";
export const metadata = createSEO({
  title: "Frequently Asked Questions About Sārathi",
  description:
    "Find answers about Sārathi, personalised Vedic astrology guidance, Life Reports, Ask Sārathi, the Astrologer Data Engine, privacy and how the platform works.",
  path: "/sarathi/faqs",
  keywords: [
    "Sārathi FAQ",
    "Vedic Astrology Questions",
    "Life Report FAQ",
    "Ask Sārathi",
    "Astrologer Data Engine",
    "Birth Chart Questions",
    "Vedic Astrology Guidance",
  ],
});
const faqs = [
  {
    q: "What is Sārathi?",
    a: "Sārathi is a Vedic astrology guidance platform designed around clarity, timing and practical interpretation. Individuals can explore their birth chart through personalised Life Reports and Ask Sārathi, while professional astrologers can use the Astrologer Data Engine for deeper chart analysis.",
  },
  {
    q: "Is Sārathi only for individuals?",
    a: "No. Sārathi has two distinct journeys. Individuals can use Life Reports and Ask Sārathi for personal guidance, while professional astrologers can use the Astrologer Data Engine to bring chart data, dashas, transits, vargas, Panchang and other analytical layers into one workspace.",
  },
  {
    q: "Does Sārathi predict my future?",
    a: "Sārathi does not treat astrology as absolute certainty. It interprets planetary periods, transits, chart patterns and timing to highlight tendencies, themes and periods of greater or lesser activation. The purpose is to help you understand the phase you are moving through while keeping choice and free will at the centre.",
  },
  {
    q: "Is Sārathi fear-based astrology?",
    a: "No. Sārathi is deliberately designed to avoid doom language, panic-driven predictions and emotional pressure. Difficult periods can still be discussed honestly, but the emphasis remains on understanding the situation, recognising what requires attention and identifying practical ways to navigate it.",
  },
  {
    q: "What is a Sārathi Life Report?",
    a: "The Life Report is a personalised interpretation of your Vedic birth chart. It brings together important chart patterns, strengths, challenges, major life themes, current planetary periods and timing to help you understand both your broader journey and the phase you are experiencing now.",
  },
  {
    q: "What is Ask Sārathi?",
    a: "Ask Sārathi lets you explore a specific question through the context of your birth chart and current timing. Questions can relate to areas such as career, money, relationships, marriage, property, relocation, health, children or personal growth. The aim is to provide focused guidance rather than a generic horoscope.",
  },
  {
    q: "What is the Astrologer Data Engine?",
    a: "The Astrologer Data Engine is a professional workspace built for astrologers. It brings together chart foundations, dashas, transits, vargas, Panchang, strength systems, aspects and supporting calculation layers so astrologers can spend less time moving between tools and more time interpreting the chart.",
  },
  {
    q: "What birth details do I need?",
    a: "For personalised chart analysis, you should provide your date of birth, accurate time of birth and place of birth. Birth time is particularly important because it determines the ascendant and house structure and can affect several timing and divisional-chart calculations.",
  },
  {
    q: "What is the difference between a Life Report and Ask Sārathi?",
    a: "The Life Report gives you a broader view of your chart, life themes and important timing periods. Ask Sārathi is designed for focused questions about a particular situation or area of life. The Life Report helps you understand the larger picture; Ask Sārathi lets you explore a specific question within that context.",
  },
  {
    q: "Is my birth data private?",
    a: "Birth details are personal information and Sārathi is designed around account-based access and responsible handling of user data. You can read more about how information is handled in the Sārathi Privacy Policy.",
  },
];
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.sarathiyourguide.com/sarathi/faqs#faq",
  url: "https://www.sarathiyourguide.com/sarathi/faqs",
  name: "Sārathi Frequently Asked Questions",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
export default function FAQsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(faqSchema),
        }}
      />

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
    </>
  );
}