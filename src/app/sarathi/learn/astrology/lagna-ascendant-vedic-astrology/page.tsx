import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Lagna & Ascendant in Vedic Astrology: Beginner Guide",
  description:
    "Learn what Lagna means in Vedic astrology, how the Ascendant determines the twelve houses, why birth time matters and how planetary lordship changes for every Lagna.",
  path: "/sarathi/learn/astrology/lagna-ascendant-vedic-astrology",
  keywords: [
    "Lagna Vedic Astrology",
    "Ascendant Vedic Astrology",
    "What Is Lagna",
    "Ascendant Meaning Astrology",
    "Lagna Lord",
    "Vedic Birth Chart Ascendant",
    "House Lords by Ascendant",
    "Jyotish Lagna",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Lagna and Ascendant in Vedic Astrology: How the Birth Chart Is Anchored",
  description:
    "A beginner-friendly guide to Lagna, the Ascendant, house structure, planetary lordship and why an accurate birth time matters in Jyotish.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/lagna-ascendant-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/lagna-ascendant-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Lagna",
    "Ascendant",
    "Lagna lord",
    "House lordship",
    "Birth chart",
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
      name: "Lagna & Ascendant",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/lagna-ascendant-vedic-astrology",
    },
  ],
};

const lagnaExamples = [
  {
    lagna: "Aries Lagna",
    first: "Aries",
    fourth: "Cancer",
    seventh: "Libra",
    tenth: "Capricorn",
    lagnaLord: "Mars",
    tenthLord: "Saturn",
  },
  {
    lagna: "Taurus Lagna",
    first: "Taurus",
    fourth: "Leo",
    seventh: "Scorpio",
    tenth: "Aquarius",
    lagnaLord: "Venus",
    tenthLord: "Saturn",
  },
  {
    lagna: "Gemini Lagna",
    first: "Gemini",
    fourth: "Virgo",
    seventh: "Sagittarius",
    tenth: "Pisces",
    lagnaLord: "Mercury",
    tenthLord: "Jupiter",
  },
  {
    lagna: "Cancer Lagna",
    first: "Cancer",
    fourth: "Libra",
    seventh: "Capricorn",
    tenth: "Aries",
    lagnaLord: "Moon",
    tenthLord: "Mars",
  },
  {
    lagna: "Leo Lagna",
    first: "Leo",
    fourth: "Scorpio",
    seventh: "Aquarius",
    tenth: "Taurus",
    lagnaLord: "Sun",
    tenthLord: "Venus",
  },
  {
    lagna: "Virgo Lagna",
    first: "Virgo",
    fourth: "Sagittarius",
    seventh: "Pisces",
    tenth: "Gemini",
    lagnaLord: "Mercury",
    tenthLord: "Mercury",
  },
  {
    lagna: "Libra Lagna",
    first: "Libra",
    fourth: "Capricorn",
    seventh: "Aries",
    tenth: "Cancer",
    lagnaLord: "Venus",
    tenthLord: "Moon",
  },
  {
    lagna: "Scorpio Lagna",
    first: "Scorpio",
    fourth: "Aquarius",
    seventh: "Taurus",
    tenth: "Leo",
    lagnaLord: "Mars",
    tenthLord: "Sun",
  },
  {
    lagna: "Sagittarius Lagna",
    first: "Sagittarius",
    fourth: "Pisces",
    seventh: "Gemini",
    tenth: "Virgo",
    lagnaLord: "Jupiter",
    tenthLord: "Mercury",
  },
  {
    lagna: "Capricorn Lagna",
    first: "Capricorn",
    fourth: "Aries",
    seventh: "Cancer",
    tenth: "Libra",
    lagnaLord: "Saturn",
    tenthLord: "Venus",
  },
  {
    lagna: "Aquarius Lagna",
    first: "Aquarius",
    fourth: "Taurus",
    seventh: "Leo",
    tenth: "Scorpio",
    lagnaLord: "Saturn",
    tenthLord: "Mars",
  },
  {
    lagna: "Pisces Lagna",
    first: "Pisces",
    fourth: "Gemini",
    seventh: "Virgo",
    tenth: "Sagittarius",
    lagnaLord: "Jupiter",
    tenthLord: "Jupiter",
  },
];

