import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "The 9 Grahas in Vedic Astrology: Complete Beginner Guide",
  description:
    "Learn the 9 grahas in Vedic astrology: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu. Understand their meanings, karakatwas, life areas and how planets actually give results.",
  path: "/sarathi/learn/astrology/9-grahas-vedic-astrology",
  keywords: [
    "9 Grahas Vedic Astrology",
    "Planets in Vedic Astrology",
    "Navagraha Meaning",
    "Graha Karaka",
    "Sun Moon Mars Mercury Jupiter Venus Saturn Rahu Ketu",
    "Jyotish Planets",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "The 9 Grahas in Vedic Astrology: What the Planets Really Represent",
  description:
    "A beginner-friendly guide to the nine grahas of Jyotish, their natural significations, karakatwas, constructive and difficult expressions, and how their results change from chart to chart.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/9-grahas-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/9-grahas-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Navagraha",
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
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
      name: "The 9 Grahas",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/9-grahas-vedic-astrology",
    },
  ],
};

const grahas = [
  {
    name: "Sun",
    sanskrit: "Surya",
    symbol: "☉",
    essence: "Identity · Authority · Vitality · Recognition",
    represents:
      "The Sun represents the centralising principle of the chart: identity, self-expression, authority, dignity, confidence, vitality and the desire to stand in one's own light.",
    karakas: [
      "Father",
      "Authority",
      "Government",
      "Leadership",
      "Status",
      "Recognition",
      "Vitality",
      "Self-respect",
      "Public responsibility",
    ],
    constructive:
      "A well-supported Sun can show confidence, responsibility, clarity of identity, leadership, independence and the ability to carry authority without needing constant validation.",
    challenging:
      "A difficult Sun expression may involve conflicts with authority, excessive pride, insecurity around recognition, difficulty accepting direction, or struggles connected with identity and self-worth.",
    example:
      "Suppose the Sun is strongly connected with the 10th house. Leadership, visibility or responsibility may become important professional themes. But this does not automatically mean the person becomes a senior executive. The Sun's house lordship, sign, aspects, Dasha and the rest of the career pattern must support that outcome.",
  },
  {
    name: "Moon",
    sanskrit: "Chandra",
    symbol: "☾",
    essence: "Mind · Emotion · Adaptability · Nourishment",
    represents:
      "The Moon represents the receptive and responsive mind. It describes emotional experience, habits, sensitivity, comfort, memory, adaptation and the way we respond to changing circumstances.",
    karakas: [
      "Mother",
      "Mind",
      "Emotions",
      "Nourishment",
      "Home comfort",
      "Public response",
      "Memory",
      "Fluidity",
      "Care",
    ],
    constructive:
      "A supported Moon can show emotional responsiveness, empathy, adaptability, good instinct, receptivity and an ability to connect with people and changing environments.",
    challenging:
      "A pressured Moon may show emotional fluctuation, excessive sensitivity, restlessness, difficulty settling internally or a tendency for circumstances to strongly affect one's state of mind.",
    example:
      "A Moon connected with the 10th house can make public interaction, people management, care, hospitality or changing professional circumstances more important. Its actual manifestation depends on the Moon's sign, phase, house lordship, aspects and planetary periods.",
  },
  {
    name: "Mars",
    sanskrit: "Mangala",
    symbol: "♂",
    essence: "Action · Courage · Force · Competition",
    represents:
      "Mars represents action, drive, physical energy, courage, assertion, competition and the capacity to cut through resistance. It shows where we fight, act, defend and pursue.",
    karakas: [
      "Courage",
      "Siblings",
      "Land",
      "Property",
      "Engineering",
      "Weapons",
      "Competition",
      "Physical strength",
      "Initiative",
    ],
    constructive:
      "A well-directed Mars can produce courage, initiative, decisiveness, technical ability, stamina and the willingness to take action under pressure.",
    challenging:
      "A difficult Mars expression may produce impatience, conflict, excessive aggression, impulsive action, competitiveness without strategy or energy that is difficult to contain.",
    example:
      "Mars in the 10th house may support ambition, technical work, leadership or competitive professions. But for one Ascendant Mars may rule favourable houses, while for another it may carry very different responsibilities. The same placement therefore cannot produce one universal result.",
  },
  {
    name: "Mercury",
    sanskrit: "Budha",
    symbol: "☿",
    essence: "Intellect · Communication · Analysis · Commerce",
    represents:
      "Mercury represents discrimination, language, calculation, learning, communication, adaptability, trade and the ability to process information.",
    karakas: [
      "Intellect",
      "Speech",
      "Communication",
      "Writing",
      "Mathematics",
      "Commerce",
      "Business",
      "Analysis",
      "Learning",
    ],
    constructive:
      "A supported Mercury can show curiosity, clear communication, commercial intelligence, analytical ability, versatility and the capacity to learn quickly.",
    challenging:
      "A pressured Mercury can show scattered thinking, over-analysis, nervousness, inconsistency, excessive calculation or communication that lacks clarity.",
    example:
      "Mercury connected with the 2nd, 3rd, 7th, 10th or 11th houses may strengthen themes of communication, trade or commercial interaction. But whether this becomes banking, technology, consulting, writing or business depends on the wider chart.",
  },
  {
    name: "Jupiter",
    sanskrit: "Guru / Brihaspati",
    symbol: "♃",
    essence: "Wisdom · Expansion · Guidance · Meaning",
    represents:
      "Jupiter represents expansion through knowledge, judgment, wisdom, ethics, guidance, faith and the ability to see a broader meaning or possibility.",
    karakas: [
      "Wisdom",
      "Teachers",
      "Children",
      "Knowledge",
      "Counsel",
      "Dharma",
      "Prosperity",
      "Faith",
      "Higher learning",
    ],
    constructive:
      "A well-supported Jupiter can give sound judgment, optimism, generosity, teaching ability, perspective, ethical awareness and a desire to grow through knowledge.",
    challenging:
      "A difficult Jupiter expression may show excess, overconfidence, poor judgment disguised as certainty, ideological rigidity, misplaced generosity or expansion without sufficient discipline.",
    example:
      "Jupiter influencing the 5th house may strengthen education, teaching, creativity or themes involving children. But it does not automatically guarantee children or academic success. The relevant houses, lords, divisional charts and Dasha must also be examined.",
  },
  {
    name: "Venus",
    sanskrit: "Shukra",
    symbol: "♀",
    essence: "Relationship · Harmony · Pleasure · Value",
    represents:
      "Venus represents attraction, relationship, pleasure, beauty, art, comfort, agreement, refinement and the values through which we seek enjoyment and harmony.",
    karakas: [
      "Relationships",
      "Marriage",
      "Love",
      "Beauty",
      "Art",
      "Luxury",
      "Comfort",
      "Vehicles",
      "Pleasure",
    ],
    constructive:
      "A supported Venus can show diplomacy, appreciation of beauty, relationship skills, creativity, refinement, enjoyment and an ability to create harmony.",
    challenging:
      "A difficult Venus expression may involve excessive indulgence, dependency on approval, complicated relationships, material attachment or difficulty distinguishing pleasure from genuine value.",
    example:
      "A prominent Venus does not automatically mean a happy marriage. Marriage analysis also requires the 7th house, 7th lord, relevant karakas, Navamsa and planetary timing.",
  },
  {
    name: "Saturn",
    sanskrit: "Shani",
    symbol: "♄",
    essence: "Time · Discipline · Responsibility · Endurance",
    represents:
      "Saturn represents limitation, time, structure, responsibility, labour, endurance, maturity and the consequences of sustained effort.",
    karakas: [
      "Time",
      "Discipline",
      "Labour",
      "Service",
      "Delay",
      "Old age",
      "Responsibility",
      "Endurance",
      "Structure",
    ],
    constructive:
      "A mature Saturn can produce patience, discipline, realism, endurance, accountability and the ability to build something slowly but sustainably.",
    challenging:
      "A difficult Saturn expression can manifest as fear, delay, isolation, pessimism, excessive burden, rigidity or the feeling of being restricted by circumstances.",
    example:
      "Saturn connected with the 10th house can create enormous professional responsibility and endurance. In one chart this may build long-term authority; in another it may first create delays or heavy obligations before stability develops.",
  },
  {
    name: "Rahu",
    sanskrit: "Rahu",
    symbol: "☊",
    essence: "Desire · Amplification · Unconventionality · Obsession",
    represents:
      "Rahu is the north lunar node and is treated as a graha in Jyotish. It is often associated with amplification, appetite, fascination, ambition, unconventional paths, foreign or unfamiliar environments and experiences that push beyond established boundaries.",
    karakas: [
      "Foreign influences",
      "Unconventional paths",
      "Ambition",
      "Obsession",
      "Technology",
      "Mass influence",
      "Illusion",
      "Breaking boundaries",
      "Unusual circumstances",
    ],
    constructive:
      "A well-directed Rahu can produce innovation, ambition, courage to enter unfamiliar territory, international exposure, technological interest and the ability to challenge convention.",
    challenging:
      "A difficult Rahu expression may involve obsession, dissatisfaction, confusion, exaggeration, shortcuts, distorted perception or the feeling that no achievement is ever enough.",
    example:
      "Rahu in the 10th house is sometimes described as automatically producing fame or an unconventional career. That is far too simple. Its result depends heavily on the sign, house lord, nakshatra lord, dispositor, associations and running Dasha.",
  },
  {
    name: "Ketu",
    sanskrit: "Ketu",
    symbol: "☋",
    essence: "Detachment · Separation · Insight · Internalisation",
    represents:
      "Ketu is the south lunar node and is treated as a graha in Jyotish. It is associated with detachment, separation, internalisation, sharp perception, past familiarity and the tendency to withdraw from conventional forms of fulfilment.",
    karakas: [
      "Detachment",
      "Separation",
      "Spiritual inquiry",
      "Introspection",
      "Sharp perception",
      "Research",
      "Mysticism",
      "Non-attachment",
      "Unusual insight",
    ],
    constructive:
      "A supported Ketu can show penetrating insight, independence from external approval, research ability, spiritual depth and the capacity to see through superficial appearances.",
    challenging:
      "A difficult Ketu expression can produce disconnection, aimlessness, dissatisfaction, abrupt separation, withdrawal or difficulty engaging fully with the area of life it influences.",
    example:
      "Ketu connected with career does not necessarily mean the person leaves their profession. It may create detachment from recognition, a specialised role, repeated changes in professional interest or a search for more meaningful work depending on the rest of the chart.",
  },
];

