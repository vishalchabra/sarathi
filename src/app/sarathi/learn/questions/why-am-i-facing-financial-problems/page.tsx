import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Why Am I Facing Financial Problems? Vedic Astrology Explained",
  description:
    "Learn how Vedic astrology studies financial problems through income, savings, expenses, debt, losses, planetary strength, Dashas and transits without blaming one planet.",
  path: "/sarathi/learn/questions/why-am-i-facing-financial-problems",
  keywords: [
    "Financial Problems Astrology",
    "Money Problems Astrology",
    "Financial Problems in Vedic Astrology",
    "Why Am I Facing Financial Problems",
    "Money Loss Astrology",
    "Debt Astrology",
    "Financial Difficulty Astrology",
    "Wealth Astrology",
    "2nd House Money",
    "11th House Gains",
    "12th House Expenses",
    "Vedic Astrology Money",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Why Am I Facing Financial Problems? How Vedic Astrology Studies Money Difficulties",
  description:
    "A practical guide to how Vedic astrology studies financial pressure by separating income, savings, expenses, debt, losses, instability and timing.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/why-am-i-facing-financial-problems",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/why-am-i-facing-financial-problems",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Financial problems",
    "Money astrology",
    "2nd house",
    "11th house",
    "6th house",
    "8th house",
    "12th house",
    "Vimshottari Dasha",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Sārathi",
      item: "https://www.sarathiyourguide.com/sarathi",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Knowledge Centre",
      item: "https://www.sarathiyourguide.com/sarathi/learn",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Why Am I Facing Financial Problems?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/why-am-i-facing-financial-problems",
    },
  ],
};

const problemTypes = [
  {
    title: "Low Income",
    text: "The problem may simply be that earnings are not yet sufficient. This is different from earning well but losing or spending most of the money.",
  },
  {
    title: "Unstable Income",
    text: "Money may come in irregularly through changing employment, business cycles, commissions, freelance work or inconsistent opportunities.",
  },
  {
    title: "High Expenses",
    text: "Income may be reasonable while unavoidable or repeated outflows prevent financial progress.",
  },
  {
    title: "Debt & Liabilities",
    text: "Loans, repayments, obligations and accumulated liabilities can create pressure even when income itself is not weak.",
  },
  {
    title: "Financial Loss",
    text: "A person may experience identifiable periods of loss through business, investment, unexpected events or poor financial decisions.",
  },
  {
    title: "Difficulty Saving",
    text: "Money may enter regularly but fail to become accumulated resources, creating a recurring sense of financial insecurity.",
  },
];

const chartFactors = [
  {
    title: "2nd House",
    text: "The 2nd house can relate to accumulated resources, savings and the financial base a person is able to build and retain.",
  },
  {
    title: "11th House",
    text: "The 11th house is important for gains and the material results of effort. It helps us study whether opportunities actually translate into financial benefit.",
  },
  {
    title: "6th House",
    text: "Depending on the horoscope and exact question, the 6th can become relevant to debts, repayments, obligations, service conditions and financial burdens that require ongoing management.",
  },
  {
    title: "8th House",
    text: "The 8th can become relevant where finances involve sudden disruption, shared resources, liabilities, uncertainty or circumstances outside ordinary income patterns.",
  },
  {
    title: "12th House",
    text: "The 12th is important when studying expenditure and outflow. Expense itself is not automatically negative — the nature, scale and context of the outflow matter.",
  },
  {
    title: "10th House",
    text: "For many people, profession is the primary source of income. Career instability can therefore become a financial issue even when the money houses themselves are not the only factors involved.",
  },
];

