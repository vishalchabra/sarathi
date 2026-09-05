import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Which House Shows Foreign Travel in Vedic Astrology?",
  description:
    "Learn which houses are studied for foreign travel, relocation and settlement in Vedic astrology, including the 3rd, 4th, 9th and 12th houses, house lords, Rahu, Dashas and transits.",
  path: "/sarathi/learn/questions/which-house-shows-foreign-travel-vedic-astrology",
  keywords: [
    "Which House Shows Foreign Travel",
    "Foreign Travel House Vedic Astrology",
    "12th House Foreign Travel",
    "9th House Foreign Travel",
    "4th House Foreign Settlement",
    "Foreign Settlement House",
    "Videsh Yoga",
    "Rahu Foreign Travel",
    "Foreign Travel Astrology",
    "Settle Abroad Vedic Astrology",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Which House Shows Foreign Travel in Vedic Astrology?",
  description:
    "A structured guide to the houses used in Vedic astrology for foreign travel, relocation and settlement.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-foreign-travel-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-foreign-travel-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Foreign travel",
    "Foreign settlement",
    "12th house",
    "9th house",
    "4th house",
    "Vimshottari Dasha",
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
      name: "Which House Shows Foreign Travel?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-foreign-travel-vedic-astrology",
    },
  ],
};

const houses = [
  {
    number: "3rd",
    title: "Movement, shorter journeys and change of place",
    text: "The 3rd house is often studied for movement, journeys and leaving the immediate environment. In foreign-travel analysis, it may contribute when movement itself is an important part of the event.",
  },
  {
    number: "9th",
    title: "Long-distance journeys",
    text: "The 9th house is traditionally associated with long-distance travel and journeys that take the person significantly beyond the familiar environment.",
  },
  {
    number: "12th",
    title: "Distant and foreign environments",
    text: "The 12th house is commonly associated with life away from the usual base, distant places and unfamiliar environments. It is important, but it does not automatically mean foreign settlement.",
  },
  {
    number: "4th",
    title: "Home, roots and established residence",
    text: "The 4th house becomes especially important when the question moves from travel to relocation or long-term settlement because it represents home, residence and the person's established base.",
  },
];

const questionHierarchy = [
  {
    title: "Will I travel abroad?",
    text: "The 3rd, 9th and 12th may become more prominent because the primary question is movement and distance.",
  },
  {
    title: "Will I live abroad temporarily?",
    text: "The 9th and 12th may remain important, while the reason for residence — such as career or education — also needs to participate.",
  },
  {
    title: "Will I relocate abroad?",
    text: "The 4th becomes more important because the event now concerns a change in the person's centre of residence.",
  },
  {
    title: "Will I settle abroad long term?",
    text: "The 4th, 9th and 12th, their lords, planetary strength, repetition, Dashas and transits should converge more clearly.",
  },
];

const supportingFactors = [
  {
    title: "House Lords",
    text: "The lords of the relevant houses show how those topics are carried through the chart. Their placement and relationships may be more informative than the houses alone.",
  },
  {
    title: "Planetary Strength",
    text: "A connection must be judged for dignity, placement, support and capacity. A weak or heavily constrained planet may express differently from a strong one.",
  },
  {
    title: "Sambandha",
    text: "Conjunctions, aspects and lordship relationships can connect home, movement, distant environments and the reason for relocation.",
  },
  {
    title: "Rahu",
    text: "Rahu may reinforce foreign, unfamiliar or boundary-crossing themes, but it should be interpreted contextually rather than treated as a universal foreign-settlement planet.",
  },
  {
    title: "Reason for travel",
    text: "Career, education, marriage, family and business may each become the mechanism through which foreign movement occurs.",
  },
  {
    title: "Dasha and Transit",
    text: "The natal chart shows potential. Dashas help identify when relevant planets become active, while transits refine the timing.",
  },
];

const examples = [
  {
    title: "Example 1 — Work trip",
    text: "A person may have strong 9th and 12th house activation linked with career factors, producing repeated overseas work travel without changing the home base.",
  },
  {
    title: "Example 2 — Study abroad",
    text: "Foreign movement may occur because education-related factors connect with long-distance and distant-residence houses.",
  },
  {
    title: "Example 3 — Marriage-led relocation",
    text: "Partnership factors may become the reason for movement when they connect with the houses associated with relocation and residence.",
  },
  {
    title: "Example 4 — Long-term settlement",
    text: "A stronger pattern may involve the 4th house or 4th lord together with foreign-related houses, repeated support and a capable Dasha period.",
  },
];

