import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Vedic Birth Chart Explained: Beginner's Guide to Your Kundli",
  description:
    "Understand what a Vedic birth chart shows, how houses, Rashis, planets and the Ascendant are arranged, what the numbers mean in a North Indian chart, and where to begin learning Jyotish.",
  path: "/sarathi/learn/astrology/how-to-read-vedic-birth-chart",
  keywords: [
    "Vedic Birth Chart",
    "Vedic Birth Chart for Beginners",
    "How to Read Kundli",
    "Kundli Explained",
    "Vedic Astrology Birth Chart",
    "North Indian Birth Chart",
    "Lagna Chart",
    "Jyotish for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Vedic Birth Chart Explained: A Beginner's Guide to Understanding Your Kundli",
  description:
    "A beginner-friendly introduction to the structure of a Vedic birth chart, including the Ascendant, twelve houses, Rashis, planets, house lords and North Indian chart notation.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/how-to-read-vedic-birth-chart",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/how-to-read-vedic-birth-chart",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Birth chart",
    "Kundli",
    "Ascendant",
    "Lagna",
    "Astrological houses",
    "Rashis",
    "Grahas",
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
      name: "Vedic Birth Chart Explained",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/how-to-read-vedic-birth-chart",
    },
  ],
};

const signNumbers = [
  { number: "1", sign: "Aries" },
  { number: "2", sign: "Taurus" },
  { number: "3", sign: "Gemini" },
  { number: "4", sign: "Cancer" },
  { number: "5", sign: "Leo" },
  { number: "6", sign: "Virgo" },
  { number: "7", sign: "Libra" },
  { number: "8", sign: "Scorpio" },
  { number: "9", sign: "Sagittarius" },
  { number: "10", sign: "Capricorn" },
  { number: "11", sign: "Aquarius" },
  { number: "12", sign: "Pisces" },
];

const chartVocabulary = [
  {
    term: "Lagna / Ascendant",
    text: "The sign rising on the eastern horizon at birth. It becomes the 1st house and establishes the structure of the horoscope.",
  },
  {
    term: "Bhava / House",
    text: "One of twelve areas of life represented in the chart, such as identity, family, home, relationships, career and gains.",
  },
  {
    term: "Rashi / Sign",
    text: "One of the twelve zodiac signs. The Rashi occupying a house modifies how that house is expressed.",
  },
  {
    term: "Graha / Planet",
    text: "The nine astrological grahas used in Jyotish: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu.",
  },
  {
    term: "House Lord",
    text: "The planet ruling the sign placed in a particular house. House lordship helps connect one area of life with another.",
  },
  {
    term: "Nakshatra",
    text: "One of the 27 lunar mansions used to refine planetary expression and support timing systems such as Vimshottari Dasha.",
  },
];

const beginnerQuestions = [
  "Which sign is rising as the Ascendant?",
  "Which number or Rashi occupies each house?",
  "Which planets are placed in each house?",
  "Which planet rules each house?",
  "Where is the Ascendant lord placed?",
  "Which planets are together or influencing one another?",
];

const learningLinks = [
  {
    number: "01",
    title: "The 9 Grahas",
    href: "/sarathi/learn/astrology/9-grahas-vedic-astrology",
  },
  {
    number: "02",
    title: "The 12 Houses",
    href: "/sarathi/learn/astrology/12-houses-vedic-astrology",
  },
  {
    number: "03",
    title: "The 12 Rashis",
    href: "/sarathi/learn/astrology/12-rashis-vedic-astrology",
  },
  {
    number: "04",
    title: "Ascendant & Chart Structure",
    href: "/sarathi/learn/astrology/lagna-ascendant-vedic-astrology",
  },
  {
    number: "05",
    title: "House Lords & Lordship",
    href: "/sarathi/learn/astrology/house-lords-vedic-astrology",
  },
  {
    number: "09",
    title: "Reading the D1 Birth Chart",
    href: "/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology",
  },
];

