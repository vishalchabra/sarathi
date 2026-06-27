import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen astro-bg text-foreground">
      <header className="border-b border-[color:var(--border)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/sarathi" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--primary)]/20 border border-indigo-400/40">
              <Sparkles className="h-4 w-4 text-[color:var(--primary)]" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Sārathi</div>
              <div className="text-[11px] text-slate-900">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-sm astro-text-soft sm:flex">
  <Link href="/sarathi/about"
 className="hover:text-foreground">
    About
  </Link>
  
  
  <Link href="/sarathi/faqs" className="hover:text-foreground">
    FAQs
  </Link>

  <span className="mx-1 h-4 w-px bg-slate-800/80" />

    <Link href="/sarathi/chat" className="hover:text-foreground">
    Ask Sārathi
  </Link>
</nav>


          <Link href="/sarathi/life-report">
            <Button className="rounded-xl bg-[#6E4BC6] px-4 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#5F3FB0]">
              Get your Life Report
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <Card className="rounded-3xl astro-card backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl md:text-3xl text-foreground">
              About Sārathi
            </CardTitle>
            <p className="mt-2 text-sm leading-7 astro-text-soft">
              Sārathi means “The Charioteer of Your Journey Within.” It turns Vedic astrology
              into calm, practical guidance for real decisions — not fear, not vague predictions.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-8 md:grid-cols-2">
              {/* My Story */}
              <section
                id="my-story"
                className="scroll-mt-24 rounded-2xl border border-[color:var(--border)] bg-white/60 p-6"
              >
                <h2 className="text-lg font-semibold text-foreground">My Story</h2>

                <p className="mt-2 text-sm leading-6 astro-text-soft">
                  Sārathi was born from a difficult phase in my own life — a time when I was searching for
                  answers but couldn’t find guidance that felt clear, grounded, or truly supportive.
                </p>

                <p className="mt-3 text-sm leading-6 astro-text-soft">
                  Instead of giving up, I chose to take responsibility. I turned to astrology and began
                  learning it deeply — not as belief, but as a system of timing, patterns, and self-understanding.
                  It wasn’t easy, and it took years of effort, study, and lived experience.
                </p>

                <div className="my-4 h-px w-12 bg-indigo-400/40" />

                <p className="mt-3 text-sm leading-6 astro-text-soft">
                  Through that journey, one truth became clear: no one should have to struggle alone just
                  to understand what phase they are in or how to move forward wisely.
                </p>

                <p className="mt-3 text-sm leading-6 astro-text-soft">
                  I built Sārathi so others don’t have to go through what I did. It’s meant to be a true
                  guide — one that walks with you, helps you understand your timing, and supports you in
                  every area where astrology can bring clarity.
                </p>

                <div className="mt-4 text-xs astro-text-muted">— Founder, Sārathi</div>
              </section>

              {/* Why Sarathi */}
              <section
                id="why-sarathi"
                className="scroll-mt-24 rounded-2xl border border-[color:var(--border)] bg-white/60 p-6"
              >
                <h2 className="text-lg font-semibold text-foreground">Why Sārathi</h2>
                <ul className="mt-3 space-y-3 text-sm astro-text-soft">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-foreground">Practical:</b> clear “do / don’t” guidance, not confusing jargon.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-foreground">Personal:</b> based on your birth chart + timing cycles (dasha/transits).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-foreground">Calm:</b> reduces anxiety by giving structure to uncertainty.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300/80" />
                    <span>
                      <b className="text-foreground">Action-first:</b> turns insight into a plan you can follow.
                    </span>
                  </li>
                </ul>
              </section>
            </div>

            {/* What Sarathi will never do */}
            <section className="mt-8 rounded-2xl border border-[color:var(--border)] bg-white/60 p-6">
              <h3 className="text-lg font-semibold text-foreground">
                What Sārathi will never do
              </h3>
              <p className="mt-2 text-sm leading-6 astro-text-soft">
                Sārathi is built to reduce anxiety — not create it. That means we avoid fear-based astrology
                and focus on grounded decision support.
              </p>

              <ul className="mt-3 space-y-2 text-sm astro-text-soft">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-foreground">No fear:</b> no “doom” messaging or panic timelines.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-foreground">No absolutes:</b> we don’t claim certainty — we help you plan wisely.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-foreground">No dependency:</b> the goal is clarity and self-trust, not reliance.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-300/80" />
                  <span>
                    <b className="text-foreground">No jargon dumps:</b> we translate — we don’t overwhelm.
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/sarathi/life-report">
                  <Button className="rounded-xl bg-[#6E4BC6] px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#5F3FB0]">
                    Start with my Life Report
                  </Button>
                </Link>
                <Link href="/sarathi/chat">
                  <Button
  variant="outline"
  className="rounded-xl border border-[color:var(--border)] bg-white/60 text-xs text-foreground hover:bg-white/80"
>
                    Ask Sārathi in chat
                  </Button>
                </Link>
                <Link href="/sarathi" className="text-xs astro-text-muted hover:text-slate-200">
                  ← Back to Home
                </Link>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
