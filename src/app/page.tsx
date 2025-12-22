import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Clock, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
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

          {/* NAV: About → My Story → Why → FAQs → Life Report → Ask Sārathi */}
          <nav className="hidden items-center gap-4 text-sm text-slate-300 sm:flex">
  <Link href="#about" className="hover:text-slate-50">
    About
  </Link>
  <Link href="#my-story" className="hover:text-slate-50">
    My Story
  </Link>
  <Link href="#why-sarathi" className="hover:text-slate-50">
    Why Sārathi
  </Link>
  <Link href="#faqs" className="hover:text-slate-50">
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



          <div className="flex items-center gap-2">
            <Badge className="hidden bg-emerald-500/15 text-[11px] font-normal text-emerald-300 border border-emerald-400/30 sm:inline-flex">
              Early access · Private beta
            </Badge>
            <Link href="/sarathi/life-report">
              <Button
                size="sm"
                className="rounded-xl bg-indigo-500 px-4 text-xs font-medium shadow-sm hover:bg-indigo-400"
              >
                Get your Life Report
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content (shorter home) */}
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-8 md:pt-12">
        {/* Hero */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-5">
            <Badge className="bg-indigo-500/15 text-[11px] font-normal text-indigo-200 border border-indigo-400/40">
              Vedic astrology · Purpose · Practical guidance
            </Badge>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Clarity for life’s decisions —
              <span className="text-indigo-300"> in your browser.</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              Sārathi reads your chart, dashas and transits with depth—then
              translates them into calm, practical guidance for career, money,
              relationships and inner growth. No fear. No fatalism. Just honest
              direction.
            </p>

            <div className="flex flex-wrap items-center gap-3">
  <Link href="/sarathi/chat">
    <Button className="rounded-xl bg-indigo-500 px-5 text-sm font-medium shadow-sm hover:bg-indigo-400">
      Ask a question in chat
    </Button>
  </Link>

  <Link href="#about">
    <Button
      variant="outline"
      className="rounded-xl border-slate-700 bg-slate-900/60 text-xs text-slate-100 hover:bg-slate-800"
    >
      Explore Sārathi
    </Button>
  </Link>

  <span className="text-[11px] text-slate-400">
    Built for depth, not quick horoscopes.
  </span>
</div>


            {/* Quick links (keeps home short, but still lets users reach story) */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300/80">
              <Link
                href="/about"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
              >
                About
              </Link>
              <Link
                href="/about#my-story"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
              >
                My Story
              </Link>
              <Link
                href="/about#why-sarathi"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
              >
                Why Sārathi
              </Link>
              <Link
                href="/faqs"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
              >
                FAQs
              </Link>
            </div>
          </div>

          {/* Right-side summary card */}
          <Card className="border-slate-800 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <Star className="h-4 w-4 text-amber-300" />
                What you get in minutes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              <div className="flex gap-3">
                <div className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-full bg-indigo-500/20 text-[10px] font-semibold text-indigo-200 flex items-center justify-center">
                  1
                </div>
                <div>
                  <div className="font-medium text-slate-100">
                    A clean Life Report
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Your ascendant, moons, dashas and key patterns explained in
                    plain English—without cookbook copy-paste.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-full bg-indigo-500/20 text-[10px] font-semibold text-indigo-200 flex items-center justify-center">
                  2
                </div>
                <div>
                  <div className="font-medium text-slate-100">
                    Timing windows that make sense
                  </div>
                  <p className="text-[11px] text-slate-400">
                    See which months & weeks are better for career moves,
                    purchases, healing conversations and inner work.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-full bg-indigo-500/20 text-[10px] font-semibold text-indigo-200 flex items-center justify-center">
                  3
                </div>
                <div>
                  <div className="font-medium text-slate-100">
                    A calm, non-fatalistic view
                  </div>
                  <p className="text-[11px] text-slate-400">
                    No “you are doomed” predictions. Just windows, tendencies
                    and choices—so you stay in the driver’s seat.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Soft transition / philosophy strip */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-50">
                A simple way to use astrology (without anxiety)
              </div>
              <p className="mt-1 text-sm text-slate-200/80 leading-6">
                Observe the phase you’re in → understand the theme → take one clear step.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-indigo-500/15 text-[11px] font-normal text-indigo-200 border border-indigo-400/40">
                Observe
              </Badge>
              <Badge className="bg-indigo-500/15 text-[11px] font-normal text-indigo-200 border border-indigo-400/40">
                Understand
              </Badge>
              <Badge className="bg-indigo-500/15 text-[11px] font-normal text-indigo-200 border border-indigo-400/40">
                Act
              </Badge>
            </div>
          </div>
        </section>

        {/* Start with one of these */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Start with one of these
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-800 bg-slate-900/70">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-indigo-300" />
                  Life Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[11px] text-slate-400">
                <p>
                  Complete MD/AD picture, key timelines and practical life
                  themes based on your chart.
                </p>
                <Link href="/sarathi/life-report">
                  <Button
                    size="sm"
                    className="mt-1 h-7 rounded-xl bg-indigo-500 text-[11px] hover:bg-indigo-400"
                  >
                    Generate report
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-emerald-300" />
                  Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[11px] text-slate-400">
                <p>
                  A clean, print-friendly view of your main charts plus a concise guidance
                  summary based on your current dasha and life themes.
                </p>
                <Link href="/sarathi/life-guidance">
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 h-7 rounded-xl border-slate-700 bg-slate-900 text-[11px] hover:bg-slate-800"
                  >
                    Open Guidance
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-sky-300" />
                  Ask Sārathi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[11px] text-slate-400">
                <p>
                  Ask about job, money, property, relationships or vehicles.
                  Answers stay grounded and specific.
                </p>
                <Link href="/sarathi/chat">
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 h-7 rounded-xl border-slate-700 bg-slate-900 text-[11px] hover:bg-slate-800"
                  >
                    Open chat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-4 border-t border-slate-800/70 pt-8 text-xs text-slate-400">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-slate-400">
              © {new Date().getFullYear()} Sārathi. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="hover:text-slate-200">
                About
              </Link>
              <Link href="/faqs" className="hover:text-slate-200">
                FAQs
              </Link>
              <Link href="#" className="hover:text-slate-200">
                Privacy
              </Link>
              <Link href="#" className="hover:text-slate-200">
                Terms
              </Link>
              <Link href="#" className="hover:text-slate-200">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
