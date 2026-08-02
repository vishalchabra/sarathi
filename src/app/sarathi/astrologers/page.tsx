import Link from "next/link";
import { createSEO } from "@/lib/seo";
export const metadata = createSEO({
  title: "Professional Vedic Astrology Software for Astrologers",
  description:
    "Use Sārathi’s professional Vedic astrology Data Engine for charts, dashas, transits, vargas, Panchang, strength systems and consultation-ready analysis in one workspace.",
  path: "/sarathi/astrologers",
  keywords: [
    "Vedic Astrology Software",
    "Astrology Software for Astrologers",
    "Professional Astrology Tools",
    "Vedic Astrology Data Engine",
    "Kundli Software",
    "Dasha Analysis Software",
    "Astrology Consultation Tools",
  ],
});
export default function AstrologersPage() {
  return (
    <main className="astro-bg min-h-screen text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <Link href="/sarathi" className="text-sm astro-text-soft hover:text-foreground">
          ← Back to Sārathi
        </Link>

       <div className="mt-10">
  <div className="max-w-4xl">
    <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold astro-text-soft">
      For professional astrologers
    </div>

    <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
      Your astrology workspace,{" "}
      <span className="text-[color:var(--primary)]">simplified.</span>
    </h1>

    <p className="mt-5 max-w-3xl text-base leading-relaxed astro-text-soft md:text-lg">
      Sārathi’s Astrologer Data Engine brings chart data, dashas,
      transits, vargas, Panchang, strengths and client-ready structure
      into one clean place — so you spend less time calculating and more
      time interpreting.
    </p>

    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        href="/sarathi/astrologers/login?next=/sarathi/data-engine"
        className="rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Open Data Engine
      </Link>

      <Link
        href="#pricing"
        className="rounded-full astro-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/80 hover:shadow-md"
      >
        View pricing
      </Link>
    </div>
  </div>

  <section className="mt-10 grid gap-5 md:grid-cols-3">
    <InfoCard
      title="All data in one place"
      text="No switching between multiple tools to check dashas, vargas, transits, Panchang and chart layers."
    />
    <InfoCard
      title="Cleaner consultations"
      text="Quickly access the chart layers you need while speaking with clients."
    />
    <InfoCard
      title="Built to grow"
      text="Client saving, report generation and CRM-style follow-ups can sit on top of the same engine."
    />
  </section>

  <section className="mt-10 rounded-3xl astro-card p-6 md:p-8">
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest astro-text-muted">
          Built for consultations
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Everything an astrologer checks — organized clearly.
        </h2>
      </div>

      <Link
        href="/sarathi/astrologers/login?next=/sarathi/data-engine"
        className="mt-3 inline-flex rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 md:mt-0"
      >
        Try the workspace
      </Link>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Feature
        title="Foundations"
        text="D1 chart, house lords, planet placements, functional roles, yogakaraka, maraka, badhaka, vargottama and core chart data."
      />
      <Feature
        title="House-wise judgment"
        text="See each house through occupants, lords, aspects, strengths and activation layers."
      />
      <Feature
        title="Timing"
        text="Current dasha stack, Mahadasha, Antardasha, Pratyantardasha and timeline views."
      />
      <Feature
        title="Transits"
        text="Live transit contacts, upcoming transit windows, degree hits, house activation and transit chart by date."
      />
      <Feature
        title="Vargas"
        text="Divisional chart placements up to advanced vargas in a clean, searchable format."
      />
      <Feature
        title="Charts"
        text="Lagna, Chandra, Bhava Chalit, dasha-based charts, transit overlay and house-centered chart views."
      />
      <Feature
        title="Strength systems"
        text="Ashtakavarga, Shadbala, Bhava Madhya, Vedic aspects, Upagrahas and supporting strength metrics."
      />
      <Feature
        title="Utilities"
        text="Panchang, Hora, planet transit timeline, date-based calculations and quick reference tools."
      />
      <Feature
        title="Dedicated astrology chatbot"
        text="Ask for placements, varga positions, dasha context, transit meaning or chart data without manually searching."
      />
    </div>
  </section>
</div>

        
        <section id="pricing" className="mt-16">
          <div className="text-xs font-semibold uppercase tracking-widest astro-text-muted">
            Pricing
          </div>

          <h2 className="mt-3 text-3xl font-semibold text-foreground">
            Introductory pricing for astrologers
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <PricingCard
              name="Starter"
              price="24-hour free trial"
              desc="Explore the Data Engine with complimentary access for 24 hours."
              features={[
                "Limited chart generation",
                "Core chart data",
                "Dasha overview",
                "Basic transit view",
              ]}
              cta="Start 24-hour trial"
              href="/sarathi/astrologers/login?next=/sarathi/data-engine"
            />

            <PricingCard
              name="Professional"
              price="₹1,499 / month"
              desc="🚀 Introductory launch offer. Early adopters lock in ₹1,499/month before regular pricing of ₹1,999/month."
              features={[
                "Unlimited client chart checks",
                "Dashas, transits and vargas",
                "Panchang and timing layers",
                "Early access to upcoming CRM and report tools",
              ]}
              cta="Choose Professional"
              href="/sarathi/astrologers/login?next=/sarathi/data-engine"
              highlighted
            />

            <PricingCard
              name="Premier"
              price="Coming soon"
              desc="For astrologers who want client management and report tools."
              features={[
                "Save client charts",
                "Client dashboard",
                "Follow-up tracking",
                "Exportable reports",
              ]}
              cta="Join waitlist"
              href="/sarathi/contact"
            />
          </div>
        </section>
      </section>
    </main>
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

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl astro-card p-6">
      <div className="text-lg font-semibold text-foreground">{title}</div>
      <p className="mt-3 text-sm leading-relaxed astro-text-soft">{text}</p>
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
      <div className="mt-3">
  <div className="text-3xl font-semibold text-foreground">
    {price}
  </div>

  {highlighted && (
    <div className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
      🚀 Introductory Launch Offer
    </div>
  )}
</div>
      <p className="mt-3 text-sm leading-relaxed astro-text-soft">{desc}</p>

      <ul className="mt-6 space-y-2 text-sm astro-text-soft">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-[color:var(--primary)]">✓</span>
            <span>{f}</span>
          </li>
        ))}
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