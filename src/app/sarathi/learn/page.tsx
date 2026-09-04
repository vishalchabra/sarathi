import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../TopNav";

export const metadata: Metadata = {
  title: "Learn Vedic Astrology | Sārathi Knowledge Centre",
  description:
    "Learn Vedic astrology with Sārathi. Find answers to important life questions, understand birth charts, houses, planets, nakshatras, dashas and transits, and learn how astrological timing is interpreted.",
  alternates: {
    canonical: "/sarathi/learn",
  },
  openGraph: {
    title: "Sārathi Vedic Astrology Knowledge Centre",
    description:
      "Find answers to life questions, learn Vedic astrology step by step and explore important Jyotish concepts.",
    url: "/sarathi/learn",
    type: "website",
  },
};

const questionTopics = [
  {
    title: "Career & Job",
    description:
      "Understand career timing, job changes, promotions, professional direction and periods of career growth or uncertainty.",
    href: "/sarathi/learn/questions/when-will-i-get-a-job",
    article: "When will I get a job?",
  },
 {
  title: "Marriage & Relationships",
  description:
    "Learn how marriage timing, relationship patterns, delays and partnership themes are studied in a Vedic birth chart.",
  href: "/sarathi/learn/questions/when-will-i-get-married",
  article: "When will I get married?",
},
  {
  title: "Money & Wealth",
  description:
    "Understand financial improvement, income growth, savings, wealth patterns and periods when financial conditions may become stronger.",
  href: "/sarathi/learn/questions/when-will-my-finances-improve",
  article: "When will my finances improve?",
},
{
  title: "Property & Home",
  description:
    "Learn how property purchase, home ownership, relocation and property timing are studied through the birth chart.",
  href: "/sarathi/learn/questions/when-will-i-buy-a-house",
  article: "When will I buy a house?",
},
{
  title: "Children & Family",
  description:
    "Learn how child-related timing and family expansion are traditionally studied through the 5th house, Saptamsa, Dasha and transits.",
  href: "/sarathi/learn/questions/when-will-i-have-a-child",
  article: "When will I have a child?",
},
{
  title: "Foreign Travel & Settlement",
  description:
    "Understand how foreign travel, relocation and long-term settlement are studied through movement, residence, Dasha and transit factors.",
  href: "/sarathi/learn/questions/will-i-settle-abroad",
  article: "Will I settle abroad?",
},
  
];

const learningSteps = [
  {
    number: "01",
    title: "The 9 Grahas",
    description:
      "Begin with the nine grahas — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu. Learn what each represents, its natural karakatwas and how planetary meanings translate into real life.",
    href: "/sarathi/learn/astrology/9-grahas-vedic-astrology",
  },
  {
    number: "02",
    title: "The 12 Houses",
    description:
      "Learn what each of the twelve bhavas represents, their natural significations, important house groupings and how houses connect different areas of life.",
    href: "/sarathi/learn/astrology/12-houses-vedic-astrology",
  },
  {
    number: "03",
    title: "The 12 Rashis",
    description:
      "Learn the twelve zodiac signs, their planetary rulers, elements and movable, fixed or dual nature — and understand how a Rashi modifies the expression of a planet or house.",
    href: "/sarathi/learn/astrology/12-rashis-vedic-astrology",
  },
  {
    number: "04",
    title: "Ascendant & Chart Structure",
    description:
      "Understand Lagna, why birth time matters, how the Ascendant establishes the twelve-house structure and why planetary lordship changes from one Lagna to another.",
    href: "/sarathi/learn/astrology/lagna-ascendant-vedic-astrology",
  },
  {
    number: "05",
    title: "House Lords & Lordship",
    description:
      "Learn how the ruler of each house carries its affairs through the chart, how one planet can rule two houses and how lordship creates connections between different areas of life.",
    href: "/sarathi/learn/astrology/house-lords-vedic-astrology",
  },
  {
    number: "06",
    title: "Planetary Strength & Dignity",
    description:
      "Learn how to assess a planet through own sign, exaltation, debilitation, planetary relationships, combustion, retrogression and other conditions — without confusing strength with favourable results.",
    href: "/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology",
  },
  {
    number: "07",
    title: "Aspects, Conjunctions & Sambandha",
    description:
      "Learn how planets influence and connect with one another through conjunctions, Graha Drishti, mutual aspects, house lordship, exchanges and other forms of Sambandha.",
    href:
      "/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology",
  },
  {
    number: "08",
    title: "Nakshatras",
    description:
      "Learn the 27 Nakshatras, their lords, deities, symbols, Shakti and Padas — and understand how Nakshatras refine planetary expression without turning symbolism into literal predictions.",
    href: "/sarathi/learn/astrology/nakshatras-vedic-astrology",
  },
  {
    number: "09",
    title: "Reading the D1 Birth Chart",
    description:
      "Learn a structured method for reading the D1 chart by combining Lagna, house lordship, planetary placement, Rashi, dignity, Sambandha, Nakshatra and repeating chart themes.",
    href: "/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology",
  },
  {
    number: "10",
    title: "Vimshottari Dasha & Planetary Periods",
    description:
      "Learn how the 120-year Vimshottari Dasha cycle works, how Mahadasha, Antardasha and Pratyantardasha activate the natal chart, and how to judge a Dasha lord from its actual role in the horoscope.",
    href: "/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology",
  },
  {
    number: "11",
    title: "Divisional Charts",
    description:
      "Learn why Jyotish uses Vargas, how divisional charts refine the D1 birth chart, and how D9, D10, D7, D12, D30 and other important charts are used without treating them as independent horoscopes.",
    href:
      "/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology",
  },
  {
    number: "12",
    title: "Transits",
    description:
      "Learn how Gochar works in Vedic astrology, how transits are read from Lagna and Moon, how Jupiter, Saturn and Rahu-Ketu create broader timing windows, and how faster planets can refine event timing.",
    href: "/sarathi/learn/astrology/transits-gochar-vedic-astrology",
  },
  {
    number: "13",
    title: "Predictive Astrology & Event Timing",
    description:
      "Learn how to combine the natal chart, relevant houses, planetary strength, aspects, Sambandha, Nakshatras, divisional charts, Dashas and transits into one disciplined event-timing framework.",
    href: "/sarathi/learn/astrology/predictive-astrology-event-timing",
  },
];

