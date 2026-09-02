import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "The 12 Houses in Vedic Astrology: Complete Beginner Guide",
  description:
    "Learn the 12 houses in Vedic astrology, what each bhava represents, its natural significations and how houses are interpreted through lords, planets, aspects and planetary timing.",
  path: "/sarathi/learn/astrology/12-houses-vedic-astrology",
  keywords: [
    "12 Houses Vedic Astrology",
    "Houses in Vedic Astrology",
    "Bhava Meaning Astrology",
    "12 Houses Kundli",
    "Vedic Astrology Houses",
    "Jyotish Houses",
    "House Lord Vedic Astrology",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "The 12 Houses in Vedic Astrology: What Each Bhava Represents",
  description:
    "A beginner-friendly guide to the twelve houses of Jyotish, their natural significations, house classifications and the method used to interpret a house.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/12-houses-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/12-houses-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Bhava",
    "Astrological houses",
    "Kendra",
    "Trikona",
    "Dusthana",
    "Upachaya",
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
      name: "The 12 Houses",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/12-houses-vedic-astrology",
    },
  ],
};

const houses = [
  {
    number: "1st",
    sanskrit: "Tanu Bhava",
    essence: "Self · Body · Identity · Beginning",
    represents:
      "The 1st house is the starting point of the horoscope. It represents the native, physical embodiment, identity, temperament, vitality and the way a person enters and experiences life.",
    karakas: [
      "Self",
      "Physical body",
      "Appearance",
      "Identity",
      "Temperament",
      "Vitality",
      "Health",
      "Life direction",
      "Beginnings",
    ],
    body: "Head and the body as a whole",
    example:
      "If the 1st lord is placed in the 10th house, identity and personal direction may become strongly connected with profession, responsibility or public life. But the quality of that connection depends on the planet, its condition and the rest of the chart.",
  },
  {
    number: "2nd",
    sanskrit: "Dhana Bhava",
    essence: "Wealth · Family · Speech · Resources",
    represents:
      "The 2nd house concerns accumulated resources and what sustains us. It is associated with family, wealth, savings, speech, food, values and possessions.",
    karakas: [
      "Accumulated wealth",
      "Savings",
      "Family",
      "Speech",
      "Food",
      "Values",
      "Possessions",
      "Early family environment",
    ],
    body: "Face, mouth, teeth and speech-related areas",
    example:
      "A strong connection between the 2nd and 11th houses may bring income and accumulated wealth into the same pattern, but actual financial results require examination of their lords, planets, strength and timing.",
  },
  {
    number: "3rd",
    sanskrit: "Sahaja Bhava",
    essence: "Effort · Courage · Communication · Skills",
    represents:
      "The 3rd house represents self-effort, initiative, courage, communication, skills, younger siblings, short journeys and the willingness to act on one's intentions.",
    karakas: [
      "Courage",
      "Initiative",
      "Communication",
      "Writing",
      "Skills",
      "Younger siblings",
      "Short journeys",
      "Hands-on effort",
      "Enterprise",
    ],
    body: "Arms, shoulders and hands",
    example:
      "A connection between the 3rd and 10th houses can make communication, self-effort, entrepreneurship, media or particular skills important to professional life.",
  },
  {
    number: "4th",
    sanskrit: "Sukha Bhava",
    essence: "Home · Mother · Inner Comfort · Property",
    represents:
      "The 4th house represents one's emotional and physical foundations: home, mother, inner contentment, property, residence, education and the sense of having a secure base.",
    karakas: [
      "Mother",
      "Home",
      "Property",
      "Residence",
      "Vehicles",
      "Inner happiness",
      "Emotional security",
      "Basic education",
      "Homeland",
    ],
    body: "Chest, heart region and emotional centre",
    example:
      "Activation of the 4th house can manifest through home, property, vehicles, education or family circumstances. Which manifestation becomes prominent depends on the connections elsewhere in the chart.",
  },
  {
    number: "5th",
    sanskrit: "Putra Bhava",
    essence: "Intelligence · Children · Creativity · Purva Punya",
    represents:
      "The 5th house is associated with intelligence, learning, creativity, children, counsel, romance, speculation, mantra and traditionally purva punya — the merit carried from prior causes.",
    karakas: [
      "Children",
      "Intelligence",
      "Creativity",
      "Education",
      "Romance",
      "Mantra",
      "Counsel",
      "Speculation",
      "Purva punya",
    ],
    body: "Upper abdomen and digestive region",
    example:
      "Jupiter connected with the 5th may strengthen themes of knowledge, teaching or children, but it does not automatically guarantee children. The 5th lord, Jupiter, relevant divisional chart and Dasha must be considered together.",
  },
  {
    number: "6th",
    sanskrit: "Shatru / Ripu Bhava",
    essence: "Service · Conflict · Disease · Competition",
    represents:
      "The 6th house deals with circumstances that require effort and problem-solving: service, employment, competition, debts, disputes, disease, enemies and daily responsibilities.",
    karakas: [
      "Service",
      "Employment",
      "Competition",
      "Disease",
      "Debts",
      "Disputes",
      "Enemies",
      "Daily work",
      "Obstacles to overcome",
    ],
    body: "Digestive system and areas associated with illness or imbalance",
    example:
      "For employment questions, the 6th can be important because it represents service and working conditions. But career cannot be judged from the 6th alone; the 10th, 2nd, 11th and relevant timing may also matter.",
  },
  {
    number: "7th",
    sanskrit: "Yuvati / Kalatra Bhava",
    essence: "Marriage · Partnership · Others · Agreements",
    represents:
      "The 7th house stands opposite the Ascendant and represents significant others: marriage, committed partnerships, business partners, contracts and direct interaction with the world outside oneself.",
    karakas: [
      "Marriage",
      "Spouse",
      "Partnership",
      "Business partners",
      "Contracts",
      "Public dealings",
      "Agreements",
      "One-to-one relationships",
    ],
    body: "Lower abdomen and reproductive region",
    example:
      "A benefic planet in the 7th cannot by itself guarantee a happy marriage. The 7th lord, Venus or other relevant karakas, Navamsa, aspects and planetary periods must also be studied.",
  },
  {
    number: "8th",
    sanskrit: "Randhra Bhava",
    essence: "Transformation · Longevity · Hidden Matters · Vulnerability",
    represents:
      "The 8th house concerns deeper processes that are often beyond immediate control: transformation, longevity, inheritance, joint resources, hidden matters, vulnerability, sudden changes and research into what lies beneath the surface.",
    karakas: [
      "Longevity",
      "Transformation",
      "Inheritance",
      "Joint resources",
      "Hidden matters",
      "Sudden events",
      "Research",
      "Secrets",
      "Vulnerability",
    ],
    body: "Reproductive organs and deeper or hidden bodily processes",
    example:
      "An activated 8th house does not automatically mean a crisis. It may manifest through research, inheritance, financial restructuring, psychological change or another form of transformation depending on the chart.",
  },
  {
    number: "9th",
    sanskrit: "Dharma Bhava",
    essence: "Dharma · Fortune · Teachers · Higher Knowledge",
    represents:
      "The 9th house represents dharma, higher knowledge, teachers, father in many Jyotish traditions, blessings, fortune, philosophy, pilgrimage and long-distance journeys.",
    karakas: [
      "Dharma",
      "Higher learning",
      "Teachers",
      "Guru",
      "Fortune",
      "Father",
      "Philosophy",
      "Pilgrimage",
      "Long journeys",
    ],
    body: "Hips and thighs",
    example:
      "A relationship between the 9th and 10th houses can connect dharma, higher learning, mentors or long-distance experiences with profession and public responsibility.",
  },
  {
    number: "10th",
    sanskrit: "Karma Bhava",
    essence: "Career · Action · Responsibility · Public Role",
    represents:
      "The 10th house is the principal house of karma in the visible world. It represents profession, actions, responsibilities, status, authority and the contribution for which a person becomes publicly known.",
    karakas: [
      "Career",
      "Profession",
      "Work",
      "Status",
      "Authority",
      "Responsibility",
      "Public role",
      "Achievement",
      "Visible action",
    ],
    body: "Knees",
    example:
      "A strong 10th house can make professional life important, but it does not tell us the profession by itself. The 10th lord, occupants, aspects, relevant karakas, D10 and Dasha help reveal how career actually develops.",
  },
  {
    number: "11th",
    sanskrit: "Labha Bhava",
    essence: "Gains · Networks · Aspirations · Fulfilment",
    represents:
      "The 11th house represents gains, income, networks, associations, elder siblings, aspirations and the fulfilment of objectives.",
    karakas: [
      "Gains",
      "Income",
      "Networks",
      "Friends",
      "Elder siblings",
      "Aspirations",
      "Recognition from groups",
      "Fulfilment of desires",
    ],
    body: "Calves and ankles",
    example:
      "Connections between the 10th and 11th houses can link professional activity with gains, networks or fulfilment of career objectives, particularly when the relevant planets are activated.",
  },
  {
    number: "12th",
    sanskrit: "Vyaya Bhava",
    essence: "Expenditure · Withdrawal · Foreign Lands · Release",
    represents:
      "The 12th house represents expenditure, loss in the sense of letting go, withdrawal, isolation, sleep, foreign residence, institutions, contemplation and release from ordinary material involvement.",
    karakas: [
      "Expenditure",
      "Foreign lands",
      "Sleep",
      "Isolation",
      "Hospitals",
      "Retreat",
      "Spiritual withdrawal",
      "Letting go",
      "Liberation themes",
    ],
    body: "Feet",
    example:
      "A strong 12th-house connection does not automatically mean financial loss. Depending on the chart it may describe foreign residence, institutional work, spiritual retreat, expenses, sleep-related matters or work performed away from public view.",
  },
];

