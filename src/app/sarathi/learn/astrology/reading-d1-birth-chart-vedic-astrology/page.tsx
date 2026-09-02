import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "How to Read a D1 Birth Chart in Vedic Astrology",
  description:
    "Learn how to read a D1 birth chart step by step using Lagna, house lords, planetary placements, dignity, Sambandha, Nakshatras and repeating chart themes.",
  path: "/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology",
  keywords: [
    "How to Read D1 Chart",
    "Vedic Birth Chart Reading",
    "D1 Chart Vedic Astrology",
    "How to Read Kundli",
    "Birth Chart Interpretation Vedic Astrology",
    "Lagna Chart Reading",
    "Jyotish Birth Chart",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "How to Read a D1 Birth Chart in Vedic Astrology: A Step-by-Step Method",
  description:
    "A structured beginner guide to reading the D1 birth chart by combining Lagna, house lordship, planetary placements, dignity, Sambandha and Nakshatras.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "D1 chart",
    "Birth chart interpretation",
    "Lagna",
    "House lords",
    "Planetary placements",
    "Nakshatras",
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
      name: "Reading the D1 Birth Chart",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology",
    },
  ],
};

const readingSequence = [
  {
    number: "01",
    title: "Identify the Lagna",
    text: "The Ascendant establishes the first house and determines the house ownership pattern for the entire horoscope.",
  },
  {
    number: "02",
    title: "Study the Lagna Lord",
    text: "Its house, Rashi, dignity and relationships provide an important starting point for understanding how the chart is organised.",
  },
  {
    number: "03",
    title: "Map every house lord",
    text: "Identify which planet rules each house and where that planet is placed. This reveals how different life areas become connected.",
  },
  {
    number: "04",
    title: "Study the planets occupying each house",
    text: "Occupants bring their natural significations and chart-specific responsibilities into the houses where they are placed.",
  },
  {
    number: "05",
    title: "Assess Rashi and planetary dignity",
    text: "Examine how comfortably and effectively each planet can operate in the sign it occupies.",
  },
  {
  number: "06",
  title: "Check planetary aspects",
  text: "Identify which planets aspect the houses and planets relevant to the topic. Aspects show influence without occupation and can reinforce, modify or connect a chart theme.",
},
  {
  number: "07",
  title: "Identify conjunctions and Sambandha",
  text: "Look for conjunctions, mutual aspects, exchanges and other meaningful relationships that connect planetary and house agendas.",
},
{
  number: "08",
  title: "Add the Nakshatra layer",
  text: "The Nakshatra and its lord refine planetary expression and introduce another dispositional connection.",
},
{
  number: "09",
  title: "Look for repetition",
  text: "Themes become more convincing when multiple independent chart factors point toward the same conclusion.",
},
{
  number: "10",
  title: "Read the chart by topic",
  text: "For career, marriage, finances or another subject, isolate the relevant houses and planets before synthesising them.",
},
{
  number: "11",
  title: "Separate promise from timing",
  text: "The natal chart shows what is structurally available. Dasha and transits later help determine when those themes become activated.",
},
];

const layers = [
  {
    title: "Graha",
    question: "Who is acting?",
    text: "Natural significations tell us what kind of energy or function the planet represents.",
  },
  {
    title: "Bhava",
    question: "Where is it acting?",
    text: "The house identifies the field of life in which the planet operates.",
  },
  {
    title: "Rashi",
    question: "How does it express?",
    text: "The sign provides the broader environment, temperament and dispositional setting.",
  },
  {
    title: "Lordship",
    question: "What responsibilities does it carry?",
    text: "House ownership tells us which areas of life the planet represents in this particular chart.",
  },
  {
    title: "Strength",
    question: "How capable is it?",
    text: "Dignity and planetary condition describe how effectively the planet can express its agenda.",
  },
  {
    title: "Sambandha",
    question: "What is it connected to?",
    text: "Conjunctions, aspects, exchanges and lordship relationships join planetary agendas together.",
  },
  {
    title: "Nakshatra",
    question: "What deeper pattern is operating?",
    text: "Nakshatra refines the planet's expression and links it to another planetary ruler.",
  },
];

