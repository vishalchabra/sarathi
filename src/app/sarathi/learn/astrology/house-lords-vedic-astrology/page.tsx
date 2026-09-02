import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "House Lords in Vedic Astrology: Complete Beginner Guide",
  description:
    "Learn how house lordship works in Vedic astrology, how to identify the lord of each house, what house-lord placements mean and how connections between houses are interpreted.",
  path: "/sarathi/learn/astrology/house-lords-vedic-astrology",
  keywords: [
    "House Lords Vedic Astrology",
    "House Lord Meaning",
    "Bhava Lord Astrology",
    "10th Lord in Houses",
    "7th Lord in Houses",
    "Planetary Lordship Vedic Astrology",
    "House Lord Placement",
    "Jyotish House Lords",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "House Lords in Vedic Astrology: How Different Areas of Life Become Connected",
  description:
    "A beginner-friendly guide to planetary house lordship, house-lord placement and the method used to connect different areas of life in Jyotish.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/house-lords-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/house-lords-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "House lords",
    "Bhava lords",
    "Planetary lordship",
    "House connections",
    "Chart interpretation",
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
      name: "House Lords & Lordship",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/house-lords-vedic-astrology",
    },
  ],
};

const signLords = [
  ["Aries", "Mars"],
  ["Taurus", "Venus"],
  ["Gemini", "Mercury"],
  ["Cancer", "Moon"],
  ["Leo", "Sun"],
  ["Virgo", "Mercury"],
  ["Libra", "Venus"],
  ["Scorpio", "Mars"],
  ["Sagittarius", "Jupiter"],
  ["Capricorn", "Saturn"],
  ["Aquarius", "Saturn"],
  ["Pisces", "Jupiter"],
];

const steps = [
  {
    number: "01",
    title: "Identify the house",
    text: "Begin with the house whose affairs you want to understand — for example, the 10th house for profession or the 7th for partnership.",
  },
  {
    number: "02",
    title: "Identify the Rashi occupying it",
    text: "The sign placed in that house tells you which planet rules the house.",
  },
  {
    number: "03",
    title: "Identify the lord",
    text: "The ruler of that Rashi becomes the lord of the house.",
  },
  {
    number: "04",
    title: "Find where the lord is placed",
    text: "The house occupied by the lord creates a connection between the house it owns and the house in which it sits.",
  },
  {
    number: "05",
    title: "Check what else the planet rules",
    text: "Most planets rule two Rashis, so the same graha may carry the responsibilities of two houses at once.",
  },
  {
    number: "06",
    title: "Assess the planet's condition",
    text: "Its sign, dignity, conjunctions, aspects, dispositor, nakshatra and other strength factors affect how the lordship can operate.",
  },
  {
    number: "07",
    title: "Look for repetition",
    text: "A meaningful interpretation becomes stronger when other planets, houses or divisional charts repeat the same theme.",
  },
  {
    number: "08",
    title: "Check timing",
    text: "Dasha and relevant transits help determine when the potential shown by a house connection is more likely to become active.",
  },
];

const examples = [
  {
    title: "10th lord in the 4th house",
    from: "10th",
    to: "4th",
    meaning:
      "Profession, responsibility and public action become connected with home, property, residence, education, inner foundations or other 4th-house matters.",
    caution:
      "This does not automatically mean working from home or dealing in property.",
  },
  {
    title: "7th lord in the 11th house",
    from: "7th",
    to: "11th",
    meaning:
      "Marriage, partnership or one-to-one relationships become connected with networks, gains, associations, aspirations or fulfilment.",
    caution:
      "This does not automatically guarantee gains through marriage.",
  },
  {
    title: "2nd lord in the 10th house",
    from: "2nd",
    to: "10th",
    meaning:
      "Accumulated resources, family, speech or values become connected with profession, status, responsibility and visible action.",
    caution:
      "This does not by itself tell us the person's profession or financial outcome.",
  },
  {
    title: "5th lord in the 9th house",
    from: "5th",
    to: "9th",
    meaning:
      "Intelligence, children, creativity, learning or counsel become connected with higher knowledge, teachers, dharma, fortune or long-distance experience.",
    caution:
      "The exact manifestation depends on the planet and the wider chart.",
  },
  {
    title: "4th lord in the 12th house",
    from: "4th",
    to: "12th",
    meaning:
      "Home, residence, property, emotional foundations or education become connected with foreign lands, expenditure, withdrawal, institutions or release.",
    caution:
      "This can manifest in many ways and should not automatically be labelled as loss of home.",
  },
  {
    title: "11th lord in the 6th house",
    from: "11th",
    to: "6th",
    meaning:
      "Gains, networks or aspirations become linked with service, employment, competition, problem-solving or daily work.",
    caution:
      "This does not automatically indicate either financial success or difficulty.",
  },
];

