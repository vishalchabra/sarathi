import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Divisional Charts in Vedic Astrology: Vargas Explained",
  description:
    "Learn how divisional charts or Vargas work in Vedic astrology, why D1 remains the foundation, and how D9, D10, D7, D12, D30 and other Vargas refine specific areas of a birth chart.",
  path: "/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology",
  keywords: [
    "Divisional Charts Vedic Astrology",
    "Varga Charts",
    "D9 Navamsa",
    "D10 Dasamsa",
    "D7 Saptamsa",
    "D12 Dwadasamsa",
    "D30 Trimsamsa",
    "Vedic Astrology Vargas",
    "How to Read Divisional Charts",
    "Jyotish Divisional Charts",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Divisional Charts in Vedic Astrology: How Vargas Refine the Birth Chart",
  description:
    "A beginner guide to understanding divisional charts, the relationship between D1 and Vargas, and the roles of D9, D10, D7, D12, D30 and other important charts.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Divisional charts",
    "Vargas",
    "Navamsa",
    "Dasamsa",
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
      name: "Divisional Charts",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology",
    },
  ],
};

const importantVargas = [
  {
    chart: "D1",
    name: "Rashi",
    division: "1",
    focus: "Main birth chart",
    description:
      "The primary horoscope and foundation of interpretation. It establishes the overall natal structure and must be studied before specialised Vargas.",
  },
  {
    chart: "D2",
    name: "Hora",
    division: "2",
    focus: "Wealth & resources",
    description:
      "Used in traditions of Jyotish to examine wealth, resources and the financial dimension of the horoscope.",
  },
  {
    chart: "D3",
    name: "Drekkana",
    division: "3",
    focus: "Siblings & initiative",
    description:
      "Commonly examined for siblings, courage, effort and themes related to the third-house domain.",
  },
  {
    chart: "D4",
    name: "Chaturthamsa",
    division: "4",
    focus: "Property & fortune",
    description:
      "Used to refine matters of property, residence, fixed assets and related fortune.",
  },
  {
    chart: "D7",
    name: "Saptamsa",
    division: "7",
    focus: "Children & progeny",
    description:
      "A specialised chart used when examining children, progeny and the continuation of lineage.",
  },
  {
    chart: "D9",
    name: "Navamsa",
    division: "9",
    focus: "Dharma, marriage & planetary strength",
    description:
      "One of the most important Vargas. It is widely used to deepen assessment of planetary strength, dharma and marriage.",
  },
  {
    chart: "D10",
    name: "Dasamsa",
    division: "10",
    focus: "Career & professional activity",
    description:
      "Used to refine professional themes, work, responsibility, status and the expression of career potential.",
  },
  {
    chart: "D12",
    name: "Dwadasamsa",
    division: "12",
    focus: "Parents & lineage",
    description:
      "Used to examine parental and ancestral themes and inherited family patterns.",
  },
  {
    chart: "D16",
    name: "Shodasamsa",
    division: "16",
    focus: "Vehicles & comforts",
    description:
      "Traditionally used for vehicles, comforts and certain dimensions of material happiness.",
  },
  {
    chart: "D20",
    name: "Vimsamsa",
    division: "20",
    focus: "Spiritual practice",
    description:
      "Used in the study of spiritual practice, worship and religious or contemplative development.",
  },
  {
    chart: "D24",
    name: "Chaturvimshamsa",
    division: "24",
    focus: "Education & learning",
    description:
      "Used to refine themes involving education, knowledge, study and learning.",
  },
  {
    chart: "D30",
    name: "Trimsamsa",
    division: "30",
    focus: "Adversity & difficulties",
    description:
      "Traditionally examined for difficulties, vulnerabilities and challenging experiences.",
  },
  {
    chart: "D60",
    name: "Shashtiamsa",
    division: "60",
    focus: "Subtle karmic pattern",
    description:
      "A highly sensitive Varga used in deeper analysis. Because its Ascendant and planetary positions can change rapidly, accurate birth time is especially important.",
  },
];