const mistakes = [
  "Treating the 12th house alone as proof of foreign settlement.",
  "Using one fixed house formula for every foreign-travel question.",
  "Ignoring the 4th house when the question is about relocation or settlement.",
  "Ignoring house lords and only reading house numbers.",
  "Assuming Rahu guarantees travel or settlement abroad.",
  "Ignoring the reason for movement, such as career, education or marriage.",
  "Calling a natal possibility an event without checking Dasha activation.",
  "Using one transit as a standalone prediction.",
  "Confusing international travel with permanent relocation.",
  "Treating astrology as a guarantee of visa, residency or citizenship outcomes.",
];

const analysisSteps = [
  {
    number: "01",
    title: "Define the exact question",
    text: "Travel, temporary residence, relocation and long-term settlement are different events.",
  },
  {
    number: "02",
    title: "Start with the D1",
    text: "Establish whether the natal horoscope supports meaningful movement or foreign-residence themes.",
  },
  {
    number: "03",
    title: "Study the 3rd house",
    text: "Assess movement, journeys and change of immediate environment where relevant.",
  },
  {
    number: "04",
    title: "Study the 9th house",
    text: "Examine long-distance travel and movement beyond the familiar environment.",
  },
  {
    number: "05",
    title: "Study the 12th house",
    text: "Assess distant environments, separation from the usual base and life away from familiar surroundings.",
  },
  {
    number: "06",
    title: "Add the 4th for relocation",
    text: "When the question concerns residence or settlement, study home, roots and the 4th lord carefully.",
  },
  {
    number: "07",
    title: "Judge the relevant house lords",
    text: "See where they are placed, how strong they are and what they connect with.",
  },
  {
    number: "08",
    title: "Identify the reason for movement",
    text: "Career, education, marriage, family or business should be supported by the appropriate parts of the chart.",
  },
  {
    number: "09",
    title: "Assess planetary strength",
    text: "Determine whether the planets involved have sufficient capacity to produce a meaningful event.",
  },
  {
    number: "10",
    title: "Map Sambandha and repetition",
    text: "Repeated independent links create more confidence than one isolated indication.",
  },
  {
    number: "11",
    title: "Check the Dasha",
    text: "Look for activation of planets connected with the foreign-movement theme.",
  },
  {
    number: "12",
    title: "Use transits for refinement",
    text: "Transits help narrow an already supported period rather than create the event by themselves.",
  },
];