const lagnaSteps = [
  {
    number: "01",
    title: "Find the Ascendant",
    text: "The Rashi rising on the eastern horizon at the birth time becomes the Lagna or 1st house.",
  },
  {
    number: "02",
    title: "Place the remaining Rashis",
    text: "Once the Lagna is known, the remaining signs follow in zodiacal order through houses 2 to 12.",
  },
  {
    number: "03",
    title: "Identify the Lagna lord",
    text: "The ruler of the Ascendant sign becomes the Lagna lord and is one of the most important planets in understanding the native and the chart as a whole.",
  },
  {
    number: "04",
    title: "Determine every house lord",
    text: "Each house receives a Rashi, and the ruler of that Rashi becomes responsible for the affairs of that house.",
  },
  {
    number: "05",
    title: "Follow each lord to its placement",
    text: "Where a house lord sits creates a connection between the house it rules and the house it occupies.",
  },
];

const comparisons = [
  {
    title: "Mars for Aries Lagna",
    text: "Mars rules the 1st and 8th houses. It therefore carries themes of identity, vitality and self along with transformation, longevity and deeper 8th-house matters.",
  },
  {
    title: "Mars for Cancer Lagna",
    text: "Mars rules the 5th and 10th houses. Its chart-specific responsibilities now include intelligence, children and creativity as well as profession, action and public responsibility.",
  },
  {
    title: "Mars for Virgo Lagna",
    text: "Mars rules the 3rd and 8th houses. Its functional role becomes connected with effort, siblings and communication together with transformation and 8th-house matters.",
  },
];

