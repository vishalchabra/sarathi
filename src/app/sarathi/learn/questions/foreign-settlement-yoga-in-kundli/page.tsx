import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Foreign Settlement Yoga in Kundli: Vedic Astrology Explained",
  description:
    "Learn how Vedic astrology studies foreign settlement through the 4th, 9th and 12th houses, relevant house lords, Rahu, planetary strength, Dashas and transits.",
  path: "/sarathi/learn/questions/foreign-settlement-yoga-in-kundli",
  keywords: [
    "Foreign Settlement Yoga in Kundli",
    "Videsh Yoga",
    "Foreign Settlement Astrology",
    "Foreign Travel Yoga",
    "12th House Foreign Settlement",
    "4th House Foreign Settlement",
    "Rahu Foreign Settlement",
    "Settle Abroad Astrology",
    "Videsh Settlement Yoga",
    "Foreign Settlement Vedic Astrology",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Foreign Settlement Yoga in Kundli: Vedic Astrology Explained",
  description:
    "A structured guide to how Vedic astrology studies foreign settlement Yoga through natal promise, house connections, planetary strength, Dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/foreign-settlement-yoga-in-kundli",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/foreign-settlement-yoga-in-kundli",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Foreign settlement",
    "Videsh Yoga",
    "Foreign travel",
    "Rahu",
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
      name: "Foreign Settlement Yoga in Kundli",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/foreign-settlement-yoga-in-kundli",
    },
  ],
};

const distinctions = [
  {
    title: "Foreign travel",
    text: "A journey outside one's country or familiar environment does not necessarily indicate relocation or permanent residence.",
  },
  {
    title: "Temporary residence abroad",
    text: "A person may live overseas for education, work or family reasons and later return home.",
  },
  {
    title: "Relocation",
    text: "Relocation changes the person's centre of life and therefore requires a broader study of home, movement and residence.",
  },
  {
    title: "Long-term settlement",
    text: "Long-term establishment abroad requires stronger and repeated support than one isolated foreign-travel indicator.",
  },
];

const coreFactors = [
  {
    title: "4th House",
    text: "The 4th represents home, roots and one's established base. Its condition and connections become especially important when the question is about leaving the homeland or changing the centre of life.",
  },
  {
    title: "9th House",
    text: "The 9th is traditionally associated with long-distance journeys and may contribute to significant movement away from the familiar environment.",
  },
  {
    title: "12th House",
    text: "The 12th is associated with distant environments, separation from familiar surroundings and life away from the usual base.",
  },
  {
    title: "Relevant House Lords",
    text: "Connections among the lords of the 4th, 9th and 12th can become important when the chart repeatedly links home, movement and distant residence.",
  },
  {
    title: "Rahu",
    text: "Rahu may reinforce themes of foreignness, unfamiliar environments and crossing established boundaries, but it should never be treated as a standalone settlement promise.",
  },
  {
    title: "Planetary Strength",
    text: "A Yoga must be judged for the strength and capacity of the planets forming it. A theoretical connection does not automatically become a major life event.",
  },
];

const yogaQuestions = [
  {
    title: "Is the Yoga actually present?",
    text: "First establish whether meaningful links between home, long-distance movement and distant residence truly exist in the natal chart.",
  },
  {
    title: "Is the Yoga strong?",
    text: "Examine dignity, placement, dispositor support and the overall condition of the planets involved.",
  },
  {
    title: "Is the pattern repeated?",
    text: "Repeated independent indications create more confidence than a single connection.",
  },
  {
    title: "What is the reason for settlement?",
    text: "Career, marriage, education, family or business may each become the mechanism through which the foreign-settlement theme manifests.",
  },
  {
    title: "Is the Yoga active?",
    text: "Even a strong natal pattern requires an appropriate Dasha period before it is likely to become prominent.",
  },
  {
    title: "Are transits supportive?",
    text: "Transits can help trigger or refine an already active foreign-residence theme.",
  },
];

const analysisSteps = [
  {
    number: "01",
    title: "Define settlement",
    text: "Clarify whether the question concerns travel, temporary residence, relocation or genuinely long-term establishment abroad.",
  },
  {
    number: "02",
    title: "Begin with the D1",
    text: "Establish the natal pattern before using timing techniques.",
  },
  {
    number: "03",
    title: "Study the 4th house",
    text: "Examine home, roots, residence and the condition of the 4th lord.",
  },
  {
    number: "04",
    title: "Study the 9th and 12th houses",
    text: "Look for long-distance movement and life away from the familiar environment.",
  },
  {
    number: "05",
    title: "Examine house-lord connections",
    text: "See whether the lords of home and foreign-related houses meaningfully connect.",
  },
  {
    number: "06",
    title: "Identify the cause of relocation",
    text: "Career, education, marriage, family or business should be supported by the appropriate areas of the chart.",
  },
  {
    number: "07",
    title: "Judge planetary strength",
    text: "Determine whether the planets forming the pattern have sufficient capacity to deliver a major life change.",
  },
  {
    number: "08",
    title: "Map Sambandha",
    text: "Assess conjunctions, aspects and lordship relationships that connect movement, residence and purpose.",
  },
  {
    number: "09",
    title: "Consider Rahu contextually",
    text: "Use Rahu as one possible foreign-environment indicator without making it a universal rule.",
  },
  {
    number: "10",
    title: "Look for repetition",
    text: "Repeated independent indications increase confidence that the foreign-residence theme is structurally important.",
  },
  {
    number: "11",
    title: "Study the Dasha",
    text: "Ask whether capable planets connected with relocation and foreign residence are currently activated.",
  },
  {
    number: "12",
    title: "Add transit support",
    text: "Use transits to refine the timing of a natal theme that is already active.",
  },
];

