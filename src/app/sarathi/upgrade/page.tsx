import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

type Props = {
  searchParams: Promise<{
    feature?: string;
  }>;
};

const featureConfig = {
  "life-report": {
    title: "Unlock Your Complete Life Report",
    description:
      "Access your full birth chart analysis, planetary strengths, dashas, career, relationships, wealth, health, spirituality and downloadable report.",
    backHref: "/sarathi",
  },
  "ask-sarathi": {
    title: "Continue Your Conversation with Sārathi",
    description:
      "You’ve used your complimentary question. Upgrade to continue asking deeper questions about timing, decisions and life direction.",
    backHref: "/sarathi/chat",
  },
  "data-engine": {
    title: "Unlock the Sārathi Data Engine",
    description:
      "Your complimentary 24-hour access has ended. Continue exploring Panchang, transits, yogas, Shadbala, Ashtakavarga and advanced chart tools.",
    backHref: "/sarathi/data-engine",
  },
};

export default async function SarathiUpgradePage({ searchParams }: Props) {
  const { feature } = await searchParams;

  const config =
    featureConfig[feature as keyof typeof featureConfig] ??
    featureConfig["life-report"];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
          Unlock Sārathi
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          {config.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
          {config.description}
        </p>
      </section>

     {feature === "ask-sarathi" ? (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">
        1 Question
      </div>

      <p className="mt-2 text-sm text-slate-700">
        Perfect for one focused question.
      </p>

      <CheckoutButton productCode="ask_1" currency="inr">
        Buy 1 Question
      </CheckoutButton>
    </div>

    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">
        3 Questions
      </div>

      <p className="mt-2 text-sm text-slate-700">
        Continue exploring a few connected topics.
      </p>

      <CheckoutButton productCode="ask_3" currency="inr">
        Buy 3 Questions
      </CheckoutButton>
    </div>

    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">
        5 Questions
      </div>

      <p className="mt-2 text-sm text-slate-700">
        A flexible pack for deeper guidance.
      </p>

      <CheckoutButton productCode="ask_5" currency="inr">
        Buy 5 Questions
      </CheckoutButton>
    </div>

    <div className="rounded-2xl border border-[color:var(--primary)] bg-white/90 p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
        Best Value
      </div>

      <div className="mt-2 text-lg font-semibold text-slate-900">
        10 Questions
      </div>

      <p className="mt-2 text-sm text-slate-700">
        Best for ongoing conversations and timing questions.
      </p>

      <CheckoutButton productCode="ask_10" currency="inr">
        Buy 10 Questions
      </CheckoutButton>
    </div>
  </div>
) : (
  <div className="grid gap-4 md:grid-cols-2">
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">
        Sārathi Pro
      </div>

      <div className="mt-2 text-sm text-slate-700">
        For users who want ongoing access to Sārathi’s AI guidance and
        advanced astrology tools.
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-800">
        <li>✓ Unlimited Ask Sārathi questions</li>
        <li>✓ Unlimited Data Engine access</li>
        <li>✓ Daily predictions and transits</li>
        <li>✓ Future premium updates</li>
      </ul>

      <button className="mt-5 w-full rounded-xl bg-[color:var(--primary)] px-4 py-2.5 text-sm font-semibold text-white opacity-80">
        Payments Opening Shortly
      </button>
    </div>

    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">
        Life Report
      </div>

      <div className="mt-2 text-sm text-slate-700">
        One-time unlock for your complete personal astrology report.
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-800">
        <li>✓ Complete Life Report</li>
        <li>✓ Career, wealth, relationship and health insights</li>
        <li>✓ Dasha and timing roadmap</li>
        <li>✓ PDF download</li>
        <li>✓ Lifetime access</li>
      </ul>

      <CheckoutButton productCode="life_report" currency="inr">
        Buy Life Report
      </CheckoutButton>
    </div>
  </div>
)}

      <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white/60 p-5">
        <div className="text-sm font-semibold text-slate-900">
          One-on-One Consultation
        </div>

        <p className="mt-2 text-sm text-slate-700">
          Personal consultation booking will be added soon for users who want a
          deeper discussion with the founder.
        </p>
      </div>

      <Link
        href={config.backHref}
        className="inline-flex rounded-xl border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-slate-900"
      >
        Back
      </Link>
    </main>
  );
}