const libraryTopics = [
  {
    label: "Mahadasha & Antardasha",
    href: "/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology",
  },
  {
    label: "Nakshatras",
    href: "/sarathi/learn/astrology/nakshatras-vedic-astrology",
  },
  {
    label: "Planets",
    href: "/sarathi/learn/astrology/9-grahas-vedic-astrology",
  },
  {
    label: "12 Houses",
    href: "/sarathi/learn/astrology/12-houses-vedic-astrology",
  },
  {
    label: "Ascendants",
    href: "/sarathi/learn/astrology/lagna-ascendant-vedic-astrology",
  },
  {
    label: "Divisional Charts",
    href:
      "/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology",
  },
  {
    label: "Planetary Transits",
    href: "/sarathi/learn/astrology/transits-gochar-vedic-astrology",
  },
  {
  label: "Yogas",
  href: "/sarathi/learn/astrology/yogas-vedic-astrology",
},
  {
    label: "Chart Interpretation",
    href: "/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology",
  },
  {
    label: "Predictive Techniques",
    href: "/sarathi/learn/astrology/predictive-astrology-event-timing",
  },
];

export default function KnowledgeCentrePage() {
  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#2f2333]">
      <TopNav />

      {/* HERO */}
      <section className="border-b border-[#eadfce]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#7c526e]">
            Sārathi Knowledge Centre
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Find answers. Learn Vedic astrology. Understand the reasoning.
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#65586a]">
            Whether you have a question about your life or want to learn
            Jyotish systematically, the Sārathi Knowledge Centre helps you
            understand not only what traditional Vedic astrology says, but
            also how an interpretation is built.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#learn"
              className="rounded-full bg-[#5a294d] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              I want to learn astrology
            </a>

            <a
              href="#answers"
              className="rounded-full border border-[#5a294d] px-6 py-3 text-sm font-semibold text-[#5a294d] transition hover:bg-[#f4e9ef]"
            >
              I have a question
            </a>
          </div>
        </div>
      </section>

      {/* LEARNING PATH */}
      <section id="learn" className="bg-[#f6eee6]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          {/* BEGINNER START */}
          <div className="mb-14 rounded-3xl border border-[#dfd0bf] bg-white p-7 md:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              New to Vedic astrology?
            </p>

            <div className="mt-4 grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-2xl font-semibold md:text-3xl">
                  Begin with the foundations.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
                  Start with the nine grahas and follow the lessons in sequence.
                  Each lesson builds on the one before it, gradually taking you
                  from the basic language of Jyotish to chart interpretation
                  and predictive timing.
                </p>

                <Link
                  href="/sarathi/learn/astrology/how-to-read-vedic-birth-chart"
                  className="mt-4 inline-flex text-sm font-semibold text-[#7c526e] transition hover:opacity-70"
                >
                  First time seeing a Kundli? Understand the birth chart →
                </Link>
              </div>

              <Link
                href="/sarathi/learn/astrology/9-grahas-vedic-astrology"
                className="inline-flex w-fit rounded-full bg-[#4b2744] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start Lesson 1 →
              </Link>
            </div>
          </div>

          {/* CURRICULUM INTRO */}
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6d58]">
              Learn Vedic Astrology
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Vedic Astrology Foundations — 13 Lessons
            </h2>

            <p className="mt-4 text-lg font-medium text-[#4b2744]">
              Learn step by step — from the building blocks of a birth chart to
              predictive timing.
            </p>

            <p className="mt-5 text-lg leading-8 text-[#65586a]">
              Astrology becomes much easier to understand when it is learned
              in the right sequence. This learning path begins with the
              foundations and gradually moves toward chart interpretation and
              predictive timing.
            </p>
          </div>

          {/* LESSON CARDS */}
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {learningSteps.map((step) => (
              <Link
                key={step.number}
                href={step.href}
                className="flex gap-5 rounded-2xl border border-[#e4d6c8] bg-[#fffaf3] p-6 transition hover:-translate-y-0.5 hover:border-[#c9adbb] hover:shadow-sm"
              >
                <div className="text-sm font-bold tracking-widest text-[#9a6d58]">
                  {step.number}
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>

                  <p className="mt-2 leading-7 text-[#6c6070]">
                    {step.description}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-[#6b315c]">
                    Start Lesson →
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* FOUNDATIONS COMPLETE */}
          <div className="mt-10 rounded-2xl border border-[#d9c8b7] bg-white p-6 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Foundations complete
            </p>

            <p className="mt-3 max-w-3xl leading-7 text-[#65586a]">
              These 13 lessons give you the framework to begin reading a Vedic
              horoscope systematically. More specialised topics can then build
              on this foundation.
            </p>
          </div>
        </div>
      </section>

      {/* ANSWERS */}
      <section id="answers" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6d58]">
            Apply what you are learning
          </p>

          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            What are you trying to understand?
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#65586a]">
            You do not need to know astrology to explore a question. Choose an
            area of life and learn how the principles of the birth chart and
            planetary timing are applied to a real question.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {questionTopics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-2xl border border-[#e7daca] bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold">{topic.title}</h3>

              <p className="mt-3 leading-7 text-[#6c6070]">
                {topic.description}
              </p>

              {"href" in topic && topic.href ? (
                <Link
                  href={topic.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6b315c] transition hover:opacity-70"
                >
                  {topic.article}
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <p className="mt-5 text-sm font-semibold text-[#9b8d99]">
                  Articles coming soon
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* LIBRARY */}
      <section className="border-t border-[#eadfce]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6d58]">
              Explore the Library
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Look up a Vedic astrology concept.
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#65586a]">
              Use the Sārathi library to explore individual concepts in greater
              depth — from planetary periods and nakshatras to houses, vargas,
              yogas and predictive techniques.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            {libraryTopics.map((topic) =>
              topic.href ? (
                <Link
                  key={topic.label}
                  href={topic.href}
                  className="rounded-full border border-[#e3d5c5] bg-white px-4 py-2 text-sm text-[#5f5263] transition hover:border-[#8b5a79] hover:text-[#4b2744]"
                >
                  {topic.label}
                </Link>
              ) : (
                <span
                  key={topic.label}
                  className="rounded-full border border-[#e3d5c5] bg-[#f4ece3] px-4 py-2 text-sm text-[#8a7d8d]"
                  title="Coming soon"
                >
                  {topic.label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="border-y border-[#eadfce] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6d58]">
                The Sārathi Approach
              </p>

              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Astrology is rarely one placement or one rule.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A Mahadasha does not produce the same result for everyone. A
                planet in a particular house cannot be interpreted in
                isolation. A transit does not automatically create an event.
              </p>

              <p>
                Meaning emerges by examining the birth chart as a whole:
                planetary placement, house lordship, dignity, nakshatra,
                associations, divisional charts, running dashas and relevant
                transits.
              </p>

              <p className="font-medium text-[#3e3042]">
                The aim of this Knowledge Centre is therefore not simply to
                give you meanings to memorise. It is to teach you how the
                pieces fit together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-[#4b2744] px-7 py-12 text-white md:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8cfb0]">
            Your chart is personal
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-semibold md:text-4xl">
            Learn the principles. Then understand how they come together in
            your own chart.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
            Sārathi brings together your birth chart, planetary periods and
            current timing to help you understand the life phase you are
            moving through.
          </p>

          <Link
            href="/sarathi/individual"
            className="mt-7 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#4b2744]"
          >
            Explore Sārathi
          </Link>
        </div>
      </section>
    </main>
  );
}