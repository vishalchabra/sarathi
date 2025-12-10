// FILE: app/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/40">
              <Sparkles className="h-4 w-4 text-indigo-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">
                AstroSārathi
              </div>
              <div className="text-[11px] text-slate-400">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <nav className="hidden gap-4 text-sm text-slate-300 sm:flex">
            <Link href="/sarathi/life-report" className="hover:text-slate-50">
              Life Report
            </Link>
            <Link href="/sarathi/daily-guide" className="hover:text-slate-50">
              Daily Guide
            </Link>
            <Link href="/sarathi/chat" className="hover:text-slate-50">
              Ask AstroSārathi
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

      {/* Main content */}
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-16 pt-8 md:pt-12">
        {/* Hero */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-5">
            <Badge className="bg-indigo-500/15 text-[11px] font-normal text-indigo-200 border border-indigo-400/40">
              Vedic astrology · Purpose · Practical guidance
            </Badge>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              A world-class Vedic astrologer,
              <span className="text-indigo-300"> in your browser.</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              AstroSārathi reads your chart, dashas and transits like an expert
              astrologer—then translates it into clear, practical guidance for
              career, money, relationships and inner growth. No fear, no drama,
              just honest direction.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/sarathi/life-report">
                <Button className="rounded-xl bg-indigo-500 px-5 text-sm font-medium shadow-sm hover:bg-indigo-400">
                  Generate my Life Report
                </Button>
              </Link>
              <Link href="/sarathi/chat">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-700 bg-slate-900/60 text-xs text-slate-100 hover:bg-slate-800"
                >
                  Ask a question in chat
                </Button>
              </Link>
              <span className="text-[11px] text-slate-400">
                Built for depth, not quick horoscopes.
              </span>
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

        {/* What you can do today */}
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
                  Daily Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[11px] text-slate-400">
                <p>
                  Panchang + transits + dashas → one steady daily focus, fasting
                  guidance and emotional weather.
                </p>
                <Link href="/sarathi/daily-guide">
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 h-7 rounded-xl border-slate-700 bg-slate-900 text-[11px] hover:bg-slate-800"
                  >
                    See today&apos;s day-plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-sky-300" />
                  Ask AstroSārathi
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

        {/* Why different */}
        <section className="space-y-4 border-t border-slate-800/70 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Why AstroSārathi feels different
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-[11px] text-slate-300">
            <div className="space-y-1.5">
              <div className="font-semibold text-slate-100">
                World-class logic, humble tone
              </div>
              <p className="text-slate-400">
                Reads dashas & transits like a top astrologer—but talks like a
                calm friend who wants you to win.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-slate-100">
                No fear, no superstition
              </div>
              <p className="text-slate-400">
                No curses, no dramatic threats. Only windows, probabilities and
                your choices.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-slate-100">
                Built for real life decisions
              </div>
              <p className="text-slate-400">
                From “Should I change jobs?” to “Is this a good month to buy a
                car?”—answers stay practical and specific.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
