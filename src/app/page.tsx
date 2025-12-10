// FILE: app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top gradient + navbar */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18),_transparent_60%)]" />
        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/40 bg-slate-900/70 text-xs font-semibold tracking-tight">
              ♃
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">
                AstroSārathi
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                The charioteer of your journey within
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs text-slate-300 md:flex">
            <a href="#how-it-works" className="hover:text-cyan-300">
              How it works
            </a>
            <a href="#features" className="hover:text-cyan-300">
              Features
            </a>
            <a href="#faq" className="hover:text-cyan-300">
              FAQ
            </a>
            <Link href="/sarathi/life-report">
              <Button size="sm" className="rounded-full text-xs">
                Open Sarathi
              </Button>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-6 md:flex-row md:items-center md:pb-20 md:pt-10">
          <div className="flex-1 space-y-6">
            <Badge className="border border-cyan-400/40 bg-slate-900/70 text-[10px] font-medium uppercase tracking-[0.18em]">
              Early Preview · For personal testing
            </Badge>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Your personal{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Vedic astrology guide
              </span>
              , powered by AI.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
              AstroSārathi combines precise Vedic calculations with an intelligent
              assistant that explains your{" "}
              <span className="font-medium text-sky-200">
                dasha, transits, and daily energy
              </span>{" "}
              in simple, practical language—so you can make clearer decisions
              about work, money, relationships and spiritual growth.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/sarathi/life-report">
                <Button
                  size="lg"
                  className="rounded-full px-6 text-sm font-medium shadow-lg shadow-cyan-500/25"
                >
                  Open My Life Report
                </Button>
              </Link>
              <Link href="/sarathi/daily-guide">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-600 bg-slate-900/80 px-6 text-sm text-slate-100 hover:border-cyan-400/60 hover:text-cyan-200"
                >
                  Today&apos;s Guidance
                </Button>
              </Link>
              <p className="w-full text-xs text-slate-400 md:w-auto">
                No sign-up yet · For internal testing & refinement
              </p>
            </div>

            <div className="grid gap-4 pt-4 text-xs text-slate-300 md:grid-cols-3">
              <div className="space-y-1">
                <p className="font-semibold text-slate-100">Birth Chart + Dasha</p>
                <p>
                  Exact Vedic chart with Mahadasha / Antardasha / Pratyantardasha
                  automatically interpreted for you.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-100">Daily & Monthly Focus</p>
                <p>
                  Emotional weather, money signals, food & fasting suggestions
                  aligned to your chart.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-100">Chat with your Sārathi</p>
                <p>
                  Ask about career, relationships, property, or spiritual path –
                  and get grounded, non-fear based guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Right: small preview card */}
          <div className="mt-8 flex flex-1 justify-center md:mt-0">
            <Card className="w-full max-w-md rounded-3xl border-slate-700/80 bg-slate-900/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Today&apos;s Snapshot</span>
                  <span className="text-[10px] text-slate-400">
                    Demo preview
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Emotional Weather
                    </p>
                    <p className="text-sm">Steady · Grounded · Focused</p>
                  </div>
                  <Badge className="border border-emerald-400/40 bg-emerald-500/10 text-[10px]">
                    Good for deep work
                  </Badge>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600/70 to-transparent" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                    <p className="text-[11px] font-semibold text-slate-300">
                      Money & Career
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Use the day to clean up loose ends, paperwork, and
                      follow-ups. A good window for steady effort, not big
                      gambles.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                    <p className="text-[11px] font-semibold text-slate-300">
                      Food & Fasting
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Light, sattvic meals will keep you sharp. Avoid heavy,
                      late-night eating if you want to sleep deeply.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                  <p className="text-[11px] font-semibold text-slate-300">
                    One Clear Step
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Pick one important task you&apos;ve been postponing and do it
                    with full attention today. Your chart supports slow but
                    meaningful progress.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl px-4 pb-16 pt-4 md:pb-20"
      >
        <h2 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
          How AstroSārathi works
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Under the hood, AstroSārathi is constantly combining three layers:
        </p>

        <div className="mt-6 grid gap-4 text-sm text-slate-200 md:grid-cols-3">
          <Card className="h-full rounded-2xl border-slate-700/80 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-sm">1. Precise Vedic maths</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300">
              Your natal chart is calculated with Swiss ephemeris, Lahiri
              ayanamsha, and divisional charts. Dasha periods and key transit
              hits are mapped to timelines.
            </CardContent>
          </Card>

          <Card className="h-full rounded-2xl border-slate-700/80 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-sm">2. An AI master astrologer</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300">
              A specialised AI prompt is trained to respond like a grounded,
              non-fear based Vedic astrologer—accurate, practical, and focused
              on your growth instead of superstition or fear.
            </CardContent>
          </Card>

          <Card className="h-full rounded-2xl border-slate-700/80 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-sm">3. Daily coaching layer</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300">
              The app turns raw astrology into day-level guidance: what to
              prioritise, what to avoid, and how to align food, fasting,
              money decisions and emotional hygiene with your current dasha.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ / footer */}
      <section
        id="faq"
        className="border-t border-slate-800 bg-slate-950/70 pb-10 pt-8"
      >
        <div className="mx-auto max-w-6xl px-4 text-xs text-slate-400 md:flex md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-slate-200">Is this production-ready?</p>
            <p>
              Not yet. This is a private preview for internal testing. Accuracy,
              wording and features are still being refined.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p>© {new Date().getFullYear()} AstroSārathi · All rights reserved.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
