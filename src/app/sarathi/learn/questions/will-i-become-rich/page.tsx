import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Will I Become Rich? Wealth Potential in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies wealth potential through the 2nd and 11th houses, house lords, Dhana Yogas, planetary strength, Dashas, divisional charts and timing.",
  path: "/sarathi/learn/questions/will-i-become-rich",
  keywords: [
    "Will I Become Rich Astrology",
    "Wealth Astrology",
    "Money Astrology",
    "Rich in Vedic Astrology",
    "Wealth Potential Astrology",
    "Dhana Yoga",
    "2nd House Wealth",
    "11th House Wealth",
    "Wealth Dasha",
    "Vedic Astrology Money",
    "Financial Astrology Vedic",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Will I Become Rich? What Vedic Astrology Can — and Cannot — Show About Wealth",
  description:
    "A practical guide to how Vedic astrology studies wealth potential through natal promise, money houses, planetary strength, Dhana Yogas, Dashas, divisional charts and timing.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/will-i-become-rich",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/will-i-become-rich",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Wealth astrology",
    "Dhana Yoga",
    "2nd house",
    "11th house",
    "Vimshottari Dasha",
    "Financial timing",
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
      name: "Will I Become Rich?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/will-i-become-rich",
    },
  ],
};

const wealthFactors = [
  {
    title: "2nd House",
    text: "The 2nd house is an important part of wealth analysis because it can relate to accumulated resources, savings, stored value and the financial foundation a person builds over time.",
  },
  {
    title: "11th House",
    text: "The 11th house is associated with gains, fulfilment and the materialisation of efforts. It is particularly important when asking how income and opportunities translate into actual gains.",
  },
  {
    title: "10th House",
    text: "Profession, responsibility and public work can become major channels through which financial potential is expressed. Wealth analysis therefore cannot be separated entirely from the chart's career structure.",
  },
  {
    title: "5th & 9th Houses",
    text: "These houses can become relevant through intelligence, judgement, merit, opportunity and broader fortune factors, especially when they connect meaningfully with wealth-producing houses.",
  },
  {
    title: "House Lords",
    text: "The lords of wealth-related houses show where those financial agendas travel in the horoscope and what other areas of life they become connected with.",
  },
  {
    title: "Planetary Strength",
    text: "A planet may be connected with wealth without having equal capacity to deliver it. Placement, dignity, dispositor support, aspects and other strength factors matter.",
  },
];

const wealthDimensions = [
  {
    title: "Income",
    text: "How much money enters through salary, business, professional work, commissions or other recurring channels.",
  },
  {
    title: "Gains",
    text: "Whether opportunities and efforts produce meaningful financial benefit rather than activity alone.",
  },
  {
    title: "Savings",
    text: "Whether income can be retained and converted into accumulated resources.",
  },
  {
    title: "Assets",
    text: "Whether financial capacity can support property, investments or other forms of long-term asset creation.",
  },
  {
    title: "Stability",
    text: "Whether financial progress is sustained or repeatedly disrupted by expenses, liabilities or unstable income patterns.",
  },
  {
    title: "Scale",
    text: "Whether the horoscope points toward modest security, strong financial comfort or the potential for significantly larger material expansion.",
  },
];

