import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Santaan Yoga in Kundli: What Vedic Astrology Studies About Children",
  description:
    "Learn how Santaan Yoga is studied in Vedic astrology through the 5th house, 5th lord, Jupiter, planetary strength, D7 or Saptamsha, Dashas and transits.",
  path: "/sarathi/learn/questions/santaan-yoga-in-kundli",
  keywords: [
    "Santaan Yoga in Kundli",
    "Santaan Yoga Astrology",
    "Child Yoga in Kundli",
    "Children in Vedic Astrology",
    "5th House Children Astrology",
    "Childbirth Astrology",
    "Jupiter Children Astrology",
    "D7 Chart",
    "Saptamsha",
    "Childbirth Dasha",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Santaan Yoga in Kundli: What Vedic Astrology Studies About Children",
  description:
    "A practical guide to how Vedic astrology studies children and progeny through the 5th house, 5th lord, Jupiter, planetary strength, D7, Dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/santaan-yoga-in-kundli",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/santaan-yoga-in-kundli",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Santaan Yoga",
    "5th house",
    "Children in astrology",
    "Jupiter",
    "D7 chart",
    "Saptamsha",
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
      name: "Santaan Yoga in Kundli",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/santaan-yoga-in-kundli",
    },
  ],
};

const childThemes = [
  {
    title: "Children as a life theme",
    text: "The chart may show how strongly the subject of children, parenting and progeny is woven into the person's broader life pattern.",
  },
  {
    title: "Timing",
    text: "Even when the natal chart supports children, the question of when the theme becomes active belongs to the timing layer.",
  },
  {
    title: "Delay",
    text: "A slower or more complex pathway should be distinguished from a medical conclusion and from the much stronger claim of denial.",
  },
  {
    title: "Parenthood experience",
    text: "Astrology can also be used traditionally to explore how the person experiences the responsibilities, growth and emotional dimension of parenting.",
  },
];

const coreFactors = [
  {
    title: "5th House",
    text: "The 5th house is the primary house traditionally associated with children and progeny. Its condition begins the enquiry but does not complete it.",
  },
  {
    title: "5th Lord",
    text: "The 5th lord carries the children-related agenda elsewhere in the horoscope. Its placement, dignity, dispositor and relationships help refine the picture.",
  },
  {
    title: "Jupiter",
    text: "Jupiter is traditionally used as an important natural significator for children in relevant Jyotish contexts, but it cannot be interpreted independently from the chart.",
  },
  {
    title: "Planetary Strength",
    text: "A relevant combination has greater interpretive weight when the planets involved have sufficient dignity, support and capacity.",
  },
  {
    title: "Sambandha",
    text: "Connections between the 5th house, 5th lord, Jupiter and other relevant factors can show how the children theme is integrated into the horoscope.",
  },
  {
    title: "D7 / Saptamsha",
    text: "The D7 is traditionally used to refine the progeny dimension after the D1 birth chart has first established the underlying promise.",
  },
];

const yogaQuestions = [
  {
    title: "Is the 5th house supported?",
    text: "Study the house as a whole, including occupants, aspects and the wider condition of the chart.",
  },
  {
    title: "What is the condition of the 5th lord?",
    text: "Its placement, strength, dignity and relationships help show how effectively it can carry the children-related agenda.",
  },
  {
    title: "What role does Jupiter play?",
    text: "Jupiter can add an important natural-signification layer, but its role must be interpreted through the individual Ascendant and horoscope.",
  },
  {
    title: "Does the pattern repeat?",
    text: "Repeated independent indications provide greater confidence than one isolated favourable or difficult placement.",
  },
  {
    title: "Does the D7 support the theme?",
    text: "Saptamsha can refine the progeny dimension after the D1 foundation has been established.",
  },
  {
    title: "Is the theme active now?",
    text: "Dashas and transits help study when capable natal factors become more prominent.",
  },
];

