import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Love Marriage or Arranged Marriage? Vedic Astrology Explained",
  description:
    "Learn how Vedic astrology studies love marriage and arranged marriage through the 5th and 7th houses, house lords, family factors, Navamsa, Dashas and chart convergence.",
  path: "/sarathi/learn/questions/love-marriage-or-arranged-marriage",
  keywords: [
    "Love Marriage or Arranged Marriage Astrology",
    "Love Marriage Astrology",
    "Arranged Marriage Astrology",
    "Love Marriage Vedic Astrology",
    "5th House Love Marriage",
    "7th House Marriage Astrology",
    "5th Lord 7th Lord Love Marriage",
    "Navamsa Love Marriage",
    "Marriage Astrology",
    "Vedic Astrology Marriage",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Love Marriage or Arranged Marriage? What Vedic Astrology Actually Shows",
  description:
    "A practical guide to how Vedic astrology studies romance, partnership, family involvement and marriage formalisation without reducing love or arranged marriage to one combination.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/love-marriage-or-arranged-marriage",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/love-marriage-or-arranged-marriage",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Love marriage",
    "Arranged marriage",
    "5th house",
    "7th house",
    "Navamsa",
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
      name: "Love Marriage or Arranged Marriage?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/love-marriage-or-arranged-marriage",
    },
  ],
};

const coreFactors = [
  {
    title: "5th House",
    text: "The 5th house is traditionally connected with romance, attraction and emotional involvement. It can help describe how romantic relationships enter the story, but it does not by itself guarantee love marriage.",
  },
  {
    title: "7th House",
    text: "The 7th house is central to committed partnership and marriage. Its Rashi, occupants, lord, aspects and associations help describe the marriage pattern.",
  },
  {
    title: "2nd House",
    text: "The 2nd house can contribute themes of family formation and the family unit. It becomes useful when studying how a relationship moves toward formal family life.",
  },
  {
    title: "11th House",
    text: "The 11th house can contribute fulfilment, materialisation and the achievement of an intention. It is supporting evidence rather than a standalone marriage indicator.",
  },
  {
    title: "House Lords",
    text: "Connections between the lords of romance, marriage and family-related houses can be important, but the quality and strength of those connections must also be judged.",
  },
  {
    title: "Navamsa — D9",
    text: "The Navamsa refines the marriage dimension after the D1 birth chart has established the underlying relationship promise.",
  },
];

const possiblePatterns = [
  {
    title: "Romance becomes marriage",
    text: "A relationship may begin through personal attraction or choice and later develop into formal marriage with family involvement.",
  },
  {
    title: "Family introduces, choice follows",
    text: "A match may originate through family or social networks, while the individuals still develop attraction, compatibility and personal choice before marriage.",
  },
  {
    title: "Relationship with family resistance",
    text: "Romantic involvement may be present while family approval, social expectations or practical circumstances complicate formalisation.",
  },
  {
    title: "Independent partner selection",
    text: "The horoscope may show stronger themes of autonomy or unconventional partner selection, but this still needs to be interpreted within the complete chart.",
  },
  {
    title: "Traditional family involvement",
    text: "Family structures may play a prominent role in partner selection or formalisation without eliminating personal preference or emotional connection.",
  },
  {
    title: "A mixed pathway",
    text: "Many real marriages do not fit neatly into either category. Personal choice and family participation can coexist.",
  },
];