const topicExamples = [
  {
    title: "Career",
    houses: "10th, 6th, 2nd and 11th",
    focus:
      "Profession, work environment, income, gains, responsibility and professional development.",
  },
  {
    title: "Marriage & Partnership",
    houses: "7th, 2nd and 11th",
    focus:
      "Partnership, family formation, continuity of relationship and fulfilment of relationship themes.",
  },
  {
    title: "Property & Home",
    houses: "4th, 2nd and 11th",
    focus:
      "Residence, property, family resources and fulfilment connected with acquiring or changing a home.",
  },
  {
    title: "Children",
    houses: "5th, 2nd and 11th",
    focus:
      "Children, family expansion, continuity and fulfilment related to progeny.",
  },
];

const commonMistakes = [
  "Starting with the strongest-looking planet and trying to predict the whole life from it.",
  "Reading a planet only through its natural karaka meaning.",
  "Ignoring house lordship.",
  "Treating one placement as a complete prediction.",
  "Assuming exalted means favourable and debilitated means failure.",
  "Reading conjunctions without checking which houses the planets rule.",
  "Reading Nakshatra symbolism literally.",
  "Jumping to Dasha before establishing what the natal chart actually contains.",
  "Trying to interpret every house at the same time instead of working topic by topic.",
  "Failing to look for repetition before forming a conclusion.",
];