const timingLayers = [
  {
    title: "Natal Promise",
    text: "First establish the underlying financial structure of the horoscope. A temporary transit should not be used to invent a problem that the broader chart does not support.",
  },
  {
    title: "Planetary Strength",
    text: "Study the capacity of the planets carrying financial responsibilities. House ownership alone does not tell us whether those responsibilities are handled easily.",
  },
  {
    title: "Sambandha",
    text: "Connections between income, gains, expenses, debt, career and other relevant houses help reveal how different parts of the financial story interact.",
  },
  {
    title: "Dasha",
    text: "The running Mahadasha, Antardasha and finer periods help show which natal agendas are currently activated.",
  },
  {
    title: "Relevant Varga",
    text: "Divisional charts may refine a specific dimension after the D1 promise is understood. They should support interpretation rather than replace the birth chart.",
  },
  {
    title: "Transits",
    text: "Transits can reinforce, trigger or time an already active financial theme. They are most useful when they repeat the same story indicated by the natal chart and Dasha.",
  },
];

const steps = [
  {
    number: "01",
    title: "Define the actual financial problem",
    text: "Do not begin with the vague statement 'my money is bad.' Identify whether the issue is income, instability, expenses, debt, loss, savings, business cash flow or another specific concern.",
  },
  {
    number: "02",
    title: "Study the 2nd and 11th houses",
    text: "Begin with accumulated resources and gains, then examine their lords, occupants, aspects and relationships.",
  },
  {
    number: "03",
    title: "Identify the source of income",
    text: "Determine whether finances are primarily linked with employment, business, partnership, property, investments, family resources or another channel.",
  },
  {
    number: "04",
    title: "Study expenditure separately",
    text: "Strong earnings can coexist with strong outflow. The question of what comes in and what goes out must be judged independently.",
  },
  {
    number: "05",
    title: "Examine debt and liabilities where relevant",
    text: "If the real problem is repayment pressure or obligations, study the parts of the chart connected with debt rather than treating the issue only as weak wealth potential.",
  },
  {
    number: "06",
    title: "Distinguish recurring pressure from sudden loss",
    text: "Long-term financial strain and a sudden disruptive event are different patterns and may involve different combinations.",
  },
  {
    number: "07",
    title: "Judge planetary capacity",
    text: "Assess dignity, placement, dispositor support, aspects and other strength factors of the planets carrying the relevant financial agendas.",
  },
  {
    number: "08",
    title: "Look for repeated indications",
    text: "One difficult placement is rarely enough. Greater confidence comes when several independent layers point toward the same type of financial pressure.",
  },
  {
    number: "09",
    title: "Study the running Dasha",
    text: "Ask whether the present planetary periods are activating income, expense, debt, career disruption or other factors involved in the financial problem.",
  },
  {
    number: "10",
    title: "Add transit timing",
    text: "Use major transits to refine the period rather than treating a single transit as the cause of every financial difficulty.",
  },
  {
    number: "11",
    title: "Look for the recovery mechanism",
    text: "A useful reading should not stop at identifying pressure. It should also examine when stronger earning, gain, stability or repayment-supporting periods become active.",
  },
  {
    number: "12",
    title: "Keep astrology within its proper role",
    text: "Astrology can help organise timing and patterns, but financial decisions still require budgeting, planning, professional advice and real-world action.",
  },
];

const mistakes = [
  "Calling every financial problem a weak 2nd house.",
  "Assuming the 12th house always means financial loss.",
  "Treating the 8th house as automatic bankruptcy or disaster.",
  "Assuming Saturn always causes poverty or financial delay.",
  "Assuming Rahu always produces sudden financial loss.",
  "Blaming one difficult planet without studying its house lordship.",
  "Ignoring a person's income source when analysing money.",
  "Treating debt, low income and high expenditure as the same problem.",
  "Reading a transit without checking the running Dasha.",
  "Ignoring strong wealth factors because one difficult combination is present.",
  "Assuming a difficult period will continue permanently.",
  "Using astrology instead of practical financial planning.",
];