const readingSteps = [
  {
    number: "01",
    title: "Establish the D1 promise",
    text: "Before opening a Varga, determine what the main birth chart says about the topic.",
  },
  {
    number: "02",
    title: "Choose the relevant Varga",
    text: "Use the divisional chart associated with the subject being studied rather than reading every Varga indiscriminately.",
  },
  {
    number: "03",
    title: "Identify the Varga Lagna and Lagna lord",
    text: "Study the Ascendant of the divisional chart and the placement and condition of its ruler.",
  },
  {
    number: "04",
    title: "Study the topic-specific house and lord",
    text: "Even within a specialised Varga, houses and their lords continue to matter.",
  },
  {
    number: "05",
    title: "Track the relevant D1 planets into the Varga",
    text: "See how planets carrying the natal promise are positioned and supported in the specialised chart.",
  },
  {
    number: "06",
    title: "Assess dignity and relationships",
    text: "Study sign placement, conjunctions, aspects and relevant planetary relationships inside the Varga.",
  },
  {
    number: "07",
    title: "Look for repetition between D1 and the Varga",
    text: "Repeated themes across the main chart and specialised chart strengthen confidence in the interpretation.",
  },
  {
    number: "08",
    title: "Only then add Dasha and transits",
    text: "The natal structure and Varga provide the promise and refinement; timing techniques help identify activation.",
  },
];

