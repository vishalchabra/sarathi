import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Property Yoga in Kundli: Will You Own a House or Property?",
  description:
    "Learn how property Yoga is studied in Vedic astrology through the 4th house, 4th lord, planetary strength, financial houses, D4 chart, Dashas and transits.",
  path: "/sarathi/learn/questions/property-yoga-in-kundli",
  keywords: [
    "Property Yoga in Kundli",
    "Property Yoga Astrology",
    "House Yoga in Kundli",
    "Property in Vedic Astrology",
    "Will I Own a House Astrology",
    "4th House Property",
    "Property Purchase Astrology",
    "D4 Chart Property",
    "Chaturthamsha",
    "Property Dasha",
    "Multiple Property Yoga",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Property Yoga in Kundli: Will You Own a House or Property?",
  description:
    "A practical guide to how Vedic astrology studies property potential through the 4th house, house lords, financial capacity, planetary strength, D4, Dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/property-yoga-in-kundli",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/property-yoga-in-kundli",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Property Yoga",
    "4th house",
    "Property astrology",
    "Chaturthamsha",
    "D4 chart",
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
      name: "Property Yoga in Kundli",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/property-yoga-in-kundli",
    },
  ],
};

const propertyTypes = [
  {
    title: "Home Ownership",
    text: "The question may concern acquiring a primary residence — a home intended for personal or family use.",
  },
  {
    title: "Land",
    text: "Land acquisition can form part of property analysis, but the specific nature of the asset should be distinguished from a completed residence.",
  },
  {
    title: "Investment Property",
    text: "Buying property primarily for rental income, capital appreciation or investment introduces a different financial objective from buying a home to live in.",
  },
  {
    title: "Construction",
    text: "Purchasing land and constructing a home is not exactly the same event as purchasing a completed property.",
  },
  {
    title: "Inherited Property",
    text: "Property received through inheritance or shared family resources involves a different mechanism from property acquired through one's own earnings.",
  },
  {
    title: "Multiple Properties",
    text: "The possibility of accumulating more than one property requires stronger and repeated indications rather than simply identifying one favourable property factor.",
  },
];

const propertyFactors = [
  {
    title: "4th House",
    text: "The 4th house is central to property analysis because it relates to home, residence, landed assets, domestic foundations and the experience of having a place of one's own.",
  },
  {
    title: "4th Lord",
    text: "The 4th lord carries the property agenda into another part of the horoscope. Its placement, strength and relationships help show how property matters may develop.",
  },
  {
    title: "2nd House",
    text: "Accumulated resources and financial reserves can become important when the question involves the capacity to acquire and retain an asset.",
  },
  {
    title: "11th House",
    text: "The 11th house can contribute the theme of gains and fulfilment, including the materialisation of a significant objective such as property acquisition.",
  },
  {
    title: "Mars",
    text: "Mars is traditionally associated with land and immovable property in relevant contexts, but it should not be treated as an automatic property-giving planet in every horoscope.",
  },
  {
    title: "Planetary Strength",
    text: "A favourable connection has greater meaning when the planets carrying the property and financial agendas have sufficient strength and support.",
  },
];

const yogaQuestions = [
  {
    title: "Is there a property promise?",
    text: "First determine whether the D1 contains meaningful support for property ownership or acquisition. Timing should not be used to manufacture a promise that has not been established.",
  },
  {
    title: "How strong is the 4th house?",
    text: "Study its occupants, aspects and wider support rather than judging the house from one factor.",
  },
  {
    title: "What is the condition of the 4th lord?",
    text: "Its Rashi, house placement, dignity, dispositor and Sambandha can significantly modify the property story.",
  },
  {
    title: "Is financial capacity connected?",
    text: "Property acquisition normally has a material component, so the chart's accumulation and gain factors should be studied alongside the property promise.",
  },
  {
    title: "Does the D4 support the theme?",
    text: "Chaturthamsha can refine property and fortune related to fixed assets after the D1 promise has been established.",
  },
  {
    title: "When does the promise activate?",
    text: "Dashas and transits help identify when capable property-related factors become more active.",
  },
];