const interpretationSteps = [
  {
    number: "01",
    title: "Define the exact question",
    text: "Clarify whether the person is asking about parenthood potential, timing, delay, the experience of parenting or another children-related concern.",
  },
  {
    number: "02",
    title: "Begin with the D1",
    text: "Establish the natal children-related pattern before moving to divisional charts or timing.",
  },
  {
    number: "03",
    title: "Study the 5th house",
    text: "Examine occupants, aspects and the overall condition of the primary house traditionally associated with children.",
  },
  {
    number: "04",
    title: "Study the 5th lord",
    text: "Assess where it is placed, what it connects with and whether it has sufficient strength to carry its responsibilities.",
  },
  {
    number: "05",
    title: "Examine Jupiter contextually",
    text: "Use Jupiter as a natural significator while still respecting functional lordship, placement and the wider horoscope.",
  },
  {
    number: "06",
    title: "Judge planetary strength",
    text: "Determine whether the planets carrying the children-related agenda have sufficient dignity, support and capacity.",
  },
  {
    number: "07",
    title: "Map Sambandha",
    text: "Look for meaningful relationships between the 5th house, 5th lord, Jupiter and other factors relevant to the question.",
  },
  {
    number: "08",
    title: "Look for repetition",
    text: "One indication should not decide the conclusion. Repeated support or repeated difficulty deserves greater interpretive weight.",
  },
  {
    number: "09",
    title: "Examine the D7",
    text: "Use Saptamsha to refine the children and progeny dimension after the natal promise has been understood.",
  },
  {
    number: "10",
    title: "Study the running Dasha",
    text: "Ask whether the active Mahadasha, Antardasha or finer periods involve capable children-related factors.",
  },
  {
    number: "11",
    title: "Add transit support",
    text: "Use transits to refine an already active period rather than predicting childbirth from one transit alone.",
  },
  {
    number: "12",
    title: "State only what the evidence supports",
    text: "Astrological timing should be framed as an interpretive window, not as a medical diagnosis or guarantee of conception or childbirth.",
  },
];

const timingLayers = [
  {
    title: "D1 Promise",
    text: "The birth chart establishes the underlying children-related pattern and the planets carrying that agenda.",
  },
  {
    title: "Planetary Capacity",
    text: "The strength and condition of the 5th lord, Jupiter and other relevant planets help refine how strongly the theme can operate.",
  },
  {
    title: "D7 / Saptamsha",
    text: "The D7 can refine the progeny dimension after the D1 foundation is understood.",
  },
  {
    title: "Dasha",
    text: "Planetary periods help identify when children-related natal factors become more active.",
  },
  {
    title: "Transit",
    text: "Transits can reinforce active natal themes and help narrow a broader period.",
  },
];

const mistakes = [
  "Assuming a strong 5th house guarantees childbirth.",
  "Assuming a difficult 5th house means infertility.",
  "Treating Saturn in connection with the 5th house as automatic denial.",
  "Treating Rahu or Ketu as automatic causes of childlessness.",
  "Assuming Jupiter alone guarantees children.",
  "Using one Yoga as the entire conclusion.",
  "Reading the D7 without first establishing the D1 foundation.",
  "Predicting childbirth from Jupiter transit alone.",
  "Treating delay and denial as the same thing.",
  "Trying to diagnose fertility or reproductive health from a horoscope.",
  "Predicting the sex or gender of a child.",
  "Ignoring medical, biological and personal realities.",
];