export default function LagnaAscendantPage() {
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
            <span className="text-[#4c3e50]">Lagna & Ascendant</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 4 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Lagna & Ascendant: The Point That Anchors the Birth Chart
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            We have learned the grahas, the houses and the Rashis. Lagna is the
            point that brings those three layers together and turns the zodiac
            into an individual birth chart.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The fourth principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>Lagna determines where the Rashis fall.</strong>
              <br />
              Where the Rashis fall determines{" "}
              <strong>which planets rule which houses</strong>.
              <br />
              That is why planetary function changes from one Ascendant to
              another.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS LAGNA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What exactly is the Lagna?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                At any given place and moment, a particular point of the zodiac
                is rising on the eastern horizon.
              </p>

              <p>
                In a birth chart, the zodiac sign rising at the time and place
                of birth becomes the <strong>Ascendant</strong>, called{" "}
                <strong>Lagna</strong> in Jyotish.
              </p>

              <p>
                That sign becomes the starting point of the horoscope and
                establishes the 1st house.
              </p>

              <p>
                From there, the remaining Rashis are assigned to the remaining
                houses in zodiacal sequence.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The Lagna does not merely describe personality. It establishes
                the structural framework through which the entire horoscope is
                interpreted.
              </p>
            </div>
          </section>

          {/* WHY BIRTH TIME */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Why time matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is an accurate birth time important?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Ascendant changes as the Earth rotates. Because of this,
                different zodiac signs rise at different times during the day.
              </p>

              <p>
                A change in birth time can change the degree of the Lagna and,
                when close to a sign boundary, may even change the Ascendant
                sign itself.
              </p>

              <p>
                If the Ascendant changes, the house structure changes. The same
                planets may then rule completely different houses.
              </p>

              <p>
                Birth time also becomes increasingly important when working
                with divisional charts and finer timing techniques.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Birth time is not just needed to know your “rising sign.” It
                helps establish the architecture of the horoscope.
              </p>
            </div>
          </section>

          {/* HOW CHART IS BUILT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Building the chart
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How does Lagna establish the twelve houses?
            </h2>

            <div className="mt-10 space-y-5">
              {lagnaSteps.map((step) => (
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
              Suppose Virgo is rising.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Virgo becomes the <strong>1st house</strong>.
                </p>

                <p>
                  Libra becomes the <strong>2nd house</strong>, Scorpio the{" "}
                  <strong>3rd</strong>, Sagittarius the <strong>4th</strong>,
                  Capricorn the <strong>5th</strong>, Aquarius the{" "}
                  <strong>6th</strong> and Pisces the <strong>7th</strong>.
                </p>

                <p>
                  Aries becomes the <strong>8th house</strong>, Taurus the{" "}
                  <strong>9th</strong>, Gemini the <strong>10th</strong>,
                  Cancer the <strong>11th</strong> and Leo the{" "}
                  <strong>12th</strong>.
                </p>

                <p>
                  Because Mercury rules both Virgo and Gemini, Mercury becomes
                  lord of the <strong>1st and 10th houses</strong> for Virgo
                  Lagna.
                </p>

                <p>
                  Mercury therefore does not represent only its natural
                  karakatwas such as communication, intellect and commerce. In
                  this chart it also carries the affairs of{" "}
                  <strong>self and profession</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* 12 LAGNAS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              See the structure change
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The same houses receive different Rashis for every Lagna.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Look at the 1st, 4th, 7th and 10th houses below. Notice how their
              signs — and therefore their planetary lords — change as Lagna
              changes.
            </p>

            <div className="mt-10 overflow-x-auto rounded-2xl border border-[#e1d3c3] bg-white">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-[#f4ece3]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">Lagna</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      1st House
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      4th House
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      7th House
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      10th House
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Lagna Lord
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      10th Lord
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lagnaExamples.map((item) => (
                    <tr
                      key={item.lagna}
                      className="border-t border-[#eadfce]"
                    >
                      <td className="px-5 py-4 font-semibold">{item.lagna}</td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.first}
                      </td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.fourth}
                      </td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.seventh}
                      </td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.tenth}
                      </td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.lagnaLord}
                      </td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.tenthLord}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* LAGNA LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A key planet
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is the Lagna lord?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The planet ruling the Ascendant sign becomes the{" "}
                <strong>Lagna lord</strong>.
              </p>

              <p>
                Because the 1st house represents the native, body, vitality,
                identity and direction of life, the condition and placement of
                the Lagna lord are especially important.
              </p>

              <p>
                If Virgo is rising, Mercury is the Lagna lord. If Cancer is
                rising, the Moon is the Lagna lord. If Capricorn is rising,
                Saturn becomes the Lagna lord.
              </p>

              <p>
                We then ask: where has the Lagna lord gone? Which house does it
                occupy? Which sign? Which planets influence it? What other
                house does it rule?
              </p>
            </div>
          </section>

          {/* NATURAL VS FUNCTIONAL */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              One of the most important distinctions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Natural meaning is not the same as functional role.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In Lesson 1, we learned the natural meanings of the grahas.
                Mars represents things such as action, courage, competition,
                force and initiative.
              </p>

              <p>
                Those natural significations remain relevant in every chart.
              </p>

              <p>
                But once Lagna is known, Mars also acquires{" "}
                <strong>house lordship</strong>. The houses it rules vary by
                Ascendant.
              </p>

              <p>
                This gives Mars a chart-specific responsibility in addition to
                its natural nature.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {comparisons.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-4 leading-7 text-[#6a5d6e]">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                The planet's natural nature tells us what it inherently
                signifies. Lagna tells us what houses that planet has been
                assigned to manage in this particular chart.
              </p>
            </div>
          </section>

          {/* SAME PLANET */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Why this changes interpretation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The same planet does not perform the same job in every chart.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Consider <strong>Venus</strong>.
                </p>

                <p>
                  Its natural significations include relationships, beauty,
                  comfort, pleasure, art and value.
                </p>

                <p>
                  For <strong>Taurus Lagna</strong>, Venus rules the 1st and 6th
                  houses.
                </p>

                <p>
                  For <strong>Libra Lagna</strong>, Venus rules the 1st and 8th
                  houses.
                </p>

                <p>
                  For <strong>Capricorn Lagna</strong>, Venus rules the 5th and
                  10th houses.
                </p>

                <p>
                  Venus is still Venus in all three charts, but its
                  responsibilities are different.
                </p>

                <p className="font-semibold text-[#403344]">
                  This is why interpreting a planet without knowing the Lagna
                  leaves out one of the most important layers of Jyotish.
                </p>
              </div>
            </div>
          </section>

          {/* LORD CONNECTION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The next major skill
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A house lord carries one area of life into another.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the 10th lord is placed in the 4th house.
              </p>

              <p>
                The 10th represents profession, karma and visible
                responsibility. The 4th represents home, residence, property,
                inner foundations and other 4th-house matters.
              </p>

              <p>
                We now have a relationship between the affairs of the 10th and
                4th houses.
              </p>

              <p>
                This does <strong>not</strong> automatically tell us the event.
                It may express in several ways depending on the planet, sign,
                dignity, aspects, other connections and planetary period.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                House lordship creates connections. Interpretation tells us
                what those connections are capable of producing.
              </p>
            </div>
          </section>

          {/* DO NOT PREDICT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Do not rush into prediction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “10th lord in 4th” is not a prediction.
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                [
                  "Do not say",
                  "“10th lord in 4th means you will work from home.”",
                ],
                [
                  "Instead ask",
                  "What planet is the 10th lord and what else does it rule?",
                ],
                [
                  "Then ask",
                  "How strong is that planet and what influences it?",
                ],
                [
                  "Then ask",
                  "What other career houses and planets support the same theme?",
                ],
                [
                  "Then ask",
                  "Does the D10 reinforce or modify the pattern?",
                ],
                [
                  "Finally ask",
                  "Is the relevant combination actually activated by Dasha and transit?",
                ],
              ].map(([title, text]) => (
                <div
                  key={text}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="font-semibold text-[#8b5a79]">{title}</p>
                  <p className="mt-3 leading-7 text-[#65586a]">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* LAGNA VS MOON SUN */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Another useful distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Lagna, Moon sign and Sun sign are not interchangeable.
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Lagna
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Chart framework
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Establishes the house structure and planetary lordships and
                  is central to reading the birth chart.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Moon
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Mind & experience
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  The Moon is especially important for mind, emotion,
                  perception and several timing and transit traditions.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">Sun</p>
                <h3 className="mt-2 text-xl font-semibold">
                  Identity & authority
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  The Sun carries its own natural significations including
                  identity, vitality, authority and recognition.
                </p>
              </div>
            </div>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#65586a]">
              All three can be meaningful, but they answer different
              interpretive questions. A complete horoscope should not be
              reduced to only one of them.
            </p>
          </section>

          {/* SYNTHESIS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Our framework so far
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              We can now read four layers.
            </h2>

            <div className="mt-9 space-y-4">
              {[
                [
                  "Graha",
                  "Who is acting — the planet and its natural significations.",
                ],
                [
                  "Bhava",
                  "Where in life — the field of experience represented by the house.",
                ],
                [
                  "Rashi",
                  "How — the environment and manner in which the energy expresses.",
                ],
                [
                  "Lagna",
                  "The chart's anchor — determining where every Rashi falls and which houses every planet rules.",
                ],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="grid gap-3 rounded-2xl border border-[#e4d8ca] bg-white p-6 md:grid-cols-[110px_1fr]"
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
              Lesson 4 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Lagna is the zodiac sign rising on the eastern horizon at the time and place of birth.",
                "The Lagna establishes the 1st house and anchors the house structure of the horoscope.",
                "Once Lagna is known, the remaining Rashis follow through houses 2 to 12.",
                "The ruler of the Ascendant sign becomes the Lagna lord.",
                "The Rashi occupying each house determines the lord of that house.",
                "Planetary house lordship changes when the Ascendant changes.",
                "A planet therefore has both natural significations and chart-specific responsibilities.",
                "Where a house lord is placed creates relationships between different areas of life.",
                "Birth time matters because changes in the Ascendant can alter house structure and lordship.",
                "Do not convert a single house-lord placement into an automatic prediction.",
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
              Lesson 5 — House Lords & Lordship
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We now understand why every planet acquires a different
              responsibility depending on Lagna.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              Next we will learn how to follow a house lord through the chart
              and understand statements such as{" "}
              <strong>“10th lord in the 4th house”</strong> or{" "}
              <strong>“7th lord connected with the 11th.”</strong>
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              This is where separate houses begin turning into a connected
              story.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 5 · Coming next
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
                Graha tells us who. Bhava tells us where. Rashi tells us how.
                Lagna assigns the roles.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                In Lesson 5, we follow those planetary roles through the chart
                and learn how house lordship creates the connections from which
                interpretation begins.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/12-rashis-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 3: The 12 Rashis
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