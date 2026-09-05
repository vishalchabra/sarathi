import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Which House Shows Property in Vedic Astrology?",
  description:
    "Learn why the 4th house is central to property in Vedic astrology and how the 4th lord, Mars, financial houses, D4, Dashas and transits complete the analysis.",
  path: "/sarathi/learn/questions/which-house-shows-property-vedic-astrology",
  keywords: [
    "Which House Shows Property in Vedic Astrology",
    "4th House Property Astrology",
    "Property House in Kundli",
    "Property in Vedic Astrology",
    "4th House Vedic Astrology",
    "4th Lord Property",
    "Mars Property Astrology",
    "D4 Chart Property",
    "Chaturthamsha Property",
    "House Purchase Astrology",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Which House Shows Property in Vedic Astrology?",
  description:
    "A practical guide to the 4th house and the wider chart framework used to study property, including the 4th lord, Mars, financial support, D4, Dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-property-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-property-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "4th house",
    "Property astrology",
    "4th lord",
    "Mars",
    "D4 chart",
    "Chaturthamsha",
    "Property timing",
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
      name: "Which House Shows Property in Vedic Astrology?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-house-shows-property-vedic-astrology",
    },
  ],
};

const houseFactors = [
  {
    title: "4th House",
    text: "The 4th house is the primary house for home, residence, land, property and domestic foundations. It begins the property analysis, but it does not provide the full answer by itself.",
  },
  {
    title: "4th Lord",
    text: "The lord of the 4th carries the property agenda into another part of the horoscope. Its placement, strength and relationships can show how property matters develop.",
  },
  {
    title: "2nd House",
    text: "Accumulated resources and savings can become relevant because property acquisition often requires financial capacity and the ability to retain assets.",
  },
  {
    title: "11th House",
    text: "The 11th house can contribute gains, fulfilment and the materialisation of major objectives, including property acquisition when supported by the rest of the chart.",
  },
  {
    title: "Mars",
    text: "Mars is traditionally associated with land and immovable property in relevant contexts, but it must still be interpreted through functional lordship, placement and strength.",
  },
  {
    title: "D4 / Chaturthamsha",
    text: "The D4 is used to refine the property and fixed-asset dimension after the property promise has first been established in the D1.",
  },
];

const propertyQuestions = [
  {
    title: "Buying a Home",
    text: "A primary residence involves the 4th-house theme directly, but financial capacity and timing must also support acquisition.",
  },
  {
    title: "Buying Land",
    text: "Land may involve strong property factors and Mars contextually, but should still be judged within the wider chart.",
  },
  {
    title: "Building a House",
    text: "Construction is not identical to buying a completed home. The sequence may involve land acquisition, financing, building activity and eventual occupation.",
  },
  {
    title: "Investment Property",
    text: "Property purchased primarily for returns introduces stronger financial, gain and asset-accumulation considerations.",
  },
  {
    title: "Inherited Property",
    text: "Inheritance involves a different mechanism from buying property through one's own income and may require additional chart factors.",
  },
  {
    title: "Change of Residence",
    text: "Moving house is not automatically the same as acquiring property. Residence, relocation and ownership should be separated.",
  },
];

const fourthHouseThemes = [
  "Home and residence",
  "Domestic environment",
  "Land and immovable property",
  "Sense of rootedness",
  "Residential comfort",
  "Fixed assets in relevant contexts",
];