const faqItems = [
  {
    question: "What is Santaan Yoga in Vedic astrology?",
    answer:
      "Santaan Yoga is a broad term used for chart combinations that are traditionally interpreted as supporting the theme of children or progeny. The strength of such combinations must be judged through the entire horoscope rather than from one placement alone.",
  },
  {
    question: "Which house shows children in Vedic astrology?",
    answer:
      "The 5th house is the primary house traditionally associated with children. The 5th lord, Jupiter, planetary strength, D7, Dashas and transits are also relevant to a fuller analysis.",
  },
  {
    question: "Does a difficult 5th house mean infertility?",
    answer:
      "No. Astrology cannot diagnose infertility. A difficult 5th-house pattern may be interpreted traditionally as complexity or delay in the broader children-related theme, but medical fertility questions require qualified healthcare professionals.",
  },
  {
    question: "Which divisional chart is used for children?",
    answer:
      "The D7, or Saptamsha, is traditionally used to refine the progeny and children-related dimension after the D1 birth chart has first been analysed.",
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

export default function SantaanYogaPage() {
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

            <span className="text-[#4c3e50]">Santaan Yoga in Kundli</span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Children & Family · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Do I Have Santaan Yoga in My Kundli? What Vedic Astrology Studies
            About Children
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Santaan Yoga is often discussed as though one favourable
            combination can guarantee children. A careful Jyotish analysis is
            wider: it studies the 5th house, 5th lord, Jupiter, planetary
            strength, repetition, the D7 or Saptamsha, and the timing factors
            that activate the natal pattern.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              In Vedic astrology, children are studied primarily through the{" "}
              <strong>
                5th house, 5th lord and Jupiter in relevant context
              </strong>
              . Planetary strength, Sambandha and repeated indications help
              refine the natal promise. The D7 or Saptamsha adds a specialised
              layer, while Dashas and transits help study timing.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does “Santaan Yoga” actually mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                “Santaan” refers broadly to children or progeny. In common
                astrological usage, Santaan Yoga refers to combinations that
                support this area of life.
              </p>

              <p>
                But a Yoga should not be treated as a guaranteed event.
              </p>

              <p>
                The combination must be judged for formation, strength,
                support, repetition and timing within the whole horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                Having a Santaan Yoga and experiencing its results are not the
                same question.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the question
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “Will I have children?” contains several different questions.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The first step is to separate the exact concern rather than using
              one broad label for every children-related matter.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {childThemes.map((item) => (
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
              Core factors
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is examined for children in a Kundli?
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
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why is the 5th house important for children?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 5th house is traditionally associated with children,
                progeny, creativity and the continuation of one's lineage in
                relevant Jyotish contexts.
              </p>

              <p>
                That makes it the starting point for a children-related
                enquiry.
              </p>

              <p>
                But an astrologer should still study its lord, occupants,
                aspects, strength and wider chart connections before drawing a
                conclusion.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 5th house begins the analysis. It does not complete it.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              House lordship
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the 5th lord so important?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 5th lord carries the children-related agenda into whichever
                part of the chart it occupies.
              </p>

              <p>
                Its house placement, dignity, dispositor, aspects and
                conjunctions can all modify how that agenda operates.
              </p>

              <p>
                Its relationship with the Ascendant, Lagna lord, Jupiter or
                other relevant houses may also help refine the pattern.
              </p>

              <p className="font-semibold text-[#47394b]">
                The house tells us the topic. The house lord shows how that
                topic travels through the horoscope.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Natural significator
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does Jupiter guarantee children?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Jupiter is traditionally given an important role in the study
                of children and progeny.
              </p>

              <p>
                But a natural significator should never become an automatic
                prediction.
              </p>

              <p>
                Jupiter's house lordship, placement, dignity, aspects,
                conjunctions and relationship with the 5th house must still be
                studied in the individual horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natural signification gives us vocabulary. The whole chart
                gives us the sentence.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A critical distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Delay does not automatically mean infertility or denial.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                One of the most important distinctions in children-related
                astrology is between a slower pathway, a difficult period and a
                medical fertility condition.
              </p>

              <p>
                Astrology cannot diagnose reproductive health, infertility or
                any medical cause of difficulty conceiving.
              </p>

              <p>
                A chart pattern traditionally interpreted as delay should
                therefore remain an astrological timing observation — not a
                medical conclusion.
              </p>

              <p className="font-semibold text-[#47394b]">
                Delay ≠ infertility ≠ denial.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Six questions to ask before calling Santaan Yoga strong
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Saptamsha
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is the D7 chart and why is it used for children?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D7, or Saptamsha, is a divisional chart traditionally used
                to refine the area of children and progeny.
              </p>

              <p>
                It should not replace the D1 birth chart.
              </p>

              <p>
                First establish the children-related pattern in the D1. Then
                examine the D7 for further support, refinement or complexity.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the natal promise. D7 refines the progeny
                dimension.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              When can children-related indications become active?
            </h2>

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
                D1 promise → planetary capacity → D7 refinement → Dasha
                activation → transit support → children-related event
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Which Dasha can support childbirth timing?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                There is no universal childbirth Dasha that applies to every
                horoscope.
              </p>

              <p>
                A children-related period becomes more relevant when the active
                Mahadasha, Antardasha or finer period involves planets
                meaningfully connected with the 5th house, 5th lord, Jupiter or
                other supported children-related factors.
              </p>

              <p>
                Which planet performs that role depends on the individual
                Ascendant and chart structure.
              </p>

              <p className="font-semibold text-[#47394b]">
                Dasha activates the natal agenda. It should not create a promise
                that the birth chart does not support.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter transit alone predict childbirth?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>No.</p>

              <p>
                Jupiter's transit may become relevant when it activates
                children-related factors, but thousands of people experience
                the same broad transit without the same life event.
              </p>

              <p>
                Timing becomes more meaningful when the natal promise, Dasha,
                D7 and transits independently converge on the same theme.
              </p>

              <p className="font-semibold text-[#47394b]">
                Transit supports timing. It does not replace the horoscope.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should Santaan Yoga actually be analysed?
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why a supportive natal pattern may not manifest immediately
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a chart with a capable 5th lord, supportive
                  relationships involving Jupiter and further confirmation in
                  the D7.
                </p>

                <p>
                  The children-related theme appears supported, but the running
                  planetary periods are focused primarily on education, career
                  or another area of life.
                </p>

                <p>
                  Later, a Dasha activates the capable 5th-house factors while
                  major transits reinforce the same theme.
                </p>

                <p className="font-semibold text-[#403344]">
                  The natal pattern existed earlier. Timing determined when the
                  theme became more active.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should be avoided in children-related astrology?
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
              Children-related questions should be judged through convergence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A structured analysis moves from the exact question into natal
                promise, strength, refinement and timing.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → D1 promise → 5th house → 5th lord → Jupiter
                contextually → planetary strength → Sambandha → repetition →
                D7 → Dasha → transit activation → supported conclusion.
              </p>

              <p>
                This prevents one planet, one difficult placement or one transit
                from becoming an exaggerated prediction about children.
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
              Santaan Yoga questions
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
              Continue exploring childbirth timing
            </h2>

            <div className="mt-8">
              <Link
                href="/sarathi/learn/questions/when-will-i-have-a-child"
                className="block rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Timing
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I have a child?
                </h3>

                <p className="mt-3 max-w-2xl leading-7 text-[#6a5d6e]">
                  Learn how Vedic astrology studies children-related timing
                  through the natal chart, D7, planetary periods and transits.
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
              Build the chart-reading principles used in children-related
              analysis through the Sārathi Vedic Astrology Foundations
              curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the 5th house within the wider Bhava framework.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the 5th lord carries the children-related agenda.
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
                  Learn how children-related factors become connected.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the role of D7 and why the D1 remains the
                  foundation.
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
                  Learn how natal themes become active over time.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transits refine an active children-related
                  period.
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
                  Bring promise, strength, Dasha and transit together into a
                  structured judgement.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Read the whole chart
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Children-related astrology is more than one house, one planet
                or one Yoga.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you understand how the 5th house, house lord,
                planetary strength, D7, Dashas and transits fit together through
                a structured Vedic astrology framework.
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