const timingLayers = [
  {
    title: "D1 Promise",
    text: "The birth chart establishes whether property is meaningfully supported and through what planetary relationships.",
  },
  {
    title: "Planetary Capacity",
    text: "The strength and condition of the 4th lord and other relevant planets help show how effectively the property agenda can operate.",
  },
  {
    title: "Sambandha",
    text: "Connections between property, finance, gains and other relevant houses help reveal the mechanism through which acquisition may occur.",
  },
  {
    title: "D4 / Chaturthamsha",
    text: "The D4 can refine the property dimension after the natal promise has been understood.",
  },
  {
    title: "Dasha",
    text: "Mahadasha, Antardasha and finer periods help identify when relevant natal property factors become active.",
  },
  {
    title: "Transit",
    text: "Transits can reinforce the active property pattern and help narrow a broader period toward a more specific window.",
  },
];

const interpretationSteps = [
  {
    number: "01",
    title: "Define the property event",
    text: "Clarify whether the question concerns buying a home, land, construction, investment property, inheritance, relocation or multiple properties.",
  },
  {
    number: "02",
    title: "Begin with the D1",
    text: "Establish the natal property promise before moving to timing systems or divisional charts.",
  },
  {
    number: "03",
    title: "Study the 4th house",
    text: "Examine occupants, aspects and the overall condition of the house associated with home and property.",
  },
  {
    number: "04",
    title: "Study the 4th lord",
    text: "Assess where it is placed, what it connects with and whether it has sufficient capacity to carry the property agenda.",
  },
  {
    number: "05",
    title: "Assess financial support",
    text: "Study accumulated resources, gains and other relevant financial factors because property potential and affordability are not identical questions.",
  },
  {
    number: "06",
    title: "Examine Mars contextually",
    text: "Mars may contribute to land and property themes, but its role must be interpreted through lordship, placement, strength and the exact chart.",
  },
  {
    number: "07",
    title: "Map Sambandha",
    text: "Look for meaningful relationships between the 4th house, 4th lord, financial houses and planets capable of connecting these agendas.",
  },
  {
    number: "08",
    title: "Look for repetition",
    text: "Greater confidence comes when several independent chart factors support property rather than one isolated placement.",
  },
  {
    number: "09",
    title: "Examine the D4",
    text: "Use Chaturthamsha to refine the property dimension after confirming the D1 foundation.",
  },
  {
    number: "10",
    title: "Study the running Dasha",
    text: "Ask whether the active planetary periods involve the 4th house, 4th lord, financial support or other relevant property factors.",
  },
  {
    number: "11",
    title: "Add transit activation",
    text: "Use transits to reinforce and narrow an already active property period rather than predicting purchase from transit alone.",
  },
  {
    number: "12",
    title: "Judge the type and quality of outcome",
    text: "Acquisition, construction, inheritance, relocation and investment are different outcomes. The chart should support the specific event being predicted.",
  },
];

const mistakes = [
  "Assuming a strong 4th house automatically guarantees property ownership.",
  "Treating Mars as a universal property-giving planet.",
  "Assuming Mars Dasha automatically means buying property.",
  "Predicting a house purchase from Jupiter transiting the 4th house alone.",
  "Ignoring the 4th lord while focusing only on the 4th house.",
  "Using the D4 without first establishing the property promise in the D1.",
  "Treating every property event as the same event.",
  "Ignoring financial capacity when predicting acquisition.",
  "Assuming one favourable Yoga guarantees multiple properties.",
  "Confusing relocation or change of residence with ownership.",
  "Ignoring Dasha activation while focusing only on transits.",
  "Using astrology instead of financial and legal due diligence.",
];

