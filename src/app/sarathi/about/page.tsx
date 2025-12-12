// FILE: src/app/sarathi/about/page.tsx

import Link from "next/link";
import TopNav from "../TopNav";
export default function AboutSarathiPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            About
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            What is AstroSārathi?
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            AstroSārathi is your{" "}
            <span className="font-semibold">charioteer of the inner journey</span> –
            a Vedic astrology–based guide that reads your chart, dashas and transits
            like a serious astrologer, then translates it into calm, practical
            guidance for daily life.
          </p>
          <p className="text-sm leading-relaxed text-slate-300">
            Instead of fear, superstition or dramatic predictions, Sārathi focuses on
            <span className="font-semibold"> windows, tendencies and choices</span>.
            You stay in the driver&apos;s seat; the app simply holds up a clearer
            mirror so you can decide with more confidence.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 text-sm text-slate-300">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">
              What you can do here
            </h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
              <li>
                Generate a{" "}
                <span className="font-semibold">Life Report</span> with your key
                placements, patterns and timelines.
              </li>
              <li>
                Use <span className="font-semibold">Life Guidance</span> to get a
                clean, printable summary of your charts and current themes.
              </li>
              <li>
                Ask questions in <span className="font-semibold">Chat</span> about
                career, money, property, relationships or inner work.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">
              How the guidance works
            </h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
              <li>Uses classic Vedic building blocks: lagna, dashas, divisional charts, transits and panchang.</li>
              <li>Combines them into clear themes instead of dumping raw technical jargon.</li>
              <li>Emphasises free will, responsibility and practical next steps.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-50">
            Important disclaimer
          </h2>
          <p>
            AstroSārathi is a guidance tool, not a substitute for professional advice.
            Nothing here is medical, legal, financial or psychological advice.
          </p>
          <p>
            Always use your own judgement and, where needed, consult qualified
            professionals before making major decisions. Astrology can point to
            timings and tendencies – your choices and actions remain central.
          </p>
        </section>

        <section className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
          <span>Ready to explore?</span>
          <Link href="/sarathi/life-report" className="underline underline-offset-4 hover:text-indigo-200">
            Start with your Life Report
          </Link>
          <span className="text-slate-600">·</span>
          <Link href="/sarathi/chat" className="underline underline-offset-4 hover:text-indigo-200">
            Or ask a question in Chat
          </Link>
        </section>
      </main>
    </div>
  );
}
