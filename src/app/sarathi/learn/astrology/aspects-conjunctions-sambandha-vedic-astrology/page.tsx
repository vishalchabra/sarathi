import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Aspects, Conjunctions & Sambandha in Vedic Astrology",
  description:
    "Learn conjunctions, planetary aspects and Sambandha in Vedic astrology. Understand how planets and house lords become connected and how those relationships shape chart interpretation.",
  path: "/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology",
  keywords: [
    "Aspects Vedic Astrology",
    "Conjunction Vedic Astrology",
    "Sambandha Vedic Astrology",
    "Graha Drishti",
    "Planetary Aspects Jyotish",
    "Planetary Conjunction Astrology",
    "House Lord Connection",
    "Parivartana Yoga",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Aspects, Conjunctions & Sambandha in Vedic Astrology: How Planets Become Connected",
  description:
    "A beginner-friendly guide to conjunctions, planetary aspects, house-lord relationships, exchanges and Sambandha in Jyotish.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Sambandha",
    "Graha Drishti",
    "Planetary aspects",
    "Conjunctions",
    "House lord relationships",
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
      name: "Aspects, Conjunctions & Sambandha",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology",
    },
  ],
};

const aspectTable = [
  {
    planet: "Sun",
    aspect: "7th from itself",
    note: "Full aspect on the opposite house/sign.",
  },
  {
    planet: "Moon",
    aspect: "7th from itself",
    note: "Full aspect on the opposite house/sign.",
  },
  {
    planet: "Mars",
    aspect: "4th, 7th and 8th",
    note: "Mars has additional special aspects besides the standard 7th.",
  },
  {
    planet: "Mercury",
    aspect: "7th from itself",
    note: "Full aspect on the opposite house/sign.",
  },
  {
    planet: "Jupiter",
    aspect: "5th, 7th and 9th",
    note: "Jupiter has additional special aspects.",
  },
  {
    planet: "Venus",
    aspect: "7th from itself",
    note: "Full aspect on the opposite house/sign.",
  },
  {
    planet: "Saturn",
    aspect: "3rd, 7th and 10th",
    note: "Saturn has additional special aspects.",
  },
];

const sambandhaTypes = [
  {
    title: "Conjunction",
    label: "Planet + Planet",
    description:
      "Two or more planets occupy the same sign or house and therefore operate from the same field of the chart.",
  },
  {
    title: "Mutual Aspect",
    label: "Planet ↔ Planet",
    description:
      "Two planets aspect one another, creating a two-way relationship between their natural significations and house lordships.",
  },
  {
    title: "One-Way Aspect",
    label: "Planet → Planet",
    description:
      "One planet influences another through its aspect. The relationship exists even when the receiving planet does not aspect back.",
  },
  {
    title: "Exchange of Signs",
    label: "Lord A ↔ Lord B",
    description:
      "Each planet occupies the sign ruled by the other. This creates a strong mutual connection called Parivartana.",
  },
  {
    title: "Lord Occupying Another House",
    label: "House A → House B",
    description:
      "A house lord carries the affairs of the house it owns into the house where it is placed.",
  },
  {
    title: "Dispositor Relationship",
    label: "Planet → Sign Lord",
    description:
      "A planet operates through the sign it occupies, linking its expression to the condition and placement of that sign's ruler.",
  },
];

const conjunctionQuestions = [
  "Which planets are conjunct?",
  "How close are they by degree?",
  "Which houses do those planets rule?",
  "Which house contains the conjunction?",
  "Which Rashi contains the conjunction?",
  "Which planet is stronger or more dominant?",
  "Are either of the planets combust, debilitated or otherwise conditioned?",
  "Does the conjunction repeat the same theme elsewhere in the chart?",
];

const interpretationSteps = [
  {
    number: "01",
    title: "Identify the planets involved",
    text: "Start with their natural karakatwas. What does each graha naturally represent?",
  },
  {
    number: "02",
    title: "Identify their house lordships",
    text: "Determine which houses each planet is responsible for in this specific chart.",
  },
  {
    number: "03",
    title: "Identify the type of relationship",
    text: "Are they conjunct, mutually aspecting, connected through lordship, exchanging signs or linked through a dispositor?",
  },
  {
    number: "04",
    title: "Identify the house where the relationship operates",
    text: "The house tells us the life field in which the combined planetary agendas become especially relevant.",
  },
  {
    number: "05",
    title: "Study the Rashi",
    text: "The sign gives the environment and style through which the relationship expresses.",
  },
  {
    number: "06",
    title: "Assess planetary condition",
    text: "Dignity, combustion, retrogression, strength and other influences can modify how easily the connection operates.",
  },
  {
    number: "07",
    title: "Look for repetition",
    text: "A theme becomes more convincing when the same houses or planets connect through more than one independent factor.",
  },
  {
    number: "08",
    title: "Apply timing",
    text: "Dasha and transit activation help determine when an existing natal relationship becomes especially relevant.",
  },
];