const faqItems = [
  {
    question: "Which house shows property in Vedic astrology?",
    answer:
      "The 4th house is central to the study of home, residence and property, but the 4th lord, financial houses, planetary strength, relevant relationships, D4, Dashas and transits should also be examined.",
  },
  {
    question: "Does Mars give property?",
    answer:
      "Mars is traditionally associated with land and immovable property in relevant contexts, but its results depend on functional lordship, placement, strength and the rest of the horoscope.",
  },
  {
    question: "Which chart is used for property?",
    answer:
      "The D1 birth chart establishes the natal property promise. The D4, or Chaturthamsha, can then refine the property and fixed-asset dimension.",
  },
  {
    question: "Can astrology guarantee that I will own a house?",
    answer:
      "No. Astrology can be used to study property potential and timing, but it cannot guarantee ownership or replace affordability, financing and legal considerations.",
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

export default function PropertyYogaPage() {
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

            <span className="text-[#4c3e50]">Property Yoga in Kundli</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Property & Home · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Do I Have Property Yoga in My Kundli? How Vedic Astrology Studies
            Property Ownership
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Property astrology is often reduced to the 4th house, Mars or one
            favourable Yoga. A serious analysis asks a wider question: does the
            horoscope support property, what type of property event is shown,
            how strong is the promise, and when can it become active?
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              Property potential in Vedic astrology is studied primarily
              through the{" "}
              <strong>
                4th house, 4th lord, relevant financial factors, planetary
                strength and meaningful chart connections
              </strong>
              . The D4 or Chaturthamsha can refine the property dimension, while
              Dashas and transits help study timing. No single placement
              guarantees property ownership.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* DEFINE PROPERTY YOGA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does “Property Yoga” actually mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In everyday astrology, the phrase “Property Yoga” is often used
                broadly for combinations that support acquiring a home, land or
                other immovable property.
              </p>

              <p>
                But identifying one favourable combination should not be treated
                as a finished prediction.
              </p>

              <p>
                The strength of the property promise depends on the houses and
                planets involved, their capacity, how often the theme repeats,
                and whether appropriate planetary periods activate it.
              </p>

              <p className="font-semibold text-[#47394b]">
                Property Yoga is better understood as a supported property
                pattern than as one magical combination.
              </p>
            </div>
          </section>

          {/* PROPERTY TYPE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the event
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “Will I own property?” can mean several different things.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Before interpreting the chart, identify the actual property event.
              These outcomes should not automatically be treated as
              interchangeable.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {propertyTypes.map((item) => (
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

          {/* FACTORS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Property factors
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should be examined for property in a Kundli?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {propertyFactors.map((factor) => (
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

          {/* FOURTH HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why is the 4th house important for property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 4th house is traditionally associated with home, residence,
                domestic foundations, land and property-related matters.
              </p>

              <p>
                But simply seeing a planet in the 4th house is not enough to
                predict ownership.
              </p>

              <p>
                We need to examine the house itself, its lord, occupants,
                aspects, Sambandha and whether property themes receive support
                elsewhere in the horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 4th house starts the property enquiry. It does not finish
                it.
              </p>
            </div>
          </section>

          {/* 4TH LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              House lordship
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the 4th lord as important as the 4th house?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The lord of the 4th carries the property agenda to whichever
                house it occupies.
              </p>

              <p>
                Its placement can connect property with profession, gains,
                family resources, foreign residence, partnership or another
                area of life depending on the individual horoscope.
              </p>

              <p>
                Its dignity, dispositor, aspects and conjunctions help us judge
                how effectively it can carry those responsibilities.
              </p>

              <p className="font-semibold text-[#47394b]">
                The house tells us the topic. The house lord shows how that
                topic travels through the chart.
              </p>
            </div>
          </section>

          {/* MARS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A common question
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does Mars give property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Mars is traditionally associated with land and immovable
                property in relevant Jyotish contexts.
              </p>

              <p>
                That does not mean every strong Mars gives property or that Mars
                Dasha automatically produces a house purchase.
              </p>

              <p>
                Mars must still be interpreted according to the houses it rules,
                where it is placed, its strength and its relationship with the
                property factors in the individual horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natural signification provides context. The individual chart
                determines the result.
              </p>
            </div>
          </section>

          {/* FINANCIAL CAPACITY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Property & money
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Property potential and financial capacity are not the same thing.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A horoscope may support the theme of property while the person's
                current financial circumstances are not yet ready for
                acquisition.
              </p>

              <p>
                That is why property analysis can also involve accumulated
                resources, gains, profession, financing and other relevant
                financial factors.
              </p>

              <p>
                A favourable property period may manifest as planning, saving,
                financing, searching, construction or acquisition depending on
                the wider circumstances.
              </p>

              <p className="font-semibold text-[#47394b]">
                Astrological property potential does not replace affordability.
              </p>
            </div>
          </section>

          {/* SIX QUESTIONS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Six questions to ask before calling a Property Yoga strong
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {yogaQuestions.map((item) => (
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

          {/* D4 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Chaturthamsha
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is the D4 chart and why is it used for property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D4, or Chaturthamsha, is a divisional chart traditionally
                used to refine matters connected with property, fixed assets,
                residence and related fortune.
              </p>

              <p>
                But the D4 should not be read as an independent replacement for
                the birth chart.
              </p>

              <p>
                First establish the property promise in the D1. Then use the D4
                to examine whether the same property theme receives further
                support or refinement.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the property promise. D4 refines the property
                dimension.
              </p>
            </div>
          </section>

          {/* TIMING */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              When can Property Yoga become active?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {timingLayers.map((item) => (
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
                D1 promise → planetary capacity → D4 refinement → Dasha
                activation → transit support → property event
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Which Dasha can give property?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                There is no universal Dasha that gives property to everyone.
              </p>

              <p>
                A property period becomes more plausible when the running
                Mahadasha, Antardasha or finer period activates capable planets
                connected with the 4th house, 4th lord, property significations,
                financial support or related chart factors.
              </p>

              <p>
                The relevant planet may differ from one horoscope to another
                because house lordship changes with the Ascendant.
              </p>

              <p className="font-semibold text-[#47394b]">
                The Dasha does not invent property. It activates the natal
                property agenda already contained in the horoscope.
              </p>
            </div>
          </section>

          {/* TRANSITS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter or Saturn transit trigger a property purchase?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Major transits can become important when they activate relevant
                property factors, but they should not be treated as standalone
                guarantees.
              </p>

              <p>
                Jupiter entering or aspecting a property-related area does not
                automatically mean that everyone experiencing that transit will
                buy a house.
              </p>

              <p>
                Stronger timing appears when natal promise, Dasha and transit
                independently support the same event.
              </p>

              <p className="font-semibold text-[#47394b]">
                Transit helps time a promise. It should not manufacture one.
              </p>
            </div>
          </section>

          {/* MULTIPLE PROPERTY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Scale
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Can a Kundli show the potential for multiple properties?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The possibility of accumulating several properties should
                require stronger evidence than the possibility of one
                significant property acquisition.
              </p>

              <p>
                We would look for repeated support involving property, financial
                capacity, gains, asset accumulation and the relevant timing
                periods.
              </p>

              <p>
                Multiple favourable periods across life may also be more
                meaningful than trying to infer the exact number of properties
                from one combination.
              </p>

              <p className="font-semibold text-[#47394b]">
                Astrology may suggest stronger or repeated property potential.
                It should not be used to promise an exact property count.
              </p>
            </div>
          </section>

          {/* METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should Property Yoga actually be analysed?
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

          {/* EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why a strong property promise may not produce a house immediately
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope with a capable 4th lord, meaningful
                  connections between property and gain factors, and supporting
                  indications in the D4.
                </p>

                <p>
                  The property promise appears strong, but the person spends
                  several years in planetary periods that primarily activate
                  education, career building or other areas of life.
                </p>

                <p>
                  A later Dasha activates the 4th lord and financial support
                  simultaneously. Major transits then reinforce the same
                  property pattern.
                </p>

                <p>
                  At the same time, the person's real-world savings and
                  financing position have improved.
                </p>

                <p className="font-semibold text-[#403344]">
                  The property promise existed earlier. Timing and practical
                  capacity determined when acquisition became realistic.
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
              What should you avoid when reading property in a chart?
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
              Property should be judged through convergence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A reliable property analysis moves from the exact event to natal
                promise, capacity, refinement and timing.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact property question → D1 promise → 4th house → 4th lord →
                financial support → Mars contextually → planetary strength →
                Sambandha → repetition → D4 → Dasha → transit activation →
                specific property event.
              </p>

              <p>
                This prevents one planet, one Yoga or one transit from becoming
                an exaggerated promise of property ownership.
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
              Property Yoga questions
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

          {/* RELATED PROPERTY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Property & Home
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring property timing
            </h2>

            <div className="mt-8">
              <Link
                href="/sarathi/learn/questions/when-will-i-buy-a-house"
                className="block rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Property Timing
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I buy a house?
                </h3>

                <p className="mt-3 max-w-2xl leading-7 text-[#6a5d6e]">
                  Learn how Vedic astrology studies the timing of property
                  acquisition through natal promise, D4, Dashas and transits.
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
                  Understand the 4th house and the wider house framework.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the 4th lord carries the property agenda through the
                  horoscope.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why a property connection and its capacity are
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
                  Learn how property and financial factors become connected.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the role of D4 and other Vargas without replacing
                  the D1.
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
                  Learn how natal property factors become active over time.
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
                  Bring promise, strength, Dasha and transit together into a
                  structured property judgement.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Your property pattern is personal
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Property is more than one house, one planet or one Yoga.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you explore how your 4th house, house lord,
                planetary strength, D4, Dashas and timing factors work together
                through a structured Vedic astrology framework.
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
              cannot guarantee property ownership, a property purchase, asset
              appreciation, financing approval or any specific financial
              outcome. Property decisions should also consider affordability,
              financing, taxation, legal due diligence and qualified
              professional advice.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}