const modifiers = [
  {
    title: "House",
    text: "The house tells you the area of life in which the planet is operating.",
  },
  {
    title: "Sign",
    text: "The sign changes the style, environment and condition through which the planet expresses itself.",
  },
  {
    title: "House lordship",
    text: "The houses ruled by the planet determine which life areas that planet carries with it in a particular chart.",
  },
  {
    title: "Nakshatra",
    text: "The nakshatra and its lord add another layer of planetary connection and expression.",
  },
  {
    title: "Conjunctions & aspects",
    text: "Other planets can support, redirect, intensify or complicate the planet's expression.",
  },
  {
    title: "Dispositor",
    text: "The condition of the planet ruling the sign of placement influences how effectively the graha can operate.",
  },
  {
    title: "Divisional charts",
    text: "Relevant vargas refine how a planetary theme operates in specific areas of life.",
  },
  {
    title: "Dasha",
    text: "A planet becomes especially important when it is activated through a running planetary period.",
  },
];

const quickReference = [
  ["Sun", "Identity, authority, vitality, father, status"],
  ["Moon", "Mind, emotions, mother, nourishment, adaptation"],
  ["Mars", "Action, courage, competition, property, force"],
  ["Mercury", "Intellect, speech, learning, business, analysis"],
  ["Jupiter", "Wisdom, teachers, children, growth, counsel"],
  ["Venus", "Relationships, pleasure, beauty, comfort, art"],
  ["Saturn", "Time, discipline, labour, responsibility, endurance"],
  ["Rahu", "Desire, amplification, foreignness, ambition, disruption"],
  ["Ketu", "Detachment, separation, insight, internalisation"],
];

