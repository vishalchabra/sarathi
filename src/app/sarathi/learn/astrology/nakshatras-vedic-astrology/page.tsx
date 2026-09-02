import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Nakshatras in Vedic Astrology: Complete Beginner Guide",
  description:
    "Learn the 27 Nakshatras in Vedic astrology, their lords, deities, symbols, Shakti, padas and how Nakshatras refine planetary expression in a birth chart.",
  path: "/sarathi/learn/astrology/nakshatras-vedic-astrology",
  keywords: [
    "27 Nakshatras Vedic Astrology",
    "Nakshatra Meaning",
    "Nakshatra Lords",
    "Nakshatra Pada",
    "Nakshatra Deities",
    "Nakshatra Shakti",
    "Lunar Mansions Vedic Astrology",
    "Nakshatra Astrology for Beginners",
    "Jyotish Nakshatras",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Nakshatras in Vedic Astrology: Understanding the 27 Lunar Mansions",
  description:
    "A beginner-friendly guide to the 27 Nakshatras, their planetary rulers, deities, symbols, Shakti, padas and their role in chart interpretation.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/nakshatras-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/nakshatras-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Nakshatras",
    "Lunar mansions",
    "Nakshatra lords",
    "Nakshatra padas",
    "Jyotish",
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
      name: "Nakshatras",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/nakshatras-vedic-astrology",
    },
  ],
};