const classifications = [
  {
    title: "Kendra",
    houses: "1 · 4 · 7 · 10",
    description:
      "The angular houses form major structural pillars of the horoscope and relate strongly to self, home, relationships and worldly action.",
  },
  {
    title: "Trikona",
    houses: "1 · 5 · 9",
    description:
      "The trinal houses are traditionally associated with dharma, intelligence, merit, purpose and supportive flows within the chart.",
  },
  {
    title: "Dusthana",
    houses: "6 · 8 · 12",
    description:
      "These houses are associated with difficulty, disruption, vulnerability, loss or processes that require adaptation and transformation. Their meanings are not exclusively negative.",
  },
  {
    title: "Upachaya",
    houses: "3 · 6 · 10 · 11",
    description:
      "Upachaya houses are associated with growth through time, effort, competition, action and experience. Their matters can develop as a person matures.",
  },
];

const purusharthas = [
  {
    title: "Dharma",
    houses: "1 · 5 · 9",
    meaning: "Purpose, identity, intelligence, values and direction.",
  },
  {
    title: "Artha",
    houses: "2 · 6 · 10",
    meaning: "Resources, livelihood, work and material participation.",
  },
  {
    title: "Kama",
    houses: "3 · 7 · 11",
    meaning: "Desire, interaction, relationships, effort and fulfilment.",
  },
  {
    title: "Moksha",
    houses: "4 · 8 · 12",
    meaning:
      "Inner experience, emotional foundations, transformation and release.",
  },
];

