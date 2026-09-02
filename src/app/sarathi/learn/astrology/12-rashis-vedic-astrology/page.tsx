import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "The 12 Rashis in Vedic Astrology: Complete Beginner Guide",
  description:
    "Learn the 12 Rashis in Vedic astrology, their planetary rulers, elements, movable fixed and dual nature, qualities and how zodiac signs modify planetary expression.",
  path: "/sarathi/learn/astrology/12-rashis-vedic-astrology",
  keywords: [
    "12 Rashis Vedic Astrology",
    "Zodiac Signs Vedic Astrology",
    "Rashi Meaning",
    "Vedic Astrology Signs",
    "Rashi Lords",
    "Movable Fixed Dual Signs",
    "Elements in Vedic Astrology",
    "Jyotish Signs",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "The 12 Rashis in Vedic Astrology: How Zodiac Signs Modify Expression",
  description:
    "A beginner-friendly guide to the twelve Rashis of Jyotish, their rulers, elements, modalities, qualities and their role in interpreting planets and houses.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/12-rashis-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/12-rashis-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Rashi",
    "Zodiac signs",
    "Planetary rulers",
    "Elements",
    "Movable fixed dual signs",
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
      name: "The 12 Rashis",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/12-rashis-vedic-astrology",
    },
  ],
};