const nakshatras = [
  {
    number: "01",
    name: "Ashwini",
    range: "0°00′ – 13°20′ Aries",
    lord: "Ketu",
    deity: "Ashwini Kumaras",
    symbol: "Horse's head",
    shakti: "Power to quickly reach or heal",
    theme:
      "Beginnings, speed, movement, recovery, initiative and the impulse to act.",
  },
  {
    number: "02",
    name: "Bharani",
    range: "13°20′ – 26°40′ Aries",
    lord: "Venus",
    deity: "Yama",
    symbol: "Yoni",
    shakti: "Power to carry things away",
    theme:
      "Containment, responsibility, endurance, consequences, transformation and bearing weight.",
  },
  {
    number: "03",
    name: "Krittika",
    range: "26°40′ Aries – 10°00′ Taurus",
    lord: "Sun",
    deity: "Agni",
    symbol: "Razor or flame",
    shakti: "Power to burn or purify",
    theme:
      "Cutting, refining, purification, discernment, protection and separating what is useful from what is not.",
  },
  {
    number: "04",
    name: "Rohini",
    range: "10°00′ – 23°20′ Taurus",
    lord: "Moon",
    deity: "Prajapati",
    symbol: "Chariot or growing plant",
    shakti: "Power to make things grow",
    theme:
      "Growth, fertility, beauty, nourishment, productivity, attraction and development.",
  },
  {
    number: "05",
    name: "Mrigashira",
    range: "23°20′ Taurus – 6°40′ Gemini",
    lord: "Mars",
    deity: "Soma",
    symbol: "Deer's head",
    shakti: "Power to give fulfilment",
    theme:
      "Searching, curiosity, movement, exploration, refinement and the pursuit of something meaningful.",
  },
  {
    number: "06",
    name: "Ardra",
    range: "6°40′ – 20°00′ Gemini",
    lord: "Rahu",
    deity: "Rudra",
    symbol: "Teardrop",
    shakti: "Power of effort",
    theme:
      "Intensity, disruption, emotional release, storms, investigation, change and rebuilding.",
  },
  {
    number: "07",
    name: "Punarvasu",
    range: "20°00′ Gemini – 3°20′ Cancer",
    lord: "Jupiter",
    deity: "Aditi",
    symbol: "Quiver of arrows",
    shakti: "Power to restore what was lost",
    theme:
      "Renewal, return, restoration, optimism, repetition and finding one's way back.",
  },
  {
    number: "08",
    name: "Pushya",
    range: "3°20′ – 16°40′ Cancer",
    lord: "Saturn",
    deity: "Brihaspati",
    symbol: "Cow's udder or flower",
    shakti: "Power to create spiritual energy",
    theme:
      "Nourishment, support, discipline, teaching, responsibility and sustaining growth.",
  },
  {
    number: "09",
    name: "Ashlesha",
    range: "16°40′ – 30°00′ Cancer",
    lord: "Mercury",
    deity: "Nagas",
    symbol: "Coiled serpent",
    shakti: "Power to inflict with poison",
    theme:
      "Penetration, entanglement, strategy, psychological depth, secrecy and binding forces.",
  },
  {
    number: "10",
    name: "Magha",
    range: "0°00′ – 13°20′ Leo",
    lord: "Ketu",
    deity: "Pitris",
    symbol: "Royal throne",
    shakti: "Power to leave the body",
    theme:
      "Ancestors, lineage, inheritance, authority, tradition, dignity and connection with the past.",
  },
  {
    number: "11",
    name: "Purva Phalguni",
    range: "13°20′ – 26°40′ Leo",
    lord: "Venus",
    deity: "Bhaga",
    symbol: "Front legs of a bed",
    shakti: "Power of procreation",
    theme:
      "Pleasure, creativity, attraction, enjoyment, relationships, relaxation and self-expression.",
  },
  {
    number: "12",
    name: "Uttara Phalguni",
    range: "26°40′ Leo – 10°00′ Virgo",
    lord: "Sun",
    deity: "Aryaman",
    symbol: "Back legs of a bed",
    shakti: "Power of prosperity through union",
    theme:
      "Commitment, agreements, responsibility, partnership, patronage and sustained bonds.",
  },
  {
    number: "13",
    name: "Hasta",
    range: "10°00′ – 23°20′ Virgo",
    lord: "Moon",
    deity: "Savitar",
    symbol: "Hand",
    shakti: "Power to manifest what is sought",
    theme:
      "Skill, craftsmanship, control, dexterity, practical intelligence and shaping outcomes.",
  },
  {
    number: "14",
    name: "Chitra",
    range: "23°20′ Virgo – 6°40′ Libra",
    lord: "Mars",
    deity: "Tvashtar",
    symbol: "Bright jewel",
    shakti: "Power to accumulate merit",
    theme:
      "Design, beauty, construction, individuality, refinement, brilliance and visible form.",
  },
  {
    number: "15",
    name: "Swati",
    range: "6°40′ – 20°00′ Libra",
    lord: "Rahu",
    deity: "Vayu",
    symbol: "Young plant in the wind",
    shakti: "Power to scatter like the wind",
    theme:
      "Independence, movement, flexibility, commerce, adaptation and learning through freedom.",
  },
  {
    number: "16",
    name: "Vishakha",
    range: "20°00′ Libra – 3°20′ Scorpio",
    lord: "Jupiter",
    deity: "Indra and Agni",
    symbol: "Triumphal arch",
    shakti: "Power to achieve goals",
    theme:
      "Ambition, focus, determination, competition, branching paths and pursuing results.",
  },
  {
    number: "17",
    name: "Anuradha",
    range: "3°20′ – 16°40′ Scorpio",
    lord: "Saturn",
    deity: "Mitra",
    symbol: "Lotus",
    shakti: "Power of worship or devotion",
    theme:
      "Friendship, loyalty, devotion, organisation, perseverance and cooperation through difficulty.",
  },
  {
    number: "18",
    name: "Jyeshtha",
    range: "16°40′ – 30°00′ Scorpio",
    lord: "Mercury",
    deity: "Indra",
    symbol: "Earring or umbrella",
    shakti: "Power to rise and conquer",
    theme:
      "Seniority, protection, responsibility, influence, strategy and carrying authority.",
  },
  {
    number: "19",
    name: "Mula",
    range: "0°00′ – 13°20′ Sagittarius",
    lord: "Ketu",
    deity: "Nirriti",
    symbol: "Tied bundle of roots",
    shakti: "Power to destroy or uproot",
    theme:
      "Roots, investigation, deconstruction, truth-seeking, foundations and getting beneath appearances.",
  },
  {
    number: "20",
    name: "Purva Ashadha",
    range: "13°20′ – 26°40′ Sagittarius",
    lord: "Venus",
    deity: "Apas",
    symbol: "Winnowing basket or fan",
    shakti: "Power to invigorate",
    theme:
      "Conviction, purification, persuasion, renewal, confidence and defending one's principles.",
  },
  {
    number: "21",
    name: "Uttara Ashadha",
    range: "26°40′ Sagittarius – 10°00′ Capricorn",
    lord: "Sun",
    deity: "Vishvadevas",
    symbol: "Elephant tusk",
    shakti: "Power to grant unchallengeable victory",
    theme:
      "Duty, endurance, lasting achievement, responsibility, leadership and principles.",
  },
  {
    number: "22",
    name: "Shravana",
    range: "10°00′ – 23°20′ Capricorn",
    lord: "Moon",
    deity: "Vishnu",
    symbol: "Ear",
    shakti: "Power of connection",
    theme:
      "Listening, learning, transmission, reputation, movement, knowledge and following a path.",
  },
  {
    number: "23",
    name: "Dhanishtha",
    range: "23°20′ Capricorn – 6°40′ Aquarius",
    lord: "Mars",
    deity: "Eight Vasus",
    symbol: "Drum",
    shakti: "Power to give abundance and fame",
    theme:
      "Rhythm, achievement, resources, community, performance and coordinated action.",
  },
  {
    number: "24",
    name: "Shatabhisha",
    range: "6°40′ – 20°00′ Aquarius",
    lord: "Rahu",
    deity: "Varuna",
    symbol: "Empty circle",
    shakti: "Power of healing",
    theme:
      "Healing, secrecy, research, boundaries, isolation, systems and uncovering hidden patterns.",
  },
  {
    number: "25",
    name: "Purva Bhadrapada",
    range: "20°00′ Aquarius – 3°20′ Pisces",
    lord: "Jupiter",
    deity: "Aja Ekapada",
    symbol: "Front legs of a funeral cot",
    shakti: "Power to elevate through spiritual fire",
    theme:
      "Intensity, idealism, transformation, conviction, sacrifice and movement toward deeper meaning.",
  },
  {
    number: "26",
    name: "Uttara Bhadrapada",
    range: "3°20′ – 16°40′ Pisces",
    lord: "Saturn",
    deity: "Ahir Budhnya",
    symbol: "Back legs of a funeral cot",
    shakti: "Power to bring rain",
    theme:
      "Depth, stability, endurance, contemplation, inner resources and quiet transformation.",
  },
  {
    number: "27",
    name: "Revati",
    range: "16°40′ – 30°00′ Pisces",
    lord: "Mercury",
    deity: "Pushan",
    symbol: "Fish or drum",
    shakti: "Power of nourishment",
    theme:
      "Guidance, completion, protection, travel, nourishment, transitions and safe passage.",
  },
];

