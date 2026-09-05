import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Dhana Yoga Explained: Do Wealth Yogas Really Make You Rich?",
  description:
    "Learn what Dhana Yoga means in Vedic astrology, how wealth yogas are formed, why strength and timing matter, and why a Dhana Yoga does not automatically guarantee riches.",
  path: "/sarathi/learn/questions/dhana-yoga-explained",
  keywords: [
    "Dhana Yoga",
    "Dhana Yoga Meaning",
    "Dhana Yoga in Vedic Astrology",
    "Wealth Yoga Astrology",
    "Wealth Yogas in Kundli",
    "Dhana Yoga Kundli",
    "Money Yoga Astrology",
    "Rich Yoga in Astrology",
    "Wealth Astrology",
    "2nd House Wealth",
    "11th House Wealth",
    "Dhana Yoga Results",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Dhana Yoga Explained: Do Wealth Yogas Really Make You Rich?",
  description:
    "A practical guide to understanding Dhana Yogas through formation, functional lordship, planetary strength, repetition, divisional charts, Dashas, transits and actual financial manifestation.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/dhana-yoga-explained",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/dhana-yoga-explained",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Dhana Yoga",
    "Wealth Yoga",
    "2nd house",
    "11th house",
    "House lordship",
    "Planetary strength",
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
      name: "Dhana Yoga Explained",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/dhana-yoga-explained",
    },
  ],
};

const yogaQuestions = [
  {
    title: "Is the Yoga actually formed?",
    text: "The first step is technical. The required planetary or house-lord relationship must genuinely exist rather than being loosely labelled as a Dhana Yoga.",
  },
  {
    title: "Which houses do the planets rule?",
    text: "Functional lordship changes with the Ascendant. The same planet can carry very different financial responsibilities in different horoscopes.",
  },
  {
    title: "How strong are the planets?",
    text: "A combination may exist while one or more planets involved have limited capacity because of dignity, placement, affliction, dispositor condition or other strength factors.",
  },
  {
    title: "Where is the Yoga operating?",
    text: "House placement helps show the life area through which the financial combination is more likely to express itself.",
  },
  {
    title: "Does the pattern repeat?",
    text: "A stronger wealth promise usually appears through several independent indications rather than one isolated Yoga.",
  },
  {
    title: "Is the Yoga active now?",
    text: "Even a strong wealth combination may remain relatively quiet until the relevant planets become active through Dasha and are reinforced by transits.",
  },
];

const keyFactors = [
  {
    title: "2nd House",
    text: "The 2nd house can relate to accumulated resources, savings and the financial foundation a person is able to build and retain.",
  },
  {
    title: "11th House",
    text: "The 11th house is associated with gains and fulfilment and is important when studying whether opportunities produce material results.",
  },
  {
    title: "5th & 9th Houses",
    text: "These houses can become relevant in wealth combinations through merit, intelligence, opportunity and broader fortune factors when they connect meaningfully with financial houses.",
  },
  {
    title: "10th House",
    text: "Career and professional responsibility can become a major channel through which financial promise is delivered.",
  },
  {
    title: "House Lords",
    text: "The lords of wealth-related houses show where those financial agendas travel and what other parts of life they become connected with.",
  },
  {
    title: "Planetary Strength",
    text: "The existence of a connection and the capacity of the planets forming that connection are separate questions.",
  },
];

const manifestationLayers = [
  {
    title: "Formation",
    text: "The combination exists technically.",
  },
  {
    title: "Strength",
    text: "The planets involved have sufficient capacity to express their agenda.",
  },
  {
    title: "Support",
    text: "Other chart factors reinforce rather than contradict the same financial theme.",
  },
  {
    title: "Activation",
    text: "The relevant planets become active through Dasha.",
  },
  {
    title: "Timing",
    text: "Transits reinforce or trigger the same financial agenda.",
  },
  {
    title: "Manifestation",
    text: "The Yoga expresses through actual gains, income, savings, assets or another measurable financial outcome.",
  },
];