const interpretationSteps = [
  {
    number: "01",
    title: "Define what 'love marriage' means",
    text: "Does it mean choosing a partner independently, knowing the person before family involvement, marrying against family wishes or simply falling in love before marriage? These are not identical events.",
  },
  {
    number: "02",
    title: "Study the 5th house",
    text: "Examine the 5th house, its lord, occupants, aspects and strength for the romance and personal-attraction dimension.",
  },
  {
    number: "03",
    title: "Study the 7th house",
    text: "Examine the marriage house and 7th lord separately. A strong romantic pattern does not automatically mean the relationship becomes marriage.",
  },
  {
    number: "04",
    title: "Look for 5th–7th Sambandha",
    text: "Connections between romance and marriage factors can be meaningful, but their existence, strength and quality must all be assessed.",
  },
  {
    number: "05",
    title: "Add family-related factors",
    text: "Study supporting houses and their lords when asking how family formation, approval or involvement interacts with the relationship.",
  },
  {
    number: "06",
    title: "Judge planetary strength",
    text: "A connection can exist without having equal capacity to manifest. Dignity, placement, dispositor relationships and other strength factors matter.",
  },
  {
    number: "07",
    title: "Examine the Navamsa",
    text: "Use D9 to refine the partnership picture and check whether the broader marriage themes seen in D1 receive further support.",
  },
  {
    number: "08",
    title: "Study the active Dasha",
    text: "Ask which natal relationship factors are actually being activated during the relevant period rather than predicting from static combinations alone.",
  },
  {
    number: "09",
    title: "Add transits",
    text: "Transits can help activate and refine a period already supported by the natal chart and Dasha.",
  },
  {
    number: "10",
    title: "Interpret the pathway, not just the label",
    text: "The stronger question is often how the relationship develops and formalises rather than whether it fits perfectly into 'love' or 'arranged'.",
  },
];

const commonMistakes = [
  "Assuming any connection between the 5th and 7th houses guarantees love marriage.",
  "Treating the 5th house alone as proof that a romantic relationship will become marriage.",
  "Assuming a strong 7th house automatically means arranged marriage.",
  "Using Venus as a universal love-marriage planet without studying its functional role.",
  "Assuming Rahu automatically means an unconventional or inter-caste marriage.",
  "Ignoring the 2nd house and broader family context when studying formalisation.",
  "Reading the Navamsa independently from the D1 birth chart.",
  "Ignoring planetary strength and judging only whether a combination exists.",
  "Predicting marriage type without studying the active Dasha.",
  "Forcing a real relationship into a binary 'love versus arranged' label.",
];

