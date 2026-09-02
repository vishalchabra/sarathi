import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Vimshottari Dasha in Vedic Astrology: Beginner Guide",
  description:
    "Learn Vimshottari Dasha step by step: the 120-year cycle, Mahadasha, Antardasha, Pratyantardasha, Moon Nakshatra, Dasha balance and how planetary periods activate the birth chart.",
  path: "/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology",
  keywords: [
    "Vimshottari Dasha",
    "Mahadasha Antardasha",
    "Pratyantardasha",
    "Vimshottari Dasha Vedic Astrology",
    "Dasha System Jyotish",
    "Mahadasha Meaning",
    "Antardasha Meaning",
    "Planetary Periods Vedic Astrology",
    "Dasha Prediction",
    "Vedic Astrology Timing",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Vimshottari Dasha in Vedic Astrology: How Planetary Periods Activate the Birth Chart",
  description:
    "A structured beginner guide to the 120-year Vimshottari Dasha cycle, Mahadasha, Antardasha, Pratyantardasha and interpreting planetary periods from the natal chart.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vimshottari Dasha",
    "Vedic astrology",
    "Mahadasha",
    "Antardasha",
    "Pratyantardasha",
    "Planetary periods",
    "Jyotish timing",
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
      name: "Vimshottari Dasha",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology",
    },
  ],
};

const dashaSequence = [
  {
    planet: "Ketu",
    years: "7 years",
    nakshatras: "Ashwini · Magha · Mula",
  },
  {
    planet: "Venus",
    years: "20 years",
    nakshatras: "Bharani · Purva Phalguni · Purva Ashadha",
  },
  {
    planet: "Sun",
    years: "6 years",
    nakshatras: "Krittika · Uttara Phalguni · Uttara Ashadha",
  },
  {
    planet: "Moon",
    years: "10 years",
    nakshatras: "Rohini · Hasta · Shravana",
  },
  {
    planet: "Mars",
    years: "7 years",
    nakshatras: "Mrigashira · Chitra · Dhanishtha",
  },
  {
    planet: "Rahu",
    years: "18 years",
    nakshatras: "Ardra · Swati · Shatabhisha",
  },
  {
    planet: "Jupiter",
    years: "16 years",
    nakshatras: "Punarvasu · Vishakha · Purva Bhadrapada",
  },
  {
    planet: "Saturn",
    years: "19 years",
    nakshatras: "Pushya · Anuradha · Uttara Bhadrapada",
  },
  {
    planet: "Mercury",
    years: "17 years",
    nakshatras: "Ashlesha · Jyeshtha · Revati",
  },
];

const judgeDashaSteps = [
  {
    number: "01",
    title: "What houses does the Dasha lord rule?",
    text: "House lordship tells us which areas of life the planet is responsible for in this particular horoscope.",
  },
  {
    number: "02",
    title: "Where is the Dasha lord placed?",
    text: "Its house placement connects the houses it rules with the house it occupies.",
  },
  {
    number: "03",
    title: "Which Rashi does it occupy?",
    text: "The sign describes the broader environment through which the planet must operate.",
  },
  {
    number: "04",
    title: "What is its strength and condition?",
    text: "Dignity, combustion, retrogression, dispositor strength and other conditions help assess its capacity.",
  },
  {
    number: "05",
    title: "Which planets is it connected with?",
    text: "Conjunctions, aspects, exchanges and other Sambandha can bring additional planetary and house agendas into the period.",
  },
  {
    number: "06",
    title: "Which Nakshatra contains it?",
    text: "The Nakshatra and its lord provide another dispositional and interpretive layer.",
  },
  {
    number: "07",
    title: "What does the planet naturally signify?",
    text: "Natural karakatwas remain relevant, but they must be interpreted alongside chart-specific lordship.",
  },
  {
    number: "08",
    title: "Does the relevant theme repeat?",
    text: "Repeated support from houses, lords, aspects and later divisional charts strengthens the interpretation.",
  },
];