const rashis = [
  {
    number: "01",
    name: "Aries",
    sanskrit: "Mesha",
    symbol: "♈",
    lord: "Mars",
    element: "Fire",
    modality: "Movable",
    gender: "Masculine",
    essence: "Initiative · Action · Independence · Beginning",
    description:
      "Mesha expresses through movement, initiative and direct action. It tends to begin rather than wait, pushing energy outward quickly and decisively.",
    constructive: [
      "Initiative",
      "Courage",
      "Independence",
      "Decisiveness",
      "Competitive drive",
    ],
    challenging: [
      "Impatience",
      "Impulsiveness",
      "Conflict",
      "Acting before reflection",
    ],
    example:
      "Mercury in Aries may make communication quicker, more direct and action-oriented. This does not automatically make someone argumentative; Mercury's house, lordship, aspects, dignity and nakshatra still matter.",
  },
  {
    number: "02",
    name: "Taurus",
    sanskrit: "Vrishabha",
    symbol: "♉",
    lord: "Venus",
    element: "Earth",
    modality: "Fixed",
    gender: "Feminine",
    essence: "Stability · Value · Resources · Preservation",
    description:
      "Vrishabha seeks stability, continuity and tangible value. It tends to consolidate rather than rush and is associated with sustaining what has already been created.",
    constructive: [
      "Patience",
      "Stability",
      "Consistency",
      "Practicality",
      "Appreciation of value",
    ],
    challenging: [
      "Resistance to change",
      "Possessiveness",
      "Stubbornness",
      "Over-attachment to comfort",
    ],
    example:
      "Mars in Taurus may pursue goals with persistence rather than immediate speed. Mars still represents action, but Taurus can make that action more sustained, practical or resistant to sudden change.",
  },
  {
    number: "03",
    name: "Gemini",
    sanskrit: "Mithuna",
    symbol: "♊",
    lord: "Mercury",
    element: "Air",
    modality: "Dual",
    gender: "Masculine",
    essence: "Communication · Curiosity · Exchange · Adaptability",
    description:
      "Mithuna expresses through information, interaction, comparison and mental movement. It is flexible and interested in connecting one idea with another.",
    constructive: [
      "Curiosity",
      "Communication",
      "Adaptability",
      "Versatility",
      "Quick learning",
    ],
    challenging: [
      "Scattered attention",
      "Restlessness",
      "Overthinking",
      "Difficulty sustaining one direction",
    ],
    example:
      "Jupiter in Gemini may expand learning through variety, discussion or multiple subjects. Jupiter remains the graha of wisdom and expansion, while Gemini changes how those qualities are expressed.",
  },
  {
    number: "04",
    name: "Cancer",
    sanskrit: "Karka",
    symbol: "♋",
    lord: "Moon",
    element: "Water",
    modality: "Movable",
    gender: "Feminine",
    essence: "Nurture · Emotion · Protection · Belonging",
    description:
      "Karka is sensitive to emotional security, belonging, protection and care. It responds strongly to environment and often expresses through nurturing or preserving emotional bonds.",
    constructive: [
      "Care",
      "Sensitivity",
      "Protectiveness",
      "Emotional awareness",
      "Adaptation",
    ],
    challenging: [
      "Emotional defensiveness",
      "Mood dependence",
      "Over-attachment",
      "Difficulty separating feeling from judgment",
    ],
    example:
      "Saturn in Cancer may bring seriousness, duty or restraint into emotional and domestic matters. That does not by itself predict an unhappy home; the complete 4th-house pattern and Saturn's chart-specific role must be assessed.",
  },
  {
    number: "05",
    name: "Leo",
    sanskrit: "Simha",
    symbol: "♌",
    lord: "Sun",
    element: "Fire",
    modality: "Fixed",
    gender: "Masculine",
    essence: "Identity · Leadership · Visibility · Creative Authority",
    description:
      "Simha expresses through identity, leadership, visibility and the desire to stand behind one's actions. It tends to consolidate personal authority rather than constantly adapt it.",
    constructive: [
      "Leadership",
      "Confidence",
      "Loyalty",
      "Creativity",
      "Sense of responsibility",
    ],
    challenging: [
      "Pride",
      "Need for recognition",
      "Rigidity of identity",
      "Difficulty accepting correction",
    ],
    example:
      "Venus in Leo may express relationships, beauty or creativity more visibly and dramatically. Whether this becomes artistic confidence, relational pride or something else depends on the rest of the chart.",
  },
  {
    number: "06",
    name: "Virgo",
    sanskrit: "Kanya",
    symbol: "♍",
    lord: "Mercury",
    element: "Earth",
    modality: "Dual",
    gender: "Feminine",
    essence: "Analysis · Refinement · Service · Discrimination",
    description:
      "Kanya examines details, separates what is useful from what is not and seeks practical improvement. It combines intellectual analysis with an earthy concern for application.",
    constructive: [
      "Analysis",
      "Precision",
      "Organisation",
      "Practical intelligence",
      "Problem-solving",
    ],
    challenging: [
      "Over-analysis",
      "Excessive criticism",
      "Anxiety over imperfections",
      "Difficulty accepting uncertainty",
    ],
    example:
      "Venus in Virgo may approach relationships, aesthetics or value with greater discernment and analysis. This alone does not define relationship quality; Venus must still be read through the full chart.",
  },
  {
    number: "07",
    name: "Libra",
    sanskrit: "Tula",
    symbol: "♎",
    lord: "Venus",
    element: "Air",
    modality: "Movable",
    gender: "Masculine",
    essence: "Balance · Exchange · Relationship · Negotiation",
    description:
      "Tula seeks balance through interaction with others. It evaluates alternatives, negotiates, compares perspectives and is strongly concerned with reciprocal exchange.",
    constructive: [
      "Diplomacy",
      "Balance",
      "Negotiation",
      "Social awareness",
      "Cooperation",
    ],
    challenging: [
      "Indecision",
      "Over-dependence on approval",
      "Avoidance of conflict",
      "Excessive comparison",
    ],
    example:
      "Mars in Libra may direct action toward negotiation, partnership or restoring balance. Mars does not stop being Mars; Libra changes the manner in which its force is expressed.",
  },
  {
    number: "08",
    name: "Scorpio",
    sanskrit: "Vrischika",
    symbol: "♏",
    lord: "Mars",
    element: "Water",
    modality: "Fixed",
    gender: "Feminine",
    essence: "Depth · Intensity · Secrecy · Transformation",
    description:
      "Vrischika concentrates energy deeply. It is associated with emotional intensity, hidden processes, investigation, endurance and transformation.",
    constructive: [
      "Depth",
      "Persistence",
      "Research ability",
      "Emotional courage",
      "Capacity for transformation",
    ],
    challenging: [
      "Secrecy",
      "Suspicion",
      "Fixation",
      "Difficulty releasing emotional intensity",
    ],
    example:
      "Mercury in Scorpio may communicate selectively and investigate beneath the surface. This may support research, strategy or depth of thought, but the final expression depends on Mercury's complete condition.",
  },
  {
    number: "09",
    name: "Sagittarius",
    sanskrit: "Dhanu",
    symbol: "♐",
    lord: "Jupiter",
    element: "Fire",
    modality: "Dual",
    gender: "Masculine",
    essence: "Meaning · Belief · Exploration · Higher Knowledge",
    description:
      "Dhanu seeks direction through knowledge, philosophy, principles and exploration. It looks beyond immediate circumstances toward a larger framework of meaning.",
    constructive: [
      "Vision",
      "Learning",
      "Optimism",
      "Principled action",
      "Exploration",
    ],
    challenging: [
      "Dogmatism",
      "Overconfidence",
      "Exaggeration",
      "Ignoring practical detail",
    ],
    example:
      "Mercury in Sagittarius may think and communicate through larger concepts, principles or broad frameworks rather than minute detail. Whether this supports teaching, philosophy or another area depends on the chart.",
  },
  {
    number: "10",
    name: "Capricorn",
    sanskrit: "Makara",
    symbol: "♑",
    lord: "Saturn",
    element: "Earth",
    modality: "Movable",
    gender: "Feminine",
    essence: "Structure · Responsibility · Ambition · Practical Achievement",
    description:
      "Makara directs effort toward structure, responsibility and measurable progress. It tends to approach life through planning, endurance and awareness of consequences.",
    constructive: [
      "Discipline",
      "Responsibility",
      "Patience",
      "Organisation",
      "Long-term ambition",
    ],
    challenging: [
      "Rigidity",
      "Pessimism",
      "Excessive burden",
      "Over-identification with achievement",
    ],
    example:
      "Sun in Capricorn may express identity and authority through responsibility, structure or achievement. It must still be read through house placement, dignity, aspects and lordship.",
  },
  {
    number: "11",
    name: "Aquarius",
    sanskrit: "Kumbha",
    symbol: "♒",
    lord: "Saturn",
    element: "Air",
    modality: "Fixed",
    gender: "Masculine",
    essence: "Systems · Networks · Ideas · Collective Structures",
    description:
      "Kumbha is concerned with systems, groups, networks and ideas that extend beyond the individual. It can be socially oriented while remaining intellectually detached.",
    constructive: [
      "Systems thinking",
      "Objectivity",
      "Community awareness",
      "Persistence of ideas",
      "Long-range thinking",
    ],
    challenging: [
      "Detachment",
      "Rigidity of ideas",
      "Social distance",
      "Over-intellectualisation",
    ],
    example:
      "Jupiter in Aquarius may expand knowledge through groups, systems, social causes or large networks. The sign shapes Jupiter's expression but does not determine its entire result.",
  },
  {
    number: "12",
    name: "Pisces",
    sanskrit: "Meena",
    symbol: "♓",
    lord: "Jupiter",
    element: "Water",
    modality: "Dual",
    gender: "Feminine",
    essence: "Sensitivity · Imagination · Surrender · Integration",
    description:
      "Meena is receptive, imaginative and concerned with what lies beyond strict boundaries. It can integrate emotion, intuition, belief and compassion.",
    constructive: [
      "Compassion",
      "Imagination",
      "Intuition",
      "Adaptability",
      "Spiritual sensitivity",
    ],
    challenging: [
      "Lack of boundaries",
      "Escapism",
      "Confusion",
      "Difficulty maintaining practical structure",
    ],
    example:
      "Mars in Pisces may direct action through intuition, compassion, imagination or less direct methods. Mars remains the graha of action; Pisces changes the style through which it operates.",
  },
];

