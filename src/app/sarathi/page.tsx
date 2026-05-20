// FILE: src/app/sarathi/page.tsx
import Link from "next/link";

export default function SarathiHome() {
  return (
    <main className="astro-bg min-h-screen text-foreground">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[color:var(--primary)]/20 blur-[140px]" />
        <div className="absolute left-[12%] top-[30%] h-[380px] w-[520px] rounded-full bg-amber-200/25 blur-[130px]" />
        <div className="absolute right-[10%] top-[55%] h-[380px] w-[520px] rounded-full bg-fuchsia-200/20 blur-[130px]" />
      </div>

      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl astro-card">
              <span className="text-lg">✧</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Sārathi</div>
              <div className="text-xs astro-text-muted">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-foreground/75 md:flex">
            <Link className="hover:text-foreground" href="/sarathi/about">
              About
            </Link>
            <Link className="hover:text-foreground" href="/sarathi/faqs">
              FAQs
            </Link>
            <Link className="hover:text-foreground" href="/sarathi/chat">
              Ask Sārathi
            </Link>
            <Link className="hover:text-foreground" href="/sarathi/data-engine">
  Sārathi Astrologer’s Desk
</Link>
            <Link className="hover:text-foreground" href="/sarathi/privacy">
              Privacy
            </Link>
            <Link className="hover:text-foreground" href="/sarathi/terms">
              Terms
            </Link>
            <Link className="hover:text-foreground" href="/sarathi/contact">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-amber-300/40 bg-amber-100 px-3 py-1 text-xs text-amber-800 md:inline-flex">
              Early access · Private beta
            </span>
            <Link
              href="/sarathi/life-report"
              className="rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90"
            >
              Get your Life Report
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 md:pt-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          {/* Left: Hero copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full astro-card px-3 py-1 text-xs astro-text-soft">
              Vedic astrology · Purpose · Practical guidance
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
              Clarity for life’s decisions <br />
              <span className="text-[color:var(--primary)]">in your browser.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed astro-text-soft">
              Sārathi reads your chart, dashas and transits with depth then
              translates them into calm, practical guidance for career, money,
              relationships and inner growth. No fear. No fatalism. Just honest
              direction.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/sarathi/chat"
                className="rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset] hover:opacity-90"
              >
                Ask a question in chat
              </Link>

              <Link
                href="#start"
                className="rounded-full astro-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
              >
                Explore Sārathi
              </Link>

              <span className="text-xs astro-text-soft">
                Built for depth, not quick horoscopes.
              </span>
            </div>

          </div>

          {/* Right: "What you get in minutes" card */}
          <div className="rounded-2xl astro-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">★</span>
              <h3 className="text-sm font-semibold text-foreground">
                What you get in minutes
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              <Step
                n="1"
                title="A clean Life Report"
                desc="Your ascendant, moons, dashas and key patterns explained in plain English without cookbook copy-paste."
              />
              <Step
                n="2"
                title="Timing windows that make sense"
                desc="See which months & weeks are better for career moves, purchases, healing conversations and inner work."
              />
              <Step
                n="3"
                title="A calm, non-fatalist view"
                desc="No ‘you are doomed’ predictions. Just windows, tendencies and choices so you stay in the driver’s seat."
              />
            </div>
          </div>
        </div>

        {/* Anxiety-free strip */}
        <div className="mt-10 rounded-2xl astro-card px-6 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">
                A simple way to use astrology (without anxiety)
              </div>
              <div className="mt-1 text-sm astro-text-soft">
                Observe the phase you’re in · understand the theme · take one
                clear step.
              </div>
            </div>

            <div className="flex items-center gap-2">
              {["Observe", "Understand", "Act"].map((t) => (
                <span
                  key={t}
                  className="rounded-full astro-chip px-3 py-1 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
{/* =========================
    MEATY SECTIONS (Why / Story / What it does / Trust)
   ========================= */}
<section className="mx-auto max-w-6xl px-4 pb-16">
  <div className="grid gap-6 md:grid-cols-2">
    {/* Why astrology */}
    <div className="rounded-2xl astro-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div className="text-xs font-semibold tracking-wide astro-text-muted">
        WHY ASTROLOGY
      </div>
      <h2 className="mt-2 text-xl font-semibold text-foreground">
        A language of timing — not superstition
      </h2>
      <p className="mt-3 text-sm leading-relaxed astro-text-soft">
        Astrology isn’t meant to create fear or fixed fate. At its best, it’s a
        language of <b>timing and tendencies</b>. When you know the season
        you’re in, you stop fighting yourself — and you make clearer decisions.
      </p>

      <ul className="mt-4 space-y-2 text-sm astro-text-soft">
        <li className="ml-5 list-disc">
          <b>Clarity:</b> why a phase feels heavy, urgent, or slow
        </li>
        <li className="ml-5 list-disc">
          <b>Timing:</b> when to act, wait, repair, or build
        </li>
        <li className="ml-5 list-disc">
          <b>Self-mastery:</b> respond with awareness instead of reacting
        </li>
      </ul>

      <div className="mt-4 rounded-xl astro-card p-4 text-sm astro-text-soft">
        <span className="astro-text-soft">Promise:</span> The point isn’t
        prediction. The point is direction.
      </div>
    </div>

    {/* Why Sarathi */}
    <div className="rounded-2xl astro-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div className="text-xs font-semibold tracking-wide astro-text-muted">
        WHY SĀRATHI
      </div>
      <h2 className="mt-2 text-xl font-semibold text-foreground">
        Depth without anxiety
      </h2>
      <p className="mt-3 text-sm leading-relaxed astro-text-soft">
        Most astrology content is either vague (“good things will happen”) or
        dramatic (“danger ahead”). Sārathi is built for people who want
        <b> calm clarity</b> and one practical next step.
      </p>

      <ul className="mt-4 space-y-2 text-sm astro-text-soft">
        <li className="ml-5 list-disc">
          Uses <b>Dasha + degree-true transits + today’s Panchang</b>
        </li>
        <li className="ml-5 list-disc">
          Converts it into <b>plain English</b> + <b>one clear step</b>
        </li>
        <li className="ml-5 list-disc">
          Adds <b>confidence</b> so you know what’s strong vs uncertain
        </li>
        <li className="ml-5 list-disc">
          Avoids fatalism — <b>you stay in the driver’s seat</b>
        </li>
      </ul>
    </div>
  </div>

  {/* Mahabharata story */}
  <div className="mt-6 rounded-2xl astro-card p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold tracking-wide astro-text-muted">
          THE STORY
        </div>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          Krishna as Sārathi — and why this matters
        </h2>

        <p className="mt-3 text-sm leading-relaxed astro-text-soft">
          On the battlefield of Kurukshetra, Arjuna wasn’t lacking skill — he
          was overwhelmed. Duty, emotion, fear, consequence — everything
          collided at once.
        </p>

        <p className="mt-3 text-sm leading-relaxed astro-text-soft">
          Krishna didn’t pick up the bow. He didn’t fight the battle for Arjuna.
          He became his <b>Sārathi</b> — his charioteer.
        </p>

        <p className="mt-3 text-sm leading-relaxed astro-text-soft">
          A Sārathi doesn’t control your life. A Sārathi helps you <b>see</b>,
          <b> choose</b>, and <b>move forward with steadiness</b>.
        </p>

        <div className="mt-4 text-sm astro-text-soft">
          That’s what this app is meant to be:{" "}
          <span className="astro-text-soft font-semibold">
            your Sārathi — the charioteer of your journey within.
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-3">
        <a
          href="/sarathi/about"
          className="rounded-full astro-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
        >
          Read the full story →
        </a>
        <a
          href="/sarathi/life-report"
          className="rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Get your Life Report
        </a>
      </div>
    </div>
  </div>
  {/* Trust / links */}
  <div className="mt-6 rounded-2xl astro-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm font-semibold text-foreground">
          Private by design
        </div>
        <div className="mt-1 text-sm astro-text-soft">
          Your birth data is sensitive. We treat it with respect. No selling.
          No public profiles. You stay in control.
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="/sarathi/privacy"
          className="rounded-full astro-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
        >
          Privacy
        </a>
        <a
          href="/sarathi/terms"
          className="rounded-full astro-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
        >
          Terms
        </a>
        <a
          href="/sarathi/contact"
          className="rounded-full astro-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
        >
          Contact
        </a>
      </div>
    </div>
  </div>
</section>

      {/* Start with one of these */}
      <section
        id="start"
        className="mx-auto max-w-6xl px-4 pb-16 pt-2"
      >
        <div className="text-xs font-semibold tracking-widest astro-text-muted">
          START WITH ONE OF THESE
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <StartCard
            icon="◷"
            title="Life Report"
            desc="Complete MD/AD picture, key timelines and practical life themes based on your chart."
            cta="Generate report"
            href="/sarathi/life-report"
            accent="indigo"
          />
          <StartCard
  icon="✦"
  title="Focused Reports"
  desc="Get precise predictions for career, marriage, money and more using divisional charts with real timing and decision guidance."
  cta="Explore Reports"
  href="/sarathi/focused-reports"
  accent="emerald"
/>
          <StartCard
            icon="💬"
            title="Ask Sārathi"
            desc="Ask about job, money, property, relationships or vehicles. Answers stay grounded and specific."
            cta="Open chat"
            href="/sarathi/chat"
            accent="cyan"
          />
        </div>

        <footer className="mt-14 border-t border-[color:var(--border)] pt-6 text-xs astro-text-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Sārathi. All rights reserved.</div>
            <div className="flex flex-wrap gap-4">
              <Link className="hover:text-foreground" href="/sarathi/about">
                About
              </Link>
              <Link className="hover:text-foreground" href="/sarathi/faqs">
                FAQs
              </Link>
              <Link className="hover:text-foreground" href="/sarathi/privacy">
                Privacy
              </Link>
              <Link className="hover:text-foreground" href="/sarathi/terms">
                Terms
              </Link>
              <Link className="hover:text-foreground" href="/sarathi/contact">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

function Step({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-foreground ring-1 ring-[color:var(--border)]">
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm leading-relaxed astro-text-soft">{desc}</div>
      </div>
    </div>
  );
}

function StartCard({
  icon,
  title,
  desc,
  cta,
  href,
  accent,
}: {
  icon: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  accent: "indigo" | "emerald" | "cyan";
}) {
const accentMap = {
  indigo: "text-purple-700",
  emerald: "text-emerald-700",
  cyan: "text-sky-700",
};

  return (
    <div className="rounded-2xl astro-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div className="flex items-center gap-3">
        <div className={`text-lg ${accentMap[accent]}`}>{icon}</div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
      </div>

      <p className="mt-4 text-sm leading-relaxed astro-text-soft">{desc}</p>

      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center rounded-full astro-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