const interpretationSteps = [
  {
    number: "01",
    title: "Define what 'rich' actually means",
    text: "For one person it may mean debt-free stability. For another it may mean substantial assets, business wealth, high income or financial independence. The question must be made specific before interpretation begins.",
  },
  {
    number: "02",
    title: "Establish the natal wealth promise",
    text: "Study the 2nd, 11th and other relevant houses, their lords, occupants, aspects and Sambandha before looking at timing.",
  },
  {
    number: "03",
    title: "Study how wealth is generated",
    text: "Ask whether money is more strongly connected with profession, business, entrepreneurship, knowledge, partnership, property, networks or another area of the horoscope.",
  },
  {
    number: "04",
    title: "Judge planetary strength",
    text: "Connections alone are not enough. The planets carrying financial agendas must be assessed for dignity, placement, dispositor support and overall capacity.",
  },
  {
    number: "05",
    title: "Examine Dhana Yogas",
    text: "If wealth-producing combinations are present, confirm the exact formation and then judge their strength rather than assuming the Yoga name guarantees riches.",
  },
  {
    number: "06",
    title: "Look for repetition",
    text: "A stronger financial promise is usually supported by multiple independent indications rather than one attractive placement or one Yoga.",
  },
  {
    number: "07",
    title: "Use relevant divisional charts",
    text: "The D1 remains the foundation. Relevant Vargas can refine specific financial, professional or asset-related dimensions after the natal promise has been established.",
  },
  {
    number: "08",
    title: "Study the running Dasha",
    text: "A strong natal wealth promise may remain relatively quiet until the planetary periods capable of activating it begin.",
  },
  {
    number: "09",
    title: "Add transit activation",
    text: "Major transits can reinforce an already active natal and Dasha pattern and help define broader windows of financial expansion or change.",
  },
  {
    number: "10",
    title: "Separate earning from keeping",
    text: "High income does not automatically mean high net wealth. The chart should be read for gains, retention, liabilities and asset formation separately.",
  },
  {
    number: "11",
    title: "Judge the quality of the period",
    text: "A period may increase income but also increase expenses, risk or instability. Financial growth and financial security should not be treated as identical outcomes.",
  },
  {
    number: "12",
    title: "State only what the evidence supports",
    text: "Astrology may support a strong wealth-building period or meaningful financial potential, but it cannot responsibly promise a fixed amount of money or guaranteed riches.",
  },
];

const commonMistakes = [
  "Assuming one strong 2nd house placement guarantees wealth.",
  "Treating the 11th house alone as proof of becoming rich.",
  "Assuming Jupiter automatically creates wealth wherever it is placed.",
  "Believing Venus always means luxury and therefore financial success.",
  "Treating every Dhana Yoga as a guaranteed wealth-producing combination.",
  "Ignoring the strength of the planets forming a wealth Yoga.",
  "Ignoring expenses, liabilities and financial instability while focusing only on income.",
  "Reading one house without studying its lord.",
  "Using transits to predict wealth without first establishing natal promise and Dasha activation.",
  "Confusing a high-income period with permanent financial security.",
  "Predicting an exact level of wealth from one placement or combination.",
];

const dhanaQuestions = [
  {
    title: "Is the Yoga actually formed?",
    text: "Traditional Yoga names have specific conditions. The first task is confirming whether the required relationship genuinely exists.",
  },
  {
    title: "How strong are the planets?",
    text: "A combination may technically exist while the planets forming it have very different levels of capacity.",
  },
  {
    title: "What houses do they rule?",
    text: "The functional role of each planet changes with the Ascendant, so lordship must be studied before interpreting the combination.",
  },
  {
    title: "Where are they placed?",
    text: "House placement, Rashi, dignity and dispositor relationships influence how the financial agenda is expressed.",
  },
  {
    title: "Does the pattern repeat?",
    text: "Other houses, lords, Vargas and Sambandha should support the same financial theme if the wealth promise is strong.",
  },
  {
    title: "When does it activate?",
    text: "Even a strong Yoga may become more visible during the Dashas and transits connected with the planets forming it.",
  },
];

