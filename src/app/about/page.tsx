import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
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
            <Link href="/sarathi/life-report" className="hover:text-slate-50">
              Life Report
            </Link>
            <Link href="/sarathi/life-guidance" className="hover:text-slate-50">
              Guidance
            </Link>
            <Link href="/sarathi/chat" className="hover:text-slate-50">
              Ask Sārathi
            </Link>
            <span className="mx-1 h-4 w-px bg-slate-800/80" />
            <Link href="/faqs" className="hover:text-slate-50">
              FAQs
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
              About Sārathi
            </CardTitle>
            <p className="mt-2 text-sm leading-7 text-slate-200/80">
              Sārathi means “The Charioteer of Your Journey Within.” It turns Vedic astrology
              into calm, practical guidance for real decisions — not fear, not vague predictions.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-slate-50">My Story</h3>

                <p className="mt-2 text-sm leading-6 text-slate-200/80">
                  Sārathi was born from a difficult phase in my own life — a time when I was searching for
                  answers but couldn’t find guidance that felt clear, grounded, or truly supportive.
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-200/80">
                  Instead of giving up, I chose to take responsibility. I turned to astrology and began
                  learning it deeply — not as belief, but as a system of timing, patterns, and self-understanding.
                  It wasn’t easy, and it took years of effort, study, and lived experience.
                </p>

                <div className="my-4 h-px w-12 bg-indigo-400/40" />

                <p className="mt-3 text-sm leading-6 text-slate-200/80">
                  Through that journey, one truth became clear: no one should have to struggle alone just
                  to understand what phase they are in or how to move forward wisely.
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-200/80">
                  I built Sārathi so others don’t have to go through what I did. It’s meant to be a true
                  guide — one that walks with you, helps you understand your timing, and supports you in
                  every area where astrology can bring clarity.
                </p>

                <div className="mt-4 text-xs text-slate-300/70">— Founder, Sārathi</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-slate-50">Why Sārathi</h3>
                <ul className="mt-3 space-y-3 text-sm text-slate-200/80">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-slate-100">Practical:</b> clear “do / don’t” guidance, not confusing jargon.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-slate-100">Personal:</b> based on your birth chart + timing cycles (dasha/transits).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-slate-100">Calm:</b> reduces anxiety by giving structure to uncertainty.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-slate-100">Action-first:</b> turns insight into a plan you can follow.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/35 p-6">
              <h3 className="text-lg font-semibold text-slate-50">
                What Sārathi will never do
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-200/80">
                Sārathi is built to reduce anxiety — not create it. That means we avoid fear-based astrology
                and focus on grounded decision support.
              </p>

              <ul className="mt-3 space-y-2 text-sm text-slate-200/80">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-slate-100">No fear:</b> no “doom” messaging or panic timelines.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-slate-100">No absolutes:</b> we don’t claim certainty — we help you plan wisely.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-slate-100">No dependency:</b> the goal is clarity and self-trust, not reliance.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-slate-100">No jargon dumps:</b> we translate — we don’t overwhelm.
                  </span>
                </li>
              </ul>
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
          </CardContent>
        </Card>

        <div className="mt-8 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