export default function HowToReadVedicBirthChartPage() {
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
            <span>Learn Vedic Astrology</span>
            <span>›</span>

            <span className="text-[#4c3e50]">
              Vedic birth chart explained
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Beginner · Birth Chart Orientation
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Vedic Birth Chart Explained: A Beginner&apos;s Guide to Understanding
            Your Kundli
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            If you have opened a Vedic birth chart and wondered what the boxes,
            numbers, planet names and Ascendant actually mean, this is where to
            begin.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start here
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              Before trying to make predictions, first learn how the chart is
              organised. Understand the <strong>Ascendant</strong>, the{" "}
              <strong>twelve houses</strong>, the <strong>Rashis</strong>, the{" "}
              <strong>grahas</strong> and the way house lordship is established.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT A CHART IS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The foundation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a Vedic birth chart?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A Vedic birth chart, often called a Janma Kundli or horoscope, is
                a representation of the planetary positions calculated for a
                person&apos;s birth time and place within a chosen Jyotish
                framework.
              </p>

              <p>
                The chart is divided into twelve houses. Each house represents a
                different area of life, while the zodiac signs and planets
                occupying those houses add further layers of meaning.
              </p>

              <p>
                The sign rising on the eastern horizon at birth becomes the
                Ascendant or Lagna. From that point, the twelve-house structure
                of the horoscope is established.
              </p>
            </div>
          </section>

          {/* CHART IS A MAP */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Think of the chart as a map, not a list of predictions.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                One of the first mistakes beginners make is trying to interpret
                each planet separately.
              </p>

              <p>
                A Vedic chart is better understood as a network. Houses represent
                areas of life. Rashis describe the environment or manner of
                expression. Grahas carry natural meanings as well as the houses
                they rule.
              </p>

              <p>
                As you progress, you learn how these factors connect through
                placement, lordship, conjunctions, aspects, Nakshatras,
                divisional charts and planetary timing.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                The planet gives us the vocabulary. The chart gives us the
                sentence.
              </p>
            </div>
          </section>

          {/* NORTH INDIAN CHART */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Reading the diagram
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What do the numbers in a North Indian birth chart mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                This is one of the most common sources of confusion when someone
                first sees a North Indian style Vedic chart.
              </p>

              <p>
                In the commonly used North Indian format, the{" "}
                <strong>house positions remain fixed</strong>. The numbers written
                inside them usually identify the <strong>zodiac signs</strong>,
                not the house numbers.
              </p>

              <p>
                For example, if the number <strong>6</strong> appears in the
                1st-house position, it does not mean that box is the 6th house.
                It means <strong>Virgo</strong>, the sixth zodiac sign, occupies
                the 1st house.
              </p>

              <p>
                Virgo therefore becomes the Ascendant, and Mercury becomes the
                Ascendant lord.
              </p>
            </div>
          </section>

          {/* SIGN NUMBERS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick reference
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Zodiac sign numbers used in the chart
            </h2>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {signNumbers.map((item) => (
                <div
                  key={item.number}
                  className="flex items-center gap-4 rounded-2xl border border-[#e3d5c5] bg-white p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4ece3] text-sm font-bold text-[#7c526e]">
                    {item.number}
                  </div>

                  <p className="font-semibold">{item.sign}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ASCENDANT */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              The Ascendant is your starting point.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Ascendant is the zodiac sign rising on the eastern horizon
                at the moment of birth.
              </p>

              <p>
                It becomes the 1st house and determines which signs occupy all
                twelve houses.
              </p>

              <p>
                This is important because a planet&apos;s house lordship changes
                with the Ascendant. Mars, for example, will not rule the same
                houses for every Lagna.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="leading-8 text-[#514455]">
                <strong>
                  First identify the Lagna. Then identify its lord and where that
                  lord is placed.
                </strong>
              </p>
            </div>
          </section>

          {/* HOUSE VS SIGN */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              An essential distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A house and a Rashi are not the same thing.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A <strong>house</strong> represents an area of life. A{" "}
                <strong>Rashi</strong> describes the style, environment or mode
                through which that area operates.
              </p>

              <p>
                The 10th house, for example, relates broadly to action,
                responsibility, profession and public role.
              </p>

              <p>
                But Aries occupying the 10th house is not interpreted in exactly
                the same way as Pisces occupying the 10th house, because their
                qualities and planetary rulers differ.
              </p>
            </div>
          </section>

          {/* PLANETS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What are the nine grahas in Vedic astrology?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Jyotish works with nine grahas: Sun, Moon, Mars, Mercury,
                Jupiter, Venus, Saturn, Rahu and Ketu.
              </p>

              <p>
                Rahu and Ketu are the lunar nodes rather than physical planets,
                but they are treated as grahas within the astrological framework.
              </p>

              <p>
                Each graha has natural significations, but its actual role in a
                horoscope also depends on the houses it rules, the house and sign
                it occupies, its condition and its relationships with other
                planets.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Do not memorise a planet as simply good or bad. First understand
                what role it is performing in that particular horoscope.
              </p>
            </div>
          </section>

          {/* HOUSE LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What does a house lord mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Every Rashi has a planetary ruler. When a Rashi occupies a
                house, the ruler of that Rashi becomes the lord of the house.
              </p>

              <p>
                The location of that house lord is important because it begins
                connecting the affairs of the house it rules with the house it
                occupies.
              </p>

              <p>
                If the 10th lord is in the 9th house, for example, career themes
                become connected with 9th-house matters in some way.
              </p>

              <p>
                That does not produce one automatic prediction. It simply tells
                us that the two areas of the horoscope are linked and need to be
                interpreted in context.
              </p>
            </div>
          </section>

          {/* VOCABULARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Beginner vocabulary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Six terms worth understanding before you go deeper
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {chartVocabulary.map((item) => (
                <div
                  key={item.term}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.term}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* BEGINNER METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Your first look at a chart
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should a beginner identify first?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Before trying to judge outcomes, practise identifying the basic
              structure accurately.
            </p>

            <div className="mt-8 space-y-3">
              {beginnerQuestions.map((question, index) => (
                <div
                  key={question}
                  className="flex gap-4 rounded-xl border border-[#e4d8ca] bg-white p-5"
                >
                  <span className="mt-1 text-sm font-bold text-[#8b5a79]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="leading-7 text-[#65586a]">{question}</p>
                </div>
              ))}
            </div>
          </section>

          {/* WHAT NOT TO DO */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What should you not try to do yet?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Once beginners recognise a few placements, it is tempting to
                search for statements such as “Mars in the 10th house means...”
                or “Saturn in the 7th house means...”
              </p>

              <p>
                Those statements may describe one layer, but they are not a
                complete chart interpretation.
              </p>

              <p>
                Before making conclusions, you eventually need to consider
                lordship, planetary condition, aspects, Sambandha, Nakshatras,
                repetition across the chart, relevant divisional charts, Dashas
                and transits.
              </p>
            </div>

            <div className="mt-8 rounded-3xl bg-[#4b2744] p-8 text-white">
              <p className="text-lg font-semibold leading-8">
                Interpretation is not the accumulation of meanings. It is the
                organisation of meanings.
              </p>
            </div>
          </section>

          {/* BRIDGE TO LESSON 9 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Orientation vs interpretation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Understanding the chart is the first step. Reading it is the next.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                This guide is designed to help you understand what you are
                looking at when you open a Vedic birth chart.
              </p>

              <p>
                Once you are comfortable identifying the Lagna, houses, Rashis,
                grahas and house lords, you can move into actual chart
                interpretation.
              </p>

              <p>
                In the Sārathi curriculum, Lesson 9 brings those building blocks
                together into a systematic method for reading the D1 birth chart.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology"
                className="inline-flex rounded-full bg-[#4b2744] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Continue to Reading the D1 Birth Chart →
              </Link>
            </div>
          </section>

          {/* CURRICULUM */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learn in sequence
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Build the foundations before trying to predict.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The Sārathi learning path breaks the chart into individual
              building blocks before bringing them together again.
            </p>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {learningLinks.map((lesson) => (
                <Link
                  key={lesson.number}
                  href={lesson.href}
                  className="group rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#8b5a79]"
                >
                  <p className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                    LESSON {lesson.number}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold group-hover:text-[#5a294d]">
                    {lesson.title}
                  </h3>

                  <p className="mt-4 text-sm font-semibold text-[#7c526e]">
                    Continue learning →
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-7">
              <Link
                href="/sarathi/learn"
                className="text-sm font-semibold text-[#6b315c] hover:underline"
              >
                View all 13 foundational lessons →
              </Link>
            </div>
          </section>

          {/* CORE LESSON */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The beginner takeaway
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Learn the language of the chart before trying to read the story.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                At the beginning, your goal is not to predict an event from every
                placement.
              </p>

              <p>
                Your goal is to recognise the building blocks correctly and
                understand what each one contributes to the horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                Graha tells us who. Bhava tells us where in life. Rashi tells us
                how. Lagna assigns the roles. House lordship shows what becomes
                connected.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                From learning to application
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Learn the principles. Then understand how they come together in
                your own chart.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi brings together your birth chart, planetary periods and
                current timing so you can explore your horoscope in a more
                structured context.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/individual"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#4b2744]"
                >
                  Explore Sārathi
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
              framework for learning, reflection and guidance. Different Jyotish
              traditions may apply some techniques or interpretive priorities
              differently.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}