export default function AspectsConjunctionsSambandhaPage() {
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
              Aspects, Conjunctions & Sambandha
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 7 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Aspects, Conjunctions & Sambandha: How Planets Become Connected
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            A birth chart is not a collection of isolated planets. Grahas
            influence, combine with and carry the agendas of one another. These
            relationships are what begin turning separate placements into a
            coherent chart story.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The seventh principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>Connection gives a theme more meaning.</strong>
              <br />
              <br />
              The fact that two houses exist in the same chart does not connect
              them. We look for a genuine relationship through their lords,
              planets, aspects or other forms of Sambandha.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS SAMBANDHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does Sambandha mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                <strong>Sambandha</strong> means relationship, connection or
                association.
              </p>

              <p>
                In chart interpretation, we use the idea to understand how
                planets and the houses they represent become connected.
              </p>

              <p>
                A relationship may be created because two planets occupy the
                same place, aspect one another, exchange signs or because the
                lord of one house is placed in another.
              </p>

              <p>
                Once such a relationship exists, the agendas represented by
                those planets and houses can begin operating together.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Sambandha helps answer:{" "}
                <strong>which parts of the chart are actually talking to each other?</strong>
              </p>
            </div>
          </section>

          {/* TYPES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Main forms of connection
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How can planets and houses become related?
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {sambandhaTypes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                    {item.label}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CONJUNCTION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Conjunction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What happens when planets occupy the same house?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                When two or more planets occupy the same sign or house, their
                agendas become closely associated.
              </p>

              <p>
                But interpreting a conjunction does not mean simply joining two
                keywords together.
              </p>

              <p>
                Suppose Mercury and Venus are conjunct.
              </p>

              <p>
                Mercury naturally carries themes such as communication,
                intellect, analysis and commerce. Venus carries relationships,
                comfort, art, attraction and value.
              </p>

              <p>
                Their conjunction can blend these themes, but the result will
                differ dramatically depending on which houses they rule and
                where the conjunction occurs.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {conjunctionQuestions.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-5"
                >
                  <p className="leading-7 text-[#65586a]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* DEGREE CLOSENESS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A finer layer
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Not every conjunction is equally close.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Two planets may occupy the same Rashi but still be many degrees
                apart.
              </p>

              <p>
                Another pair may be separated by only one or two degrees.
              </p>

              <p>
                Both are conjunct at the sign level in a basic chart reading,
                but a very close degree relationship can make their interaction
                more intimate or concentrated.
              </p>

              <p>
                Degree closeness therefore adds refinement, but it should not
                replace the larger questions of house lordship, house placement
                and planetary condition.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Same sign tells us they share the same field. Degree closeness
                tells us how tightly their energies may be intertwined.
              </p>
            </div>
          </section>

          {/* DRISHTI */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Graha Drishti
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Planets can influence places they do not occupy.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                <strong>Drishti</strong> means sight or aspect.
              </p>

              <p>
                Through Graha Drishti, a planet can influence another house,
                sign or planet without physically occupying the same place.
              </p>

              <p>
                In the common Parashari framework, all seven visible grahas
                have a full 7th-house aspect from their position.
              </p>

              <p>
                Mars, Jupiter and Saturn additionally have special full
                aspects.
              </p>
            </div>

            <div className="mt-9 overflow-x-auto rounded-2xl border border-[#e1d3c3] bg-white">
              <table className="min-w-[700px] w-full text-left">
                <thead className="bg-[#f4ece3]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">Graha</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Full Graha Drishti
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">Note</th>
                  </tr>
                </thead>

                <tbody>
                  {aspectTable.map((item) => (
                    <tr
                      key={item.planet}
                      className="border-t border-[#eadfce]"
                    >
                      <td className="px-5 py-4 font-semibold">{item.planet}</td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.aspect}
                      </td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {item.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="leading-8 text-[#493b4d]">
                This lesson uses the common Parashari Graha Drishti framework.
                Jyotish also contains other aspect systems, including Rashi
                Drishti in specific traditions. We will keep those separate so
                the foundational rules remain clear.
              </p>
            </div>
          </section>

          {/* HOW COUNT ASPECTS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learning to count
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How do you count planetary aspects?
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Suppose <strong>Saturn is in Aries</strong>.
                </p>

                <p>
                  Count Aries itself as position one.
                </p>

                <p>
                  Saturn's <strong>3rd aspect</strong> reaches Gemini.
                </p>

                <p>
                  Its <strong>7th aspect</strong> reaches Libra.
                </p>

                <p>
                  Its <strong>10th aspect</strong> reaches Capricorn.
                </p>

                <p>
                  If planets occupy Gemini, Libra or Capricorn, Saturn's
                  influence can therefore become part of their interpretation.
                </p>
              </div>
            </div>
          </section>

          {/* ASPECT IS NOT AUTOMATICALLY BAD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Important correction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              An aspect is influence — not automatically benefit or harm.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Students often learn statements such as “Jupiter's aspect is
                good” or “Saturn's aspect is bad.”
              </p>

              <p>
                Those shortcuts can become misleading.
              </p>

              <p>
                The planet casting the aspect has natural qualities, but it also
                has chart-specific house lordships and its own condition.
              </p>

              <p>
                We therefore ask what planet is influencing, what it represents
                in this chart, what it is influencing and why that connection
                matters.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Drishti creates influence. Interpretation determines the nature
                of that influence.
              </p>
            </div>
          </section>

          {/* MUTUAL ASPECT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Two-way relationship
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Mutual aspect creates a stronger dialogue.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                If Planet A aspects Planet B and Planet B also aspects Planet A,
                the influence becomes mutual.
              </p>

              <p>
                Their natural significations and their house lordships become
                more directly connected.
              </p>

              <p>
                For example, planets placed opposite one another generally form
                a mutual 7th-house aspect in the Parashari system.
              </p>

              <p>
                This does not mean the relationship is automatically harmonious.
                It means the planets are strongly engaged with one another.
              </p>
            </div>
          </section>

          {/* PARIVARTANA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Exchange
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Parivartana strongly links two planetary agendas.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Suppose <strong>Mercury is in Taurus</strong> and{" "}
                  <strong>Venus is in Gemini</strong>.
                </p>

                <p>
                  Taurus belongs to Venus, so Mercury occupies Venus's sign.
                </p>

                <p>
                  Gemini belongs to Mercury, so Venus occupies Mercury's sign.
                </p>

                <p>
                  Each planet therefore sits in the domain of the other. This
                  creates an exchange known as <strong>Parivartana</strong>.
                </p>

                <p>
                  The houses ruled by Mercury and Venus can become strongly
                  interconnected.
                </p>

                <p className="font-semibold text-[#403344]">
                  But once again, a strong connection does not automatically
                  mean a comfortable one. The houses and planets involved must
                  still be judged.
                </p>
              </div>
            </div>
          </section>

          {/* LORDSHIP SAMBANDHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Connect this with Lesson 5
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              House lordship itself creates relationship.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the 10th lord occupies the 11th house.
              </p>

              <p>
                The affairs of profession and public responsibility are now
                carried into the field of gains, networks and aspirations.
              </p>

              <p>
                Now imagine the 11th lord also aspects the 10th lord.
              </p>

              <p>
                The career–gain relationship is no longer visible through only
                one factor. Another connection reinforces the same theme.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Repetition is one of the reasons an interpretation becomes more
                persuasive.
              </p>
            </div>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Suppose the 10th lord and 11th lord are conjunct.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  The <strong>10th house</strong> concerns profession, karma,
                  responsibility and visible action.
                </p>

                <p>
                  The <strong>11th house</strong> concerns gains, networks,
                  aspirations and fulfilment.
                </p>

                <p>
                  If their lords are conjunct, those two house agendas become
                  associated through the planets themselves.
                </p>

                <p>
                  We now have a meaningful{" "}
                  <strong>career–gains connection</strong>.
                </p>

                <p>But we still need more information.</p>

                <p>
                  Which planets are the two lords? In which house are they
                  conjunct? Which Rashi? How strong are they? What else do they
                  rule? What aspects the conjunction?
                </p>

                <p>
                  And if we want to know when that connection may become
                  important, which planet's Dasha is running?
                </p>

                <p className="font-semibold text-[#403344]">
                  Sambandha tells us a relationship exists. It does not remove
                  the need for synthesis.
                </p>
              </div>
            </div>
          </section>

          {/* RELEVANT HOUSES EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Why connections matter for prediction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Relevant houses need a reason to operate together.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose we are studying a career question.
              </p>

              <p>
                We may examine houses such as the 10th for profession, 6th for
                service and employment, 2nd for income and resources, and 11th
                for gains and fulfilment.
              </p>

              <p>
                Simply having these four houses in every horoscope does not
                create a career event.
              </p>

              <p>
                We look for meaningful relationships among their lords,
                occupants and significators.
              </p>

              <p>
                If those houses repeatedly connect and the relevant planets are
                later activated through Dasha and transit, the reasoning becomes
                considerably stronger.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Prediction is not “which house means job?” It is “which
                relevant houses are connected, capable and activated?”
              </p>
            </div>
          </section>

          {/* INTERPRETATION METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A practical method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should you analyse a planetary relationship?
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

          {/* CONNECTION VS RESULT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Keep the layers separate
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Connection does not tell us the final result.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Connection
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  What is related?
                </h3>

                <p className="mt-3 leading-7 text-[#65586a]">
                  Sambandha identifies the planets and house agendas that are
                  operating together.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Condition
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  How can it operate?
                </h3>

                <p className="mt-3 leading-7 text-[#65586a]">
                  Dignity, strength, dispositor and other influences help
                  describe the quality and capacity of the planets involved.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Timing
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  When is it activated?
                </h3>

                <p className="mt-3 leading-7 text-[#65586a]">
                  Dasha and transits tell us when an existing natal relationship
                  becomes especially relevant.
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
                "Do not interpret a conjunction by simply combining two planetary keywords.",
                "Do not forget the houses ruled by the planets forming the relationship.",
                "Do not assume every conjunction is equally strong without considering degree closeness and context.",
                "Do not treat every Saturn aspect as automatically harmful or every Jupiter aspect as automatically beneficial.",
                "Do not confuse one-way influence with mutual aspect.",
                "Do not assume a strong Sambandha guarantees an easy outcome.",
                "Do not treat two unrelated houses as connected merely because both are relevant to the question.",
                "Do not ignore dispositor relationships.",
                "Do not jump from one planetary relationship directly to event timing.",
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
              We can now read relationships, not just placements.
            </h2>

            <div className="mt-9 space-y-4">
              {[
                ["Graha", "Who is acting?"],
                ["Bhava", "Where in life is it acting?"],
                ["Rashi", "How does it tend to express?"],
                ["Lagna", "What role has the planet been assigned?"],
                ["Lordship", "Which areas of life does the planet carry?"],
                ["Strength", "How capable is it of carrying those agendas?"],
                [
                  "Sambandha",
                  "Which planets and life areas are genuinely connected with one another?",
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
              Lesson 7 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Sambandha describes meaningful relationships between planets and house agendas.",
                "Conjunction connects planets operating from the same house or sign.",
                "Degree closeness can refine how tightly conjunct planets interact.",
                "Graha Drishti allows planets to influence places they do not occupy.",
                "All seven visible grahas have a full 7th aspect in the common Parashari framework.",
                "Mars additionally aspects the 4th and 8th, Jupiter the 5th and 9th, and Saturn the 3rd and 10th.",
                "Mutual aspect creates a two-way planetary relationship.",
                "Parivartana creates a strong connection through exchange of signs.",
                "House lord placement itself connects the affairs of one house with another.",
                "Repeated relationships strengthen an interpretive theme, but condition and timing are still required.",
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
              Lesson 8 — Nakshatras
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We now understand planets, houses, Rashis, lordship, planetary
              condition and the relationships between grahas.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              The next layer takes us inside each Rashi.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              In Lesson 8 we will learn the <strong>27 Nakshatras</strong>,
              their lords, symbols, deities, motivations and why the nakshatra
              occupied by a planet can refine how that planet expresses its
              role.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 8 · Coming next
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
                A placement gives information. A relationship begins to create
                a story.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                We can now see not only what each planet represents, but also
                how planetary agendas interact across the horoscope.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 6: Planetary Strength
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