const interpretationSteps = [
  {
    number: "01",
    title: "Begin with the Ascendant",
    text: "The Ascendant determines functional house lordship, so no wealth combination should be interpreted before identifying which planets rule which houses.",
  },
  {
    number: "02",
    title: "Confirm the exact Yoga",
    text: "Do not use the label loosely. Establish the precise connection or relationship that creates the wealth combination.",
  },
  {
    number: "03",
    title: "Study the houses involved",
    text: "Ask what financial functions those houses actually represent — income, gains, accumulation, profession, opportunity or another relevant dimension.",
  },
  {
    number: "04",
    title: "Judge functional lordship",
    text: "A planet must be understood through the houses it rules for that particular Ascendant, not only through its natural significations.",
  },
  {
    number: "05",
    title: "Assess dignity and strength",
    text: "Study sign placement, house placement, dispositor, aspects, conjunctions and other strength factors before assuming the Yoga can deliver strongly.",
  },
  {
    number: "06",
    title: "Study Sambandha",
    text: "Understand how the planets and houses involved are connected through conjunction, aspect, exchange or other meaningful relationships.",
  },
  {
    number: "07",
    title: "Look for repetition",
    text: "If similar wealth themes appear elsewhere in the D1, confidence in the financial promise increases.",
  },
  {
    number: "08",
    title: "Check the relevant Varga",
    text: "The D1 remains the foundation. Relevant divisional charts may refine financial, professional or asset-related dimensions after the natal promise is established.",
  },
  {
    number: "09",
    title: "Examine the running Dasha",
    text: "Ask whether the planets forming or supporting the Yoga are currently active through Mahadasha, Antardasha or finer periods.",
  },
  {
    number: "10",
    title: "Add transit support",
    text: "Transits become more useful when they reinforce an already active wealth pattern rather than being treated as independent promises.",
  },
  {
    number: "11",
    title: "Identify the channel of wealth",
    text: "Determine whether the combination is more likely to express through salary, business, property, partnership, knowledge, networks or another life area.",
  },
  {
    number: "12",
    title: "Judge the actual financial outcome",
    text: "A wealth Yoga may improve income or gains without necessarily creating lasting accumulation. Earnings, savings, assets and stability should be judged separately.",
  },
];

const mistakes = [
  "Assuming any connection between the 2nd and 11th houses automatically creates major wealth.",
  "Treating every Dhana Yoga as equally powerful.",
  "Ignoring the Ascendant and functional lordship.",
  "Ignoring planetary dignity and strength.",
  "Calling a Yoga strong simply because it appears in a software-generated list.",
  "Assuming a Dhana Yoga guarantees millions or a specific level of wealth.",
  "Ignoring whether the same wealth theme repeats elsewhere in the horoscope.",
  "Ignoring the Dasha periods of the planets forming the Yoga.",
  "Using transits alone to decide when a Yoga will deliver.",
  "Confusing higher income with accumulated wealth.",
  "Ignoring expenses, debt and liabilities while focusing only on gains.",
  "Treating one named Yoga as more important than the entire horoscope.",
];