const interpretationSteps = [
  {
    number: "01",
    title: "What does the house naturally represent?",
    text: "Begin with the bhava itself. Identify the life areas traditionally associated with that house.",
  },
  {
    number: "02",
    title: "Which sign occupies the house?",
    text: "The sign tells you the environment and style through which the matters of the house operate.",
  },
  {
    number: "03",
    title: "Who is the house lord?",
    text: "Identify the ruler of the sign occupying the house. This planet becomes responsible for carrying the affairs of that house.",
  },
  {
    number: "04",
    title: "Where is the house lord placed?",
    text: "The lord's placement connects the affairs of the house it rules with the house in which it sits.",
  },
  {
    number: "05",
    title: "Are any planets occupying the house?",
    text: "Occupying planets bring their own natural significations and house lordships into the affairs of the bhava.",
  },
  {
    number: "06",
    title: "Which planets influence the house?",
    text: "Aspects and other recognised relationships can modify or strengthen the themes of the house.",
  },
  {
    number: "07",
    title: "What is the condition of the lord?",
    text: "Dignity, conjunctions, aspects, dispositor and other strength factors influence how effectively the house lord can operate.",
  },
  {
    number: "08",
    title: "Is the house currently activated?",
    text: "Dasha and relevant transit activation help determine when the matters represented by a house become especially prominent.",
  },
];

