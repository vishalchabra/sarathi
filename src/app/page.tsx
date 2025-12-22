// FILE: app/page.tsx

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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/40">
              <Sparkles className="h-4 w-4 text-indigo-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">
                Sārathi
              </div>
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
         {/* ===================== About Us ===================== */}
<section id="about" className="mx-auto max-w-5xl px-4 py-12 md:py-16">
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
      About Sārathi
    </h2>
    <p className="mt-3 text-slate-200/80 leading-7">
      Sārathi means “The Charioteer of Your Journey Within.” It’s designed to turn Vedic astrology
      into calm, practical guidance for daily life — not fear, not vague predictions.
    </p>

    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {/* My Story */}
      <div id="my-story" className="scroll-mt-24 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
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

  <p className="mt-3 text-sm leading-6 text-slate-200/80">
    Through that journey, one truth became clear: no one should have to struggle alone just
    to understand what phase they are in or how to move forward wisely.
  </p>

  <p className="mt-3 text-sm leading-6 text-slate-200/80">
    I built Sārathi so others don’t have to go through what I did. It’s meant to be a true
    guide — one that walks with you, helps you understand your timing, and supports you in
    every area where astrology can bring clarity.
  </p>
  <div className="mt-4 text-xs text-slate-300/70">
  — Founder, Sārathi
</div>
</div>


      {/* Why Sarathi */}
      <div id="why-sarathi" className="rounded-2xl border border-white/10 bg-slate-950/30 p-5">
        <h3 className="text-lg font-semibold text-slate-50">Why Sārathi</h3>
        <ul className="mt-3 space-y-3 text-sm text-slate-200/80">
          <li className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
            <span><b className="text-slate-100">Practical:</b> clear “do / don’t” guidance, not confusing jargon.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
            <span><b className="text-slate-100">Personal:</b> based on your birth chart + timing cycles (dasha/transits).</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
            <span><b className="text-slate-100">Calm:</b> reduces anxiety by giving structure to uncertainty.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
            <span><b className="text-slate-100">Action-first:</b> turns insight into a plan you can follow.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
<div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
  <h3 className="text-lg font-semibold text-slate-50">What Sārathi will never do</h3>
  <p className="mt-2 text-sm leading-6 text-slate-200/80">
    Sārathi is built to reduce anxiety — not create it. That means we avoid fear-based astrology
    and focus on grounded decision support.
  </p>

  <ul className="mt-3 space-y-2 text-sm text-slate-200/80">
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
      <span><b className="text-slate-100">No fear:</b> no “doom” messaging or panic timelines.</span>
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
      <span><b className="text-slate-100">No absolutes:</b> we don’t claim certainty — we help you plan wisely.</span>
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
      <span><b className="text-slate-100">No dependency:</b> the goal is clarity and self-trust, not reliance.</span>
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
      <span><b className="text-slate-100">No jargon dumps:</b> we translate — we don’t overwhelm.</span>
    </li>
  </ul>
</div>

{/* ===================== FAQs ===================== */}
<section id="faqs" className="mx-auto max-w-5xl px-4 pb-16">
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
      FAQs
    </h2>
    <p className="mt-3 text-slate-200/80 leading-7">
      Answers to the questions most people ask before they begin.
    </p>

    <div className="mt-8 grid gap-4">
      {[
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
      ].map((item, idx) => (
        <details
          key={idx}
          className="group rounded-2xl border border-white/10 bg-slate-950/30 p-5"
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
    <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
  <h3 className="text-lg font-semibold text-slate-50">Our promise</h3>
  <p className="mt-2 text-sm leading-6 text-slate-200/80">
    Sārathi is here to help you move through life with steadiness. Not by predicting your life for you,
    but by giving you timing, clarity, and a simple plan — so you can act with confidence.
  </p>

  <div className="mt-4 grid gap-3 md:grid-cols-3">
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold text-slate-100">Clarity</div>
      <div className="mt-1 text-xs text-slate-200/80">
        Understand what phase you’re in and what it means — in simple language.
      </div>
    </div>
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold text-slate-100">Timing</div>
      <div className="mt-1 text-xs text-slate-200/80">
        Know when to push, when to build, and when to be patient.
      </div>
    </div>
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold text-slate-100">Action</div>
      <div className="mt-1 text-xs text-slate-200/80">
        Get practical “do / don’t” guidance you can apply immediately.
      </div>
    </div>
  </div>

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
    <span className="text-[11px] text-slate-400">
      Calm guidance. Practical steps. Better timing.
    </span>
  </div>
</div>
  </div>
</section>

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

        {/* Why different */}
        <section className="space-y-4 border-t border-slate-800/70 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Why Sārathi feels different
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