const lordCycle = [
  ["Ketu", "Ashwini, Magha, Mula"],
  ["Venus", "Bharani, Purva Phalguni, Purva Ashadha"],
  ["Sun", "Krittika, Uttara Phalguni, Uttara Ashadha"],
  ["Moon", "Rohini, Hasta, Shravana"],
  ["Mars", "Mrigashira, Chitra, Dhanishtha"],
  ["Rahu", "Ardra, Swati, Shatabhisha"],
  ["Jupiter", "Punarvasu, Vishakha, Purva Bhadrapada"],
  ["Saturn", "Pushya, Anuradha, Uttara Bhadrapada"],
  ["Mercury", "Ashlesha, Jyeshtha, Revati"],
];

const interpretationSteps = [
  {
    number: "01",
    title: "Start with the planet",
    text: "What does the graha naturally signify, and which houses does it rule in this chart?",
  },
  {
    number: "02",
    title: "Identify the Rashi",
    text: "The sign gives the broader environment and style through which the planet operates.",
  },
  {
    number: "03",
    title: "Identify the Nakshatra",
    text: "The Nakshatra adds a more specific pattern, motivation and symbolic field within the Rashi.",
  },
  {
    number: "04",
    title: "Identify the Nakshatra lord",
    text: "The planet ruling the Nakshatra becomes an important dispositional influence and should be examined in the chart.",
  },
  {
    number: "05",
    title: "Study the deity, symbol and Shakti",
    text: "Use them to understand the deeper pattern of the Nakshatra rather than converting the symbolism into literal predictions.",
  },
  {
    number: "06",
    title: "Identify the Pada",
    text: "The Pada further refines expression and connects the Nakshatra with Navamsa structure.",
  },
  {
    number: "07",
    title: "Look for repetition",
    text: "A Nakshatra theme becomes more meaningful when other chart factors support the same interpretation.",
  },
  {
    number: "08",
    title: "Apply Dasha and transit timing",
    text: "Nakshatra lords are deeply relevant to Vimshottari Dasha, while transits through Nakshatras can provide another layer of timing.",
  },
];