export default function WillIBecomeRichPage() {
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

            <span className="text-[#4c3e50]">Will I become rich?</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Money & Wealth · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Will I Become Rich? What Vedic Astrology Can — and Cannot — Show
            About Wealth
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Wealth astrology is often reduced to a list of lucky planets and
            Dhana Yogas. A serious Vedic analysis asks something more useful:
            how strong is the financial promise, through which channels can it
            develop, when does it activate, and can income actually become
            lasting wealth?
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              Vedic astrology can study{" "}
              <strong>financial potential, earning capacity, gains, savings,
              asset formation and periods of financial expansion</strong>. It
              cannot responsibly guarantee that someone will become “rich” from
              one planet, one house or one Yoga. Wealth is better judged through
              the convergence of natal promise, planetary strength, house
              relationships, Dashas, relevant divisional charts and transits.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* FIRST PRINCIPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Income and wealth are not the same thing.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Someone can earn extremely well and still accumulate little
                because expenses, liabilities or unstable financial decisions
                consume most of the income.
              </p>

              <p>
                Another person may earn more modestly but steadily build
                savings, property and long-term assets.
              </p>

              <p>
                That means a wealth analysis should not ask only, “Will I make
                money?” It should also ask whether money can be retained,
                expanded and converted into lasting financial strength.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {wealthDimensions.map((item) => (
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
                Earning money, keeping money and building wealth are related
                questions — but they are not identical questions.
              </p>
            </div>
          </section>

          {/* WHAT TO EXAMINE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Wealth factors
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which parts of the chart matter for wealth?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              There is no single “wealth house” that answers the entire
              question. Different houses contribute different parts of the
              financial story.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {wealthFactors.map((factor) => (
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
          </section>

          {/* 2ND VS 11TH */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What is the difference between the 2nd and 11th houses?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In practical wealth analysis, the distinction is useful because
                financial gain and accumulated wealth are not exactly the same.
              </p>

              <p>
                The 11th can contribute the theme of gains and fulfilment —
                whether work, business or opportunities actually produce
                material results.
              </p>

              <p>
                The 2nd can contribute accumulated resources, savings and the
                financial base that remains after money is earned.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 11th can help describe what comes in. The 2nd helps us ask
                what becomes part of the person's financial foundation.
              </p>
            </div>
          </section>

          {/* NO SINGLE WEALTH PLANET */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A common misconception
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Is there one planet that makes a person rich?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                No planet should be treated as a universal wealth switch.
                Jupiter, Venus, Mercury and other planets may become important
                in financial analysis, but their results depend on the
                individual horoscope.
              </p>

              <p>
                The same planet can carry very different house responsibilities
                for different Ascendants. Its placement, dignity, aspects,
                dispositor and Sambandha also modify what it can express.
              </p>

              <p>
                Natural significations provide vocabulary. Functional lordship
                and chart context tell us how that vocabulary is being used.
              </p>

              <p className="font-semibold text-[#47394b]">
                The planet gives us the vocabulary. The chart gives us the
                sentence.
              </p>
            </div>
          </section>

          {/* DHANA YOGA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Dhana Yoga
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does having a Dhana Yoga mean you will become rich?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Dhana Yogas are wealth-related planetary combinations described
                in Jyotish traditions. Their presence can be meaningful, but
                identifying the name of a Yoga is only the beginning.
              </p>

              <p>
                Two people may technically possess similar wealth combinations
                while experiencing very different financial outcomes because
                the planets involved have different strengths, placements,
                lordships, supporting factors and activation periods.
              </p>

              <p>
                That is why the better question is not simply, “Do I have a
                Dhana Yoga?”
              </p>

              <p className="font-semibold text-[#47394b]">
                Ask: Is it formed? Is it strong? Is it supported? Is it active?
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {dhanaQuestions.map((item) => (
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
                The name of a Yoga starts the analysis. It does not finish it.
              </p>
            </div>
          </section>

          {/* SCALE OF WEALTH */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can astrology show the scale of financial potential?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Astrology can help distinguish between a relatively ordinary
                financial pattern and a horoscope containing repeated,
                well-supported themes of larger material expansion.
              </p>

              <p>
                But scale cannot be responsibly judged from one placement. It
                requires repetition across houses, house lords, planetary
                strength, combinations and timing systems.
              </p>

              <p>
                Real-world context also matters enormously. The same chart
                potential can manifest differently depending on education,
                opportunity, geography, family resources, industry, risk
                decisions and economic circumstances.
              </p>

              <p className="font-semibold text-[#47394b]">
                Astrology can describe potential and timing. It cannot convert
                a horoscope into a guaranteed bank balance.
              </p>
            </div>
          </section>

          {/* HOW WEALTH IS CREATED */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Source of wealth
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The chart should also tell us how wealth is more likely to be
              created.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Wealth can arise through very different life channels. One
                horoscope may connect financial houses strongly with profession.
                Another may connect them with business, property, partnership,
                knowledge, networks or another area of life.
              </p>

              <p>
                This is why merely identifying a “money Yoga” does not tell us
                enough. We also need to understand the mechanism through which
                financial potential is likely to manifest.
              </p>

              <p className="font-semibold text-[#47394b]">
                Wealth potential becomes more useful when we can identify both
                the promise and the likely channel of expression.
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why can a strong wealth chart remain quiet for years?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Natal potential and event timing are different layers of
                interpretation.
              </p>

              <p>
                A person may have strong financial combinations while spending
                many years in planetary periods that activate education,
                family, health, relationships or other priorities more strongly.
              </p>

              <p>
                When a Dasha begins activating capable planets connected with
                gains, profession, accumulated wealth or supporting financial
                combinations, the material potential can become more visible.
              </p>

              <p className="font-semibold text-[#47394b]">
                The Dasha does not manufacture wealth from nothing. It activates
                the financial agenda already contained in the horoscope.
              </p>
            </div>
          </section>

          {/* TRANSITS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter transit suddenly make someone wealthy?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Jupiter transits are often associated with expansion and
                opportunity, but a transit should not be treated as an
                independent promise of wealth.
              </p>

              <p>
                Saturn, Jupiter, Rahu, Ketu and faster planets may all matter
                depending on what they activate in the individual horoscope.
              </p>

              <p>
                Transit becomes more convincing when the natal chart already
                contains the relevant promise and the running Dasha supports the
                same financial theme.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natal promise → planetary capacity → Dasha activation → transit
                support is stronger reasoning than transit alone.
              </p>
            </div>
          </section>

          {/* STRUCTURED METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should wealth potential actually be analysed?
            </h2>

            <div className="mt-10 space-y-5">
              {interpretationSteps.map((step) => (
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
              Why a wealth Yoga may not produce obvious wealth immediately
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope containing a clear relationship between
                  important financial houses, creating a meaningful wealth
                  combination.
                </p>

                <p>
                  The relevant planets are reasonably strong, and the same
                  financial theme receives additional support elsewhere in the
                  chart.
                </p>

                <p>
                  Yet the person spends the first part of adult life in Dashas
                  that do not strongly activate those planets. Income remains
                  normal rather than exceptional.
                </p>

                <p>
                  A later planetary period activates the financial combination,
                  career factors and gains simultaneously. Major transits then
                  reinforce the same pattern.
                </p>

                <p className="font-semibold text-[#403344]">
                  The Yoga was present all along. Its capacity and timing
                  determined when it became materially important.
                </p>
              </div>
            </div>
          </section>

          {/* FINANCIAL PROBLEMS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What if the chart shows both wealth and financial difficulty?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                This is entirely possible. A chart can contain strong earning
                capacity while also showing periods of large expenditure,
                liabilities, volatility or financial pressure.
              </p>

              <p>
                That is why one attractive wealth combination should never be
                isolated from the rest of the horoscope.
              </p>

              <p>
                Financial interpretation should ask not only how much can be
                earned, but how stable the financial structure is and what can
                interfere with wealth accumulation.
              </p>

              <p className="font-semibold text-[#47394b]">
                Wealth promise and financial pressure can coexist. The task is
                to understand which becomes dominant, when, and under what
                conditions.
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading wealth in a chart?
            </h2>

            <div className="mt-8 space-y-3">
              {commonMistakes.map((mistake) => (
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
              Wealth should be judged through convergence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A structured analysis moves from natal financial potential
                toward capacity, repetition and timing.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → 2nd house → 11th house → wealth channels →
                house lords → planetary strength → Sambandha → Dhana Yogas →
                relevant Vargas → Dasha → transit activation → gains → retention
                → asset formation.
              </p>

              <p>
                This prevents one attractive placement or Yoga from becoming an
                exaggerated financial prediction.
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
              Explore financial timing next
            </h2>

            <div className="mt-8">
              <Link
                href="/sarathi/learn/questions/when-will-my-finances-improve"
                className="block rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Money & Wealth
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will my finances improve?
                </h3>

                <p className="mt-3 max-w-2xl leading-7 text-[#6a5d6e]">
                  Learn how financial improvement is studied through income,
                  gains, savings, planetary periods and timing.
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
              Build the concepts used in wealth analysis through the Sārathi
              Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the roles of the 2nd, 11th and other financial
                  houses.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how financial house lords carry their agendas through
                  the chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why a financial connection and its capacity are
                  separate questions.
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
                  Learn how financial factors become connected across the
                  horoscope.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/yogas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Yogas in Vedic Astrology</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why a Yoga must be judged for formation, strength
                  and activation.
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
                  Learn how natal financial themes become active over time.
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
                  See how promise, Dasha and transit are combined into a timing
                  judgement.
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
                Wealth is not one Yoga, one planet or one lucky transit.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you explore how your financial houses, planetary
                strength, Dashas and timing factors come together through a
                structured Vedic astrology framework.
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
              cannot guarantee wealth, income, investment returns, business
              success or any specific financial outcome. It should not replace
              financial planning, investment advice, tax advice or other
              qualified professional guidance.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}