const recoveryFactors = [
  {
    title: "Income improves",
    text: "A stronger professional or business period may increase the amount of money entering the financial system.",
  },
  {
    title: "Gains improve",
    text: "Opportunities may begin translating into actual material benefit more effectively.",
  },
  {
    title: "Expenses reduce",
    text: "The financial picture can improve even without a dramatic rise in income if repeated outflows begin to ease.",
  },
  {
    title: "Debt becomes manageable",
    text: "A period may support repayment, restructuring or a gradual reduction in financial obligations.",
  },
  {
    title: "Savings rebuild",
    text: "Income may become more stable and begin converting into accumulated financial reserves.",
  },
  {
    title: "Assets strengthen",
    text: "Improvement may eventually appear through property, investments or other forms of longer-term asset creation rather than cash income alone.",
  },
];

export default function FinancialProblemsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="min-h-screen bg-[#fffaf3] text-[#2f2333]">
        <TopNav />

        {/* BREADCRUMB */}
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-[#796c7b]"
          >
            <Link href="/sarathi/learn" className="hover:text-[#5a294d]">
              Knowledge Centre
            </Link>

            <span>›</span>

            <span>Money & Wealth</span>

            <span>›</span>

            <span className="text-[#4c3e50]">
              Why am I facing financial problems?
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Money & Wealth · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Why Am I Facing Financial Problems? How Vedic Astrology Studies
            Money Difficulties
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Financial difficulty is not one astrological event. Low income,
            unstable earnings, excessive expenses, debt, sudden loss and an
            inability to save are different problems — and they should not be
            explained by blaming one planet.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              Vedic astrology studies financial problems by first identifying
              <strong>
                {" "}
                what kind of financial pressure is actually occurring
              </strong>
              . The analysis can then examine income, gains, savings,
              expenditure, liabilities, planetary strength, Dashas and
              transits. A difficult financial period should not be reduced to a
              single house, one planet or one transit.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* DEFINE THE PROBLEM */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “Financial problems” is too broad a question.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Before analysing a horoscope, we need to understand what is
                actually going wrong financially.
              </p>

              <p>
                Someone earning too little has a different problem from someone
                earning well but spending excessively. Both are different again
                from debt, a failed investment, business losses or irregular
                income.
              </p>

              <p>
                The more precisely the real-life event is defined, the more
                precise the astrological analysis can become.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question first. Astrology second.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {problemTypes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Financial houses
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which houses are studied for money problems?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Different houses describe different financial functions. The
              relevant houses depend on the exact problem being investigated.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {chartFactors.map((factor) => (
                <div
                  key={factor.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{factor.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {factor.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                A house is not automatically good or bad. Its relevance depends
                on the question being asked and the role it plays in the entire
                horoscope.
              </p>
            </div>
          </section>

          {/* 2ND HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Does a difficult 2nd house automatically mean money problems?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                No. The 2nd house is important because it can relate to
                accumulated resources and financial foundations, but it should
                never be judged in isolation.
              </p>

              <p>
                We need to study the 2nd lord, occupants, aspects, dignity,
                dispositor, Sambandha and whether other parts of the chart
                support or compensate for the same financial agenda.
              </p>

              <p>
                A challenging factor may describe pressure in one part of the
                financial story without eliminating the possibility of strong
                income, gains or later accumulation.
              </p>

              <p className="font-semibold text-[#47394b]">
                Do not memorise a difficult placement as a financial
                prediction.
              </p>
            </div>
          </section>

          {/* 12TH */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Expenditure
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does the 12th house always mean financial loss?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 12th house is closely associated with expenditure and
                outflow, but expenditure is not automatically the same as
                harmful loss.
              </p>

              <p>
                Money may leave through travel, education, healthcare, property,
                family responsibilities, charitable activity, business
                investment or other legitimate purposes.
              </p>

              <p>
                The analytical question is therefore not merely whether money is
                leaving.
              </p>

              <p className="font-semibold text-[#47394b]">
                We need to ask why it is leaving, how much pressure it creates
                and whether the outflow ultimately supports or weakens the
                person's financial position.
              </p>
            </div>
          </section>

          {/* 6TH */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Debt & obligations
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What if the real problem is debt rather than income?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A person can have reasonable earnings and still experience
                financial stress because repayments and obligations absorb a
                large part of those earnings.
              </p>

              <p>
                In that situation, simply judging the chart for wealth potential
                misses the actual problem.
              </p>

              <p>
                Debt-related analysis can require examination of the 6th house
                and its lord alongside income, savings and expenditure factors.
                The entire structure must still be judged rather than turning
                the 6th into a universal “debt house prediction.”
              </p>
            </div>
          </section>

          {/* 8TH */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Sudden financial disruption
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does the 8th house mean sudden financial disaster?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                No. The 8th house has a much broader range of meanings and
                should not be converted into automatic fear-based predictions.
              </p>

              <p>
                In a financial question it may become relevant when the issue
                involves sudden disruption, shared resources, liabilities,
                uncertainty or financial circumstances that do not arise from
                ordinary salary and savings alone.
              </p>

              <p>
                Whether the result becomes constructive, difficult or mixed
                depends on the full chart, the planets involved and the timing
                system.
              </p>

              <p className="font-semibold text-[#47394b]">
                One house describes a field of experience. It does not dictate
                one inevitable event.
              </p>
            </div>
          </section>

          {/* NO BAD MONEY PLANET */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common misconception
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which planet causes financial problems?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                There is no universal planet that causes financial problems for
                everyone.
              </p>

              <p>
                Saturn, Rahu, Ketu, Mars or any other planet can be involved in
                difficult financial periods depending on lordship, placement,
                strength, Sambandha and the specific financial houses being
                activated.
              </p>

              <p>
                The same planet that contributes pressure in one horoscope may
                support professional growth, gains or financial discipline in
                another.
              </p>

              <p className="font-semibold text-[#47394b]">
                No planet should be labelled a financial villain without
                understanding its role in the individual chart.
              </p>
            </div>
          </section>

          {/* TIMING */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why do financial problems often become stronger during particular
              periods?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The horoscope may contain several different financial potentials.
              Timing systems help us understand which part of that potential is
              becoming active now.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {timingLayers.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                The Dasha does not invent a financial problem. It activates the
                natal agenda already contained in the horoscope.
              </p>
            </div>
          </section>

          {/* TRANSITS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can one difficult transit cause financial problems?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A transit may coincide with increased financial pressure, but
                transit alone is usually a weak basis for a major prediction.
              </p>

              <p>
                More convincing timing appears when the transit activates the
                same houses, lords or planets already relevant in the natal
                chart and currently active through Dasha.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natal promise → planetary strength → Dasha activation → transit
                support is stronger reasoning than transit alone.
              </p>
            </div>
          </section>

          {/* TEMPORARY VS STRUCTURAL */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              An important distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Is the problem temporary or part of a longer financial pattern?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                This is one of the most useful questions astrology can help us
                organise.
              </p>

              <p>
                A fundamentally capable financial chart can experience a
                difficult Dasha or transit period. In that case, the pressure
                may be significant but temporary.
              </p>

              <p>
                In another horoscope, repeated natal patterns may show that
                financial stability requires more deliberate management over a
                longer period.
              </p>

              <p>
                These situations should not be interpreted in the same way.
              </p>

              <p className="font-semibold text-[#47394b]">
                A difficult period is not automatically a difficult financial
                life.
              </p>
            </div>
          </section>

          {/* RECOVERY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Financial recovery
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does financial improvement actually look like?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Recovery does not always arrive as a sudden increase in salary.
              Different parts of the financial structure can improve at
              different times.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {recoveryFactors.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Financial improvement should be judged through income, gains,
                expenses, liabilities, savings and assets — not salary alone.
              </p>
            </div>
          </section>

          {/* METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should financial difficulty actually be analysed?
            </h2>

            <div className="mt-10 space-y-5">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-4 rounded-2xl border border-[#e3d5c5] bg-white p-6 md:grid-cols-[70px_1fr]"
                >
                  <div className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>

                    <p className="mt-3 leading-7 text-[#6a5d6e]">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why “money problems” can have very different causes
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine someone whose earning potential remains reasonably
                  strong, but a particular planetary period activates large
                  expenses and financial obligations.
                </p>

                <p>
                  The person may continue receiving a normal salary while
                  feeling increasingly financially stretched.
                </p>

                <p>
                  If we looked only at income, we might incorrectly conclude
                  that there is no financial problem.
                </p>

                <p>
                  But the real issue is not earnings. It is the relationship
                  between earnings, obligations and outflow.
                </p>

                <p>
                  Later, the expense-heavy period weakens while a stronger gain
                  and accumulation period begins.
                </p>

                <p className="font-semibold text-[#403344]">
                  The financial story changed because different parts of the
                  horoscope became active — not because the person suddenly
                  acquired a completely different birth chart.
                </p>
              </div>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when analysing financial problems?
            </h2>

            <div className="mt-8 space-y-3">
              {mistakes.map((mistake) => (
                <div
                  key={mistake}
                  className="flex gap-4 rounded-xl border border-[#e4d8ca] bg-white p-5"
                >
                  <span className="mt-1 text-[#8b5a79]">✦</span>

                  <p className="leading-7 text-[#65586a]">{mistake}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Sārathi framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Financial problems should be judged through convergence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A structured analysis begins with the actual financial problem
                and then works through the natal chart, strength and timing
                layers.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact problem → income source → 2nd house → 11th house →
                expenditure → debt or liability factors → relevant house lords
                → planetary strength → Sambandha → Dasha → relevant Varga →
                transit activation → recovery factors.
              </p>

              <p>
                This approach prevents one difficult planet, house or transit
                from becoming an exaggerated prediction about someone's entire
                financial life.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* RELATED MONEY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Money & Wealth
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring your financial questions
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href="/sarathi/learn/questions/when-will-my-finances-improve"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Financial Timing
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will my finances improve?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how periods of financial improvement are studied through
                  income, gains, savings, Dashas and transits.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/will-i-become-rich"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Wealth Potential
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Will I become rich?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand how wealth potential, Dhana Yogas, gains, savings
                  and financial scale are studied.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>
            </div>
          </section>

          {/* CONTINUE LEARNING */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">Continue learning</h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              Build the concepts used in financial analysis through the Sārathi
              Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how different houses describe income, gains,
                  obligations and expenditure.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how financial house lords carry their responsibilities
                  through the horoscope.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why connection and capacity are different
                  questions.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">
                  Aspects, Conjunctions & Sambandha
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how financial themes connect with other areas of the
                  chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">
                  Vimshottari Dasha & Planetary Periods
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how different natal agendas become active over time.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transits refine already active financial
                  periods.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/predictive-astrology-event-timing"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">
                  Predictive Astrology & Event Timing
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how natal promise, Dasha and transit are brought
                  together systematically.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/yogas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Yogas in Vedic Astrology</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why one favourable or difficult combination never
                  replaces whole-chart analysis.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Your financial pattern is personal
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Financial pressure is rarely explained by one planet.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you explore how income, gains, expenses,
                liabilities, planetary periods and timing factors come together
                through a structured Vedic astrology framework.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/individual"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#4b2744]"
                >
                  Explore your Sārathi
                </Link>

                <Link
                  href="/sarathi/learn"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  Back to Knowledge Centre
                </Link>
              </div>
            </div>
          </section>

          {/* DISCLAIMER */}
          <section className="pt-10">
            <p className="text-sm leading-6 text-[#827685]">
              Sārathi presents Vedic astrology as a traditional interpretive
              framework for reflection and guidance. Astrological analysis
              cannot guarantee income, wealth, investment performance, debt
              reduction, business success or any specific financial outcome. It
              should not replace budgeting, financial planning, investment
              advice, tax advice, debt counselling or other qualified
              professional guidance.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}