export default function ReadingD1BirthChartPage() {
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
            <span className="text-[#4c3e50]">
              Reading the D1 Birth Chart
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 9 · Chart Synthesis
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            How to Read the D1 Birth Chart: From Individual Placements to a
            Coherent Story
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Until now we have studied the building blocks separately. The D1
            chart is where those layers must finally be brought together in the
            correct order.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The ninth principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>
                Do not read a horoscope as a collection of isolated
                placements.
              </strong>
              <br />
              <br />
              Read it as a network of planets carrying house agendas through
              specific signs, relationships and Nakshatras.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS D1 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the foundation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is the D1 chart?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D1 chart is the main natal horoscope, commonly called the{" "}
                <strong>Rashi chart</strong> or birth chart.
              </p>

              <p>
                It maps the planets into the twelve Rashis and twelve houses
                based on the birth time and location.
              </p>

              <p>
                It provides the broad structural foundation from which we study
                personality, relationships, career, family, finances,
                challenges, opportunities and other areas of life.
              </p>

              <p>
                Divisional charts later provide additional detail, but they do
                not replace the D1.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The D1 gives us the main architecture of the horoscope.
              </p>
            </div>
          </section>

          {/* WHY BEGINNERS STRUGGLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Why chart reading feels difficult
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The difficulty is not learning meanings. It is learning
              synthesis.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A beginner can memorise that Jupiter represents wisdom, the
                10th house represents career and Saturn represents discipline.
              </p>

              <p>
                But a real horoscope may show Jupiter ruling two houses,
                sitting in a third, aspecting another planet, receiving Saturn's
                influence and occupying a Nakshatra ruled by Mercury.
              </p>

              <p>
                None of those layers can be read independently.
              </p>

              <p>
                Chart reading therefore requires a method that prevents us from
                jumping from one attractive placement to another.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Interpretation is not the accumulation of meanings. It is the
                organisation of meanings.
              </p>
            </div>
          </section>

          {/* THE SEVEN LAYERS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Bring the lessons together
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Every important placement can be read through seven layers.
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {layers.map((layer) => (
                <div
                  key={layer.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                    {layer.title}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {layer.question}
                  </h3>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {layer.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SEQUENCE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The reading sequence
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A repeatable method for reading the D1 chart
            </h2>

            <div className="mt-10 space-y-5">
              {readingSequence.map((step) => (
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

          {/* LAGNA FIRST */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step 1
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Always begin with the Lagna.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Ascendant determines which Rashi becomes the first house.
              </p>

              <p>
                From there, every subsequent sign becomes another house and
                every planet receives its chart-specific house lordships.
              </p>

              <p>
                Until the Lagna is known, we do not know what role a planet
                performs in the chart.
              </p>

              <p>
                This is why the same Mars can carry very different
                responsibilities for different Ascendants.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Lagna does not merely describe personality. It assigns the
                entire house-lordship structure.
              </p>
            </div>
          </section>

          {/* LAGNA LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step 2
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Follow the Lagna Lord.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Once the Ascendant is identified, locate the planet ruling that
                sign.
              </p>

              <p>
                Ask where it is placed, what sign it occupies, what dignity it
                has, which planets influence it and which Nakshatra contains it.
              </p>

              <p>
                The Lagna lord often becomes an important anchor because it
                carries the first-house agenda into another part of the chart.
              </p>
            </div>
          </section>

          {/* HOUSE LORDS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step 3
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Map the house lords before making predictions.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the 10th lord is placed in the 4th house.
              </p>

              <p>
                The first conclusion is not “work from home,” “career in
                property” or “career will suffer.”
              </p>

              <p>
                The first conclusion is simply that{" "}
                <strong>
                  the 10th-house agenda has been connected with the 4th house
                </strong>
                .
              </p>

              <p>
                We then examine the planet, sign, dignity, aspects,
                conjunctions and Nakshatra before deciding what the connection
                may mean.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Lordship gives us the relationship. The rest of the chart tells
                us how that relationship can manifest.
              </p>
            </div>
          </section>

          {/* OCCUPANT VS LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Keep these separate
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              House occupant and house lord are not the same thing.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  House occupant
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  What is operating here?
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  A planet occupying a house brings its natural significations
                  and house lordships directly into that field of life.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  House lord
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  Where has the house gone?
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  The house lord carries the affairs of its house into the
                  house where that lord is placed.
                </p>
              </div>
            </div>
          </section>

          {/* SIGNS AND STRENGTH */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Steps 4 and 5
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Then ask how each planet can operate.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Once we know what a planet represents in the chart, we assess
                its environment.
              </p>

              <p>
                Is it in its own sign, exalted, debilitated, friendly or
                uncomfortable territory?
              </p>

              <p>
                Who is its dispositor?
              </p>

              <p>
                Is it combust or retrograde?
              </p>

              <p>
                Is it supported or pressured by other planets?
              </p>

              <p>
                These conditions help tell us how effectively the planet can
                carry the responsibilities already identified through
                lordship.
              </p>
            </div>
          </section>
          {/* ASPECTS */}
<section className="border-t border-[#eadfce] py-14">
  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
    Step 6
  </p>

  <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
    Check who is influencing the house and its lord.
  </h2>

  <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
    <p>
      A planet does not need to occupy a house in order to influence it.
    </p>

    <p>
      Through Graha Drishti, planets can cast their influence across the
      horoscope.
    </p>

    <p>
      When studying a particular topic, check both the relevant house and its
      lord for incoming aspects.
    </p>

    <p>
      For example, if we are studying career, we should not examine only the
      10th house and 10th lord. We should also ask which planets aspect the
      10th house and which planets aspect the 10th lord.
    </p>

    <p>
      Those planets can become part of the career story even though they are
      placed elsewhere in the chart.
    </p>
  </div>

  <div className="mt-8 grid gap-5 md:grid-cols-2">
    <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
      <p className="text-sm font-semibold text-[#9a6d58]">
        Aspect on the house
      </p>

      <h3 className="mt-2 text-xl font-semibold">
        What influences the field of life?
      </h3>

      <p className="mt-3 leading-7 text-[#65586a]">
        A planet aspecting a house brings its natural nature and
        chart-specific responsibilities into that house's affairs.
      </p>
    </div>

    <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
      <p className="text-sm font-semibold text-[#9a6d58]">
        Aspect on the house lord
      </p>

      <h3 className="mt-2 text-xl font-semibold">
        What influences the planet carrying that agenda?
      </h3>

      <p className="mt-3 leading-7 text-[#65586a]">
        An aspect to the house lord can modify or connect the way that
        planet carries the affairs of the house it rules.
      </p>
    </div>
  </div>

  <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
    <p className="text-lg font-medium leading-8 text-[#493b4d]">
      Occupation tells us who is sitting in the house. Aspect tells us who is
      influencing it from elsewhere.
    </p>
  </div>
</section>
          {/* SAMBANDHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step 7
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Now look for genuine relationships.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Once the house lords and planetary placements are mapped, we
                ask which of them are actually connected.
              </p>

              <p>
                Conjunction, Graha Drishti, mutual aspect, sign exchange and
                other forms of Sambandha can link two planetary agendas.
              </p>

              <p>
                These relationships become especially important when multiple
                houses relevant to the same topic connect with one another.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                A topic becomes more persuasive when its relevant houses are
                genuinely connected rather than merely present.
              </p>
            </div>
          </section>

          {/* NAKSHATRA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step 8
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Add Nakshatra only after the basic structure is clear.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Nakshatra can add remarkable depth, but it should refine an
                interpretation rather than replace the foundations.
              </p>

              <p>
                First know the planet, house lordship, house placement and
                Rashi.
              </p>

              <p>
                Then examine the Nakshatra, its lord and its symbolic pattern.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Nakshatra adds precision after structure. It should not be used
                to bypass structure.
              </p>
            </div>
          </section>

          {/* REPETITION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step 9
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Repetition is one of the strongest clues in chart synthesis.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose one placement appears to connect career with foreign
                environments.
              </p>

              <p>
                That is worth noting.
              </p>

              <p>
                But if the 10th lord also connects with the 12th house, the
                12th lord influences the 10th, the relevant Nakshatra lord has a
                similar connection and later the D10 repeats it, the theme
                becomes much harder to dismiss.
              </p>

              <p>
                This is why chart interpretation should look for convergence,
                not isolated symbolism.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* TOPIC READING */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step 10
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do not read everything at once. Read by topic.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A chart contains many simultaneous relationships. A practical
              reading becomes much clearer when we first define the question
              and then isolate the houses and planets relevant to it.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {topicExamples.map((topic) => (
                <div
                  key={topic.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-2xl font-semibold">{topic.title}</h3>

                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#9a6d58]">
                    Commonly examined houses
                  </p>

                  <p className="mt-2 text-lg font-medium">{topic.houses}</p>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {topic.focus}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-7 max-w-3xl text-sm leading-7 text-[#796c7b]">
              These are useful starting combinations, not exhaustive formulas.
              Different questions may require additional houses, karakas and
              divisional charts.
            </p>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Suppose we are studying career in a Virgo Lagna chart.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  For Virgo Lagna, <strong>Mercury rules the 1st and 10th
                  houses</strong>.
                </p>

                <p>
                  Mercury therefore represents both the native's Ascendant
                  agenda and an important professional agenda.
                </p>

                <p>
                  Suppose Mercury is placed in the 4th house in Sagittarius.
                </p>

                <p>
                  We can first say that the 10th-house agenda is connected with
                  the 4th house.
                </p>

                <p>
                  Sagittarius tells us the sign environment. Jupiter becomes
                  the dispositor because Jupiter rules Sagittarius.
                </p>

                <p>
                  If Mercury occupies Mula, Ketu becomes the Nakshatra lord and
                  adds another dispositional connection.
                </p>

                <p>
                  We then examine Mercury's dignity, Jupiter's condition, Ketu's
                  placement, conjunctions and aspects involving Mercury and
                  whether other career houses repeat the same theme.
                </p>

                <p>
                  Only after this would we begin forming a professional
                  interpretation.
                </p>

                <p className="font-semibold text-[#403344]">
                  Notice the order: lordship first, placement second, Rashi
                  third, dispositor, Nakshatra and relationships after that.
                </p>
              </div>
            </div>
          </section>

          {/* PROMISE VS STRENGTH VS TIMING */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A crucial distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Promise, strength and timing are three different questions.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Natal promise
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Is the theme structurally present?
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  House lords, placements, significators and relationships show
                  what patterns exist in the chart.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Strength
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  How capable is the pattern?
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Dignity, planetary condition and supporting factors help
                  assess the capacity of the planets involved.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Timing
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  When does it become active?
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Dasha and transits later help determine when the natal
                  pattern becomes especially relevant.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Timing cannot create a completely unrelated natal promise. It
                activates and expresses what the chart already contains.
              </p>
            </div>
          </section>

          {/* DON'T START WITH DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Before we learn timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why we are not starting with Dasha.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                It can be tempting to immediately look at the current
                Mahadasha and ask what will happen.
              </p>

              <p>
                But a Dasha planet does not operate independently of the natal
                chart.
              </p>

              <p>
                Before interpreting its period, we need to know what that
                planet represents, which houses it rules, where it is placed,
                what condition it has and which other planets it is connected
                with.
              </p>

              <p>
                That is why chart structure comes before timing.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                First understand the planet's agenda. Then study when that
                agenda is activated.
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common beginner mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading a D1 chart?
            </h2>

            <div className="mt-8 space-y-4">
              {commonMistakes.map((item) => (
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

          {/* SIMPLE WORKSHEET */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Your chart-reading worksheet
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Ask these questions before forming a conclusion.
            </h2>

            <div className="mt-8 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-4 text-lg leading-8 text-[#5e5162]">
                <p>1. What is the Lagna?</p>
                <p>2. Where is the Lagna lord?</p>
                <p>3. Which planet rules the house I am studying?</p>
                <p>4. Where is that lord placed?</p>
                <p>5. Which planets occupy the house?</p>
                <p>6. What Rashi and dignity do the relevant planets have?</p>
                <p>7. Who are their dispositors?</p>
                <p>8. What conjunctions or aspects connect the topic?</p>
                <p>9. Which Nakshatras and Nakshatra lords are involved?</p>
                <p>10. Does the same theme repeat elsewhere?</p>
                <p>
                  11. What can I conclude from the natal chart before adding
                  timing?
                </p>
              </div>
            </div>
          </section>

          {/* FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The full foundation so far
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              We can now build a natal interpretation in sequence.
            </h2>

            <div className="mt-9 rounded-3xl border border-[#e3d5c5] bg-white p-7 md:p-9">
              <p className="text-xl font-semibold leading-9 text-[#493b4d]">
                Lagna → House Lord → Planetary Placement → Rashi → Strength →
                Sambandha → Nakshatra → Repetition → Topic Synthesis
              </p>
            </div>

            <div className="mt-7 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                The planet gives us the vocabulary. The chart gives us the
                sentence. Repetition tells us which sentences matter most.
              </p>
            </div>
          </section>

          {/* SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 9 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "The D1 chart provides the main structural foundation of the horoscope.",
                "Begin with Lagna because it establishes every house and house lord.",
                "Follow the Lagna lord before moving into detailed topic analysis.",
                "House lordship tells us which life areas each planet is responsible for.",
                "House occupants and house lords provide different kinds of information.",
                "Rashi and dignity describe the environment and capacity of the planets involved.",
                "Sambandha reveals which planetary and house agendas are genuinely connected.",
                "Nakshatra should refine an already established interpretation rather than replace it.",
                "Repeated independent indications make a chart theme more persuasive.",
                "Read the horoscope topic by topic rather than trying to interpret everything simultaneously.",
                "Separate natal promise, planetary strength and event timing.",
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
              Lesson 10 — Dashas
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We now know how to identify the structural promise of a chart.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              The next question is:
              <strong> when does a particular part of that chart become active?</strong>
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              In Lesson 10 we will begin with Vimshottari Dasha, understand
              Mahadasha, Antardasha and Pratyantardasha, learn how a Dasha lord
              activates its natal responsibilities and see why a planetary
              period cannot be interpreted from the planet's name alone.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 10 · Coming next
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                From placements to interpretation
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                A chart becomes readable when we stop asking what one placement
                means and start asking how the placements work together.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                With the natal framework in place, the next stage is learning
                how Jyotish activates those patterns through planetary periods.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/nakshatras-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 8: Nakshatras
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