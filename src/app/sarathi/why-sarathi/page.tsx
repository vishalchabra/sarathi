import Link from "next/link";

export default function WhySarathiPage() {
  return (
    <main className="min-h-screen astro-bg text-slate-900">
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <Link href="/sarathi" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to Sārathi
        </Link>

        <div className="mt-10">
          <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold text-slate-700">
            Why Sārathi
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Astrology should give you{" "}
            <span className="text-[color:var(--primary)]">clarity, not fear.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
            Sārathi was created because most astrology experiences are either too
            vague, too scary, or too complicated. We are building a calmer,
            more practical way to use astrology for real life.
          </p>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <InfoCard
            title="Not fear-based"
            text="We do not use doom language, panic predictions, or emotional pressure."
          />
          <InfoCard
            title="Not generic"
            text="Guidance is based on your chart, timing cycles, transits, and the question you ask."
          />
          <InfoCard
            title="Not overwhelming"
            text="Complex astrology is translated into simple themes, timing, and next steps."
          />
        </section>

        <section className="mt-10 rounded-3xl astro-card p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            How we are different
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Feature
              title="We combine depth with simplicity"
              text="Sārathi uses serious astrological layers, dashas, transits, vargas, Panchang and chart context, but presents them in language you can actually use."
            />
            <Feature
              title="We focus on decisions"
              text="The goal is not entertainment. The goal is to help you understand your phase and make better choices in career, money, relationships, health and growth."
            />
            <Feature
              title="We avoid fatalism"
              text="Astrology shows tendencies and timing. It should never make you feel trapped. Sārathi keeps free will and practical action at the center."
            />
            <Feature
              title="We show timing, not panic"
              text="Instead of saying something will definitely happen, Sārathi highlights windows, themes, strengths, cautions and what you can do."
            />
            <Feature
              title="We serve both individuals and astrologers"
              text="Individuals get guidance they can understand. Astrologers get a professional data engine to reduce manual checking and support better consultations."
            />
            <Feature
              title="We respect your privacy"
              text="Birth details are deeply personal. Sārathi is designed around privacy, account-based access and responsible handling of your data."
            />
          </div>
        </section>

        <section className="mt-10 rounded-3xl astro-card p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Why we are doing this
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Because people need guidance without confusion.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            Life becomes difficult when timing, emotions, responsibilities and
            choices all collide. Astrology can help, but only when it is used
            with maturity. Sārathi exists to bring the wisdom of astrology into
            modern life in a calm, useful and responsible way.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            We believe astrology should support self-awareness, not dependency.
            It should help you pause, understand the phase you are in, and take
            the next right step with steadiness.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-[color:var(--border)] bg-white/70 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            Choose your journey
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ChoiceCard
              title="For individuals"
              text="Generate your Life Report or ask Sārathi about your current phase, decisions and timing."
              href="/sarathi/individual"
              cta="Explore for Individuals"
            />
            <ChoiceCard
              title="For astrologers"
              text="Use the Astrologer Data Engine to simplify chart analysis and consultation preparation."
              href="/sarathi/astrologers"
              cta="Explore for Astrologers"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl astro-card p-6">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/55 p-5">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}

function ChoiceCard({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl astro-card p-6">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{text}</p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-full bg-[#6E4BC6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
      >
        {cta}
      </Link>
    </div>
  );
}