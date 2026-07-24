// FILE: src/app/sarathi/page.tsx
import Link from "next/link";

export default function SarathiHome() {
  return (
    <main className="astro-bg min-h-screen text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[color:var(--primary)]/20 blur-[140px]" />
        <div className="absolute left-[12%] top-[30%] h-[380px] w-[520px] rounded-full bg-amber-200/25 blur-[130px]" />
        <div className="absolute right-[10%] top-[55%] h-[380px] w-[520px] rounded-full bg-fuchsia-200/20 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-start gap-12 px-4 py-4">
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

          <nav className="hidden items-center gap-5 text-sm text-foreground/75 lg:flex">
            <Link className="hover:text-foreground" href="/sarathi/about">About Us</Link>
            <Link className="hover:text-foreground" href="/sarathi/why-sarathi">Why Sārathi</Link>
            <Link className="hover:text-foreground" href="/sarathi/faqs">FAQs</Link>
            <Link className="hover:text-foreground" href="/sarathi/privacy">Privacy</Link>
            <Link className="hover:text-foreground" href="/sarathi/terms">Terms</Link>
            <Link className="hover:text-foreground" href="/sarathi/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold astro-text-soft">
            Vedic astrology · Life guidance · Astrologer data engine
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
            One Sārathi. <br />
            <span className="text-[color:var(--primary)]">
              Two journeys.
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed astro-text-soft md:text-lg">
            Whether you are looking for personal clarity or you are an astrologer
            serving clients, Sārathi helps convert complex astrology into clear,
            useful direction.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <JourneyCard
            eyebrow="For individuals"
            title="Looking for clarity in life?"
            desc="Generate your personalized Life Report, understand your current phase, and ask Sārathi questions about career, money, relationships, property, health, and inner growth."
            points={[
              "Personal Life Report based on your birth details",
              "Current dasha, timing windows, and practical guidance",
              "Ask Sārathi for specific life questions",
              "Simple language. No fear. No fatalism.",
            ]}
            primaryHref="/sarathi/individual"
            primaryCta="Explore for Individuals"
            secondaryHref="/sarathi/individual/login?next=/sarathi/chat"
            secondaryCta="Ask Sārathi"
          />

          <JourneyCard
  eyebrow="For astrologers"
  title="Need a better way to read charts?"
  desc="Use Sārathi’s Astrologer Data Engine to bring chart data, dashas, transits, vargas, Panchang, strengths, and client-ready insights into one clean workspace."
  points={[
    "All core chart data organized in one place",
    "Dasha, transit, varga, strength, and Panchang layers",
    "Built for professional astrologers and consultants",
    "Less manual checking. More time for judgment.",
  ]}
  primaryHref="/sarathi/astrologers"
  primaryCta="Explore for Astrologers"
  secondaryHref="/sarathi/astrologers/login?next=/sarathi/data-engine"
  secondaryCta="Open Data Engine"
/>
        </div>

        <div className="mt-10 rounded-2xl astro-card p-6 text-center">
          <div className="text-sm font-semibold text-foreground">
            Sārathi does not replace your free will.
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed astro-text-soft">
            It helps you understand the phase you are in, the choices in front
            of you, and the timing that supports your next step.
          </p>
        </div>

        <footer className="mt-14 border-t border-[color:var(--border)] pt-6 text-xs astro-text-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Sārathi. All rights reserved.</div>
            <div className="flex flex-wrap gap-4">
              <Link className="hover:text-foreground" href="/sarathi/about">About</Link>
              <Link className="hover:text-foreground" href="/sarathi/faqs">FAQs</Link>
              <Link className="hover:text-foreground" href="/sarathi/privacy">Privacy</Link>
              <Link className="hover:text-foreground" href="/sarathi/terms">Terms</Link>
              <Link className="hover:text-foreground" href="/sarathi/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

function JourneyCard({
  eyebrow,
  title,
  desc,
  points,
  primaryHref,
  primaryCta,
  secondaryHref,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
  primaryHref: string;
  primaryCta: string;
  secondaryHref: string;
  secondaryCta: string;
}) {
  return (
    <div className="flex min-h-[520px] flex-col rounded-3xl astro-card p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div className="text-xs font-semibold uppercase tracking-widest astro-text-muted">
        {eyebrow}
      </div>

      <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-relaxed astro-text-soft md:text-base">
        {desc}
      </p>

      <ul className="mt-6 space-y-3 text-sm astro-text-soft">
        {points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--primary)]" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
        <Link
          href={primaryHref}
          className="inline-flex justify-center rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {primaryCta}
        </Link>

        <Link
          href={secondaryHref}
          className="inline-flex justify-center rounded-full astro-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
        >
          {secondaryCta}
        </Link>
      </div>
    </div>
  );
}