const faqItems = [
  {
    question: "Does Dhana Yoga guarantee wealth?",
    answer:
      "No. A Dhana Yoga can indicate financial potential, but its strength, support, activation and real-world expression must still be judged.",
  },
  {
    question: "Can someone have Dhana Yoga and still struggle financially?",
    answer:
      "Yes. A wealth combination may be weak, poorly supported, inactive during a particular period, or coexist with strong expense, debt or instability factors.",
  },
  {
    question: "When does a Dhana Yoga give results?",
    answer:
      "Results are more likely to become visible when the planets forming or supporting the Yoga become active through Dasha and receive supportive transit activation.",
  },
  {
    question: "Is one Dhana Yoga enough to become rich?",
    answer:
      "Not necessarily. Stronger financial potential is usually supported by repetition across houses, house lords, strength, relevant Vargas and timing systems.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function DhanaYogaExplainedPage() {
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
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

            <span className="text-[#4c3e50]">Dhana Yoga Explained</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Money & Wealth · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Dhana Yoga Explained: Do Wealth Yogas Really Make You Rich?
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Dhana Yogas are among the most discussed combinations in Vedic
            astrology. But finding a wealth Yoga in a Kundli does not end the
            analysis. The real questions are whether the combination is strong,
            supported, active and capable of becoming lasting financial
            progress.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              A Dhana Yoga is a wealth-related planetary combination described
              in Jyotish tradition. Its presence can indicate financial
              potential, but{" "}
              <strong>
                the existence of a Yoga is not the same as the strength or
                activation of that Yoga
              </strong>
              . A serious reading must judge formation, house lordship,
              planetary strength, placement, repetition, relevant Vargas,
              Dashas and transits before drawing conclusions.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS DHANA YOGA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Definition
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a Dhana Yoga?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The word <em>Dhana</em> refers to wealth or resources. In Vedic
                astrology, Dhana Yoga broadly refers to planetary combinations
                associated with financial potential.
              </p>

              <p>
                Different Jyotish traditions describe a range of wealth-related
                combinations involving financial houses, their lords and other
                supportive houses.
              </p>

              <p>
                The mistake begins when the name of the Yoga is treated as a
                finished prediction.
              </p>

              <p className="font-semibold text-[#47394b]">
                Identifying a Yoga tells us that a combination exists. It does
                not yet tell us how strongly it can operate, when it will
                activate or what scale of financial result it can produce.
              </p>
            </div>
          </section>

          {/* FORMATION VS RESULT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The central distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Having a Dhana Yoga is not the same as receiving strong Dhana Yoga
              results.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Two people can technically possess similar wealth combinations
                while having completely different financial lives.
              </p>

              <p>
                In one horoscope, the planets may be strong, well placed,
                repeatedly supported and activated during important Dashas.
              </p>

              <p>
                In another, the same technical combination may involve weak or
                poorly supported planets and remain relatively quiet for much
                of life.
              </p>

              <p className="font-semibold text-[#47394b]">
                Presence, strength and activation are three different questions.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {manifestationLayers.map((item) => (
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
                Formation → Strength → Support → Activation → Timing →
                Manifestation
              </p>
            </div>
          </section>

          {/* HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Wealth structure
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which houses are important in Dhana Yoga analysis?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Wealth combinations are not understood by memorising one house.
              Different houses contribute different parts of the financial
              story.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {keyFactors.map((factor) => (
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

          {/* LORDSHIP */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Functional lordship
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why does the Ascendant matter when judging a wealth Yoga?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Planetary house lordship changes with the Ascendant. That means
                the same planet can carry completely different responsibilities
                in different horoscopes.
              </p>

              <p>
                A planet should therefore not be called a “wealth planet” simply
                because of its natural symbolism.
              </p>

              <p>
                We first identify what houses the planet rules in the individual
                chart and then study how those responsibilities connect with the
                rest of the horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natural significations provide vocabulary. Functional lordship
                tells us what job the planet is actually performing in this
                chart.
              </p>
            </div>
          </section>

          {/* STRENGTH */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Strength matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why can a technically correct Dhana Yoga still be weak?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A Yoga is formed by planets. Those planets still need sufficient
                capacity to carry their responsibilities.
              </p>

              <p>
                Their Rashi placement, dignity, house position, dispositor,
                conjunctions, aspects and wider chart support can all influence
                how effectively the combination operates.
              </p>

              <p>
                A technically present Yoga formed by poorly supported planets
                should not automatically be interpreted at the same level as a
                similar Yoga involving strong, well-supported planets.
              </p>

              <p className="font-semibold text-[#47394b]">
                Connection tells us that a financial relationship exists.
                Strength tells us how much capacity that relationship may have.
              </p>
            </div>
          </section>

          {/* QUESTIONS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Six questions to ask before calling a Dhana Yoga powerful
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {yogaQuestions.map((item) => (
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

          {/* REPETITION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Repetition
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is one wealth Yoga not enough?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Astrology becomes more convincing when the same theme appears
                through several independent parts of the horoscope.
              </p>

              <p>
                A Dhana Yoga becomes more meaningful when financial houses,
                their lords, planetary strength, supportive Sambandha and
                relevant timing factors repeatedly point toward the same
                conclusion.
              </p>

              <p>
                Repetition does not mean counting ten versions of the same
                factor as ten separate confirmations. The strongest confidence
                comes from independent layers supporting the same financial
                theme.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* VARGAS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Divisional charts
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do divisional charts confirm a Dhana Yoga?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D1 birth chart remains the foundation of the reading.
                Divisional charts should refine the relevant dimension rather
                than replace the natal horoscope.
              </p>

              <p>
                Depending on the financial question, professional, asset-related
                or other relevant Vargas can help us see whether the same theme
                receives additional support.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the promise. The relevant Varga refines the
                dimension.
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Activation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              When does a Dhana Yoga give results?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Even a strong natal wealth combination may remain relatively
                quiet until the planets involved become active through the
                timing system.
              </p>

              <p>
                Mahadasha, Antardasha and finer planetary periods help show
                which natal agendas are currently being brought forward.
              </p>

              <p>
                If the running Dasha activates capable planets involved in the
                wealth combination, the Yoga has a stronger opportunity to
                become visible.
              </p>

              <p className="font-semibold text-[#47394b]">
                The Dasha does not create the Yoga. It activates the potential
                already contained in the horoscope.
              </p>
            </div>
          </section>

          {/* TRANSITS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter transit activate a Dhana Yoga?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Jupiter may become relevant in some wealth periods, but no
                transit should automatically be treated as a universal wealth
                trigger.
              </p>

              <p>
                The important question is whether current transits reinforce the
                same houses, lords or planets already supported by natal promise
                and Dasha activation.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natal promise → Yoga strength → Dasha activation → transit
                support is stronger reasoning than transit alone.
              </p>
            </div>
          </section>

          {/* WEALTH CHANNEL */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              How wealth manifests
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A Dhana Yoga should also tell us where the money may come from.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A financial combination becomes more useful when we understand
                the life area through which it is likely to express.
              </p>

              <p>
                Wealth may be connected with profession, business,
                entrepreneurship, partnerships, property, knowledge, networks
                or another part of the chart.
              </p>

              <p>
                The houses occupied and ruled by the planets forming the Yoga
                help identify these channels.
              </p>

              <p className="font-semibold text-[#47394b]">
                A wealth Yoga is not merely about “how much.” It can also
                describe “through what.”
              </p>
            </div>
          </section>

          {/* INCOME VS WEALTH */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Does a Dhana Yoga mean high income or accumulated wealth?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                These are not necessarily the same outcome.
              </p>

              <p>
                A period can increase earnings or gains while expenses,
                liabilities or financial decisions prevent those earnings from
                becoming lasting wealth.
              </p>

              <p>
                Another chart may show slower financial growth but stronger
                retention and asset creation over time.
              </p>

              <p className="font-semibold text-[#47394b]">
                Income, gains, savings, assets and stability should be judged
                separately before concluding that a wealth Yoga has produced
                substantial wealth.
              </p>
            </div>
          </section>

          {/* METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should a Dhana Yoga actually be analysed?
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
              Why two people with a similar Dhana Yoga can have very different
              results
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine two horoscopes that both contain a relationship
                  between important wealth-producing houses.
                </p>

                <p>
                  In the first chart, the planets forming the Yoga are strong,
                  well placed and supported by other financial indications. The
                  same pattern receives support in relevant divisional analysis.
                </p>

                <p>
                  Their planetary periods later activate those same planets
                  during a phase of professional expansion.
                </p>

                <p>
                  In the second horoscope, the technical Yoga exists, but the
                  planets involved are less capable and the wider chart gives
                  weaker support. Their important Dashas also activate other
                  life themes instead.
                </p>

                <p className="font-semibold text-[#403344]">
                  Both charts may contain the Yoga. The strength, repetition and
                  timing determine how differently it can manifest.
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
              What should you avoid when interpreting Dhana Yogas?
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
              A Yoga is a starting point, not a finished prediction.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Dhana Yoga analysis becomes more reliable when the combination
                is studied within the entire horoscope rather than isolated from
                it.
              </p>

              <p className="font-semibold text-[#47394b]">
                Ascendant → exact Yoga formation → house lordship → placement →
                planetary strength → Sambandha → repetition → relevant Varga →
                Dasha activation → transit support → wealth channel → actual
                financial manifestation.
              </p>

              <p>
                This protects us from converting a named combination into an
                exaggerated promise of riches.
              </p>

              <p className="font-semibold text-[#47394b]">
                Is it present? Is it strong? Is it supported? Is it active?
                What does it actually deliver?
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Frequently asked questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Dhana Yoga questions
            </h2>

            <div className="mt-8 space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-lg font-semibold">{item.question}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* RELATED */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Money & Wealth
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring wealth
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Link
                href="/sarathi/learn/questions/will-i-become-rich"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">Will I become rich?</h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how the wider horoscope is used to assess wealth
                  potential, financial scale and accumulation.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/when-will-my-finances-improve"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">
                  When will my finances improve?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand how financial improvement is studied through
                  natal promise, Dashas and timing.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/why-am-i-facing-financial-problems"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">
                  Why am I facing financial problems?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Separate income, debt, losses, expenses and savings before
                  analysing the real financial problem.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>
            </div>
          </section>

          {/* LEARNING LINKS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">Continue learning</h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              Dhana Yoga becomes easier to understand when the underlying chart
              principles are clear.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/yogas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Yogas in Vedic Astrology</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how planetary combinations should be tested for
                  formation, strength and activation.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the financial roles of the 2nd, 11th and other
                  supporting houses.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why the Ascendant changes the functional role of
                  every planet.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn why a Yoga's existence and its capacity are different
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
                  Learn how the planets forming wealth combinations become
                  meaningfully connected.
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
                  Understand when natal combinations become active.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how transit activation refines an already active natal
                  promise.
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
                  Bring natal promise, strength, Dasha and transit together into
                  one structured judgement.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Go beyond the Yoga name
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                A wealth combination becomes meaningful only in the context of
                your whole horoscope.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you understand how house lordship, planetary
                strength, combinations, Dashas and timing factors work together
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
              framework for reflection and guidance. A Dhana Yoga or any other
              astrological combination cannot guarantee wealth, income,
              investment returns, business success or a specific financial
              outcome. Astrological interpretation should not replace qualified
              financial, investment, tax or legal advice.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}