const dashaLevels = [
  {
    level: "Mahadasha",
    Sanskrit: "महादशा",
    role: "The major period",
    text: "Creates the broad planetary background and establishes which natal agenda becomes prominent over a longer phase of life.",
  },
  {
    level: "Antardasha",
    Sanskrit: "अन्तर्दशा",
    role: "The sub-period",
    text: "Introduces a second planetary agenda inside the Mahadasha and helps narrow the kinds of themes that can become active.",
  },
  {
    level: "Pratyantardasha",
    Sanskrit: "प्रत्यन्तर्दशा",
    role: "The sub-sub-period",
    text: "Narrows the timing further by introducing another planetary layer within the Mahadasha–Antardasha framework.",
  },
];

export default function VimshottariDashaPage() {
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

        <div className="mx-auto max-w-5xl px-6 pt-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-[#796c7b]"
          >
            <Link href="/sarathi/learn" className="hover:text-[#5a294d]">
              Knowledge Centre
            </Link>

            <span>›</span>
            <span>Learn Vedic Astrology</span>
            <span>›</span>
            <span className="text-[#4c3e50]">Vimshottari Dasha</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 10 · Timing
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Vimshottari Dasha: When Different Parts of the Birth Chart Become
            Active
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            The birth chart contains many possibilities at the same time.
            Vimshottari Dasha helps us study which planetary agenda becomes
            especially relevant during a particular phase of life.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The tenth principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>
                A Dasha does not give a planet a new identity. It activates the
                agenda that planet already carries in the natal chart.
              </strong>
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a Dasha?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In Jyotish, a Dasha is a planetary period used to organise time
                into sequences governed by different grahas.
              </p>

              <p>
                The natal horoscope does not disappear when a Dasha begins.
                Instead, the Dasha draws greater attention to the houses,
                relationships and significations carried by its ruling planet.
              </p>

              <p>
                This gives us an important distinction:
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Birth chart
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  What patterns exist?
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  The natal chart establishes the underlying structure,
                  planetary responsibilities and relationships.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Dasha
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Which agenda is active?
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  The Dasha helps identify which part of that natal structure
                  becomes more prominent during a period.
                </p>
              </div>
            </div>
          </section>

          {/* WHY VIMSHOTTARI */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The system
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is Vimshottari Dasha?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Vimshottari is one of the most widely used Dasha systems in
                Parashari Jyotish.
              </p>

              <p>
                The complete sequence contains planetary periods totalling{" "}
                <strong>120 years</strong>.
              </p>

              <p>
                The word Vimshottari refers to this 120-year framework.
              </p>

              <p>
                Nine grahas participate in the cycle: Ketu, Venus, Sun, Moon,
                Mars, Rahu, Jupiter, Saturn and Mercury.
              </p>

              <p>
                Each receives a fixed number of years, and the sequence always
                follows the same order.
              </p>
            </div>
          </section>

          {/* 120 YEAR TABLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The 120-year cycle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The Vimshottari Mahadasha sequence
            </h2>

            <div className="mt-9 overflow-x-auto rounded-2xl border border-[#e1d3c3] bg-white">
              <table className="min-w-[720px] w-full text-left">
                <thead className="bg-[#f4ece3]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">Planet</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Mahadasha
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Nakshatras ruled
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashaSequence.map((item) => (
                    <tr
                      key={item.planet}
                      className="border-t border-[#eadfce]"
                    >
                      <td className="px-5 py-4 font-semibold">{item.planet}</td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.years}
                      </td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.nakshatras}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                7 + 20 + 6 + 10 + 7 + 18 + 16 + 19 + 17 = 120 years.
              </p>
            </div>
          </section>

          {/* MOON NAKSHATRA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Where the sequence begins
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The Moon&apos;s birth Nakshatra determines the starting
              Mahadasha.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In the standard Vimshottari system, the Nakshatra occupied by
                the Moon at birth determines which planet&apos;s Mahadasha is
                operating at birth.
              </p>

              <p>
                If the Moon is in a Ketu-ruled Nakshatra such as Ashwini, Magha
                or Mula, the birth begins within Ketu Mahadasha.
              </p>

              <p>
                If the Moon is in Rohini, Hasta or Shravana, the relevant
                Mahadasha lord at birth is the Moon.
              </p>

              <p>
                But this does <strong>not</strong> mean the person necessarily
                receives the planet&apos;s entire Mahadasha from its beginning.
              </p>

              <p>
                The exact degree of the Moon within the Nakshatra determines
                how much of that Mahadasha remains at birth.
              </p>
            </div>
          </section>

          {/* DASHA BALANCE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Dasha balance
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why two people born in the same Nakshatra can begin life with
              different Dasha balances
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Each Nakshatra spans 13°20′.
              </p>

              <p>
                The proportion of the Nakshatra remaining for the Moon at birth
                determines the proportion of its ruling planet&apos;s
                Mahadasha that remains.
              </p>

              <p>
                A Moon near the beginning of a Nakshatra leaves most of that
                Mahadasha still to run.
              </p>

              <p>
                A Moon near the end leaves much less.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Birth Nakshatra identifies the Dasha lord. The Moon&apos;s
                position within that Nakshatra determines the balance.
              </p>
            </div>
          </section>

          {/* LEVELS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Layers of timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Mahadasha → Antardasha → Pratyantardasha
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Vimshottari timing becomes increasingly specific by dividing a
              major planetary period into smaller planetary periods.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {dashaLevels.map((item) => (
                <div
                  key={item.level}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold text-[#9a6d58]">
                    {item.Sanskrit}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">{item.level}</h3>

                  <p className="mt-3 font-medium text-[#4b2744]">
                    {item.role}
                  </p>

                  <p className="mt-4 leading-7 text-[#65586a]">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NESTED CLOCK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Think of nested clocks
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Each level operates inside the level above it.
            </h2>

            <div className="mt-8 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Suppose someone is running{" "}
                  <strong>Rahu Mahadasha</strong>.
                </p>

                <p>
                  That establishes Rahu as the broad planetary background.
                </p>

                <p>
                  Within Rahu Mahadasha, the person may enter{" "}
                  <strong>Venus Antardasha</strong>.
                </p>

                <p>
                  Now both Rahu and Venus become important.
                </p>

                <p>
                  Within Rahu–Venus, a{" "}
                  <strong>Sun Pratyantardasha</strong> may operate.
                </p>

                <p>
                  We now study the interaction of Rahu, Venus and Sun — but
                  always through the roles those planets already have in the
                  natal chart.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Rahu–Venus–Sun does not have one universal meaning. Its meaning
                depends on what Rahu, Venus and Sun represent in that
                particular horoscope.
              </p>
            </div>
          </section>

          {/* HOW TO JUDGE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The interpretation method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How do we judge a Dasha lord?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We use the same natal framework learned in Lesson 9. The Dasha
              does not allow us to skip chart interpretation.
            </p>

            <div className="mt-10 space-y-5">
              {judgeDashaSteps.map((step) => (
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

          {/* FOUR CHANNELS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A useful mental model
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A Dasha planet can activate several layers of its natal agenda.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  House lordship
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  The houses it rules
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  These are among the primary life agendas carried by the
                  planet.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Placement
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  The house it occupies
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  This is where the planet&apos;s responsibilities are placed
                  and expressed.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Relationships
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Planets and houses it connects with
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Conjunctions, aspects and Sambandha can bring additional
                  agendas into the period.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Karakatwa
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  What it naturally signifies
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  The planet&apos;s natural significations remain part of the
                  interpretive picture.
                </p>
              </div>
            </div>
          </section>

          {/* MD AD RELATIONSHIP */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Mahadasha and Antardasha
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The relationship between the two planets matters.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                When an Antardasha begins, we do not simply interpret the
                Antardasha lord separately and add its meaning to the
                Mahadasha.
              </p>

              <p>
                We ask how the two planets are related in the natal chart.
              </p>

              <p>
                Do they rule connected houses?
              </p>

              <p>Are they conjunct?</p>

              <p>Do they aspect one another?</p>

              <p>Does one occupy a house ruled by the other?</p>

              <p>
                Does the Nakshatra structure create another relationship
                between them?
              </p>

              <p>
                Do they jointly connect the houses required for the event we
                are studying?
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The Mahadasha sets the broader agenda. The Antardasha can
                select, modify or intensify particular parts of that agenda.
              </p>
            </div>
          </section>

          {/* RAHU EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A common misconception
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “Rahu Mahadasha is difficult” is not an interpretation.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Rahu has natural significations and behavioural tendencies, but
                Rahu Mahadasha cannot be judged from Rahu&apos;s name alone.
              </p>

              <p>
                We need to examine the house Rahu occupies, the Rashi and its
                lord, Rahu&apos;s Nakshatra and Nakshatra lord, planets
                associated with Rahu and the houses those planets represent.
              </p>

              <p>
                A Rahu period may coincide with major ambition, unconventional
                developments, foreign connections, rapid expansion,
                uncertainty, disruption or several of these themes depending
                on the chart.
              </p>

              <p>
                The natal structure determines which possibilities are
                relevant.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                No Mahadasha should be labelled favourable or difficult before
                examining the planet&apos;s actual role in the horoscope.
              </p>
            </div>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Suppose Mercury is both Lagna lord and 10th lord.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  For <strong>Virgo Lagna</strong>, Mercury rules both the 1st
                  and 10th houses.
                </p>

                <p>
                  Mercury therefore carries matters connected with the self,
                  direction and professional life.
                </p>

                <p>
                  Suppose Mercury is placed in the 4th house.
                </p>

                <p>
                  The 1st- and 10th-house agendas are now connected with
                  4th-house matters through Mercury&apos;s placement.
                </p>

                <p>
                  During Mercury Mahadasha or an important Mercury sub-period,
                  those natal connections may become more prominent.
                </p>

                <p>
                  But we still need to study Mercury&apos;s Rashi, dignity,
                  dispositor, Nakshatra, aspects, conjunctions and other
                  supporting factors.
                </p>

                <p>
                  If the question is specifically about career, we would also
                  examine whether other career houses support the same theme.
                </p>

                <p className="font-semibold text-[#403344]">
                  Dasha tells us which planet&apos;s natal agenda is active. It
                  does not tell us the final event by itself.
                </p>
              </div>
            </div>
          </section>

          {/* ACTIVATION VS EVENT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A critical distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Activation is not the same as a guaranteed event.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Natal chart
                </p>
                <h3 className="mt-2 text-xl font-semibold">Promise</h3>
                <p className="mt-4 leading-7 text-[#65586a]">
                  Is the relevant pattern present and supported in the
                  horoscope?
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Dasha
                </p>
                <h3 className="mt-2 text-xl font-semibold">Activation</h3>
                <p className="mt-4 leading-7 text-[#65586a]">
                  Are planets carrying that pattern currently operating through
                  the planetary-period hierarchy?
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Further timing
                </p>
                <h3 className="mt-2 text-xl font-semibold">Trigger</h3>
                <p className="mt-4 leading-7 text-[#65586a]">
                  Divisional-chart confirmation and transits can later help
                  narrow when an activated theme may manifest more clearly.
                </p>
              </div>
            </div>
          </section>

          {/* WHY AD CHANGES EXPERIENCE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Why a Mahadasha changes internally
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Eighteen years of Rahu do not feel identical.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A long Mahadasha contains the Antardashas of all nine Dasha
                planets.
              </p>

              <p>
                Therefore the same Rahu Mahadasha can produce distinctly
                different phases during Rahu–Jupiter, Rahu–Saturn,
                Rahu–Mercury or Rahu–Venus.
              </p>

              <p>
                Each Antardasha introduces another natal planetary agenda into
                the broader Rahu period.
              </p>

              <p>
                Pratyantardasha divides those phases further.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Mahadasha gives the chapter. Antardasha develops the storyline.
                Pratyantardasha helps narrow the scene.
              </p>
            </div>
          </section>

          {/* EVENT SPECIFIC */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Ask a specific question
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A strong Dasha is not automatically strong for every event.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose a planetary period is powerful for career development.
              </p>

              <p>
                That does not automatically mean it is equally powerful for
                marriage, property or children.
              </p>

              <p>
                Each event requires its own relevant houses, lords,
                significators and supporting relationships.
              </p>

              <p>
                We therefore judge the Dasha against the{" "}
                <strong>specific event being studied</strong>.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Never ask only, “Is this a good Dasha?” Ask, “What is this
                Dasha capable of activating in this chart, and for which area
                of life?”
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common beginner mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when interpreting Dashas?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Do not judge a Mahadasha from the planet's natural nature alone.",
                "Do not say Rahu, Saturn or Ketu periods must be difficult.",
                "Do not assume Jupiter or Venus periods must automatically be favourable.",
                "Do not ignore the houses ruled by the Dasha lord.",
                "Do not ignore the house occupied by the Dasha lord.",
                "Do not ignore aspects, conjunctions and other Sambandha.",
                "Do not ignore the Dasha lord's dispositor and Nakshatra lord.",
                "Do not interpret the Antardasha independently of the Mahadasha.",
                "Do not confuse planetary activation with a guaranteed event.",
                "Do not use Dasha timing before establishing the natal promise.",
                "Do not assume a Dasha that supports one life area must support every other life area equally.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-xl border border-[#e4d8ca] bg-white p-5"
                >
                  <span className="mt-1 text-[#8b5a79]">✦</span>
                  <p className="leading-7 text-[#65586a]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Our framework is evolving
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              We can now add time to the natal chart.
            </h2>

            <div className="mt-9 space-y-4">
              {[
                ["Graha", "Who is acting?"],
                ["Bhava", "Where in life is it acting?"],
                ["Rashi", "How does it express?"],
                ["Lagna", "What role has the planet been assigned?"],
                ["Lordship", "Which life areas does it carry?"],
                ["Strength", "How capable is it of delivering its agenda?"],
                ["Aspects", "Who influences the planet or house from elsewhere?"],
                ["Sambandha", "Which planetary agendas are connected?"],
                ["Nakshatra", "What finer pattern and planetary ruler colour its expression?"],
                ["Dasha", "Which natal planetary agenda is active now?"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="grid gap-3 rounded-2xl border border-[#e4d8ca] bg-white p-6 md:grid-cols-[130px_1fr]"
                >
                  <p className="font-semibold text-[#8b5a79]">{title}</p>
                  <p className="leading-7 text-[#65586a]">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 10 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Vimshottari Dasha is a 120-year planetary-period system.",
                "The fixed sequence is Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn and Mercury.",
                "The Moon's birth Nakshatra determines the Mahadasha operating at birth.",
                "The Moon's exact position within that Nakshatra determines the remaining Dasha balance.",
                "Mahadasha provides the broad planetary period.",
                "Antardasha introduces a second planetary agenda within the Mahadasha.",
                "Pratyantardasha narrows the hierarchy further.",
                "A Dasha lord activates the natal responsibilities it already carries.",
                "Judge a Dasha lord through house lordship, placement, dignity, aspects, Sambandha, Nakshatra and natural karakatwa.",
                "The relationship between Mahadasha and Antardasha lords is important.",
                "No Mahadasha is universally favourable or difficult.",
                "Activation does not by itself guarantee a specific event.",
                "The strength of a Dasha should be judged in relation to the event being studied.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-xl border border-[#e4d8ca] bg-white p-5"
                >
                  <span className="mt-1 text-[#8b5a79]">✦</span>
                  <p className="leading-7 text-[#65586a]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NEXT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Next lesson
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Lesson 11 — Divisional Charts
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The D1 provides the main architecture and Dasha tells us which
              planetary agenda is active.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              Next we will learn why Jyotish uses divisional charts, what a
              Varga actually represents and how charts such as D9 and D10 can
              provide additional depth without being read as independent
              horoscopes.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 11 · Coming next
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                From chart structure to timing
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Dasha tells us when a planet gets the microphone. The natal
                chart tells us what that planet has to say.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                The next stage is learning how divisional charts help us examine
                particular areas of that natal promise in greater depth.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 9: Reading the D1 Chart
                </Link>

                <Link
                  href="/sarathi/learn"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#4b2744]"
                >
                  Knowledge Centre
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}