const analysisSteps = [
  {
    number: "01",
    title: "Define the property question",
    text: "Clarify whether the person is asking about home ownership, land, construction, investment property, inheritance or simply a change of residence.",
  },
  {
    number: "02",
    title: "Study the 4th house",
    text: "Examine occupants, aspects and the overall condition of the primary house connected with property and residence.",
  },
  {
    number: "03",
    title: "Study the 4th lord",
    text: "See where the 4th lord is placed, what it rules, what it connects with and whether it has sufficient capacity to carry the property agenda.",
  },
  {
    number: "04",
    title: "Judge planetary strength",
    text: "A relevant property connection matters more when the planets involved are sufficiently supported by dignity, placement and dispositor relationships.",
  },
  {
    number: "05",
    title: "Map Sambandha",
    text: "Look for meaningful relationships between the 4th house, 4th lord, financial houses, gains and other factors relevant to the specific property event.",
  },
  {
    number: "06",
    title: "Examine Mars contextually",
    text: "Mars can support land or immovable-property themes, but its role depends on the individual horoscope rather than a universal rule.",
  },
  {
    number: "07",
    title: "Assess financial capacity",
    text: "Property potential and the ability to finance an acquisition are different questions. Savings, income, gains and liabilities may all matter.",
  },
  {
    number: "08",
    title: "Look for repetition",
    text: "A stronger property promise is usually supported by several independent chart factors rather than one favourable placement.",
  },
  {
    number: "09",
    title: "Use the D4",
    text: "After confirming the D1 promise, study Chaturthamsha to refine the property and fixed-asset dimension.",
  },
  {
    number: "10",
    title: "Study the running Dasha",
    text: "Look for planetary periods that activate the 4th house, 4th lord, property significations or supporting financial factors.",
  },
  {
    number: "11",
    title: "Add transit support",
    text: "Use transits to refine an already active property period rather than predicting ownership from a transit alone.",
  },
  {
    number: "12",
    title: "Match the chart to the exact event",
    text: "Do not call every 4th-house activation a property purchase. The event could manifest as relocation, renovation, family property matters or another residential development.",
  },
];

const mistakes = [
  "Assuming the 4th house alone guarantees property ownership.",
  "Ignoring the 4th lord.",
  "Treating every planet in the 4th house as a property-giving planet.",
  "Assuming Mars always gives land or property.",
  "Predicting property from Mars Dasha alone.",
  "Treating Jupiter in or aspecting the 4th as an automatic house purchase.",
  "Ignoring financial capacity and affordability.",
  "Using the D4 without first reading the D1.",
  "Confusing relocation with ownership.",
  "Confusing family property with self-acquired property.",
  "Using one transit as the entire timing method.",
  "Ignoring the exact type of property event being asked about.",
];