export default function TwelveHousesPage() {
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
            <span className="text-[#4c3e50]">The 12 Houses</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 2 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            The 12 Houses in Vedic Astrology: Where Life Happens
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            If the grahas are the actors of a birth chart, the twelve houses
            are the areas of life in which those actors operate. Each bhava
            represents a different field of human experience.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The second principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              A house tells us <strong>what area of life</strong> we are
              examining. But the house alone does not tell us the result. We
              must examine its <strong>sign, lord, occupants, influences,
              strength and timing</strong>.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS A HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a bhava?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Sanskrit word <strong>bhava</strong> is commonly used for
                an astrological house. The horoscope is organised into twelve
                houses, beginning from the Ascendant.
              </p>

              <p>
                Each house represents a field of experience. The 2nd deals
                with matters such as family, speech and accumulated resources;
                the 7th with partnership; the 10th with karma, profession and
                visible responsibility.
              </p>

              <p>
                Houses therefore answer a fundamental question:
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Which area of life are we talking about?
              </p>
            </div>
          </section>

          {/* HOUSE VS SIGN */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Important distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              House and sign are not the same thing.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                This is one of the first distinctions a student of Jyotish
                should understand.
              </p>

              <p>
                A <strong>house</strong> represents an area of life. A{" "}
                <strong>sign</strong> describes a particular quality or mode
                of expression.
              </p>

              <p>
                The 10th house remains the 10th house whether Aries, Taurus,
                Gemini or another sign occupies it. But the sign changes its
                ruler and modifies how the affairs of that house are expressed.
              </p>

              <p>
                This is why you should not permanently associate the 1st house
                with Aries, the 2nd with Taurus, the 3rd with Gemini and so on
                when reading an individual birth chart.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                House = area of life.
                <br />
                Sign = the quality operating there.
                <br />
                House lord = the planet responsible for that house.
              </p>
            </div>
          </section>

          {/* ALL HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learn the twelve bhavas
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does each house represent?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Learn the natural domain of each house first. Later we will add
              signs, house lords, planets and relationships to understand how
              that house actually functions in a particular chart.
            </p>

            <div className="mt-12 space-y-8">
              {houses.map((house) => (
                <section
                  key={house.number}
                  className="rounded-3xl border border-[#e1d3c3] bg-white p-7 md:p-9"
                >
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.17em] text-[#9a6d58]">
                      {house.number} House
                    </p>

                    <h3 className="mt-2 text-3xl font-semibold">
                      {house.sanskrit}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-[#7c526e]">
                      {house.essence}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <h4 className="text-lg font-semibold">
                        What does the {house.number} house represent?
                      </h4>

                      <p className="mt-3 leading-8 text-[#65586a]">
                        {house.represents}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#faf5ef] p-6">
                      <h4 className="font-semibold">Natural significations</h4>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {house.karakas.map((karaka) => (
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

                  <div className="mt-6 rounded-2xl border border-[#e5d9cc] p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8b5a79]">
                      Body association
                    </p>

                    <p className="mt-3 leading-7 text-[#65586a]">
                      {house.body}
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#f4ece3] p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                      Simple example
                    </p>

                    <p className="mt-3 leading-8 text-[#584b5c]">
                      {house.example}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </section>

          {/* CLASSIFICATIONS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              House groups
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Houses also work in important groups.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Jyotish does not treat the twelve houses as twelve unrelated
              compartments. Several classical groupings help us understand
              their broader function.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {classifications.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold tracking-[0.14em] text-[#9a6d58]">
                    {group.houses}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">{group.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {group.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* PURUSHARTHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Four aims of life
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Dharma · Artha · Kama · Moksha
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Another useful way to understand the houses is through the four
              traditional aims of life.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {purusharthas.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl bg-[#f4ece3] p-6"
                >
                  <p className="text-sm font-semibold text-[#9a6d58]">
                    Houses {group.houses}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">{group.title}</h3>

                  <p className="mt-3 leading-7 text-[#65586a]">
                    {group.meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* HOUSE LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              From house meaning to chart reading
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Knowing what a house means is only the beginning.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose someone asks about career. You know that the 10th house
                is important. That does not mean you can look at the 10th house
                and immediately give a prediction.
              </p>

              <p>
                You need to know which sign occupies the 10th, which planet
                rules that sign, where the 10th lord is placed, which planets
                occupy or influence the 10th and how the broader career pattern
                is connected.
              </p>

              <p>
                Timing adds another layer: are those planets and houses
                currently activated through Dasha and relevant transits?
              </p>
            </div>
          </section>

          {/* HOW TO READ */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should you actually read a house?
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

          {/* MULTIPLE HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A major predictive principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Most life events involve more than one house.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                This is why learning isolated house meanings is not enough for
                prediction.
              </p>

              <p>
                A job opportunity may involve the 6th house of service, the
                10th of profession, the 2nd of income and the 11th of gains.
              </p>

              <p>
                Marriage naturally brings the 7th house into focus, but family,
                relationship fulfilment and the continuation of the partnership
                can connect additional houses and chart factors.
              </p>

              <p>
                Property may involve the 4th house, but finance, debt, gains or
                expenditure may become relevant depending on how the property
                is acquired.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Events emerge from relationships between houses — not from one
                house operating alone.
              </p>
            </div>
          </section>

          {/* EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Simple example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The 4th house does not simply mean “property.”
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Suppose a planetary period strongly activates the 4th house.
                </p>

                <p>
                  A beginner might immediately predict that the person will buy
                  a house.
                </p>

                <p>
                  But the 4th also represents mother, residence, emotional
                  security, vehicles, education and the domestic environment.
                </p>

                <p>
                  If the 4th connects with the 12th, relocation or living away
                  from the familiar home environment may become relevant.
                </p>

                <p>
                  If it connects strongly with financial houses and the
                  appropriate planets, property acquisition may become more
                  plausible.
                </p>

                <p>
                  If the 4th lord connects with education-related factors, the
                  activation may instead manifest through study.
                </p>

                <p className="font-semibold text-[#403344]">
                  The house gives us the field of experience. Its connections
                  help us identify the event.
                </p>
              </div>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Learning principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do not memorise houses as one-word predictions.
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                ["2nd house", "Not simply “money”"],
                ["4th house", "Not simply “property”"],
                ["5th house", "Not simply “children”"],
                ["6th house", "Not simply “disease”"],
                ["7th house", "Not simply “marriage”"],
                ["8th house", "Not simply “crisis”"],
                ["10th house", "Not simply “job”"],
                ["12th house", "Not simply “loss”"],
              ].map(([house, warning]) => (
                <div
                  key={house}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-5"
                >
                  <p className="font-semibold text-[#493b4d]">{house}</p>
                  <p className="mt-1 text-[#6a5d6e]">{warning}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 2 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "The twelve houses represent twelve broad fields of life experience.",
                "A house and a zodiac sign are not the same thing.",
                "The sign occupying a house determines its planetary lord.",
                "The house lord carries the affairs of that house wherever it is placed.",
                "Planets occupying or influencing a house modify its expression.",
                "Kendra, Trikona, Dusthana and Upachaya are important house classifications.",
                "The houses can also be understood through Dharma, Artha, Kama and Moksha.",
                "Most significant life events involve connections between several houses.",
                "Dasha and transits help determine when particular house themes become active.",
                "Never turn one house meaning into an automatic prediction.",
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
              Lesson 3 — The 12 Zodiac Signs
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We now know the <strong>actors</strong> — the grahas — and the{" "}
              <strong>areas of life</strong> — the houses.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              Next we learn the twelve Rashis: what each sign represents, its
              planetary ruler, element, modality and how a sign changes the way
              a planet or house expresses itself.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 3 · Coming next
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
                Graha tells us who. Bhava tells us where in life.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                In the next lesson, we add the Rashis and begin understanding
                how the same planet can express very differently depending on
                the sign it occupies.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/9-grahas-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 1: The 9 Grahas
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