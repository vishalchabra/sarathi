import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Planetary Strength & Dignity in Vedic Astrology",
  description:
    "Learn planetary strength in Vedic astrology, including own sign, exaltation, debilitation, friendly and enemy signs, combustion, retrogression and why strong does not always mean favourable.",
  path: "/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology",
  keywords: [
    "Planetary Strength Vedic Astrology",
    "Planetary Dignity Astrology",
    "Exalted Planets Vedic Astrology",
    "Debilitated Planets Vedic Astrology",
    "Own Sign Vedic Astrology",
    "Combust Planets Vedic Astrology",
    "Retrograde Planets Vedic Astrology",
    "Planet Strength Jyotish",
    "Vedic Astrology for Beginners",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Planetary Strength & Dignity in Vedic Astrology: How Capable Is a Planet?",
  description:
    "A beginner-friendly guide to planetary dignity, sign strength, exaltation, debilitation, combustion, retrogression and the wider assessment of planetary condition in Jyotish.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Planetary strength",
    "Planetary dignity",
    "Exaltation",
    "Debilitation",
    "Combustion",
    "Retrogression",
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
      name: "Planetary Strength & Dignity",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology",
    },
  ],
};

const dignityLevels = [
  {
    title: "Own Sign",
    sanskrit: "Sva Rashi",
    description:
      "A planet in a sign it rules is generally operating in familiar territory and may express its significations with greater autonomy and coherence.",
    caution:
      "This does not mean every result of the planet will automatically be pleasant.",
  },
  {
    title: "Exaltation",
    sanskrit: "Uccha",
    description:
      "A planet in its exaltation sign is traditionally considered to have a particularly strong capacity to express its nature.",
    caution:
      "Exaltation increases capacity. It does not erase difficult house lordship, affliction or context.",
  },
  {
    title: "Debilitation",
    sanskrit: "Neecha",
    description:
      "A debilitated planet may find it harder to express its natural functions smoothly or confidently in that sign.",
    caution:
      "Debilitation is not a life sentence. Cancellation, support, aspects, vargas and other factors can substantially modify the result.",
  },
  {
    title: "Friendly Sign",
    sanskrit: "Mitra Rashi",
    description:
      "A planet placed in the sign of a friendly graha may operate in a more supportive environment.",
    caution:
      "Friendship is one factor among many and should not be used as a standalone judgement.",
  },
  {
    title: "Enemy Sign",
    sanskrit: "Shatru Rashi",
    description:
      "A planet in an enemy's sign may have less comfort or ease in expressing its natural qualities.",
    caution:
      "An enemy sign does not automatically make the planet incapable or harmful.",
  },
  {
    title: "Neutral Sign",
    sanskrit: "Sama Rashi",
    description:
      "A neutral sign may provide neither especially supportive nor especially difficult terrain for the planet.",
    caution:
      "The complete condition of the planet still matters more than the label alone.",
  },
];

const exaltations = [
  ["Sun", "Aries", "Libra"],
  ["Moon", "Taurus", "Scorpio"],
  ["Mars", "Capricorn", "Cancer"],
  ["Mercury", "Virgo", "Pisces"],
  ["Jupiter", "Cancer", "Capricorn"],
  ["Venus", "Pisces", "Virgo"],
  ["Saturn", "Libra", "Aries"],
];

const assessmentSteps = [
  {
    number: "01",
    title: "What houses does the planet rule?",
    text: "Before judging strength, remember what responsibilities the planet carries in this particular chart.",
  },
  {
    number: "02",
    title: "Which house does it occupy?",
    text: "Strength does not replace house placement. The field in which the planet operates remains essential.",
  },
  {
    number: "03",
    title: "Which Rashi does it occupy?",
    text: "Check whether the planet is in its own sign, exalted, debilitated, friendly, neutral or enemy territory.",
  },
  {
    number: "04",
    title: "What is happening around the planet?",
    text: "Conjunctions and aspects can support, pressure, redirect or complicate its expression.",
  },
  {
    number: "05",
    title: "Is it combust or retrograde?",
    text: "These conditions modify the planet's behaviour and should be understood in context rather than treated as simple good-or-bad labels.",
  },
  {
    number: "06",
    title: "How is its dispositor functioning?",
    text: "A planet operates through the sign it occupies, so the condition of that sign's ruler can become important.",
  },
  {
    number: "07",
    title: "Does divisional support repeat the story?",
    text: "A planet that appears strong in the birth chart may express differently in a relevant divisional chart.",
  },
  {
    number: "08",
    title: "Is the planet activated by Dasha?",
    text: "A strong natal planet may remain relatively quiet until its own period or a connected period becomes active.",
  },
];

