import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Which House Shows Children in Vedic Astrology?",
  description:
    "Learn why the 5th house is central to children in Vedic astrology and how the 5th lord, Jupiter, planetary strength, D7 or Saptamsha, Dashas and transits complete the analysis.",
  path: "/sarathi/learn/questions/which-house-shows-children-vedic-astrology",
  keywords: [
    "Which House Shows Children in Vedic Astrology",
    "5th House Children Astrology",
    "Children House in Kundli",
    "Childbirth House Astrology",
    "5th Lord Children",
    "Jupiter Children Astrology",
    "D7 Chart Children",
    "Saptamsha Children",
    "Children in Vedic Astrology",
    "Santaan Astrology",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Which House Shows Children in Vedic Astrology?",
  description:
    "A practical guide to the 5th house and the wider Vedic astrology framework used to study children, including the 5th lord, Jupiter, D7, Dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-children-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-children-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "5th house",
    "Children in astrology",
    "5th lord",
    "Jupiter",
    "D7 chart",
    "Saptamsha",
    "Childbirth timing",
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
      name: "Which House Shows Children in Vedic Astrology?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-children-vedic-astrology",
    },
  ],
};

const fifthHouseThemes = [
  "Children and progeny",
  "Creativity",
  "Intelligence and learning",
  "Expression and creation",
  "Purva punya in traditional interpretation",
  "Parenthood themes in relevant contexts",
];

const coreFactors = [
  {
    title: "5th House",
    text: "The 5th house is the primary house traditionally associated with children and progeny. It begins the enquiry but should never be read in isolation.",
  },
  {
    title: "5th Lord",
    text: "The lord of the 5th carries the children-related agenda through the horoscope. Its placement, dignity, dispositor and relationships help refine the picture.",
  },
  {
    title: "Jupiter",
    text: "Jupiter is traditionally important as a natural significator for children in relevant Jyotish contexts, but it is not a universal guarantee of childbirth.",
  },
  {
    title: "Planetary Strength",
    text: "Relevant planets need to be judged for capacity through dignity, placement, dispositor support and the wider horoscope.",
  },
  {
    title: "Sambandha",
    text: "Connections between the 5th house, 5th lord, Jupiter and other relevant factors can reveal how the children-related theme operates within the chart.",
  },
  {
    title: "D7 / Saptamsha",
    text: "The D7 is traditionally used to refine the children and progeny dimension after the D1 has first established the natal foundation.",
  },
];

const questions = [
  {
    title: "Children as a natal theme",
    text: "The chart can traditionally be studied for how the subject of children and parenthood fits within the person's wider life pattern.",
  },
  {
    title: "Santaan Yoga",
    text: "Supportive combinations may strengthen the children-related theme, but a Yoga must still be judged for formation, strength and activation.",
  },
  {
    title: "Timing",
    text: "The question of when a children-related period becomes active requires Dashas and transits in addition to the natal chart.",
  },
  {
    title: "Delay",
    text: "A slower astrological pathway must not be confused with infertility, reproductive illness or permanent denial.",
  },
  {
    title: "Parenthood experience",
    text: "The children-related part of the chart may also be interpreted traditionally in relation to the responsibilities and experience of parenting.",
  },
  {
    title: "Medical fertility",
    text: "This is not an astrological question. Fertility and reproductive health require qualified medical assessment.",
  },
];

const analysisSteps = [
  {
    number: "01",
    title: "Define the exact question",
    text: "Clarify whether the enquiry concerns children as a life theme, Santaan Yoga, timing, delay or another aspect of parenthood.",
  },
  {
    number: "02",
    title: "Begin with the D1",
    text: "Establish the natal framework before moving to specialised divisional charts or timing techniques.",
  },
  {
    number: "03",
    title: "Study the 5th house",
    text: "Examine occupants, aspects and the overall condition of the primary house traditionally associated with children.",
  },
  {
    number: "04",
    title: "Study the 5th lord",
    text: "See where it is placed, what it connects with and whether it has sufficient strength to carry its responsibilities.",
  },
  {
    number: "05",
    title: "Examine Jupiter contextually",
    text: "Use Jupiter as a natural significator while respecting functional lordship, placement, dignity and the wider horoscope.",
  },
  {
    number: "06",
    title: "Judge planetary strength",
    text: "Determine whether the relevant planets have sufficient capacity rather than interpreting their presence alone.",
  },
  {
    number: "07",
    title: "Map Sambandha",
    text: "Look for meaningful relationships between children-related houses, lords and significators.",
  },
  {
    number: "08",
    title: "Look for repetition",
    text: "Repeated independent indications provide greater confidence than one isolated favourable or difficult placement.",
  },
  {
    number: "09",
    title: "Examine the D7",
    text: "Use Saptamsha to refine the progeny dimension after the D1 pattern has been established.",
  },
  {
    number: "10",
    title: "Study the running Dasha",
    text: "Ask whether capable children-related planets and houses are activated during the current planetary periods.",
  },
  {
    number: "11",
    title: "Add transit support",
    text: "Use transits to refine an already active period rather than predicting childbirth from one transit alone.",
  },
  {
    number: "12",
    title: "Keep the conclusion within evidence",
    text: "Astrology may describe traditional timing or chart patterns, but it should not diagnose fertility or guarantee conception or childbirth.",
  },
];

