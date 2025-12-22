import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is Sārathi free?",
    a: "Sārathi offers a free experience and optional upgrades as features expand. You’ll always be able to explore core guidance without pressure.",
  },
  {
    q: "Do I need to know astrology to use it?",
    a: "Not at all. Sārathi translates the chart into simple language and practical steps.",
  },
  {
    q: "How accurate is this?",
    a: "Astrology is best used for timing and decision support, not certainty. Sārathi gives probabilities and actionable planning — you stay in control.",
  },
  {
    q: "What details do you need from me?",
    a: "To personalize timing, you need birth date, birth time, and birth place. Without it, Sārathi can still give general guidance.",
  },
  {
    q: "What can I ask Sārathi?",
    a: "Career/job change, money/wealth timing, relationships, health focus, property/vehicle decisions, disputes, and general decision timing.",
  },
  {
    q: "Does Sārathi replace a human astrologer?",
    a: "No. Think of Sārathi as your daily charioteer — structured guidance and reflection. For major life decisions, a human expert can add nuance.",
  },
  {
    q: "Is my data private?",
    a: "Your birth details are used only to generate your guidance. We aim to minimize what we store and avoid sharing your data with third parties.",
  },
  {
    q: "What’s next for Sārathi?",
    a: "More guided modules, smarter daily notifications, and deeper personalization — while staying simple and calm to use.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/40">
              <Sparkles className="h-4 w-4 text-indigo-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Sārathi</div>
              <div className="text-[11px] text-slate-400">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-slate-300 sm:flex">
  <Link href="/about" className="hover:text-slate-50">
    About
  </Link>
  <Link href="/faqs" className="hover:text-slate-50">
    FAQs
  </Link>

  <span className="mx-1 h-4 w-px bg-slate-800/80" />

  <Link href="/sarathi/life-report" className="hover:text-slate-50">
    Life Report
  </Link>
  <Link href="/sarathi/chat" className="hover:text-slate-50">
    Ask Sārathi
  </Link>
</nav>

          <Link href="/sarathi/life-report">
            <Button
              size="sm"
              className="rounded-xl bg-indigo-500 px-4 text-xs font-medium shadow-sm hover:bg-indigo-400"
            >
              Get your Life Report
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl md:text-3xl text-slate-50">
              FAQs
            </CardTitle>
            <p className="mt-2 text-sm leading-7 text-slate-200/80">
              Answers to the questions most people ask before they begin.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-4">
              {FAQS.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-slate-950/35 p-5"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100 flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-slate-300/70 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <div className="mt-3 text-sm leading-6 text-slate-200/80">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/35 p-6">
              <h3 className="text-lg font-semibold text-slate-50">Our promise</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200/80">
                Sārathi is here to help you move through life with steadiness. Not by predicting your life for you,
                but by giving you timing, clarity, and a simple plan — so you can act with confidence.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link href="/sarathi/life-report">
                  <Button className="rounded-xl bg-indigo-500 px-5 text-sm font-medium shadow-sm hover:bg-indigo-400">
                    Start with my Life Report
                  </Button>
                </Link>
                <Link href="/sarathi/chat">
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-700 bg-slate-900/60 text-xs text-slate-100 hover:bg-slate-800"
                  >
                    Ask Sārathi in chat
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-400">
              <Link href="/" className="hover:text-slate-200">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
