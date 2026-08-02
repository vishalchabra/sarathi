// FILE: src/app/sarathi/about/page.tsx
import Link from "next/link";
import { createSEO } from "@/lib/seo";
export const metadata = createSEO({
  title: "About Sārathi — Calm, Practical Vedic Astrology Guidance",
  description:
    "Learn why Sārathi was created, the meaning behind its name, and its mission to make Vedic astrology clear, practical, non-fatalistic and useful in everyday life.",
  path: "/sarathi/about",
  keywords: [
    "About Sārathi",
    "Vedic Astrology Guidance",
    "Practical Astrology",
    "AI Vedic Astrology",
    "Non-Fatalistic Astrology",
    "Jyotish Guidance",
  ],
});
function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen astro-bg text-slate-900">
      {/* subtle background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[color:var(--primary)]/20 blur-[140px]" />
        <div className="absolute left-[12%] top-[30%] h-[380px] w-[520px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute right-[10%] top-[55%] h-[380px] w-[520px] rounded-full bg-violet-500/10 blur-[130px]" />
      </div>

      {/* simple top bar */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] astro-bg/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl astro-card">
              <span className="text-lg">✧</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Sārathi</div>
              <div className="text-xs text-slate-500">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/sarathi/faqs"
              className="hidden text-sm text-slate-900 hover:text-slate-900 md:inline"
            >
              FAQs
            </Link>
            <Link
              href="/sarathi/login?next=/sarathi/chat"
              className="hidden text-sm text-slate-900 hover:text-slate-900 md:inline"
            >
              Ask Sārathi
            </Link>
            <Link
              href="/sarathi/login?next=/sarathi/life-report"
              className="rounded-full bg-[#6E4BC6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
            >
              Get your Life Report
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-14 pt-10">
        <div className="inline-flex items-center gap-2 rounded-full astro-card px-3 py-1 text-xs text-slate-900">
          Why astrology · Why Sārathi · The story
        </div>

        <h1 className="mt-5 text-3xl font-semibold leading-tight md:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-900">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-8 space-y-6">{children}</div>

        <footer className="mt-12 border-t border-[color:var(--border)] pt-6 text-xs text-slate-900/55">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Sārathi</div>
            <div className="flex flex-wrap gap-4">
              <Link className="hover:text-slate-900" href="/sarathi/privacy">
                Privacy
              </Link>
              <Link className="hover:text-slate-900" href="/sarathi/terms">
                Terms
              </Link>
              <Link className="hover:text-slate-900" href="/sarathi/contact">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl astro-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div className="text-sm font-semibold text-slate-900/90">{title}</div>
      <div className="mt-3 text-sm leading-relaxed text-slate-900">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="ml-5 list-disc text-sm leading-relaxed text-slate-900">
      {children}
    </li>
  );
}

export default function AboutPage() {
  return (
    <PageShell
  title="A founder’s message"
  subtitle="Sārathi was built to bring calm, practical guidance to real life — without fear, noise, or superstition."
>

      <Card title="The inspiration">
  <p>
    I kept noticing the same thing: people don’t struggle because they lack
    intelligence — they struggle because life becomes emotionally loud.
    Too many choices, too many opinions, and not enough inner clarity.
  </p>
  <p className="mt-3">
    I’ve always loved the deeper spirit of Vedic wisdom — not as superstition,
    but as a tool for timing, self-awareness, and steady action. That’s the
    spirit Sārathi is built on.
  </p>
  <p className="mt-3 text-slate-500">
    Sārathi isn’t here to “predict” your life. It’s here to help you see it more
    clearly — and move with confidence.
  </p>
</Card>

<Card title="Why the name Sārathi">
  <p>
    In the Mahabharata, Arjuna isn’t weak — he’s overwhelmed. Krishna doesn’t
    fight the battle for him. He becomes his <b>Sārathi</b> — his charioteer.
  </p>
  <p className="mt-3">
    A Sārathi doesn’t control your destination. A Sārathi helps you hold the
    reins with steadiness — especially when emotions are high and the road feels
    uncertain.
  </p>
  <p className="mt-4 text-slate-500">
    That’s the relationship I want Sārathi to have with you: calm presence,
    clear timing, and one practical next step.
  </p>
</Card>

<Card title="Vision">
  <p>
    To make spiritual and astrological wisdom usable in daily modern life —
    in a way that increases calm, clarity, and self-mastery.
  </p>
</Card>

<Card title="Mission">
  <ul className="mt-1 space-y-2">
    <Bullet>
      Turn complex astrology into clear guidance for decisions (career, money,
      relationships, health, growth).
    </Bullet>
    <Bullet>
      Offer timing windows and action steps without fear-based messaging.
    </Bullet>
    <Bullet>
      Respect privacy, reduce noise, and keep the experience simple and honest.
    </Bullet>
  </ul>
</Card>

<Card title="What we stand for (principles)">
  <ul className="mt-1 space-y-2">
    <Bullet>
      <b>Non-fatalist:</b> astrology is a mirror, not a prison.
    </Bullet>
    <Bullet>
      <b>Practical:</b> every insight should lead to an action or a choice.
    </Bullet>
    <Bullet>
      <b>Truthful confidence:</b> show what’s strong vs uncertain.
    </Bullet>
    <Bullet>
      <b>Respectful tone:</b> no shaming, no fear, no emotional manipulation.
    </Bullet>
    <Bullet>
      <b>Privacy first:</b> your birth data is sensitive and treated that way.
    </Bullet>
  </ul>
</Card>

<Card title="A note to you">
  <p>
    If you’re here, you probably want clarity — not more information.
    My hope is that Sārathi feels like a steady guide: honest, calm, and
    genuinely helpful.
  </p>
  <div className="mt-5 flex flex-wrap gap-3">
    <Link
      href="/sarathi/login?next=/sarathi/life-report"
      className="rounded-full bg-[#6E4BC6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
    >
      Start with your Life Report
    </Link>
    <Link
      href="/sarathi/login?next=/sarathi/chat"
      className="rounded-full astro-card px-4 py-2 text-sm font-semibold text-slate-900/90 hover:bg-white/80 hover:shadow-md"
    >
      Ask Sārathi
    </Link>
    <Link
      href="/sarathi/contact"
      className="rounded-full astro-card px-4 py-2 text-sm font-semibold text-slate-900/90 hover:bg-white/80 hover:shadow-md"
    >
      Contact
    </Link>
  </div>
</Card>
    </PageShell>
  );
}