export default function NakshatrasPage() {
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
            <span className="text-[#4c3e50]">Nakshatras</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 8 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            The 27 Nakshatras: The Deeper Pattern Behind Planetary Expression
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Rashis divide the zodiac into twelve broad environments.
            Nakshatras take us one level deeper, dividing the zodiac into
            twenty-seven distinct fields through which planets express their
            nature and chart-specific responsibilities.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The eighth principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>
                The Rashi gives the broader environment. The Nakshatra gives a
                more specific operating pattern within that environment.
              </strong>
              <br />
              <br />
              Neither should be read independently of the planet, house
              lordship and wider chart.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS NAKSHATRA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a Nakshatra?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The zodiac contains 360 degrees. In the common twenty-seven
                Nakshatra system, those 360 degrees are divided equally into
                twenty-seven sections.
              </p>

              <p>
                Each Nakshatra therefore spans{" "}
                <strong>13 degrees and 20 minutes</strong>.
              </p>

              <p>
                Because the Moon moves relatively quickly through the zodiac,
                Nakshatras are often described as lunar mansions. But they are
                not relevant only to the Moon.
              </p>

              <p>
                Every graha occupies a Nakshatra according to its exact zodiac
                degree.
              </p>

              <p>
                The Nakshatra of the Ascendant can also become an important
                interpretive layer.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Rashi gives us 12 divisions. Nakshatra gives us 27 finer
                divisions.
              </p>
            </div>
          </section>

          {/* WHY NAKSHATRA MATTERS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Why this layer matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Two planets in the same Rashi can behave differently.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Consider two people who both have the Moon in Taurus.
              </p>

              <p>
                One Moon may be in Krittika, another in Rohini and another in
                Mrigashira.
              </p>

              <p>
                The Rashi is the same, but the Nakshatra environment is
                different.
              </p>

              <p>
                Krittika carries themes connected with Agni, purification,
                cutting and refinement. Rohini carries growth, nourishment and
                development. Mrigashira emphasises searching, curiosity and
                pursuit.
              </p>

              <p>
                These themes can refine how the Moon expresses its
                significations.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Same planet. Same Rashi. Different Nakshatra. Therefore, a
                different layer of expression.
              </p>
            </div>
          </section>

          {/* STRUCTURE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The structure
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Every Nakshatra has four Padas.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Each 13°20′ Nakshatra is divided into four equal quarters
                called <strong>Padas</strong>.
              </p>

              <p>
                Each Pada spans <strong>3°20′</strong>.
              </p>

              <p>
                This gives us 108 Padas across the zodiac:
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Zodiac
                </p>
                <p className="mt-2 text-3xl font-semibold">360°</p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  27 Nakshatras
                </p>
                <p className="mt-2 text-3xl font-semibold">13°20′ each</p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  108 Padas
                </p>
                <p className="mt-2 text-3xl font-semibold">3°20′ each</p>
              </div>
            </div>
          </section>

          {/* PADA AND NAVAMSA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Pada
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why does the Pada matter?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The four Padas refine the expression of the Nakshatra even
                further.
              </p>

              <p>
                Importantly, every Pada corresponds with a{" "}
                <strong>Navamsa sign</strong>.
              </p>

              <p>
                This creates a mathematical connection between Nakshatra Padas
                and the Navamsa, or D9 chart.
              </p>

              <p>
                A planet may therefore share a Nakshatra with another planet
                but occupy a different Pada and Navamsa environment.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="leading-8 text-[#493b4d]">
                We do not need to interpret every Pada in depth yet. For now,
                remember that the Pada is a finer subdivision and is linked
                directly with Navamsa.
              </p>
            </div>
          </section>

          {/* LORD CYCLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Nakshatra rulers
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The nine planetary lords repeat in a fixed sequence.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The Nakshatra lord sequence is the same sequence used by
              Vimshottari Dasha:
            </p>

            <div className="mt-9 overflow-x-auto rounded-2xl border border-[#e1d3c3] bg-white">
              <table className="min-w-[650px] w-full text-left">
                <thead className="bg-[#f4ece3]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">Lord</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Nakshatras
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lordCycle.map(([lord, names]) => (
                    <tr key={lord} className="border-t border-[#eadfce]">
                      <td className="px-5 py-4 font-semibold">{lord}</td>
                      <td className="px-5 py-4 text-[#65586a]">{names}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn →
                Mercury — then the sequence repeats.
              </p>
            </div>
          </section>

          {/* NAKSHATRA LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              An important relationship
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The Nakshatra lord becomes part of the planet's story.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose Mars is placed in Rohini.
              </p>

              <p>
                Rohini is ruled by the Moon.
              </p>

              <p>
                Mars therefore expresses within a Nakshatra governed by the
                Moon, making the Moon an important additional influence on
                Mars.
              </p>

              <p>
                We should then ask where the Moon is placed, which houses it
                rules or influences, and what condition it has.
              </p>

              <p>
                This does not mean Mars “becomes the Moon.” It means the
                Nakshatra lord becomes another interpretive connection.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Planet → Nakshatra → Nakshatra lord → its placement and
                condition.
              </p>
            </div>
          </section>

          {/* DEITY SYMBOL SHAKTI */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Reading symbolism correctly
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Deity, symbol and Shakti describe a pattern — not a literal fate.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Nakshatras carry several layers of traditional symbolism.
              </p>

              <p>
                The <strong>deity</strong> provides a mythological and
                archetypal framework.
              </p>

              <p>
                The <strong>symbol</strong> provides a visual key to the
                Nakshatra's nature.
              </p>

              <p>
                The <strong>Shakti</strong> describes a particular capacity or
                power associated with the Nakshatra.
              </p>

              <p>
                These layers are useful when interpreted symbolically and in
                context.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Do not convert mythology into a one-line prediction.
              </p>
            </div>
          </section>

          {/* KRITTIKA EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example: Krittika
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why “Krittika means cutting” is incomplete.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Krittika is associated with <strong>Agni</strong> and carries
                  imagery of fire, cutting and purification.
                </p>

                <p>
                  A beginner may therefore immediately conclude:
                  “Krittika causes separation.”
                </p>

                <p>
                  That is too literal.
                </p>

                <p>
                  The same principle of cutting can represent{" "}
                  <strong>
                    discernment, refinement, removing impurities, protecting
                    boundaries, separating truth from falsehood or making a
                    decisive choice
                  </strong>
                  .
                </p>

                <p>
                  Which expression is relevant depends on{" "}
                  <strong>
                    the planet occupying Krittika, its house lordship, the
                    house involved, its Pada, condition, relationships and
                    timing
                  </strong>
                  .
                </p>

                <p className="font-semibold text-[#403344]">
                  Symbolism gives us possibilities. The chart decides which
                  possibility is relevant.
                </p>
              </div>
            </div>
          </section>

          {/* MULA EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example: Mula
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “Uprooting” does not simply mean destruction.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Mula's symbol is a bundle of roots, and its symbolism includes
                uprooting and getting to the root of something.
              </p>

              <p>
                That may manifest through endings or deconstruction in some
                contexts.
              </p>

              <p>
                But it can also describe research, investigation, discovering
                origins, questioning assumptions, stripping away superficial
                layers or rebuilding from a deeper foundation.
              </p>

              <p>
                The Nakshatra therefore does not tell us whether an outcome is
                automatically destructive.
              </p>
            </div>
          </section>

          {/* ALL 27 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Reference guide
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The 27 Nakshatras
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Use these as foundational themes, not ready-made predictions.
              Each Nakshatra becomes meaningful only after it is connected with
              the graha and chart in which it appears.
            </p>

            <div className="mt-10 space-y-5">
              {nakshatras.map((nakshatra) => (
                <div
                  key={nakshatra.name}
                  className="rounded-3xl border border-[#e3d5c5] bg-white p-6 md:p-8"
                >
                  <div className="grid gap-6 md:grid-cols-[80px_1fr]">
                    <div>
                      <p className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                        {nakshatra.number}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        <h3 className="text-2xl font-semibold">
                          {nakshatra.name}
                        </h3>

                        <span className="text-sm text-[#817382]">
                          {nakshatra.range}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl bg-[#f8f2ea] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a6d58]">
                            Lord
                          </p>
                          <p className="mt-2 font-medium">{nakshatra.lord}</p>
                        </div>

                        <div className="rounded-xl bg-[#f8f2ea] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a6d58]">
                            Deity
                          </p>
                          <p className="mt-2 font-medium">{nakshatra.deity}</p>
                        </div>

                        <div className="rounded-xl bg-[#f8f2ea] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a6d58]">
                            Symbol
                          </p>
                          <p className="mt-2 font-medium">
                            {nakshatra.symbol}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm font-semibold text-[#8b5a79]">
                          Shakti
                        </p>
                        <p className="mt-1 leading-7 text-[#65586a]">
                          {nakshatra.shakti}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-[#8b5a79]">
                          Foundational theme
                        </p>
                        <p className="mt-1 leading-7 text-[#65586a]">
                          {nakshatra.theme}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PLANET IN NAKSHATRA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Apply the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A Nakshatra modifies a planet. It does not replace the planet.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Planet
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  What energy is operating?
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Natural significations and chart-specific house lordship.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Rashi
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  What environment?
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Element, modality, sign lord and broader style of expression.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Nakshatra
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  What deeper pattern?
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  A more specific motivational, symbolic and dispositional
                  layer.
                </p>
              </div>
            </div>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Suppose the 10th lord is Mercury in Mula.
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  First, Mercury naturally represents areas such as
                  communication, analysis, information, calculation, commerce
                  and learning.
                </p>

                <p>
                  If Mercury is the <strong>10th lord</strong>, it also carries
                  the chart's professional and public responsibilities.
                </p>

                <p>
                  Suppose Mercury is placed in Sagittarius.
                </p>

                <p>
                  Sagittarius gives a Jupiterian environment connected with
                  knowledge, principles, meaning, belief and expansion.
                </p>

                <p>
                  If Mercury occupies <strong>Mula</strong>, another layer is
                  added: investigation, roots, deconstruction and getting below
                  the surface.
                </p>

                <p>
                  Mula is ruled by Ketu, so the placement and condition of Ketu
                  now become relevant.
                </p>

                <p>
                  This can suggest a professional pattern involving deeper
                  analysis, investigation, research, restructuring or
                  questioning established assumptions.
                </p>

                <p>
                  But we still cannot declare a profession from this one
                  placement.
                </p>

                <p className="font-semibold text-[#403344]">
                  Planet gives the vocabulary. Lordship gives responsibility.
                  Rashi gives the environment. Nakshatra refines the pattern.
                </p>
              </div>
            </div>
          </section>

          {/* BIRTH NAKSHATRA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The Moon's Nakshatra
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the birth Nakshatra especially important?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Nakshatra occupied by the Moon at birth is commonly called
                the <strong>Janma Nakshatra</strong>.
              </p>

              <p>
                Because the Moon is closely associated with mind, perception,
                emotional response and lived experience, its Nakshatra becomes
                an important interpretive reference.
              </p>

              <p>
                It is also fundamental to the calculation of{" "}
                <strong>Vimshottari Dasha</strong>.
              </p>

              <p>
                The planetary lord of the Moon's birth Nakshatra determines
                which Mahadasha sequence is operating at birth, while the
                Moon's precise progress through the Nakshatra determines the
                balance remaining.
              </p>
            </div>
          </section>

          {/* NAKSHATRA AND DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Bridge to timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Nakshatras connect chart interpretation with Dasha timing.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The nine Nakshatra lords repeat in the same sequence used by
                Vimshottari Dasha.
              </p>

              <p>
                This is one reason Nakshatras become extremely important when
                we move from describing a natal chart to understanding timing.
              </p>

              <p>
                A planet's Nakshatra lord can create connections with other
                houses and planets, while the Moon's Janma Nakshatra anchors
                the Vimshottari sequence.
              </p>

              <p>
                We will study the Dasha system in depth in a later lesson.
              </p>
            </div>
          </section>

          {/* HOW TO READ */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A practical method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should you interpret a planet through its Nakshatra?
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
                "Do not turn a Nakshatra symbol into a literal life event.",
                "Do not interpret a Nakshatra without first identifying the planet occupying it.",
                "Do not ignore the house lordship of that planet.",
                "Do not ignore the Nakshatra lord and its placement.",
                "Do not assume every person with the same Moon Nakshatra will live the same life.",
                "Do not treat Krittika as only separation, Mula as only destruction or Ardra as only suffering.",
                "Do not forget the Rashi containing the Nakshatra.",
                "Do not ignore Pada when greater precision is required.",
                "Do not use a Nakshatra theme as a substitute for Dasha and transit timing.",
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
              We now have a deeper language for planetary expression.
            </h2>

            <div className="mt-9 space-y-4">
              {[
                ["Graha", "Who is acting?"],
                ["Bhava", "Where in life is it acting?"],
                ["Rashi", "What broad environment shapes its expression?"],
                ["Lagna", "What role has the planet been assigned?"],
                ["Lordship", "Which areas of life does it carry and connect?"],
                ["Strength", "How capable is it of expressing those agendas?"],
                ["Sambandha", "Which other planets and houses is it connected to?"],
                [
                  "Nakshatra",
                  "What more specific pattern, motivation and dispositional influence operates within the Rashi?",
                ],
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
              Lesson 8 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "The zodiac is divided into 27 Nakshatras of 13°20′ each.",
                "Every Nakshatra contains four Padas of 3°20′ each.",
                "The 108 Nakshatra Padas connect directly with Navamsa structure.",
                "Every planet occupies a Nakshatra according to its exact zodiac degree.",
                "The Nakshatra refines the expression already created by the planet, house and Rashi.",
                "Every Nakshatra has a planetary lord, deity, symbol and traditional Shakti.",
                "The Nakshatra lord becomes an important additional influence on the occupying planet.",
                "The Moon's Janma Nakshatra is fundamental to Vimshottari Dasha calculation.",
                "Nakshatra symbolism should be interpreted contextually rather than literally.",
                "No Nakshatra by itself guarantees a specific event.",
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
              Lesson 9 — Reading the D1 Birth Chart
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We have now built the major components required to begin reading
              the natal chart systematically.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              In Lesson 9 we will bring together Lagna, house lordship,
              planetary placement, Rashi, dignity, Sambandha and Nakshatra into
              a structured method for reading the D1 chart.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              This is where the earlier foundations begin becoming a complete
              interpretation process.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 9 · Coming next
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
                Nakshatra adds precision — but precision still requires
                context.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                We now have enough foundational layers to begin combining them
                into a systematic D1 chart reading.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 7: Aspects & Sambandha
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