const mistakes = [
  "Reading the 5th house alone.",
  "Ignoring the condition of the 5th lord.",
  "Assuming Jupiter guarantees children.",
  "Assuming Saturn connected with the 5th automatically denies children.",
  "Treating Rahu or Ketu as automatic causes of childlessness.",
  "Using one Santaan Yoga as a guaranteed prediction.",
  "Reading the D7 without first establishing the D1 foundation.",
  "Predicting childbirth from Jupiter transit alone.",
  "Confusing delay with infertility.",
  "Confusing astrological difficulty with permanent denial.",
  "Trying to diagnose reproductive health from a horoscope.",
  "Predicting the sex or gender of a child.",
];

const faqItems = [
  {
    question: "Which house represents children in Vedic astrology?",
    answer:
      "The 5th house is the primary house traditionally associated with children and progeny. A complete analysis also considers the 5th lord, Jupiter, planetary strength, D7, Dashas and transits.",
  },
  {
    question: "Which planet represents children in Vedic astrology?",
    answer:
      "Jupiter is traditionally an important natural significator for children in relevant Jyotish contexts. However, Jupiter alone cannot guarantee childbirth or determine fertility.",
  },
  {
    question: "Which divisional chart is used for children?",
    answer:
      "The D7, or Saptamsha, is traditionally used to refine the children and progeny dimension after the D1 birth chart has first established the natal foundation.",
  },
  {
    question: "Does a weak 5th house mean no children?",
    answer:
      "No. A difficult or weak 5th-house pattern is not a diagnosis of infertility and should not automatically be interpreted as permanent denial. The whole horoscope and timing framework must be considered.",
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

export default function WhichHouseShowsChildrenPage() {
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
            <span>Children & Family</span>
            <span>›</span>
            <span className="text-[#4c3e50]">
              Which house shows children?
            </span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Children & Family · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Which House Shows Children in Vedic Astrology?
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            The 5th house is the primary starting point for studying children
            and progeny in a Vedic birth chart. But “5th house = children” is
            only the beginning. The 5th lord, Jupiter, planetary strength,
            Sambandha, D7, Dashas and transits complete the traditional
            astrological framework.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              The <strong>5th house is the primary house for children</strong>{" "}
              in Vedic astrology. A fuller interpretation also examines the
              5th lord, Jupiter contextually, planetary strength, aspects and
              Sambandha, the D7 or Saptamsha, planetary periods and transits.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Primary house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why does the 5th house represent children?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In Jyotish, each Bhava represents a field of life. The 5th
                house carries several themes connected with creation,
                continuity and expression.
              </p>

              <p>
                Children and progeny are traditionally included within this
                field, making the 5th house the natural starting point for a
                children-related enquiry.
              </p>

              <p>
                But the 5th house contains more than one meaning. Its
                activation does not automatically mean conception, pregnancy
                or childbirth.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 5th house identifies the domain. The whole chart tells us
                how that domain may express itself.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {fifthHouseThemes.map((theme) => (
                <div
                  key={theme}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-5"
                >
                  <p className="font-semibold">{theme}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Beyond one house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What else must be studied besides the 5th house?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A Bhava cannot be interpreted independently from its lord,
              planetary influences, strength and the wider horoscope.
            </p>

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
              House lordship
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the 5th lord as important as the 5th house?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 5th house identifies the children-related field. Its lord
                carries that field into another part of the horoscope.
              </p>

              <p>
                The house occupied by the 5th lord can therefore show where
                this agenda becomes connected with other areas of life.
              </p>

              <p>
                Its dignity, dispositor, aspects, conjunctions and overall
                strength also help determine how effectively it can perform
                its role.
              </p>

              <p className="font-semibold text-[#47394b]">
                The house tells us the subject. The house lord carries the
                subject through the chart.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Natural significator
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which planet represents children?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Jupiter is traditionally an important natural significator for
                children and progeny in relevant Jyotish contexts.
              </p>

              <p>
                This does not mean that a strong Jupiter automatically
                guarantees children, or that a difficult Jupiter automatically
                indicates problems.
              </p>

              <p>
                Jupiter still has a specific functional role in each
                horoscope based on the Ascendant, house lordship, placement,
                dignity and relationships.
              </p>

              <p className="font-semibold text-[#47394b]">
                The natural karaka adds meaning. It does not replace the
                individual horoscope.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the enquiry
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “Children” can mean several different astrological questions.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Before interpreting the 5th house, the question itself should be
              defined clearly.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {questions.map((item) => (
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
              A critical boundary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Can the 5th house show fertility?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 5th house can be studied within the traditional
                astrological framework for children and progeny.
              </p>

              <p>
                It cannot medically determine fertility, infertility,
                reproductive health or the biological cause of difficulty
                conceiving.
              </p>

              <p>
                These are healthcare questions and require qualified medical
                assessment.
              </p>

              <p className="font-semibold text-[#47394b]">
                An astrological children indicator is not a medical fertility
                test.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Divisional chart
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which divisional chart is used for children?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D7, called Saptamsha, is traditionally used to refine the
                area of children and progeny.
              </p>

              <p>
                It should not be read as a replacement for the D1 birth chart.
              </p>

              <p>
                The natal chart first establishes the underlying pattern. The
                D7 can then add specialised refinement to that theme.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the foundation. D7 refines the children-related
                dimension.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How does Dasha affect children-related timing?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Natal promise and timing are separate layers of analysis.
              </p>

              <p>
                A children-related theme may be present in the horoscope
                without being equally active throughout life.
              </p>

              <p>
                Mahadasha, Antardasha and finer planetary periods help identify
                when capable planets connected with the 5th house, 5th lord,
                Jupiter or other relevant factors become more prominent.
              </p>

              <p className="font-semibold text-[#47394b]">
                Dasha activates natal agendas. It does not create a promise
                that the birth chart does not support.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter transiting the 5th house predict childbirth?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>Not by itself.</p>

              <p>
                A Jupiter transit may reinforce children-related themes when it
                meaningfully activates natal factors.
              </p>

              <p>
                But the same broad transit occurs for many people without
                producing the same life event.
              </p>

              <p>
                Timing becomes more meaningful when natal promise, planetary
                periods, the D7 and transits converge independently.
              </p>

              <p className="font-semibold text-[#47394b]">
                Transit supports an active natal theme. It does not replace the
                horoscope.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should the house for children actually be analysed?
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
              Why 5th-house activation does not automatically mean childbirth
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a period that strongly activates the 5th house.
                </p>

                <p>
                  During that time, the person begins an important course of
                  study, develops a creative project or takes on a significant
                  mentoring responsibility.
                </p>

                <p>
                  The 5th-house field is active, but the event is not
                  childbirth.
                </p>

                <p>
                  Later, another period activates the 5th lord and supportive
                  children-related factors while the D7 and major transits
                  reinforce the same theme.
                </p>

                <p className="font-semibold text-[#403344]">
                  The exact manifestation becomes clearer through convergence,
                  not through the house number alone.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading the house for children?
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
              The 5th house begins the enquiry. Convergence completes it.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A structured children-related analysis moves from the primary
                house into the wider natal, divisional and timing framework.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → D1 promise → 5th house → 5th lord → Jupiter
                contextually → planetary strength → Sambandha → repetition →
                D7 → Dasha → transit activation → supported conclusion.
              </p>

              <p>
                This prevents the simple equation “5th house = childbirth”
                from becoming an unsupported prediction.
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
              Children in Vedic astrology
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
              Children & Family
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring children-related questions
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Link
                href="/sarathi/learn/questions/santaan-yoga-in-kundli"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Natal Potential
                </p>
                <h3 className="mt-3 text-xl font-semibold">
                  Do I have Santaan Yoga?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Study the combinations traditionally used to assess the
                  children-related natal promise.
                </p>
                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/why-is-childbirth-delayed"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Delay
                </p>
                <h3 className="mt-3 text-xl font-semibold">
                  Why is childbirth delayed?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand why astrological delay must not be confused with
                  infertility or denial.
                </p>
                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/when-will-i-have-a-child"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Timing
                </p>
                <h3 className="mt-3 text-xl font-semibold">
                  When will I have a child?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how Dasha, D7 and transits are used to study
                  children-related timing.
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
              Build the principles behind children-related analysis through
              the Sārathi Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the 5th house within the complete Bhava framework.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the 5th lord carries its agenda through the chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why relevance and delivery capacity are separate
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
                  Learn how children-related factors connect within the chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the role of D7 and why D1 remains the foundation.
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
                  Learn how children-related natal agendas become active.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transits refine an active period.
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
                  Bring natal promise, strength, Dasha and transit together.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Go beyond one house
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                The 5th house identifies the children-related theme. Your whole
                chart explains how that theme may develop.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you understand how houses, house lords,
                planetary strength, divisional charts, Dashas and transits work
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
              framework for reflection and guidance. Astrology cannot diagnose
              fertility, infertility, reproductive conditions or any medical
              cause of difficulty conceiving, and it cannot guarantee
              conception, pregnancy or childbirth. Medical questions should be
              discussed with a qualified healthcare professional.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}