const mistakes = [
  "Calling any 12th-house connection a foreign-settlement Yoga.",
  "Assuming Rahu guarantees life abroad.",
  "Confusing foreign travel with permanent settlement.",
  "Ignoring the 4th house and 4th lord.",
  "Ignoring why the person would relocate.",
  "Treating one Yoga as a guaranteed life event.",
  "Ignoring planetary dignity and strength.",
  "Ignoring the running Dasha.",
  "Predicting settlement from one transit.",
  "Assuming foreign residence automatically means permanent residency or citizenship.",
  "Predicting a specific country without sufficient astrological basis.",
  "Treating immigration outcomes as astrologically guaranteed.",
];

const faqItems = [
  {
    question: "What is Foreign Settlement Yoga in Vedic astrology?",
    answer:
      "Foreign Settlement Yoga is a broad term used for combinations that connect residence, long-distance movement and distant environments. A complete interpretation must also judge planetary strength, repetition and timing.",
  },
  {
    question: "Which houses are important for foreign settlement?",
    answer:
      "The 4th house is important for home and residence, while the 9th and 12th are commonly studied for long-distance movement and life away from familiar surroundings. Their lords and connections must also be considered.",
  },
  {
    question: "Does Rahu guarantee foreign settlement?",
    answer:
      "No. Rahu may support foreign or unfamiliar-environment themes in some horoscopes, but it cannot independently guarantee relocation or settlement.",
  },
  {
    question: "Can a person have Foreign Settlement Yoga but never settle abroad?",
    answer:
      "Yes. A natal pattern may exist without becoming strongly active during a particular period, or it may manifest as travel, temporary residence or international connections rather than permanent settlement.",
  },
  {
    question: "Can astrology guarantee permanent residency or citizenship?",
    answer:
      "No. Astrology cannot guarantee visa approval, residency, permanent residency or citizenship. These depend on legal, administrative, financial and personal circumstances.",
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

export default function ForeignSettlementYogaPage() {
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

        <div className="mx-auto max-w-5xl px-6 pt-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-[#796c7b]"
          >
            <Link href="/sarathi/learn" className="hover:text-[#5a294d]">
              Knowledge Centre
            </Link>
            <span>›</span>
            <span>Foreign Travel & Settlement</span>
            <span>›</span>
            <span className="text-[#4c3e50]">
              Foreign Settlement Yoga
            </span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Foreign Travel & Settlement · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Do I Have Foreign Settlement Yoga in My Kundli?
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Foreign Settlement Yoga is not one fixed planetary combination.
            Vedic astrology studies whether the chart repeatedly connects
            home, long-distance movement, distant residence and the life
            circumstances that could cause relocation.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The most important distinction
            </p>

            <p className="mt-4 text-2xl font-semibold text-[#47394b]">
              Yoga present ≠ Yoga strong ≠ Yoga active ≠ guaranteed settlement.
            </p>

            <p className="mt-4 leading-7 text-[#65586a]">
              A foreign-settlement combination only becomes meaningful after
              its exact formation, planetary strength, supporting repetition,
              Dasha activation and transit support are examined.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the event
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Foreign travel and foreign settlement are not the same thing.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A chart may support international movement without showing a
              lasting change of residence. That is why the type of event must
              be defined before calling something Foreign Settlement Yoga.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {distinctions.map((item) => (
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

            <p className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-[#47394b]">
              Do not memorise one foreign Yoga as a prediction. First decide
              what form of foreign experience the chart actually needs to
              explain.
            </p>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Core framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which factors are studied for Foreign Settlement Yoga?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {coreFactors.map((factor) => (
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Home and homeland
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the 4th house important for foreign settlement?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 4th house traditionally represents home, residence, roots
                and one's emotional connection with the established base.
              </p>

              <p>
                Foreign settlement involves more than movement. It involves a
                meaningful change in where life is centred.
              </p>

              <p>
                That is why the 4th house and its lord become especially
                important when distinguishing a journey from a genuine
                relocation.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 9th and 12th can describe movement away. The 4th helps us
                understand what happens to the person's home base.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Foreign environments
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does the 12th house mean foreign settlement?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 12th house is strongly associated with life away from the
                familiar environment in many traditional and modern Jyotish
                interpretations.
              </p>

              <p>
                But the 12th has many meanings. Its presence in a Dasha or
                Yoga cannot automatically be translated into living abroad.
              </p>

              <p>
                The 12th becomes more persuasive when it repeatedly connects
                with home, long-distance movement and the reason for
                relocation.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 12th contributes to the foreign-residence story. It does
                not tell the whole story by itself.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Rahu
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Is Rahu the planet of foreign settlement?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Rahu is often associated with unfamiliar environments,
                foreign influences and crossing traditional boundaries.
              </p>

              <p>
                This can make Rahu important in some relocation or foreign
                residence charts.
              </p>

              <p>
                But Rahu must still be interpreted through its house,
                dispositor, planetary relationships, strength and Dasha role.
              </p>

              <p className="font-semibold text-[#47394b]">
                Rahu may reinforce a foreign theme. Rahu does not independently
                guarantee foreign settlement.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Yoga evaluation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Finding a Yoga is only the first step.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A useful analysis separates formation, strength, repetition and
              activation instead of treating every theoretical combination as
              an event.
            </p>

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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Cause of settlement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What actually takes the person abroad?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Foreign settlement does not occur in a vacuum. The chart should
                normally explain the mechanism through which relocation becomes
                possible.
              </p>

              <p>
                A career-led move should meaningfully involve career factors.
                A marriage-led move should involve partnership factors.
                Education-led relocation requires the educational dimension to
                participate.
              </p>

              <p className="font-semibold text-[#47394b]">
                The foreign houses describe movement away. The rest of the
                chart explains why the person moves.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              When does Foreign Settlement Yoga become active?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A natal pattern can remain present for many years without
                producing a major relocation.
              </p>

              <p>
                Mahadasha and Antardasha help identify when planets connected
                with home, movement, distant residence and the cause of
                relocation become active.
              </p>

              <p>
                Transits can then reinforce those planets or houses and refine
                the period.
              </p>

              <p className="font-semibold text-[#47394b]">
                Dasha activates the natal agenda. Transit helps time its
                expression.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A 12-step method for analysing Foreign Settlement Yoga
            </h2>

            <div className="mt-10 space-y-5">
              {analysisSteps.map((step) => (
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why the same Foreign Settlement Yoga can manifest differently
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope where the 4th lord meaningfully connects
                  with the 12th house and a strong career planet.
                </p>

                <p>
                  This creates a plausible link between home, distant residence
                  and professional life.
                </p>

                <p>
                  During one earlier Dasha, the person may travel
                  internationally for work but remain based at home.
                </p>

                <p>
                  During a later period, the same natal structure may be
                  activated more strongly while career and relocation factors
                  converge, resulting in an overseas move.
                </p>

                <p className="font-semibold text-[#403344]">
                  The natal Yoga creates potential. Timing and supporting
                  factors determine how strongly that potential manifests.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading Foreign Settlement Yoga?
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Sārathi framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A Yoga becomes meaningful only when the whole chart supports it.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Foreign Settlement Yoga should be treated as a structured chart
                pattern, not a keyword attached to one placement.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → D1 promise → 4th house → 9th/12th houses →
                relevant house lords → reason for relocation → planetary
                strength → Sambandha → repetition → Dasha → transit activation
                → likely manifestation.
              </p>

              <p>
                This framework helps distinguish an international journey from
                temporary residence, relocation and long-term settlement.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Frequently asked questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Foreign Settlement Yoga
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Foreign Travel & Settlement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring the foreign-movement theme
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href="/sarathi/learn/questions/when-will-i-go-abroad"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Timing
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I go abroad?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how Dashas and transits are used to study stronger
                  foreign-travel periods.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/will-i-settle-abroad"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Settlement
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Will I settle abroad?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand how long-term foreign residence differs from
                  travel and temporary relocation.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">Continue learning</h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              Build the principles behind foreign-settlement analysis through
              the Sārathi Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the 4th, 9th and 12th within the complete Bhava
                  framework.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how residence and foreign-related house lords carry
                  their agendas through the horoscope.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why a Yoga's presence and its ability to deliver
                  are separate questions.
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
                  Learn how home, movement and purpose-related factors connect.
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
                  Learn how a natal foreign-settlement pattern becomes active.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transits refine an active relocation period.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/predictive-astrology-event-timing"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9] md:col-span-2"
              >
                <p className="font-semibold">
                  Predictive Astrology & Event Timing
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Bring natal promise, strength, Dasha and transit together
                  before making a timing conclusion.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Go beyond one Yoga
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Foreign settlement is a chart-wide pattern, not a promise
                hidden in one placement.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you understand how houses, house lords,
                planetary strength, relationships, Dashas and transits work
                together through a structured Vedic astrology framework.
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

          <section className="pt-10">
            <p className="text-sm leading-6 text-[#827685]">
              Sārathi presents Vedic astrology as a traditional interpretive
              framework for reflection and guidance. Astrology cannot
              guarantee foreign travel, relocation, visa approval, residency,
              permanent residency or citizenship. Immigration outcomes depend
              on legal, administrative, financial and personal circumstances.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}