export default function NineGrahasPage() {
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
            <span className="text-[#4c3e50]">The 9 Grahas</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 1 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            The 9 Grahas in Vedic Astrology: What the Planets Really Represent
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Before learning houses, signs, dashas or prediction, begin with the
            nine grahas. They are the fundamental actors of a Vedic birth
            chart — each representing particular forces, experiences and areas
            of life.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The first principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              A planet has <strong>natural significations</strong>, but those
              significations are not predictions by themselves. The actual
              result of a graha depends on{" "}
              <strong>
                what it represents, which houses it rules, where it is placed,
                its condition, its relationships and whether it is activated
                by planetary timing.
              </strong>
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS A GRAHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the language
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a graha?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In Jyotish, the word <strong>graha</strong> is broader than the
                modern astronomical word “planet.”
              </p>

              <p>
                The nine grahas used in traditional Vedic astrology are the
                Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu.
              </p>

              <p>
                Astronomically, the Sun is a star and the Moon is a natural
                satellite. Rahu and Ketu are not physical planets at all; they
                correspond to the lunar nodes.
              </p>

              <p>
                Yet all nine are treated as grahas because Jyotish is concerned
                with their symbolic and interpretive role within the
                astrological system.
              </p>
            </div>
          </section>

          {/* KARAKA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              An essential concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does “karaka” mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A <strong>karaka</strong> is a significator — something that
                naturally represents a person, experience, quality or area of
                life.
              </p>

              <p>
                For example, the Sun is traditionally connected with father,
                authority and status. The Moon is associated with mother and
                mind. Venus signifies relationships and pleasures. Jupiter has
                associations with teachers, knowledge and children.
              </p>

              <p>
                These natural significations give us a starting vocabulary for
                understanding the planets.
              </p>

              <p className="font-semibold text-[#493b4d]">
                But karakatwa is not the same thing as prediction.
              </p>

              <p>
                Venus being a relationship karaka does not mean that simply
                having a strong Venus guarantees a happy marriage. Marriage
                requires examination of the relevant houses, house lords,
                planetary relationships, divisional charts and timing.
              </p>
            </div>
          </section>

          {/* QUICK REFERENCE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick reference
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The nine grahas at a glance
            </h2>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#e3d5c5] bg-white">
              {quickReference.map(([planet, meaning], index) => (
                <div
                  key={planet}
                  className={`grid gap-2 px-6 py-5 md:grid-cols-[140px_1fr] ${
                    index !== quickReference.length - 1
                      ? "border-b border-[#eee3d7]"
                      : ""
                  }`}
                >
                  <p className="font-semibold text-[#493b4d]">{planet}</p>
                  <p className="leading-7 text-[#6a5d6e]">{meaning}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm leading-6 text-[#817483]">
              Use this only as a memory aid. Real interpretation requires much
              more than matching a planet with a keyword.
            </p>
          </section>

          {/* INDIVIDUAL GRAHAS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learn each graha
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does each planet represent?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Begin by learning the natural language of each graha. Later we
              will learn how signs, houses and house lordship modify these
              meanings.
            </p>

            <div className="mt-12 space-y-8">
              {grahas.map((graha, index) => (
                <section
                  key={graha.name}
                  id={graha.name.toLowerCase()}
                  className="rounded-3xl border border-[#e1d3c3] bg-white p-7 md:p-9"
                >
                  <div className="flex items-start gap-5">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#f4ece3] text-2xl text-[#633354]">
                      {graha.symbol}
                    </div>

                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.17em] text-[#9a6d58]">
                        Graha {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-1 text-3xl font-semibold">
                        {graha.name}{" "}
                        <span className="font-normal text-[#756879]">
                          · {graha.sanskrit}
                        </span>
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[#7c526e]">
                        {graha.essence}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <h4 className="text-lg font-semibold">
                        What does {graha.name} represent?
                      </h4>

                      <p className="mt-3 leading-8 text-[#65586a]">
                        {graha.represents}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#faf5ef] p-6">
                      <h4 className="font-semibold">
                        Natural karakatwas
                      </h4>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {graha.karakas.map((karaka) => (
                          <span
                            key={karaka}
                            className="rounded-full border border-[#e1d3c3] bg-white px-3 py-1.5 text-sm text-[#65586a]"
                          >
                            {karaka}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#e5d9cc] p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8b5a79]">
                        Constructive expression
                      </p>

                      <p className="mt-3 leading-7 text-[#65586a]">
                        {graha.constructive}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#e5d9cc] p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8b5a79]">
                        Difficult expression
                      </p>

                      <p className="mt-3 leading-7 text-[#65586a]">
                        {graha.challenging}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#f4ece3] p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                      Simple example
                    </p>

                    <p className="mt-3 leading-8 text-[#584b5c]">
                      {graha.example}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </section>

          {/* NATURAL VS FUNCTIONAL */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A crucial distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Natural meaning and chart-specific role are not the same thing.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Every graha has natural significations. Mars always carries
                themes such as action and courage. Venus always retains an
                association with relationship, attraction and pleasure.
              </p>

              <p>
                But once an Ascendant is known, planets also become{" "}
                <strong>lords of particular houses</strong>.
              </p>

              <p>
                This gives them a chart-specific role.
              </p>

              <p>
                The same Mars may rule one set of houses for an Aries
                Ascendant and an entirely different set for a Virgo Ascendant.
                Its functional role therefore changes even though Mars remains
                Mars.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Natural karakatwa tells you what a planet represents.
                House lordship tells you what that planet is responsible for
                in this particular chart.
              </p>
            </div>
          </section>

          {/* GOOD OR BAD */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Is any planet simply good or bad?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Beginners often learn Jupiter and Venus as “benefics” and
                Saturn and Mars as “malefics.” Those classifications are useful
                in classical interpretation, but they should not become a
                shortcut for judging an entire chart.
              </p>

              <p>
                Saturn can give extraordinary discipline, longevity of effort
                and professional authority. Mars can provide courage and the
                ability to act under pressure.
              </p>

              <p>
                Jupiter can sometimes expand something undesirable. Venus can
                increase indulgence or attachment.
              </p>

              <p>
                A better question is therefore not simply{" "}
                <strong>“Is this planet good?”</strong>
              </p>

              <p className="font-semibold text-[#493b4d]">
                Ask: What is this planet responsible for in this chart, how
                strong is it, what influences it, and what is it currently
                being asked to deliver?
              </p>
            </div>
          </section>

          {/* MODIFIERS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              From meaning to interpretation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What changes the result of a planet?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Knowing the natural meaning of a graha is only the first layer.
              The next stages of this course will teach you how the following
              factors modify its result.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {modifiers.map((modifier) => (
                <div
                  key={modifier.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{modifier.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {modifier.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learn to reason
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              One planet can produce very different outcomes.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine two people both have Saturn strongly connected with
                  their 10th house.
                </p>

                <p>
                  A beginner might immediately predict delayed career growth
                  because Saturn signifies delay.
                </p>

                <p>
                  But Saturn also represents structure, responsibility,
                  persistence and endurance.
                </p>

                <p>
                  In one chart Saturn may eventually give a highly stable
                  position with considerable authority because the rest of the
                  career pattern supports it.
                </p>

                <p>
                  In another chart Saturn may connect career with heavy
                  obligations, repeated delays or a profession requiring long
                  periods of patient effort.
                </p>

                <p className="font-semibold text-[#403344]">
                  The planet gives us the vocabulary. The chart gives us the
                  sentence.
                </p>
              </div>
            </div>
          </section>

          {/* DON'T MEMORISE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learning principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do not memorise planets as predictions.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                It is useful to memorise the natural language of each graha.
                But avoid turning those meanings into automatic predictions.
              </p>

              <p>
                Do not learn:
              </p>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="leading-8 text-[#65586a]">
                  “Saturn means delay.”
                  <br />
                  “Jupiter means wealth.”
                  <br />
                  “Venus means marriage.”
                  <br />
                  “Rahu means foreign settlement.”
                </p>
              </div>

              <p>
                Instead learn:
              </p>

              <div className="rounded-2xl bg-[#4b2744] p-7 text-white">
                <p className="text-lg font-semibold leading-8">
                  What does this planet naturally represent → what houses does
                  it rule → where is it placed → what modifies it → what does
                  it connect with → is it currently activated?
                </p>
              </div>
            </div>
          </section>

          {/* LESSON SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 1 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember before moving forward?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Jyotish works with nine grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu.",
                "Each graha has natural significations or karakatwas.",
                "Karakatwa gives meaning; it does not by itself give a prediction.",
                "A planet can express constructively or difficultly depending on its condition and chart context.",
                "House lordship gives a planet a chart-specific responsibility.",
                "House, sign, nakshatra, aspects, conjunctions and dispositor relationships modify planetary expression.",
                "Dasha determines when a planet becomes especially active.",
                "Never reduce a chart to one planet or one keyword.",
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

          {/* NEXT LESSON */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Next lesson
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Lesson 2 — The 12 Houses in Vedic Astrology
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Now that you know who the actors are, the next step is to
              understand the stage on which they operate.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              We will learn what each of the twelve houses represents, how
              houses are grouped, what kinds of life events they describe and
              why one house should never be interpreted in isolation.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 2 · Coming next
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Learn before you predict
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Astrology becomes clearer when you understand the building
                blocks before combining them.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Continue through the Sārathi learning path step by step. Later,
                we will bring planets, houses, signs, lordship, nakshatras,
                dashas and transits together into complete chart
                interpretation.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#4b2744]"
                >
                  Back to Knowledge Centre
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}