export default function LoveMarriageOrArrangedMarriagePage() {
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
            <span>Marriage & Relationships</span>
            <span>›</span>
            <span className="text-[#4c3e50]">
              Love marriage or arranged marriage?
            </span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Marriage & Relationships · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Love Marriage or Arranged Marriage? What Vedic Astrology Actually
            Shows
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Vedic astrology can study how romance, personal choice, partnership
            and family involvement interact in a horoscope. But reducing the
            answer to a single combination such as “5th house + 7th house =
            love marriage” misses much of the actual interpretation.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              The 5th house can contribute romance and attraction, while the
              7th is central to committed partnership and marriage. Connections
              between them may be important, but the analysis must also consider
              their lords, planetary strength, family-related factors, the
              Navamsa, Dasha and the wider horoscope. In many cases, the chart
              describes a <strong>relationship pathway</strong> more accurately
              than a simple love-versus-arranged label.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Love marriage and arranged marriage are not always opposites.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Real relationships often sit somewhere between the two. A
                couple may meet independently and later involve their families.
                A family may introduce two people who then choose each other
                after developing a relationship.
              </p>

              <p>
                Even the meaning of “love marriage” differs between people,
                families and cultures.
              </p>

              <p>
                Astrology therefore becomes more useful when the question is
                made precise.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Instead of asking only “love or arranged?”, ask how romance,
                choice, family involvement and marriage formalisation connect
                in the horoscope.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Core chart factors
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does Vedic astrology examine?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {coreFactors.map((factor) => (
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

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Does a 5th and 7th house connection guarantee love marriage?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                No. A meaningful Sambandha between the 5th and 7th houses or
                their lords can connect the themes of romance and marriage, but
                that is the beginning of the interpretation rather than the
                conclusion.
              </p>

              <p>
                The connection must be examined for strength, dignity, placement,
                aspects, dispositors and supporting factors elsewhere in the
                horoscope.
              </p>

              <p>
                It is also necessary to ask whether the active planetary periods
                actually bring those factors into expression.
              </p>

              <p className="font-semibold text-[#47394b]">
                A connection tells us that two chart themes interact. It does
                not automatically tell us exactly how that interaction will
                manifest.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Family involvement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How can family involvement appear in the analysis?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Marriage does not occur only through the 7th house. When the
                question specifically concerns family participation,
                acceptance or formalisation, the broader family pattern becomes
                relevant.
              </p>

              <p>
                The 2nd house can contribute family-formation themes, while
                connections among romance, marriage and family-related factors
                may help describe how these areas interact.
              </p>

              <p>
                This still does not create a universal formula for arranged
                marriage. The whole chart must be synthesised.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Real-life pathways
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A chart may describe several different relationship pathways.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {possiblePatterns.map((pattern) => (
                <div
                  key={pattern.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{pattern.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {pattern.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common shortcut
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does Rahu mean an unconventional or love marriage?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Rahu is often associated in modern interpretations with
                unfamiliar environments, crossing boundaries, unconventional
                experiences or departures from established patterns.
              </p>

              <p>
                But Rahu alone cannot tell us that someone will have a love
                marriage, marry outside their community or reject family
                expectations.
              </p>

              <p>
                Its house lordship connections, placement, dispositor,
                Sambandha, strength and Dasha activation all matter.
              </p>

              <p className="font-semibold text-[#47394b]">
                A planetary symbolism is not a complete prediction.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Navamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does the D9 add?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Navamsa or D9 is used to refine marriage and partnership
                analysis after the main birth chart has been studied.
              </p>

              <p>
                It can show whether important relationship themes receive
                further support, modification or complexity in the marriage
                dimension.
              </p>

              <p>
                It should not be used as a separate horoscope from which a
                love-versus-arranged verdict is declared.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the relationship promise. D9 refines the marriage
                dimension.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A romantic relationship and marriage may activate at different
              times.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                One planetary period may activate attraction, dating or the
                beginning of a relationship. Another period may activate
                commitment, family involvement or marriage formalisation.
              </p>

              <p>
                This distinction is important because a strong romantic period
                does not necessarily mean marriage will occur immediately.
              </p>

              <p>
                The Dasha hierarchy helps identify which natal themes are active,
                while transits can help refine broader and narrower timing
                windows.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Relationship begins → commitment develops → families become
                involved → marriage formalises. These can be separate
                astrological events.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should the question actually be analysed?
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why one combination is not enough
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope with a clear connection between the 5th
                  and 7th lords. That may immediately make romance-to-marriage
                  an important possibility to investigate.
                </p>

                <p>
                  Now suppose the same chart also contains strong family-related
                  connections and the eventual marriage period activates both
                  the partnership and family themes.
                </p>

                <p>
                  The person might meet the partner independently, develop a
                  relationship and then marry with active family participation.
                </p>

                <p>
                  Calling this simply “love marriage” may technically answer the
                  question while missing most of the story.
                </p>

                <p className="font-semibold text-[#403344]">
                  Good interpretation describes the pathway supported by the
                  chart instead of forcing the chart into a label.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid?
            </h2>

            <div className="mt-8 space-y-3">
              {commonMistakes.map((mistake) => (
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
              Interpret the relationship pathway, not a formula.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A structured analysis moves from the natal relationship promise
                toward the interaction between romance, marriage, family and
                timing factors.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → 5th house → 5th lord → 7th house → 7th lord →
                family factors → planetary strength → Sambandha → D9 → Dasha →
                transit activation → convergence → relationship pathway.
              </p>

              <p>
                This produces a more useful interpretation than matching one
                placement to one predetermined marriage type.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Marriage & Relationships
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Explore the marriage cluster
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href="/sarathi/learn/questions/when-will-i-get-married"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">
                  When will I get married?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how marriage timing is studied through D1, D9, Dashas
                  and transits.
                </p>
                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/why-is-my-marriage-delayed"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">
                  Why is my marriage delayed?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand why delay should be distinguished from difficulty
                  or denial.
                </p>
                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">Continue learning</h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              Build the concepts used in relationship analysis through the
              Sārathi Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the houses used in romance, marriage and family
                  analysis.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how house lords carry different areas of life through
                  the horoscope.
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
                  Understand how romance, marriage and family factors become
                  connected.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the Navamsa refines the marriage dimension.
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
                  Understand when different natal relationship themes become
                  active.
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
                  See how natal promise, Dasha and transit are synthesised.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Your relationship story is personal
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Your chart may describe much more than a “love” or “arranged”
                label.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you explore how your relationship, partnership and
                timing factors come together through a structured Vedic
                astrology framework.
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
              framework for reflection and guidance. Astrological analysis
              cannot guarantee whether a person will have a love marriage or an
              arranged marriage, determine whom someone will marry or replace
              personal judgement, relationship counselling, legal advice or
              other professional support.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}