const elements = [
  {
    name: "Fire",
    signs: "Aries · Leo · Sagittarius",
    meaning:
      "Fire emphasises initiative, inspiration, direction, visibility and the impulse to act.",
  },
  {
    name: "Earth",
    signs: "Taurus · Virgo · Capricorn",
    meaning:
      "Earth emphasises practicality, stability, material reality, organisation and tangible results.",
  },
  {
    name: "Air",
    signs: "Gemini · Libra · Aquarius",
    meaning:
      "Air emphasises communication, ideas, exchange, relationships, comparison and networks.",
  },
  {
    name: "Water",
    signs: "Cancer · Scorpio · Pisces",
    meaning:
      "Water emphasises feeling, receptivity, emotional depth, intuition and internal experience.",
  },
];

const modalities = [
  {
    name: "Movable",
    sanskrit: "Chara",
    signs: "Aries · Cancer · Libra · Capricorn",
    meaning:
      "Movable signs initiate movement. They tend to begin, change circumstances and direct energy toward action.",
  },
  {
    name: "Fixed",
    sanskrit: "Sthira",
    signs: "Taurus · Leo · Scorpio · Aquarius",
    meaning:
      "Fixed signs preserve, stabilise and sustain. They tend to hold direction once established.",
  },
  {
    name: "Dual",
    sanskrit: "Dwisvabhava",
    signs: "Gemini · Virgo · Sagittarius · Pisces",
    meaning:
      "Dual signs combine continuity with adaptability. They can evaluate, adjust and move between alternatives.",
  },
];