const faqItems = [
  {
    question: "Which house is the main house for foreign travel?",
    answer:
      "There is no single universal house. The 3rd, 9th and 12th are commonly studied for movement, long-distance journeys and distant environments. The exact question determines which becomes more important.",
  },
  {
    question: "Which house shows foreign settlement?",
    answer:
      "The 4th house becomes especially important for settlement because it represents home and residence, while the 9th and 12th may contribute long-distance and foreign-environment themes.",
  },
  {
    question: "Does the 12th house guarantee living abroad?",
    answer:
      "No. The 12th house has many meanings and cannot independently guarantee foreign residence or settlement.",
  },
  {
    question: "Is Rahu necessary for foreign travel?",
    answer:
      "No. Rahu may reinforce foreign or unfamiliar-environment themes in some charts, but foreign travel can occur without Rahu being the central factor.",
  },
  {
    question: "Can astrology tell whether I will get a visa or permanent residency?",
    answer:
      "No. Astrology cannot guarantee visa approval, residency, permanent residency or citizenship. These depend on legal, administrative, financial and personal circumstances.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function ForeignTravelHousePage() {
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
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
            <span>Foreign Travel & Settlement</span>
            <span>›</span>
            <span className="text-[#4c3e50]">
              Which House Shows Foreign Travel?
            </span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Foreign Travel & Settlement · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Which House Shows Foreign Travel and Settlement in Vedic Astrology?
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            There is no single foreign-travel house that answers every
            question. Vedic astrology changes the hierarchy depending on
            whether the person is asking about travel, temporary residence,
            relocation or long-term settlement.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The basic map
            </p>

            <p className="mt-4 text-2xl font-semibold leading-10 text-[#47394b]">
              3rd → movement
              <br />
              9th → long-distance travel
              <br />
              12th → distant or foreign environments
              <br />
              4th → home, residence and settlement
            </p>

            <p className="mt-5 leading-7 text-[#65586a]">
              This is a framework for analysis, not a fixed prediction formula.
              The relevant house lords, strength, Sambandha, Dashas and
              transits still have to support the event.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The four-house framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The house hierarchy changes with the question.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Foreign movement should not be reduced to one house. Different
              houses describe different layers of the experience.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {houses.map((house) => (
                <div
                  key={house.number}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a6d58]">
                    {house.number} House
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">{house.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {house.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              3rd house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why does the 3rd house matter for foreign travel?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 3rd house is associated with movement, journeys and leaving
                the immediate environment.
              </p>

              <p>
                In foreign-travel analysis, it can contribute to the act of
                movement itself, especially where the horoscope shows repeated
                travel or a lifestyle involving frequent movement.
              </p>

              <p>
                It should not automatically be treated as a foreign-settlement
                house. Its role depends on what else it connects with.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 3rd helps describe movement. Other factors tell us how far,
                why and whether the move becomes lasting.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              9th house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the 9th house associated with long-distance travel?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 9th house is traditionally associated with longer journeys,
                distant movement and experiences that take a person beyond the
                familiar environment.
              </p>

              <p>
                It can therefore become important in questions about overseas
                travel, especially when the 9th lord connects with relevant
                movement or foreign-environment factors.
              </p>

              <p>
                But long-distance travel does not automatically imply residence
                abroad.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 9th can show distance. It does not by itself tell us
                whether the person will establish a new home abroad.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              12th house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Is the 12th house the house of foreign countries?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 12th house is commonly studied for life away from the usual
                base, distant environments and unfamiliar surroundings.
              </p>

              <p>
                This makes it highly relevant in many foreign-travel and
                foreign-residence questions.
              </p>

              <p>
                However, the 12th house has many meanings. Its activation does
                not automatically mean a person will leave the country.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 12th may describe being away from the familiar environment.
                The complete chart must explain what that actually means.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              4th house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why does the 4th house become crucial for settlement?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 4th house represents home, residence, roots and the
                person's established base.
              </p>

              <p>
                A foreign journey can occur without changing the 4th-house
                story at all. Settlement is different because the person's
                centre of life may shift.
              </p>

              <p>
                That is why the 4th house and 4th lord deserve greater weight
                when the question concerns relocation or long-term residence
                rather than travel alone.
              </p>

              <p className="font-semibold text-[#47394b]">
                Travel asks, “Where am I going?” Settlement also asks, “Where
                does home become established?”
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Question-specific hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The exact question determines which house matters most.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {questionHierarchy.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-[#47394b]">
              Interpretation improves when we stop asking, “Which single house
              shows abroad?” and start asking, “Which houses describe this
              specific type of movement?”
            </p>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              House lords
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The houses matter — but their lords carry the story.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A house should not be interpreted in isolation from its lord.
                The house lord carries that topic into another part of the
                horoscope.
              </p>

              <p>
                For example, a connection between the lord of home and the lord
                of a distant-residence house may become relevant in a
                relocation analysis.
              </p>

              <p>
                The exact meaning still depends on placement, dignity,
                dispositor support, aspects and the rest of the chart.
              </p>

              <p className="font-semibold text-[#47394b]">
                The house identifies the topic. The house lord shows how that
                topic travels through the chart.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Supporting factors
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Foreign-travel analysis needs more than houses.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {supportingFactors.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Rahu
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does Rahu show foreign travel?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Rahu is often associated with unfamiliar environments,
                foreign influences, boundary-crossing and experiences outside
                established norms.
              </p>

              <p>
                That can make Rahu relevant in some charts involving overseas
                movement or relocation.
              </p>

              <p>
                But Rahu should be judged through its house, dispositor,
                Sambandha, strength and Dasha role.
              </p>

              <p className="font-semibold text-[#47394b]">
                Rahu can strengthen a foreign theme. It does not create a
                universal rule that everyone with a certain Rahu placement
                will live abroad.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Reason for movement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The chart should explain why the person goes abroad.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Foreign movement usually happens through a real-life pathway:
                employment, education, marriage, family, business or personal
                choice.
              </p>

              <p>
                The chart should therefore connect the foreign-movement theme
                with the areas that describe the cause.
              </p>

              <p className="font-semibold text-[#47394b]">
                The travel houses describe movement. The rest of the chart
                explains the purpose of that movement.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Examples
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The same houses can produce very different outcomes.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {examples.map((example) => (
                <div
                  key={example.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{example.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {example.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-[#47394b]">
              Do not memorise these examples as predictions. They show why the
              entire chart must be organised around the exact event being
              studied.
            </p>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Houses show the theme. Dashas and transits help show when it may activate.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Even a strong foreign-travel or relocation pattern does not
                operate continuously throughout life.
              </p>

              <p>
                Vimshottari Dasha helps identify periods when planets connected
                with the relevant houses become active.
              </p>

              <p>
                Transits can reinforce those planets and houses and help refine
                the period of manifestation.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natal promise first. Dasha activation second. Transit
                refinement third.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A 12-step method for studying foreign travel and settlement
            </h2>

            <div className="mt-10 space-y-5">
              {analysisSteps.map((step) => (
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading foreign-travel houses?
            </h2>

            <div className="mt-8 space-y-3">
              {mistakes.map((mistake) => (
                <div
                  key={mistake}
                  className="flex gap-4 rounded-xl border border-[#e4d8ca] bg-white p-5"
                >
                  <span className="mt-1 text-[#8b5a79]">✦</span>

                  <p className="leading-7 text-[#65586a]">{mistake}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Sārathi framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Start with the question, not the house number.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The strongest analysis begins by defining the type of foreign
                event before assigning meaning to individual placements.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → D1 promise → 3rd/9th/12th movement factors →
                4th house when residence changes → relevant house lords →
                reason for movement → planetary strength → Sambandha →
                repetition → Dasha → transit activation → likely manifestation.
              </p>

              <p>
                This prevents one-house formulas from being mistaken for
                complete predictions.
              </p>

              <p className="font-semibold text-[#47394b]">
                The planet gives us the vocabulary. The chart gives us the
                sentence.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Frequently asked questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Foreign-travel houses in Vedic astrology
            </h2>

            <div className="mt-8 space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-lg font-semibold">{item.question}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Foreign Travel & Settlement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring this topic
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Link
                href="/sarathi/learn/questions/when-will-i-go-abroad"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Timing
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I go abroad?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how Dashas and transits are used to study stronger
                  travel periods.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/will-i-settle-abroad"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Settlement
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Will I settle abroad?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand the difference between travel, residence and
                  long-term settlement.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/foreign-settlement-yoga-in-kundli"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Natal potential
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Foreign Settlement Yoga
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how repeated natal combinations are evaluated for
                  long-term foreign residence.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">Continue learning</h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              Build the principles behind foreign-travel interpretation through
              the Sārathi Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the complete Bhava framework before interpreting
                  foreign movement.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the lords of movement, distance and residence carry
                  their topics through the chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Judge whether the planets involved have the capacity to
                  support a meaningful event.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">
                  Aspects, Conjunctions & Sambandha
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how movement, residence and purpose-related factors
                  connect.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">
                  Vimshottari Dasha & Planetary Periods
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand when a natal foreign-movement theme becomes active.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how transits refine an already active travel or
                  relocation period.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/predictive-astrology-event-timing"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9] md:col-span-2"
              >
                <p className="font-semibold">
                  Predictive Astrology & Event Timing
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Bring natal promise, strength, Dasha and transit together
                  before making a timing conclusion.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Read the whole chart
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Foreign travel is not hidden in one house.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi brings houses, house lords, planetary strength,
                Sambandha, Dashas and transits together to build a structured
                Vedic astrology interpretation.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/individual"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#4b2744]"
                >
                  Explore your Sārathi
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

          <section className="pt-10">
            <p className="text-sm leading-6 text-[#827685]">
              Sārathi presents Vedic astrology as a traditional interpretive
              framework for reflection and guidance. Different Jyotish
              traditions may assign different emphasis to particular factors.
              Astrology cannot guarantee foreign travel, relocation, visa
              approval, residency, permanent residency or citizenship.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}