const modifiers = [
  {
    title: "Combustion",
    description:
      "A planet close to the Sun may be considered combust. Traditional interpretation treats this as a condition affecting the planet's ability to express independently, though the exact result depends on the planet, degree distance and the wider chart.",
  },
  {
    title: "Retrogression",
    description:
      "A retrograde graha is traditionally treated as having an unusual or intensified mode of expression. Different Jyotish traditions interpret retrogression with nuance, so it should not be reduced to simply strong, weak, good or bad.",
  },
  {
    title: "Conjunctions",
    description:
      "Planets placed together influence one another. The result depends on the planets involved, their lordships, relative strength and the house and sign containing the conjunction.",
  },
  {
    title: "Aspects",
    description:
      "Planetary aspects bring influence from a distance. Supportive or challenging outcomes depend on the complete functional role and condition of the planets involved.",
  },
  {
    title: "Dispositor",
    description:
      "The dispositor is the ruler of the sign a planet occupies. Its condition can affect the environment through which the occupying planet operates.",
  },
  {
    title: "Divisional Charts",
    description:
      "A planet's dignity and strength should eventually be compared with relevant vargas, especially when evaluating specific life areas.",
  },
];

export default function PlanetaryStrengthPage() {
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
              Planetary Strength & Dignity
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 6 · Foundations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Planetary Strength & Dignity: How Capable Is a Planet of Doing Its
            Job?
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Knowing what a planet represents and which houses it rules is not
            enough. We must also ask how comfortably, consistently and
            effectively that planet can operate in the chart.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The sixth principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>Strength tells us capacity — not morality.</strong>
              <br />
              <br />
              A strong planet does not automatically give pleasant results,
              and a weak planet does not automatically destroy the houses it
              represents.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS STRENGTH */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What do we mean by planetary strength?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In Jyotish, a planet is not interpreted only by its name or its
                natural significations.
              </p>

              <p>
                We also examine whether it is operating from a supportive,
                neutral or difficult position.
              </p>

              <p>
                Planetary dignity is one part of that assessment. It describes
                how a planet relates to the Rashi it occupies.
              </p>

              <p>
                But planetary strength is broader than dignity alone. House
                placement, lordship, aspects, conjunctions, combustion,
                retrogression, dispositors, divisional charts and other
                strength measures may all contribute.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Dignity is one layer of strength. It is not the entire verdict
                on a planet.
              </p>
            </div>
          </section>

          {/* STRENGTH VS GOOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The biggest beginner mistake
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Strong does not mean “good.”
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Imagine a planet is very strong. That tells us the planet may
                have considerable ability to express the agendas it carries.
              </p>

              <p>
                But what agendas does it carry?
              </p>

              <p>
                That depends on its natural significations, house lordship,
                placement and relationships.
              </p>

              <p>
                A strong planet ruling houses associated with conflict,
                transformation or challenge may strongly activate those themes
                during its period.
              </p>

              <p>
                Conversely, a planet with some weakness may still produce
                useful results if it receives support from the wider chart.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                First ask <strong>what the planet is responsible for</strong>.
                Then ask <strong>how capable it is of delivering it</strong>.
              </p>
            </div>
          </section>

          {/* DIGNITY LEVELS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Sign-based dignity
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How comfortable is the planet in its Rashi?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Traditional Jyotish uses several categories to describe the
              relationship between a graha and the sign it occupies.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {dignityLevels.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold text-[#9a6d58]">
                    {item.sanskrit}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {item.description}
                  </p>

                  <div className="mt-5 rounded-xl bg-[#f4ece3] p-4">
                    <p className="text-sm leading-6 text-[#5e5162]">
                      <strong>Remember:</strong> {item.caution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EXALTATION TABLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A useful reference
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Exaltation and debilitation signs
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              In the traditional framework, the seven visible grahas have
              recognised exaltation and debilitation signs.
            </p>

            <div className="mt-9 overflow-x-auto rounded-2xl border border-[#e1d3c3] bg-white">
              <table className="min-w-[650px] w-full text-left">
                <thead className="bg-[#f4ece3]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">Graha</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Exaltation
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Debilitation
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {exaltations.map(([planet, exalted, debilitated]) => (
                    <tr key={planet} className="border-t border-[#eadfce]">
                      <td className="px-5 py-4 font-semibold">{planet}</td>
                      <td className="px-5 py-4 text-[#65586a]">{exalted}</td>
                      <td className="px-5 py-4 text-[#65586a]">
                        {debilitated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="leading-8 text-[#493b4d]">
                Rahu and Ketu are treated differently across Jyotish
                traditions regarding exaltation, debilitation and sign
                ownership. For a beginner framework, it is better not to force
                one disputed scheme into the basic rules.
              </p>
            </div>
          </section>

          {/* OWN SIGN */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Familiar territory
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What happens when a planet is in its own sign?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                When a planet occupies a Rashi that it rules, it is operating
                in its own domain.
              </p>

              <p>
                Mars in Aries or Scorpio, Venus in Taurus or Libra, Mercury in
                Gemini or Virgo, Jupiter in Sagittarius or Pisces, and Saturn
                in Capricorn or Aquarius are examples.
              </p>

              <p>
                The Sun is in its own sign in Leo, while the Moon is in its own
                sign in Cancer.
              </p>

              <p>
                This can support a planet's capacity to express its nature and
                manage the affairs it carries.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Own sign tells us the planet has strong access to its own
                resources. It does not tell us whether every outcome will feel
                easy.
              </p>
            </div>
          </section>

          {/* EXALTATION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              High capacity
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does exaltation actually mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Exaltation is traditionally understood as a sign placement in
                which a planet has a particularly strong capacity to express
                its qualities.
              </p>

              <p>
                For example, Saturn is exalted in Libra. Mars is exalted in
                Capricorn. Jupiter is exalted in Cancer.
              </p>

              <p>
                But an exalted planet is not automatically a promise of
                happiness, wealth or success.
              </p>

              <p>
                If the planet carries difficult functional responsibilities,
                is involved in challenging combinations or operates during a
                difficult period, its strength may simply make its agenda more
                powerful.
              </p>
            </div>

            <div className="mt-8 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <p className="text-lg font-semibold text-[#403344]">
                Exaltation answers:
              </p>

              <p className="mt-3 text-lg leading-8 text-[#5e5162]">
                “How strongly can this graha potentially operate here?”
              </p>

              <p className="mt-5 text-lg font-semibold text-[#403344]">
                It does not answer:
              </p>

              <p className="mt-3 text-lg leading-8 text-[#5e5162]">
                “Will everything represented by this planet be good?”
              </p>
            </div>
          </section>

          {/* DEBILITATION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Challenging terrain
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A debilitated planet is not a ruined planet.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Debilitation indicates a sign in which a planet may have
                difficulty expressing its natural functions in an easy,
                balanced or straightforward way.
              </p>

              <p>
                For example, Saturn is debilitated in Aries and Mars in
                Cancer.
              </p>

              <p>
                But this is only the beginning of interpretation.
              </p>

              <p>
                The planet may receive support from its dispositor, aspects,
                conjunctions or divisional placements. Classical Jyotish also
                recognises conditions under which debilitation may be
                cancelled or substantially modified.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Do not stop reading a chart the moment you see the word
                “debilitated.”
              </p>
            </div>
          </section>

          {/* NEECHA BHANGA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A concept to recognise
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is Neecha Bhanga?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                <strong>Neecha Bhanga</strong> refers broadly to classical
                conditions that can cancel or modify the debilitation of a
                planet.
              </p>

              <p>
                There are several rules discussed in Jyotish texts and
                traditions, and their application requires care.
              </p>

              <p>
                For a beginner, the important principle is simply this:
                debilitation should never be judged in isolation.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4ece3] p-7">
              <p className="leading-8 text-[#493b4d]">
                We will study cancellation, yogas and deeper strength
                assessment later. At this stage, learn not to make a final
                judgement from dignity alone.
              </p>
            </div>
          </section>

          {/* FRIEND ENEMY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Planetary relationships
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Friendly and enemy signs
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Grahas have traditional relationships of friendship,
                neutrality and enmity.
              </p>

              <p>
                When a planet occupies a sign ruled by a friendly planet, the
                environment may be more cooperative for its expression.
              </p>

              <p>
                When it occupies an enemy's sign, the expression may involve
                greater friction or adjustment.
              </p>

              <p>
                But this relationship should never be used independently of
                house lordship, placement and the rest of the chart.
              </p>
            </div>
          </section>

          {/* OTHER CONDITIONS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Beyond the Rashi
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What else modifies planetary strength?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A planet's sign dignity is only one piece of the assessment.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {modifiers.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-4 leading-7 text-[#65586a]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* COMBUSTION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Combustion
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does it mean when a planet is combust?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A planet very close to the Sun may be considered combust under
                traditional Jyotish rules.
              </p>

              <p>
                Combustion is generally interpreted as the planet operating
                under the overwhelming proximity of the Sun, which can alter
                its independent expression.
              </p>

              <p>
                But combustion is degree-sensitive and planet-specific.
                Different planets have different traditional combustion
                ranges, and retrogression may also affect how some traditions
                assess the condition.
              </p>

              <p>
                Therefore, simply seeing the Sun and another planet in the same
                sign is not enough to declare the planet combust.
              </p>
            </div>
          </section>

          {/* RETROGRADE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Retrogression
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Retrograde does not simply mean weak.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                From the Earth's perspective, certain planets periodically
                appear to move backwards through the zodiac. This apparent
                motion is called retrogression.
              </p>

              <p>
                Jyotish gives retrograde planets special interpretive
                importance, but the rules are more nuanced than the popular
                idea that retrograde automatically means negative.
              </p>

              <p>
                Depending on the method being used, retrogression can be
                associated with unusual strength, repetition, internalisation,
                reconsideration or a less straightforward expression of the
                planet's agenda.
              </p>

              <p>
                At this stage, the most important lesson is not to turn
                retrograde into a one-word judgement.
              </p>
            </div>
          </section>

          {/* DISPOSITOR */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Follow the chain
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The dispositor can change the story.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose Mars is placed in Taurus.
              </p>

              <p>
                Taurus is ruled by Venus, so Venus becomes the{" "}
                <strong>dispositor of Mars</strong>.
              </p>

              <p>
                Mars is operating inside Venus's sign, so the condition and
                placement of Venus become relevant to understanding how Mars
                can function.
              </p>

              <p>
                If Venus itself is supported, strong or well connected, it may
                provide a different environment than if Venus is heavily
                challenged.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                A planet does not operate in isolation. Follow the ruler of the
                sign it occupies.
              </p>
            </div>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Saturn exalted in Libra: what can we actually say?
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  First, we can say that Saturn is in its{" "}
                  <strong>exaltation sign</strong>.
                </p>

                <p>
                  That suggests Saturn has significant capacity to express
                  themes such as discipline, endurance, responsibility,
                  structure and sustained effort.
                </p>

                <p>
                  But we still do not know what Saturn will produce.
                </p>

                <p>
                  We need the <strong>Lagna</strong> to know which houses
                  Saturn rules.
                </p>

                <p>
                  We need its <strong>house placement</strong> to know where
                  the planet is operating.
                </p>

                <p>
                  We need to know which planets conjoin or aspect it, how Venus
                  as Libra's ruler is functioning, what relevant vargas show
                  and whether Saturn is activated by Dasha.
                </p>

                <p className="font-semibold text-[#403344]">
                  “Saturn is exalted” is an important observation. It is not a
                  complete interpretation.
                </p>
              </div>
            </div>
          </section>

          {/* ASSESSMENT METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A better method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should you assess a planet?
            </h2>

            <div className="mt-10 space-y-5">
              {assessmentSteps.map((step) => (
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

          {/* STRONG VS FAVOURABLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Separate two questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Strength and favourability are different assessments.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                  Question 1
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  How strong is the planet?
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  This concerns its ability, condition, dignity and capacity
                  to operate.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a6d58]">
                  Question 2
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  What is the planet trying to deliver?
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  This depends on its natural significations, functional
                  lordship, placement, connections and the subject being
                  analysed.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Never answer the second question using only the first.
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
                "Do not call every exalted planet beneficial.",
                "Do not call every debilitated planet disastrous.",
                "Do not judge dignity before checking house lordship.",
                "Do not treat retrograde as automatically weak or negative.",
                "Do not call a planet combust merely because it shares a sign with the Sun.",
                "Do not ignore the dispositor of the planet.",
                "Do not assume sign dignity alone tells you whether a life event will occur.",
                "Do not ignore aspects, conjunctions and divisional support.",
                "Do not confuse a planet's capacity with the nature of the results it is capable of delivering.",
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
              We can now ask six questions.
            </h2>

            <div className="mt-9 space-y-4">
              {[
                ["Graha", "Who is acting?"],
                ["Bhava", "Where in life is it acting?"],
                ["Rashi", "How does it tend to express?"],
                ["Lagna", "What role has this planet been assigned?"],
                ["Lordship", "Which areas of life does it connect?"],
                [
                  "Strength",
                  "How capable is the planet of carrying and expressing those responsibilities?",
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
              Lesson 6 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Planetary dignity describes how a graha relates to the sign it occupies.",
                "Own sign and exaltation generally support planetary capacity.",
                "Debilitation indicates a more challenging environment but is not a final verdict.",
                "Friendly, neutral and enemy signs provide another layer of sign-based assessment.",
                "Strength does not automatically mean favourable results.",
                "Weakness does not automatically mean failure.",
                "Combustion is degree-sensitive and should not be assumed from sign placement alone.",
                "Retrogression requires nuanced interpretation and is not simply negative.",
                "The dispositor helps describe the environment supporting the occupying planet.",
                "A complete assessment combines dignity, lordship, house placement, relationships, vargas and timing.",
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
              Lesson 7 — Aspects, Conjunctions & Sambandha
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Until now we have mostly examined planets individually.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              But planets constantly influence one another through conjunction,
              aspect, lordship and other relationships.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              In Lesson 7 we will study how these relationships create{" "}
              <strong>Sambandha</strong> — one of the foundations of chart
              synthesis.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 7 · Coming next
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
                Strength tells us capacity. The chart tells us what that
                capacity is being used for.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Next we move from individual planetary condition to planetary
                relationships — how grahas connect, influence and modify one
                another.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 5: House Lords & Lordship
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