const mercuryVirgo = [
  {
    house: "1st House",
    sign: "Virgo",
    lord: "Mercury",
    meaning: "Self, body, identity and life direction",
  },
  {
    house: "10th House",
    sign: "Gemini",
    lord: "Mercury",
    meaning: "Profession, karma, responsibility and public role",
  },
];

const samePlanetExamples = [
  {
    title: "Mercury for Virgo Lagna",
    rules: "1st and 10th houses",
    explanation:
      "Mercury carries both the native's identity and the affairs of profession. Wherever Mercury is placed, it can connect those two domains with the house it occupies.",
  },
  {
    title: "Venus for Capricorn Lagna",
    rules: "5th and 10th houses",
    explanation:
      "Venus carries the affairs of intelligence, children and creativity together with profession, status and visible action.",
  },
  {
    title: "Mars for Cancer Lagna",
    rules: "5th and 10th houses",
    explanation:
      "Mars carries both 5th-house and 10th-house responsibilities while retaining its natural significations of action, courage and initiative.",
  },
];

export default function HouseLordsPage() {
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
              House Lords & Lordship
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 5 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            House Lords & Lordship: How the Birth Chart Becomes Connected
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Until now we have learned the individual building blocks of a
            horoscope. House lordship is where those blocks begin interacting
            with one another.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The fifth principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              A house lord carries the affairs of the house it rules{" "}
              <strong>into the house where it is placed</strong>.
              <br />
              <br />
              That creates a relationship between two areas of life — but it
              is still not a complete prediction.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS LORDSHIP */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does “house lord” mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Every house in the horoscope contains a Rashi. Every Rashi has
                a planetary ruler.
              </p>

              <p>
                The ruler of the Rashi occupying a house becomes the{" "}
                <strong>lord of that house</strong>.
              </p>

              <p>
                If Gemini occupies the 10th house, Mercury becomes the 10th
                lord. If Aries occupies the 10th, Mars becomes the 10th lord.
                If Taurus occupies the 10th, Venus becomes the 10th lord.
              </p>

              <p>
                This means we can follow the planet that rules a house to see
                where the affairs of that house are being carried.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The house tells us the subject. The house lord helps us follow
                that subject through the chart.
              </p>
            </div>
          </section>

          {/* SIGN LORD TABLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First skill
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Memorise the rulers of the twelve Rashis.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              You cannot identify a house lord until you know which planet
              rules the sign occupying that house.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {signLords.map(([sign, lord]) => (
                <div
                  key={sign}
                  className="flex items-center justify-between rounded-2xl border border-[#e3d5c5] bg-white p-5"
                >
                  <span className="font-semibold">{sign}</span>
                  <span className="text-[#7c526e]">{lord}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="leading-8 text-[#493b4d]">
                Sun and Moon each rule one Rashi. Mars, Mercury, Jupiter,
                Venus and Saturn each rule two Rashis in this foundational
                rulership framework.
              </p>
            </div>
          </section>

          {/* HOW TO FIND LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How do you find and interpret a house lord?
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

          {/* VIRGO EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Virgo Lagna: Mercury rules two important houses.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              For Virgo Lagna, Virgo occupies the 1st house and Gemini occupies
              the 10th. Mercury rules both signs.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {mercuryVirgo.map((item) => (
                <div
                  key={item.house}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold text-[#9a6d58]">
                    {item.house}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {item.sign} → {item.lord}
                  </h3>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {item.meaning}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Mercury therefore carries both{" "}
                  <strong>1st-house affairs</strong> and{" "}
                  <strong>10th-house affairs</strong>.
                </p>

                <p>
                  Suppose Mercury is placed in the 4th house.
                </p>

                <p>
                  We now have a connection between{" "}
                  <strong>self and life direction</strong>,{" "}
                  <strong>profession</strong> and the{" "}
                  <strong>4th-house field of home, residence, property,
                  education and inner foundations</strong>.
                </p>

                <p>
                  This is useful information — but it still does not tell us
                  exactly what will happen.
                </p>

                <p className="font-semibold text-[#403344]">
                  Lordship gives us the relationship. The rest of the chart
                  tells us how that relationship can manifest.
                </p>
              </div>
            </div>
          </section>

          {/* ONE PLANET TWO HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A critical concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              One planet can carry two house agendas at the same time.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                This is one of the reasons Jyotish interpretation becomes much
                richer than simply saying “Mars means courage” or “Venus means
                relationships.”
              </p>

              <p>
                Once Lagna is established, most planets become responsible for
                two houses.
              </p>

              <p>
                Their natural karakatwas remain relevant, but the planet also
                carries the affairs of the houses it rules.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {samePlanetExamples.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm font-semibold text-[#8b5a79]">
                    Rules {item.rules}
                  </p>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* LORD IN HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Reading the language
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does “X lord in Y house” actually mean?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              This phrase appears constantly in astrology. The safest way to
              understand it is as a connection between two fields of
              experience.
            </p>

            <div className="mt-10 space-y-6">
              {examples.map((example) => (
                <div
                  key={example.title}
                  className="rounded-3xl border border-[#e1d3c3] bg-white p-7 md:p-8"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                    {example.from} → {example.to}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {example.title}
                  </h3>

                  <p className="mt-5 leading-8 text-[#65586a]">
                    {example.meaning}
                  </p>

                  <div className="mt-5 rounded-2xl bg-[#f4ece3] p-5">
                    <p className="text-sm font-semibold text-[#8b5a79]">
                      Do not jump to a prediction
                    </p>

                    <p className="mt-2 leading-7 text-[#5d505f]">
                      {example.caution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* HOUSE EXCHANGE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A stronger connection
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What if two house lords exchange houses?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the lord of one house occupies another house, while
                the lord of that second house occupies the first.
              </p>

              <p>
                This creates a direct exchange between the two houses, often
                called <strong>Parivartana</strong>.
              </p>

              <p>
                It creates a strong relationship between the two sets of house
                affairs because each lord occupies the other's domain.
              </p>

              <p>
                But the quality of the exchange still depends on the houses
                involved, the planets themselves and their wider condition.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                A strong connection does not automatically mean an easy
                connection.
              </p>
            </div>
          </section>

          {/* LORD AND OCCUPANT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Another distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              House lord and house occupant are not the same thing.
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  House Lord
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  The planet responsible for the house
                </h3>

                <p className="mt-3 leading-7 text-[#65586a]">
                  It is determined by the Rashi occupying the house. Its
                  placement shows where the affairs of that house are being
                  carried.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  House Occupant
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  A planet physically placed in the house
                </h3>

                <p className="mt-3 leading-7 text-[#65586a]">
                  It brings its natural significations, house lordships and
                  condition directly into the affairs of that house.
                </p>
              </div>
            </div>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#65586a]">
              A house may contain no planets and still be extremely important.
              Its lord always exists somewhere in the chart and can connect the
              house with other areas of life.
            </p>
          </section>

          {/* NATURAL KARAKA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Three different layers
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do not confuse house, house lord and natural karaka.
            </h2>

            <div className="mt-9 space-y-4">
              {[
                [
                  "House",
                  "The field of life we are examining.",
                ],
                [
                  "House lord",
                  "The planet responsible for carrying the affairs of that house in this particular chart.",
                ],
                [
                  "Natural karaka",
                  "A planet naturally associated with that subject regardless of Ascendant.",
                ],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="grid gap-3 rounded-2xl border border-[#e4d8ca] bg-white p-6 md:grid-cols-[150px_1fr]"
                >
                  <p className="font-semibold text-[#8b5a79]">{title}</p>
                  <p className="leading-7 text-[#65586a]">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <p className="text-lg leading-8 text-[#5e5162]">
                For marriage, for example, we may study the{" "}
                <strong>7th house</strong>, the{" "}
                <strong>7th lord</strong>, relevant natural significators and,
                when appropriate, the Navamsa and timing factors. No single
                layer should automatically replace the others.
              </p>
            </div>
          </section>

          {/* CONDITION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Connection is not enough
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              We also need to know how capable the house lord is.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Once a house connection is identified, several questions remain.
            </p>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {[
                "Which Rashi is the lord occupying?",
                "Is it in its own sign, exalted, debilitated or otherwise conditioned?",
                "Which planets conjoin it?",
                "Which planets aspect or influence it?",
                "Who is its dispositor?",
                "Which nakshatra does it occupy?",
                "Does the relevant divisional chart support the theme?",
                "Is the planet or house currently activated by Dasha?",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-5"
                >
                  <p className="leading-7 text-[#65586a]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* TIMING */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Promise versus activation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A house connection can exist for life. It is not active every day.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Your natal chart does not change every month. A 10th lord
                placed in the 4th remains there throughout life.
              </p>

              <p>
                Yet career and 4th-house events do not occur continuously.
              </p>

              <p>
                This is why Jyotish separates the{" "}
                <strong>promise of the natal chart</strong> from the{" "}
                <strong>activation of that promise through time</strong>.
              </p>

              <p>
                Dashas help identify which planets and house agendas become
                prominent during particular periods. Transits can then help
                refine the timing and context.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Lordship tells us what is connected. Timing tells us when that
                connection becomes especially relevant.
              </p>
            </div>
          </section>

          {/* SYNTHESIS EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Begin thinking like an astrologer
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              From one placement to a chain of reasoning
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine the <strong>10th lord is in the 11th house</strong>.
                </p>

                <p>
                  Step one: the 10th carries themes of profession, karma,
                  responsibility and public role.
                </p>

                <p>
                  Step two: the 11th carries themes of gains, networks,
                  associations, aspirations and fulfilment.
                </p>

                <p>
                  We therefore have a career–gain or career–network connection.
                </p>

                <p>
                  But now we ask: which planet is the 10th lord? What other
                  house does it rule? How strong is it? What influences it?
                </p>

                <p>
                  Then we examine whether other career factors repeat the same
                  theme.
                </p>

                <p>
                  Finally, if we are asking{" "}
                  <strong>when</strong> something may occur, we study Dasha and
                  transit activation.
                </p>

                <p className="font-semibold text-[#403344]">
                  Interpretation is a chain of reasoning, not a dictionary
                  lookup.
                </p>
              </div>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common beginner mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Do not interpret a house lord without checking what other house the same planet rules.",
                "Do not assume that a lord placed in a house guarantees one specific event.",
                "Do not confuse a natural karaka with a house lord.",
                "Do not ignore the condition of the house lord.",
                "Do not assume an empty house is inactive or unimportant.",
                "Do not read one house connection without looking for supporting or modifying factors.",
                "Do not confuse a strong connection with an automatically favourable result.",
                "Do not use Dasha as though it can create an event that has no support in the natal chart.",
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
              Our framework is growing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              We can now read five layers.
            </h2>

            <div className="mt-9 space-y-4">
              {[
                [
                  "Graha",
                  "Who is acting and what the planet naturally signifies.",
                ],
                [
                  "Bhava",
                  "Which area of life is involved.",
                ],
                [
                  "Rashi",
                  "How the planetary energy tends to express.",
                ],
                [
                  "Lagna",
                  "The anchor that determines house structure and planetary responsibilities.",
                ],
                [
                  "Lordship",
                  "How one area of life becomes connected with another through the planet that rules it.",
                ],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="grid gap-3 rounded-2xl border border-[#e4d8ca] bg-white p-6 md:grid-cols-[120px_1fr]"
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
              Lesson 5 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "The ruler of the Rashi occupying a house becomes the lord of that house.",
                "The house lord carries the affairs of the house it rules into the house where it is placed.",
                "Most planets rule two houses and therefore carry two sets of chart-specific responsibilities.",
                "House lordship is different from a planet's natural karakatwa.",
                "A house lord and a planet occupying a house are different interpretive layers.",
                "An empty house still has a lord and can remain highly important.",
                "Lordship creates relationships between different areas of life.",
                "The condition of the house lord helps determine how effectively that relationship can operate.",
                "Repeated connections across the chart strengthen an interpretive theme.",
                "Dasha and transits help determine when natal house connections become activated.",
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
              Lesson 6 — Planetary Strength & Dignity
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We now know which planet is responsible for a house and where it
              carries those responsibilities.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              But two people can have the same house-lord placement and
              experience it very differently.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              The next question is therefore:
              <strong> how capable is that planet of doing its job?</strong>
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              In Lesson 6 we will study own sign, exaltation, debilitation,
              planetary friendships, combustion, retrogression and the broader
              idea of planetary strength — without reducing the chart to
              “strong equals good” and “weak equals bad.”
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 6 · Coming next
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Build the chart one layer at a time
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Lordship turns twelve separate houses into one connected chart.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Once we know which areas of life are connected, the next step
                is to assess the condition and strength of the planets carrying
                those connections.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/lagna-ascendant-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 4: Ascendant & Chart Structure
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