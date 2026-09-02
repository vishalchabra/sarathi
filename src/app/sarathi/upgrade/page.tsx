import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

export const metadata: Metadata = {
  title: "Upgrade",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{
    feature?: string;
  }>;
};

type FeatureKey = "life-report" | "ask-sarathi" | "data-engine";

const featureConfig: Record<
  FeatureKey,
  {
    title: string;
    description: string;
    backHref: string;
  }
> = {
  "life-report": {
    title: "Unlock Your Complete Life Report",
    description:
      "Access your full birth chart analysis, planetary strengths, dashas, career, relationships, wealth, health, spirituality and downloadable report.",
    backHref: "/sarathi/life-report",
  },

  "ask-sarathi": {
  title: "Continue Your Conversation with Sārathi",
  description:
    "Your complimentary Ask Sārathi question has been used. Choose a question pack to continue, or subscribe to Sārathi Pro for ongoing access to Ask Sārathi and the Data Engine.",
  backHref: "/sarathi/chat",
},

  "data-engine": {
    title: "Unlock the Sārathi Data Engine",
    description:
      "Your complimentary 24-hour access has ended. Subscribe to continue exploring Panchang, transits, yogas, Shadbala, Ashtakavarga and advanced chart tools.",
    backHref: "/sarathi/data-engine",
  },
};

export default async function SarathiUpgradePage({
  searchParams,
}: Props) {
  const { feature } = await searchParams;

  const selectedFeature: FeatureKey =
    feature === "ask-sarathi" ||
    feature === "data-engine" ||
    feature === "life-report"
      ? feature
      : "life-report";

  const config = featureConfig[selectedFeature];

  return (
    <main className="min-h-screen astro-bg px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm sm:p-8">
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

        {selectedFeature === "ask-sarathi" ? (
          <AskSarathiOptions />
        ) : null}

        {selectedFeature === "data-engine" ? (
          <DataEngineSubscription />
        ) : null}

        {selectedFeature === "life-report" ? (
          <LifeReportPurchase />
        ) : null}

        <div>
          <Link
            href={config.backHref}
            className="inline-flex rounded-xl border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}

function AskSarathiOptions() {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
  Continue with Ask Sārathi
</h2>

<p className="mt-1 text-sm text-slate-700">
  Choose the number of additional questions you need. Purchased
  questions will be added to your account after payment.
</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuestionCard
            title="1 Question"
            description="Perfect for one focused question."
            productCode="ask_1"
            buttonLabel="Buy 1 Question"
          />

          <QuestionCard
            title="3 Questions"
            description="Explore a few connected topics."
            productCode="ask_3"
            buttonLabel="Buy 3 Questions"
          />

          <QuestionCard
            title="5 Questions"
            description="A flexible pack for deeper guidance."
            productCode="ask_5"
            buttonLabel="Buy 5 Questions"
          />

          <QuestionCard
            title="10 Questions"
            description="Best for ongoing conversations and timing questions."
            productCode="ask_10"
            buttonLabel="Buy 10 Questions"
            badge="Best Value"
            highlighted
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Or Choose Unlimited Access
          </h2>

          <p className="mt-1 text-sm text-slate-700">
            Ideal for users who want to use Sārathi regularly.
          </p>
        </div>

        <ProSubscriptionCard />
      </section>
    </div>
  );
}

type QuestionCardProps = {
  title: string;
  description: string;
  productCode: "ask_1" | "ask_3" | "ask_5" | "ask_10";
  buttonLabel: string;
  badge?: string;
  highlighted?: boolean;
};

function QuestionCard({
  title,
  description,
  productCode,
  buttonLabel,
  badge,
  highlighted = false,
}: QuestionCardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/85 p-5 shadow-sm ${
        highlighted
          ? "border border-[color:var(--primary)]"
          : "border border-[color:var(--border)]"
      }`}
    >
      {badge ? (
        <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
          {badge}
        </div>
      ) : null}

      <div className={`${badge ? "mt-2" : ""} text-lg font-semibold`}>
        {title}
      </div>

      <p className="mt-2 min-h-10 text-sm leading-5 text-slate-700">
        {description}
      </p>

      <CheckoutButton productCode={productCode} currency="inr">
        {buttonLabel}
      </CheckoutButton>
    </div>
  );
}

function DataEngineSubscription() {
  return (
    <div className="mx-auto max-w-2xl">
      <ProSubscriptionCard />
    </div>
  );
}

function ProSubscriptionCard() {
  return (
    <div className="rounded-3xl border border-[color:var(--primary)] bg-white/90 p-6 shadow-sm sm:p-8">
      <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
        Monthly Subscription
      </div>

      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
        Sārathi Pro
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-700">
  Get ongoing access to Ask Sārathi and advanced Vedic astrology
  tools through one monthly subscription.
</p>

      <ul className="mt-6 space-y-3 text-sm text-slate-800">
        <li>✓ Unlimited Ask Sārathi questions</li>
        <li>✓ Unlimited Data Engine access</li>
        <li>✓ Panchang and planetary transits</li>
        <li>✓ Yogas, Shadbala and Ashtakavarga</li>
        <li>✓ Divisional charts and advanced astrology tools</li>
        <li>✓ Future premium updates</li>
      </ul>

      <CheckoutButton
        productCode="data_engine_monthly"
        currency="inr"
      >
        Subscribe to Sārathi Pro
      </CheckoutButton>
    </div>
  );
}

function LifeReportPurchase() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-[color:var(--border)] bg-white/90 p-6 shadow-sm sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
          One-Time Purchase
        </div>

        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Complete Life Report
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-700">
          Unlock your complete personal astrology report with lifetime
          access.
        </p>

        <ul className="mt-6 space-y-3 text-sm text-slate-800">
          <li>✓ Complete birth chart analysis</li>
          <li>✓ Career, wealth, relationship and health insights</li>
          <li>✓ Planetary strengths and important yogas</li>
          <li>✓ Dasha and timing roadmap</li>
          <li>✓ Spiritual direction and personal growth insights</li>
          <li>✓ Downloadable PDF report</li>
          <li>✓ Lifetime access</li>
        </ul>

        <CheckoutButton productCode="life_report" currency="inr">
          Buy Life Report
        </CheckoutButton>
      </div>
    </div>
  );
}