export default function DivisionalChartsPage() {
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
            <span className="text-[#4c3e50]">Divisional Charts</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 11 · Deeper Chart Analysis
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Divisional Charts: How Vargas Reveal Greater Detail Within the
            Birth Chart
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            The D1 chart gives us the main architecture of the horoscope.
            Divisional charts allow us to examine particular dimensions of
            that architecture at a finer level.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The eleventh principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>
                D1 shows the main promise. A Varga examines a specific
                dimension of that promise in greater detail.
              </strong>
              <br />
              <br />
              A divisional chart should refine the natal interpretation, not
              become a replacement horoscope.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS VARGA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is a Varga?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Sanskrit word <strong>Varga</strong> refers to a division.
              </p>

              <p>
                In divisional-chart calculation, each 30-degree Rashi is
                divided into a specified number of smaller portions.
              </p>

              <p>
                Those portions are mapped according to traditional rules to
                produce a specialised chart.
              </p>

              <p>
                For example, Navamsa is the ninth division, so each Rashi is
                divided into nine portions of 3°20′ each.
              </p>

              <p>
                Dasamsa is based on ten divisions of each Rashi, while Saptamsa
                uses seven.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                A Varga is derived from the same natal planetary degrees. It is
                not a second, unrelated birth chart.
              </p>
            </div>
          </section>

          {/* WHY VARGAS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Why Jyotish uses them
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              One horoscope contains many dimensions of life.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D1 must represent career, marriage, family, wealth,
                education, children, property, health, spirituality and many
                other areas simultaneously.
              </p>

              <p>
                Vargas provide a way of examining particular dimensions of
                those natal themes more closely.
              </p>

              <p>
                The D10 can add depth to professional analysis. The D7 can add
                depth to matters of children. The D9 has several important
                applications, including marriage, dharma and the deeper
                assessment of planetary strength.
              </p>

              <p>
                But the specialised chart does not erase what the D1 already
                shows.
              </p>
            </div>
          </section>

          {/* MICROSCOPE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A useful analogy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Think of a Varga as changing the magnification.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">D1</p>

                <h3 className="mt-2 text-2xl font-semibold">
                  The wider landscape
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Shows the broad architecture, house relationships and natal
                  promise across the entire life.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">Varga</p>

                <h3 className="mt-2 text-2xl font-semibold">
                  A closer examination
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Allows us to study a particular dimension of that natal
                  structure with greater specificity.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Changing magnification does not change the subject being
                examined.
              </p>
            </div>
          </section>

          {/* D1 FIRST */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Always begin with D1.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose someone asks about career.
              </p>

              <p>
                We should not immediately open the D10 and attempt to predict
                professional life from it.
              </p>

              <p>
                First examine the 10th house, 10th lord, relevant career
                houses, planetary strength and relationships in the D1.
              </p>

              <p>
                Once the career promise is understood in the main chart, the
                D10 can help us examine that professional dimension more
                closely.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                D1 establishes the theme. The relevant Varga refines it.
              </p>
            </div>
          </section>

          {/* IMPORTANT VARGAS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Reference guide
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Important divisional charts
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Jyotish contains many Vargas. You do not need to use all of them
              at once. These are some of the commonly studied divisional
              charts.
            </p>

            <div className="mt-10 space-y-5">
              {importantVargas.map((varga) => (
                <div
                  key={varga.chart}
                  className="rounded-3xl border border-[#e3d5c5] bg-white p-6 md:p-8"
                >
                  <div className="grid gap-6 md:grid-cols-[100px_1fr]">
                    <div>
                      <p className="text-3xl font-semibold text-[#4b2744]">
                        {varga.chart}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        <h3 className="text-2xl font-semibold">{varga.name}</h3>

                        <span className="text-sm text-[#817382]">
                          {varga.division === "1"
                            ? "Main chart"
                            : `${varga.division} divisions per Rashi`}
                        </span>
                      </div>

                      <p className="mt-4 font-semibold text-[#8b5a79]">
                        {varga.focus}
                      </p>

                      <p className="mt-3 leading-7 text-[#65586a]">
                        {varga.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* D9 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The Navamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why is the D9 given so much importance?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The <strong>Navamsa or D9</strong> is one of the most important
                divisional charts in Jyotish.
              </p>

              <p>
                It is widely examined in matters of marriage and partnership,
                but reducing the D9 to only a “marriage chart” is incomplete.
              </p>

              <p>
                Navamsa is also used in deeper assessment of planetary dignity,
                strength and dharmic expression.
              </p>

              <p>
                Each Rashi is divided into nine portions of 3°20′, which is why
                the Nakshatra Padas learned in Lesson 8 connect directly with
                Navamsa.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                D9 is important, but it still does not replace the D1.
              </p>
            </div>
          </section>

          {/* VARGOTTAMA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              An important concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does Vargottama mean?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A planet is commonly called <strong>Vargottama</strong> when it
                occupies the same Rashi in the D1 and D9.
              </p>

              <p>
                This repetition is traditionally considered significant in the
                assessment of planetary strength and consistency.
              </p>

              <p>
                But Vargottama should not be translated into “this planet will
                automatically give good results.”
              </p>

              <p>
                House lordship, house placement, aspects, conjunctions and the
                planet&apos;s overall role still matter.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Repetition can strengthen a planetary pattern. It does not
                change what that planet is responsible for.
              </p>
            </div>
          </section>

          {/* D10 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The Dasamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              D10 adds depth to professional analysis.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The <strong>Dasamsa or D10</strong> is commonly used to refine
                career and professional interpretation.
              </p>

              <p>
                But career should first be established from the D1 through the
                10th house, 10th lord and other relevant houses and planets.
              </p>

              <p>
                We can then examine the D10 Lagna, D10 Lagna lord, 10th house,
                10th lord and the placement of important career planets within
                the D10.
              </p>

              <p>
                If a professional theme repeats between D1 and D10, confidence
                in that interpretation can increase.
              </p>
            </div>
          </section>

          {/* WORKED CAREER EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How D1 and D10 can work together
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Suppose the D1 shows a strong relationship between the{" "}
                  <strong>10th and 11th houses</strong>.
                </p>

                <p>
                  This can connect profession with gains, networks, fulfilment
                  or achievement.
                </p>

                <p>
                  That is our first indication.
                </p>

                <p>
                  We then examine the D10.
                </p>

                <p>
                  Suppose important career planets again connect with the D10
                  10th or 11th houses.
                </p>

                <p>
                  The professional-gains theme has now repeated at another
                  level.
                </p>

                <p>
                  If the relevant planets also operate through Dasha, the theme
                  becomes temporally activated.
                </p>

                <p className="font-semibold text-[#403344]">
                  D1 gives the promise. D10 refines the professional dimension.
                  Dasha activates the relevant planets.
                </p>
              </div>
            </div>
          </section>

          {/* D7 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The Saptamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              D7 refines matters related to children.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                When studying children or progeny, we begin with the relevant
                promise in the D1.
              </p>

              <p>
                This commonly includes the 5th house, 5th lord, Jupiter and
                other relevant factors depending on the question.
              </p>

              <p>
                The D7 can then provide an additional layer of analysis.
              </p>

              <p>
                We do not reject the D1 because the D7 looks different. Instead
                we ask how the two charts qualify and refine one another.
              </p>
            </div>
          </section>

          {/* D12 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The Dwadasamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              D12 adds depth to parental and lineage themes.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The <strong>D12 or Dwadasamsa</strong> is traditionally used
                when examining parents, ancestry and inherited family themes.
              </p>

              <p>
                As always, the relevant houses and significators should first
                be studied in D1.
              </p>

              <p>
                The D12 then provides a specialised layer through which those
                themes can be examined more closely.
              </p>
            </div>
          </section>

          {/* D30 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The Trimsamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              D30 is used in the study of adversity and vulnerabilities.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The <strong>D30 or Trimsamsa</strong> is traditionally examined
                when studying difficulties, misfortunes and challenging
                experiences.
              </p>

              <p>
                It should not be treated as a chart of inevitable suffering.
              </p>

              <p>
                The purpose is to refine themes already relevant in the main
                horoscope, not to search the D30 for frightening standalone
                predictions.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                A difficult-looking Varga is not permission to make
                deterministic or fear-based predictions.
              </p>
            </div>
          </section>

          {/* BIRTH TIME */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Precision matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Higher Vargas become increasingly sensitive to birth time.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                As the zodiac is divided into increasingly smaller portions,
                relatively small changes in planetary or Ascendant degree can
                alter divisional-chart placements.
              </p>

              <p>
                The Ascendant is particularly sensitive because it moves
                continuously with time.
              </p>

              <p>
                Higher divisions therefore demand greater caution when birth
                time is uncertain.
              </p>

              <p>
                D60 is an especially clear example: each 30-degree Rashi is
                divided into sixty portions of only 0°30′ each.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Greater divisional precision requires greater birth-data
                precision.
              </p>
            </div>
          </section>

          {/* HOW TO READ */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A practical method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should you use a divisional chart?
            </h2>

            <div className="mt-10 space-y-5">
              {readingSteps.map((step) => (
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

          {/* SAME PLANET DIFFERENT VARGA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A deeper principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The same planet can appear differently across Vargas.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A planet may occupy one Rashi in D1 and another in D9 or D10.
              </p>

              <p>
                This does not mean one chart is correct and another is wrong.
              </p>

              <p>
                The charts are examining different divisional expressions of
                the same natal longitude.
              </p>

              <p>
                The contrast itself can become meaningful when interpreted
                through the purpose of the relevant Varga.
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common beginner mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid with divisional charts?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Do not read a Varga before establishing the relevant promise in D1.",
                "Do not treat D9 as only a marriage chart.",
                "Do not use D10 as a replacement for the D1 career analysis.",
                "Do not assume a strong planet in one Varga guarantees a favourable event.",
                "Do not treat a weak-looking Varga as proof that an area of life must fail.",
                "Do not ignore the Varga Lagna and its lord.",
                "Do not ignore houses and house lordship inside the divisional chart.",
                "Do not compare Vargas without remembering that each has a specific interpretive purpose.",
                "Do not use higher Vargas casually when birth time is uncertain.",
                "Do not search divisional charts for isolated combinations that contradict the entire natal framework.",
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

          {/* CONVERGENCE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The principle of convergence
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Repetition across charts matters more than an isolated
              combination.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the D1 contains one moderate indication for a
                professional theme.
              </p>

              <p>
                That should be treated as a possibility rather than a
                certainty.
              </p>

              <p>
                If the same theme is repeated through relevant planets in D10,
                and those planets are activated by Dasha, the interpretation
                becomes more persuasive.
              </p>

              <p>
                This is the same principle we have used throughout the course:
                look for independent factors converging on the same theme.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                D1 promise → Varga refinement → Dasha activation.
              </p>
            </div>
          </section>

          {/* FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Our framework is growing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              We now have three levels of interpretation.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Level 1
                </p>

                <h3 className="mt-2 text-xl font-semibold">D1</h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Establish the natal structure and main promise.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Level 2
                </p>

                <h3 className="mt-2 text-xl font-semibold">Relevant Varga</h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Examine the specific dimension of that natal promise in
                  greater detail.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Level 3
                </p>

                <h3 className="mt-2 text-xl font-semibold">Dasha</h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Determine whether planets carrying that promise are
                  temporally activated.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                We still need one more major layer before event timing becomes
                complete: transits.
              </p>
            </div>
          </section>

          {/* SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 11 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Varga means division, and divisional charts are derived from the same natal planetary degrees.",
                "D1 remains the primary chart and establishes the main natal promise.",
                "A specialised Varga examines a particular dimension of that promise in greater detail.",
                "D9 is important for marriage, dharma and deeper assessment of planetary strength.",
                "D10 refines career and professional themes.",
                "D7 is used in matters of children and progeny.",
                "D12 is used for parental and lineage themes.",
                "D30 is traditionally examined for adversity and vulnerabilities.",
                "Vargottama commonly refers to a planet occupying the same Rashi in D1 and D9.",
                "A strong placement in a Varga does not automatically create an event absent from the broader natal framework.",
                "Higher Vargas become increasingly sensitive to birth-data accuracy.",
                "Look for convergence between D1, the relevant Varga and the active Dasha.",
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
              Lesson 12 — Transits
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We now know how to establish the natal promise, refine it through
              a relevant Varga and identify planetary activation through Dasha.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              Next we will add the moving sky.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              We will learn how transiting Jupiter, Saturn, Rahu, Ketu and the
              faster planets interact with the natal chart — and why a transit
              should not be used as a standalone prediction.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 12 · Coming next
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                From the whole chart to the finer detail
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                A Varga does not give us a different destiny. It lets us examine
                one dimension of the same horoscope more closely.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                With D1, Vargas and Dasha in place, we are ready to add the
                moving planetary environment through transits.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 10: Vimshottari Dasha
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