const faqItems = [
  {
    question: "Which house represents property in Vedic astrology?",
    answer:
      "The 4th house is the primary house associated with home, residence, land and property. A complete analysis also studies the 4th lord, planetary strength, financial support, D4, Dashas and transits.",
  },
  {
    question: "Which planet represents property?",
    answer:
      "Mars is traditionally associated with land and immovable property in relevant contexts, but there is no universal planet that guarantees property ownership in every horoscope.",
  },
  {
    question: "Which divisional chart is used for property?",
    answer:
      "The D4, or Chaturthamsha, is commonly used to refine property, residence and fixed-asset matters after the D1 birth chart has established the natal promise.",
  },
  {
    question: "Does a strong 4th house guarantee a house?",
    answer:
      "No. A strong 4th house can support property and residential themes, but ownership also depends on the 4th lord, financial capacity, wider chart support and timing.",
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

export default function WhichHouseShowsPropertyPage() {
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

            <span>Property & Home</span>

            <span>›</span>

            <span className="text-[#4c3e50]">
              Which house shows property?
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Property & Home · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Which House Shows Property in Vedic Astrology?
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            The 4th house is the starting point for studying home, residence,
            land and property in a Vedic birth chart. But “4th house =
            property” is only the first layer. Ownership, timing and the type of
            property event require a much wider analysis.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              The <strong>4th house is the primary house for property</strong>{" "}
              in Vedic astrology. A complete property analysis also examines
              the 4th lord, occupants, aspects, planetary strength, financial
              houses, Mars contextually, the D4 or Chaturthamsha, Dashas and
              transits.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* FOURTH HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Primary house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why does the 4th house represent property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In Jyotish, the 4th house is connected with the foundations of
                one's private and domestic life.
              </p>

              <p>
                This includes home, residence, domestic comfort and, in
                relevant contexts, land and immovable property.
              </p>

              <p>
                That makes the 4th the natural starting point whenever the
                question concerns buying a home, owning land or building a
                residential foundation.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 4th house tells us where to begin. It does not give the
                entire property prediction by itself.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {fourthHouseThemes.map((theme) => (
                <div
                  key={theme}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-5"
                >
                  <p className="font-semibold">{theme}</p>
                </div>
              ))}
            </div>
          </section>

          {/* WHOLE FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Beyond one house
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What else must be studied besides the 4th house?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A house cannot be interpreted independently from its lord,
              planetary influences and the wider chart.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {houseFactors.map((factor) => (
                <div
                  key={factor.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{factor.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {factor.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FOURTH LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              House lordship
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the 4th lord so important?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 4th house identifies the property domain. The planet ruling
                that house carries the domain elsewhere in the horoscope.
              </p>

              <p>
                If the 4th lord connects with financial houses, professional
                houses, gain factors or another important area, it may reveal
                part of the mechanism through which property matters develop.
              </p>

              <p>
                Its dignity, house placement, dispositor, aspects and
                conjunctions also help determine how effectively it can
                discharge its responsibilities.
              </p>

              <p className="font-semibold text-[#47394b]">
                The house tells us the subject. The house lord carries the
                subject through the chart.
              </p>
            </div>
          </section>

          {/* PROPERTY EVENTS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the event
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Not every 4th-house event is a property purchase.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The 4th house covers a wider domestic and residential field.
              Before predicting property, the exact real-life event must be
              defined.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {propertyQuestions.map((item) => (
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

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Residence, relocation, ownership, construction and inheritance
                are related property themes — but they are not identical
                events.
              </p>
            </div>
          </section>

          {/* MARS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Property karaka
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which planet represents property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Mars is traditionally associated with land and immovable
                property in relevant Jyotish contexts.
              </p>

              <p>
                But a natural signification should never be converted into a
                universal event formula.
              </p>

              <p>
                Mars may rule completely different houses for different
                Ascendants. Its placement, dignity and relationship with the 4th
                house must therefore be considered.
              </p>

              <p className="font-semibold text-[#47394b]">
                Mars can contribute to the property story. Mars alone does not
                write the story.
              </p>
            </div>
          </section>

          {/* MONEY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Financial support
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why are the 2nd and 11th houses relevant to property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Property ownership is not only a residential event. In most
                real-life situations it is also a substantial financial event.
              </p>

              <p>
                The 2nd house can contribute the theme of accumulated resources
                and savings, while the 11th can contribute gains and the
                fulfilment of an important material objective.
              </p>

              <p>
                That does not mean every property analysis requires a rigid
                2nd–4th–11th formula. The exact relationships must emerge from
                the individual horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                Property promise and financial capacity should be studied
                together — but they are still different questions.
              </p>
            </div>
          </section>

          {/* D4 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Divisional chart
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which divisional chart is used for property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D4, called Chaturthamsha, is traditionally used to refine
                matters connected with property, fixed assets, residence and
                related fortune.
              </p>

              <p>
                It should not be used independently from the D1.
              </p>

              <p>
                If the birth chart establishes a meaningful property promise,
                the D4 can help refine the strength and expression of that
                dimension.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the promise. D4 refines the property dimension.
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How does Dasha affect property timing?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Natal promise and event timing are separate layers.
              </p>

              <p>
                A strong property indication may remain relatively quiet until
                planetary periods connected with the 4th house, 4th lord,
                property significations or supporting financial factors become
                active.
              </p>

              <p>
                Mahadasha, Antardasha and finer periods can help identify when
                those natal agendas move to the foreground.
              </p>

              <p className="font-semibold text-[#47394b]">
                The Dasha does not create property potential. It activates the
                relevant natal agenda.
              </p>
            </div>
          </section>

          {/* TRANSITS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can a transit through the 4th house mean buying a house?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Not automatically.
              </p>

              <p>
                Jupiter, Saturn or another planet activating the 4th house may
                increase emphasis on home and residential matters, but the
                resulting event can vary considerably.
              </p>

              <p>
                It might coincide with relocation, renovation, family changes,
                property planning or acquisition depending on the natal promise
                and Dasha.
              </p>

              <p className="font-semibold text-[#47394b]">
                Transit tells us what is being activated now. Natal promise and
                Dasha help tell us what that activation is capable of becoming.
              </p>
            </div>
          </section>

          {/* METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should the property houses actually be analysed?
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

          {/* EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why 4th-house activation does not always mean ownership
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a chart entering a strong period connected with the
                  4th house.
                </p>

                <p>
                  The native changes residence, improves the living environment
                  and spends substantially on the home.
                </p>

                <p>
                  The 4th-house theme is clearly active, but the person does not
                  purchase property during that period.
                </p>

                <p>
                  Several years later, another Dasha connects the 4th house with
                  gains and accumulated resources, while the D4 and major
                  transits support the same property theme.
                </p>

                <p>
                  That later period coincides with actual acquisition.
                </p>

                <p className="font-semibold text-[#403344]">
                  Both periods activated the 4th house. The wider convergence
                  helped distinguish residential activity from property
                  ownership.
                </p>
              </div>
            </div>
          </section>

          {/* MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading property houses?
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

          {/* FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Sārathi framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The 4th house begins the enquiry. Convergence completes it.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A structured property analysis moves from the primary house into
                the wider natal, divisional and timing framework.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact property question → 4th house → 4th lord → planetary
                strength → Sambandha → Mars contextually → financial support →
                repetition → D4 → Dasha → transit activation → exact property
                event.
              </p>

              <p>
                This prevents the simple equation “4th house = house purchase”
                from becoming an unsupported prediction.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Frequently asked questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Property houses in Vedic astrology
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

          {/* RELATED */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Property & Home
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring property
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href="/sarathi/learn/questions/property-yoga-in-kundli"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Property Potential
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Do I have Property Yoga in my Kundli?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how multiple chart factors combine to create a stronger
                  property promise.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/when-will-i-buy-a-house"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Property Timing
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I buy a house?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand how Dasha, D4 and transits are used to study a
                  property-purchase window.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>
            </div>
          </section>

          {/* LEARNING */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">Continue learning</h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              Build the chart-reading principles used in property analysis
              through the Sārathi Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the 4th house within the complete Bhava framework.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the 4th lord carries the property agenda through the
                  chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why property relevance and delivery capacity are
                  separate questions.
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
                  Learn how property factors connect with gains, finance and
                  other areas of life.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the purpose of the D4 and why the D1 remains the
                  foundation.
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
                  Learn how natal property themes become active over time.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transits refine an already active property
                  period.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/predictive-astrology-event-timing"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">
                  Predictive Astrology & Event Timing
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  See how natal promise, strength, Dasha and transit combine
                  into an event judgement.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Go beyond one house
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                The 4th house identifies the property theme. Your whole chart
                explains how that theme can develop.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you understand how houses, house lords,
                planetary strength, divisional charts, Dashas and transits work
                together through a structured Vedic astrology framework.
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

          {/* DISCLAIMER */}
          <section className="pt-10">
            <p className="text-sm leading-6 text-[#827685]">
              Sārathi presents Vedic astrology as a traditional interpretive
              framework for reflection and guidance. Astrological analysis
              cannot guarantee property ownership, financing approval, asset
              appreciation or any specific financial outcome. Property decisions
              should also consider affordability, financing, legal due
              diligence, taxation and qualified professional advice.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}