import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personalised Vedic Astrology Life Report & Guidance",

  description:
    "Understand your birth chart, current dasha, planetary transits and important life phases with Sārathi. Generate a personalised Vedic astrology Life Report and explore guidance around timing, decisions and life themes.",

  alternates: {
    canonical: "/sarathi/individual",
  },

  openGraph: {
    title: "Personalised Vedic Astrology Life Report & Guidance | Sārathi",
    description:
      "Understand your birth chart, current timing and important life phases through personalised Vedic astrology guidance.",
    url: "/sarathi/individual",
    type: "website",
    images: [
      {
        url: "/sarathi-logo.png",
        width: 1024,
        height: 1024,
        alt: "Sārathi Vedic Astrology",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Personalised Vedic Astrology Life Report & Guidance | Sārathi",
    description:
      "Understand your birth chart, current timing and important life phases through personalised Vedic astrology guidance.",
    images: ["/sarathi-logo.png"],
  },
};
export default function IndividualPage() {
  return (
    <main className="astro-bg min-h-screen text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <Link href="/sarathi" className="text-sm astro-text-soft hover:text-foreground">
          ← Back to Sārathi
        </Link>

        <div className="mt-10">
          <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold astro-text-soft">
            For individuals
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
  Understand your life through Vedic astrology,{" "}
  <span className="text-[color:var(--primary)]">then move with clarity.</span>
</h1>

         <p className="mt-5 max-w-3xl text-base leading-relaxed astro-text-soft md:text-lg">
  Sārathi brings together your Vedic birth chart, current dasha,
  planetary transits and timing windows in clear language — helping you
  understand the phase you are moving through and make decisions with
  greater clarity.
</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sarathi/individual/login?next=/sarathi/life-report"
              className="rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Generate Life Report
            </Link>

            <Link
              href="/sarathi/individual/login?next=/sarathi/chat"
              className="rounded-full astro-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
            >
              Ask Sārathi
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <InfoCard
            title="Know your current phase"
            text="Understand what your active Mahadasha, Antardasha and transits are highlighting."
          />
          <InfoCard
            title="Ask specific questions"
            text="Career, money, marriage, property, health, children, inner growth and more."
          />
          <InfoCard
            title="Get practical guidance"
            text="No fear-based astrology. Just clear themes, timing and next steps."
          />
        </section>

        <section className="mt-10 rounded-3xl astro-card p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-widest astro-text-muted">
            What you get
          </div>

          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            A personal astrology guide built around your chart.
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Feature
              title="Life Report"
              text="A clear overview of your personality patterns, life themes, strengths, challenges and major phases."
            />
            <Feature
              title="Current timing"
              text="Understand your active dasha and the life areas being emphasized right now."
            />
            <Feature
              title="Near future guidance"
              text="See practical windows for career, relationships, money, home, health and inner work."
            />
            <Feature
              title="Ask Sārathi"
              text="Ask follow-up questions in plain language and receive chart-grounded answers."
            />
            <Feature
              title="Daily guidance"
              text="Use Panchang, Moon movement, transits and your chart to understand the tone of the day."
            />
            <Feature
              title="Privacy first"
              text="Your birth details are sensitive. Sārathi is designed to treat them with care."
            />
          </div>
        </section>

        <section id="pricing" className="mt-16">
          <div className="text-xs font-semibold uppercase tracking-widest astro-text-muted">
            Pricing
          </div>

          <h2 className="mt-3 text-3xl font-semibold text-foreground">
  Choose how you want to begin
</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
  <PricingCard
    name="Free Preview"
    price="₹0"
    desc="Generate a basic preview of your Life Report."
    features={[
      "Birth profile setup",
      "Basic life pattern",
      "Limited overview",
      "Locked premium sections",
    ]}
    cta="Generate free preview"
    href="/sarathi/individual/login?next=/sarathi/life-report"
  />

  <PricingCard
    name="Full Life Report"
    price="₹999"
    desc="Introductory launch offer. One-time payment for your complete personalised Life Report."
    features={[
      "Full personal Life Report",
      "Current and upcoming timing",
      "Deeper life phases",
      "Lifetime access to your complete report",
    ]}
    cta="Unlock full report"
    href="/sarathi/individual/login?next=/sarathi/life-report"
    highlighted
  />

  <PricingCard
    name="Ask Sārathi"
    price="From ₹99"
    desc="Your first question is complimentary. Continue with question packs whenever you need deeper guidance."
    features={[
  "1 Question — ₹99",
  "⭐ Most Popular | 5 Questions — ₹399",
  "3 Questions — ₹249",
  "10 Questions — ₹799",
]}
    cta="Ask Sārathi"
    href="/sarathi/individual/login?next=/sarathi/chat"
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
      <div className="text-lg font-semibold text-foreground">{title}</div>
      <p className="mt-3 text-sm leading-relaxed astro-text-soft">{text}</p>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/50 p-4">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm leading-relaxed astro-text-soft">{text}</div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  desc,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        "flex flex-col rounded-3xl p-6 " +
        (highlighted
          ? "border border-[color:var(--primary)] bg-[color:var(--primary)]/10"
          : "astro-card")
      }
    >
      <div className="text-sm font-semibold text-foreground">{name}</div>
      <div className="mt-3 text-3xl font-semibold text-foreground">{price}</div>
      <p className="mt-3 text-sm leading-relaxed astro-text-soft">{desc}</p>

      <ul className="mt-6 space-y-3 text-sm astro-text-soft">
  {features.map((f) => {
    const popular = f.startsWith("⭐");

    return (
      <li
        key={f}
        className={
          popular
            ? "rounded-xl border border-[color:var(--primary)] bg-[color:var(--primary)]/10 p-3"
            : "flex gap-2"
        }
      >
        {popular ? (
          <div>
            <div className="mb-1 text-xs font-semibold uppercase text-[color:var(--primary)]">
              ⭐ Most Popular
            </div>
            <div className="font-medium text-foreground">
              {f.replace("⭐ Most Popular | ", "")}
            </div>
          </div>
        ) : (
          <>
            <span className="text-[color:var(--primary)]">✓</span>
            <span>{f}</span>
          </>
        )}
      </li>
    );
  })}
</ul>

      <Link
        href={href}
        className="mt-auto inline-flex justify-center rounded-full bg-[color:var(--primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        {cta}
      </Link>
    </div>
  );
}