export default function TwelveRashisPage() {
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
            <span className="text-[#4c3e50]">The 12 Rashis</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 3 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            The 12 Rashis in Vedic Astrology: How the Signs Change Expression
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            You now know the grahas and the houses. The next layer is the
            Rashi — the zodiac sign through which a planet or house expresses
            itself.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The third principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>Graha tells us who.</strong>
              <br />
              <strong>Bhava tells us where in life.</strong>
              <br />
              <strong>Rashi tells us how that energy tends to express.</strong>
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS RASHI */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a Rashi?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The zodiac is divided into twelve signs known in Jyotish as
                <strong> Rashis</strong>.
              </p>

              <p>
                Each Rashi has a planetary ruler and a collection of
                traditional qualities including element, movable, fixed or
                dual nature, and other classifications used in interpretation.
              </p>

              <p>
                A Rashi does not represent an event by itself. Instead, it
                modifies the way the graha occupying it expresses its natural
                significations and chart-specific responsibilities.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The planet remains the actor. The sign changes the actor's
                style of expression.
              </p>
            </div>
          </section>

          {/* HOUSE VS SIGN */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Do not mix these concepts
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A sign is not a house.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Aries is not automatically the 1st house. Taurus is not
                automatically the 2nd house. Gemini is not automatically the
                3rd house.
              </p>

              <p>
                The actual house occupied by a Rashi depends on the Ascendant
                of the individual chart.
              </p>

              <p>
                For example, if Virgo rises, Virgo becomes the 1st house,
                Libra the 2nd, Scorpio the 3rd and so on.
              </p>

              <p>
                This distinction becomes crucial when we begin learning
                planetary lordship.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Do not permanently attach zodiac signs to house numbers when
                interpreting an individual horoscope.
              </p>
            </div>
          </section>

          {/* ELEMENTS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First classification
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The four elements
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The elements help describe the broad quality through which a
              Rashi operates.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {elements.map((element) => (
                <div
                  key={element.name}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold text-[#9a6d58]">
                    {element.signs}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {element.name}
                  </h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {element.meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* MODALITIES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Second classification
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Movable · Fixed · Dual
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Another important distinction is how readily a Rashi initiates,
              maintains or adapts.
            </p>

            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              {modalities.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl bg-[#f4ece3] p-6"
                >
                  <p className="text-sm font-semibold text-[#9a6d58]">
                    {item.sanskrit}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">{item.name}</h3>

                  <p className="mt-2 text-sm font-semibold text-[#7c526e]">
                    {item.signs}
                  </p>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {item.meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ALL RASHIS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learn the twelve Rashis
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does each Rashi represent?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Read these as qualities of expression, not as complete
              personality descriptions and certainly not as predictions.
            </p>

            <div className="mt-12 space-y-8">
              {rashis.map((rashi) => (
                <section
                  key={rashi.name}
                  className="rounded-3xl border border-[#e1d3c3] bg-white p-7 md:p-9"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.17em] text-[#9a6d58]">
                        Rashi {rashi.number}
                      </p>

                      <h3 className="mt-2 text-3xl font-semibold">
                        {rashi.symbol} {rashi.name}
                      </h3>

                      <p className="mt-1 text-[#7c526e]">{rashi.sanskrit}</p>
                    </div>

                    <div className="rounded-2xl bg-[#faf5ef] px-5 py-4 text-sm">
                      <p>
                        <strong>Lord:</strong> {rashi.lord}
                      </p>
                      <p className="mt-1">
                        <strong>Element:</strong> {rashi.element}
                      </p>
                      <p className="mt-1">
                        <strong>Nature:</strong> {rashi.modality}
                      </p>
                      <p className="mt-1">
                        <strong>Gender:</strong> {rashi.gender}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm font-semibold text-[#7c526e]">
                    {rashi.essence}
                  </p>

                  <p className="mt-6 max-w-3xl leading-8 text-[#65586a]">
                    {rashi.description}
                  </p>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#e5d9cc] p-6">
                      <h4 className="font-semibold">
                        Constructive expression
                      </h4>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {rashi.constructive.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-[#f4ece3] px-3 py-1.5 text-sm text-[#65586a]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#e5d9cc] p-6">
                      <h4 className="font-semibold">
                        Challenging expression
                      </h4>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {rashi.challenging.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-[#faf5ef] px-3 py-1.5 text-sm text-[#65586a]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#f4ece3] p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                      Simple example
                    </p>

                    <p className="mt-3 leading-8 text-[#584b5c]">
                      {rashi.example}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </section>

          {/* SAME PLANET DIFFERENT SIGNS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Putting the idea into practice
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The same planet can express differently in different Rashis.
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Mars in Aries
                </p>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Mars may express action more immediately, directly and
                  competitively.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Mars in Taurus
                </p>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Mars may act more steadily, persistently and with greater
                  resistance to changing course.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Mars in Libra
                </p>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Mars may direct action through negotiation, partnership,
                  comparison or the need to restore balance.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Mars remains Mars in all three cases. The Rashi changes the
                style through which Mars operates.
              </p>
            </div>
          </section>

          {/* SIGN LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The ruler matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Every Rashi belongs to a graha.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Aries and Scorpio are ruled by Mars. Taurus and Libra are ruled
                by Venus. Gemini and Virgo belong to Mercury. Sagittarius and
                Pisces belong to Jupiter. Capricorn and Aquarius belong to
                Saturn.
              </p>

              <p>
                Cancer is ruled by the Moon and Leo by the Sun.
              </p>

              <p>
                This rulership becomes extremely important because the planet
                ruling the sign occupying a house becomes the{" "}
                <strong>lord of that house</strong>.
              </p>

              <p>
                That is the bridge between our current lesson and one of the
                most important concepts in chart interpretation: planetary
                lordship.
              </p>
            </div>
          </section>

          {/* RAHU KETU */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A useful clarification
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What about Rahu and Ketu?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In the foundational rulership system taught here, the twelve
                Rashis are ruled by the seven visible grahas: Sun, Moon, Mars,
                Mercury, Jupiter, Venus and Saturn.
              </p>

              <p>
                Rahu and Ketu are extremely important in interpretation, but
                they are not required to give each of the twelve Rashis a basic
                sign lord in this framework.
              </p>

              <p>
                Different Jyotish traditions may discuss additional
                co-lordship or specialised principles. Those can be studied
                later without confusing the basic structure.
              </p>
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
                "Do not read a Rashi as though it is a complete personality profile.",
                "Do not treat a sign placement as a guaranteed life event.",
                "Do not permanently equate Aries with the 1st house, Taurus with the 2nd and so on.",
                "Do not ignore the planetary lord of the Rashi.",
                "Do not say a planet is automatically good or bad merely because of the sign name.",
                "Do not interpret a planet in a sign without checking the house it occupies.",
                "Do not forget that dignity, aspects, conjunctions, nakshatra and lordship can substantially modify expression.",
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

          {/* SIMPLE SYNTHESIS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Begin combining the layers
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Graha + Bhava + Rashi
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Suppose <strong>Mercury</strong> is placed in the{" "}
                  <strong>10th house</strong> in <strong>Gemini</strong>.
                </p>

                <p>
                  Mercury naturally represents communication, analysis,
                  business, learning and information.
                </p>

                <p>
                  The 10th house brings those themes into profession,
                  responsibility, public action and visible contribution.
                </p>

                <p>
                  Gemini gives Mercury an adaptable, communicative and
                  information-oriented environment.
                </p>

                <p>
                  This may make communication, analysis, commerce, writing,
                  advisory work or information exchange relevant to career.
                </p>

                <p>
                  But we still cannot declare the profession from these three
                  facts alone.
                </p>

                <p>
                  We would next need to examine Mercury's lordship, condition,
                  relationships, nakshatra, D10 and timing.
                </p>

                <p className="font-semibold text-[#403344]">
                  Astrology becomes meaningful when layers are combined
                  carefully rather than interpreted in isolation.
                </p>
              </div>
            </div>
          </section>

          {/* SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 3 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "The zodiac is divided into twelve Rashis.",
                "A Rashi describes the style or environment through which a graha expresses itself.",
                "A sign and a house are not the same thing.",
                "Every Rashi has a planetary ruler.",
                "Fire, Earth, Air and Water describe broad elemental qualities.",
                "Movable, Fixed and Dual describe different patterns of movement and adaptation.",
                "A planet never loses its fundamental nature simply because it occupies a particular sign.",
                "The same graha can express differently in different Rashis.",
                "A Rashi placement is not a complete prediction.",
                "Graha + Bhava + Rashi is only the beginning of chart synthesis.",
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
              Lesson 4 — Ascendant & Chart Structure
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              You now know the <strong>grahas</strong>, the{" "}
              <strong>bhavas</strong> and the <strong>Rashis</strong>.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              The next question is: how do we know which Rashi becomes the 1st
              house, which becomes the 2nd, and which planets become the lords
              of the different houses?
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              That begins with the <strong>Ascendant — Lagna</strong>.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 4 · Coming next
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
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Next we introduce the Lagna — the point that anchors the entire
                horoscope and determines where each Rashi and planetary
                lordship falls in an individual birth chart.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 2: The 12 Houses
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