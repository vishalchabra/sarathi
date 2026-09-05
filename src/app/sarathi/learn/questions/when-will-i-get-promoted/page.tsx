import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "When Will I Get Promoted? Promotion Timing in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies promotion timing through the 10th and 11th houses, planetary strength, D10, dashas, transits and convergence.",
  path: "/sarathi/learn/questions/when-will-i-get-promoted",
  keywords: [
    "When Will I Get Promoted Astrology",
    "Promotion Astrology",
    "Career Growth Astrology",
    "Promotion Timing Vedic Astrology",
    "Career Advancement Astrology",
    "10th House Promotion",
    "11th House Career Gains",
    "D10 Promotion",
    "Career Dasha",
    "Vedic Astrology Promotion",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "When Will I Get Promoted? How Vedic Astrology Studies Career Advancement",
  description:
    "A practical guide to understanding how Vedic astrology studies promotion through the birth chart, career houses, planetary strength, Dashamsa, dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-get-promoted",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-get-promoted",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Career astrology",
    "Promotion",
    "Career growth",
    "Dashamsa",
    "Vimshottari Dasha",
    "Planetary transits",
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
      name: "When Will I Get Promoted?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-get-promoted",
    },
  ],
};

const promotionFactors = [
  {
    title: "10th House",
    text: "The 10th house is central to profession, authority, responsibility, status and one's visible role. It helps establish whether the chart supports professional advancement and greater responsibility.",
  },
  {
    title: "11th House",
    text: "The 11th house is strongly connected with gains, fulfilment, achievement and the result of professional effort. Its involvement can be especially relevant when judging whether career activity produces advancement.",
  },
  {
    title: "2nd House",
    text: "The 2nd house contributes to income, financial continuity and accumulated resources. It helps assess whether promotion is accompanied by an improvement in compensation or material stability.",
  },
  {
    title: "6th House",
    text: "The 6th house describes employment, service, competition, daily work and functioning within an organisational structure. It can help distinguish advancement within employment from other forms of professional change.",
  },
];

const promotionOutcomes = [
  {
    title: "Higher designation",
    text: "A new title or formal level can indicate advancement, but title alone does not necessarily mean greater authority, income or long-term professional strength.",
  },
  {
    title: "Greater responsibility",
    text: "Promotion may manifest first as wider responsibility, ownership of important work or leadership expectations before a formal title changes.",
  },
  {
    title: "Higher income",
    text: "Financial improvement should be judged separately. Career elevation does not automatically guarantee a significant increase in salary or total compensation.",
  },
  {
    title: "Greater authority",
    text: "Some promotions increase decision-making power, visibility or control over teams and resources. Authority-related factors should therefore be assessed independently.",
  },
  {
    title: "Recognition without title",
    text: "A person may become more visible, trusted or influential even before receiving a formal promotion. This can still reflect a strong career-growth period.",
  },
  {
    title: "Internal advancement",
    text: "Promotion may occur through movement into another team, function or leadership role within the same organisation rather than through a simple upward title change.",
  },
];

const timingLayers = [
  {
    number: "01",
    title: "Define what promotion means",
    text: "Clarify whether the question concerns title, authority, responsibility, income, leadership, grade or organisational level. These outcomes can occur together, but they are not identical.",
  },
  {
    number: "02",
    title: "Establish the natal career promise",
    text: "Study the 10th house, 10th lord, career-related planets, dignity, aspects and Sambandha. The chart must first show the capacity for professional growth before timing that growth.",
  },
  {
    number: "03",
    title: "Look for gain and recognition factors",
    text: "Promotion usually requires more than career activation. The astrologer also looks for support from houses and planets connected with gains, recognition, authority, status and fulfilment.",
  },
  {
    number: "04",
    title: "Judge the running Dasha",
    text: "Mahadasha, Antardasha and shorter sub-periods reveal which natal planets currently have the opportunity to deliver results. Their role is judged from the individual horoscope rather than from natural planetary meanings alone.",
  },
  {
    number: "05",
    title: "Refine with the D10",
    text: "The Dashamsa can help confirm whether the active period supports professional visibility, responsibility, authority or advancement. It should refine the professional promise already established in the D1.",
  },
  {
    number: "06",
    title: "Add transit activation",
    text: "Slow-moving transits can create broader career-growth windows when they activate relevant natal factors. Faster transits and shorter sub-periods may later help narrow the period.",
  },
  {
    number: "07",
    title: "Separate advancement from movement",
    text: "A strong career period may produce a new job, transfer or change of responsibilities rather than promotion. The astrologer should identify whether the chart specifically supports elevation.",
  },
  {
    number: "08",
    title: "Assess the quality of the promotion",
    text: "After establishing advancement, examine whether income, authority, stability and long-term professional direction are also supported. A promotion can still bring greater pressure or limited financial benefit.",
  },
];

const commonMistakes = [
  "Assuming any strong 10th-house period must produce a promotion.",
  "Treating the 11th house as a standalone guarantee of career advancement.",
  "Predicting promotion only because Jupiter is transiting the 10th or 11th house.",
  "Assuming Saturn always delays or denies professional growth.",
  "Judging a Dasha only from the natural meaning of its planet.",
  "Ignoring whether the active planets actually connect with career, gains and recognition in the natal chart.",
  "Using the D10 without first understanding the D1 career promise.",
  "Treating promotion, job change, salary increase and greater responsibility as the same event.",
  "Assuming a higher title always means a better professional outcome.",
  "Giving an exact promotion date when the broader timing layers do not support a narrow window.",
];

const qualityFactors = [
  {
    title: "Status",
    text: "Does the period support a genuine rise in professional standing or only a change in title?",
  },
  {
    title: "Authority",
    text: "Are there signs of increased responsibility, leadership or decision-making power?",
  },
  {
    title: "Income",
    text: "Do financial and gain-related factors support better compensation alongside advancement?",
  },
  {
    title: "Stability",
    text: "Does the professional rise appear sustainable, or is the period still marked by uncertainty or restructuring?",
  },
];

export default function WhenWillIGetPromotedPage() {
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

            <span>Career & Job</span>

            <span>›</span>

            <span className="text-[#4c3e50]">When will I get promoted?</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Career & Job · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            When Will I Get Promoted? How Vedic Astrology Studies Career
            Advancement
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Promotion timing in Vedic astrology is not judged from one house or
            one favourable transit. A meaningful assessment brings together the
            natal career promise, gain and recognition factors, planetary
            strength, the D10, running Dashas and transit activation.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              In traditional Vedic astrology, a stronger promotion period is
              usually identified when the active planetary periods support
              professional advancement, recognition or gains in the natal chart,
              while the D10 and relevant transits reinforce the same theme. The
              astrologer therefore asks not only{" "}
              <strong>“Is career active?”</strong> but also{" "}
              <strong>
                “Does this period show genuine elevation within the career?”
              </strong>
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* START HERE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start here
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Career activity is not the same as career advancement.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A person can enter a highly active professional period without
                receiving a promotion. The same period may produce a new job,
                internal transfer, heavier workload, a new manager, greater
                visibility or a change in responsibilities.
              </p>

              <p>
                Promotion requires evidence of professional elevation rather
                than movement alone. This may involve recognition, authority,
                gains, status or expansion of responsibility.
              </p>

              <p className="font-semibold text-[#47394b]">
                First establish professional activation. Then ask whether the
                activation actually represents advancement.
              </p>
            </div>
          </section>

          {/* DEFINE PROMOTION */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the outcome
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What exactly counts as a promotion?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Promotion can express itself in several ways. A disciplined
              interpretation should define the expected outcome before trying to
              time it.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {promotionOutcomes.map((outcome) => (
                <div
                  key={outcome.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{outcome.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {outcome.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Career houses
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which houses are examined for promotion?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Promotion is usually studied through a combination of
              professional, gain and income-related houses rather than the 10th
              house alone.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {promotionFactors.map((factor) => (
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

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="font-semibold text-[#493b4d]">
                The 10th house shows the professional field. The 11th helps
                assess whether effort produces gain or fulfilment.
              </p>

              <p className="mt-3 leading-7 text-[#65586a]">
                Their involvement can be important, but no fixed house
                combination should be treated as an automatic promise of
                promotion.
              </p>
            </div>
          </section>

          {/* 10TH LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What does the 10th lord tell us?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 10th lord carries the agenda of profession, responsibility
                and public role into the part of the horoscope where it is
                placed.
              </p>

              <p>
                Its dignity, strength, nakshatra, dispositor, aspects and
                associations help explain how professional matters operate in
                that particular chart.
              </p>

              <p>
                If the 10th lord becomes active through Dasha, it may increase
                professional activity, but the surrounding relationships are
                needed to judge whether that activity becomes promotion,
                movement, pressure, recognition or some other career event.
              </p>
            </div>
          </section>

          {/* SAMBANDHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Planetary connection
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Promotion becomes stronger when career and gain factors connect.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Sambandha helps show how different planetary agendas connect
                within the horoscope. In promotion analysis, the astrologer looks
                for meaningful relationships between career, recognition, gains,
                income and authority-related factors.
              </p>

              <p>
                One isolated connection may be interesting. Repetition across
                houses, lords, aspects, Dasha and divisional charts provides
                stronger evidence.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Planetary periods
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Dasha shows when professional growth factors can become active.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Mahadasha creates the larger life environment, while Antardasha
                and shorter sub-periods refine which themes are more active
                within that period.
              </p>

              <p>
                For promotion, the astrologer studies whether the active planets
                connect meaningfully with career, gains, recognition, authority
                or financial improvement.
              </p>

              <p>
                Statements such as{" "}
                <strong>“Jupiter Dasha gives promotion”</strong> or{" "}
                <strong>“Saturn Dasha delays promotion”</strong> are too broad.
                The result depends on what those planets actually represent in
                the individual horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                The Dasha activates natal responsibilities. It does not guarantee
                the textbook meaning of the planet.
              </p>
            </div>
          </section>

          {/* D10 */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              How is the D10 used for promotion?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D10 or Dashamsa is an important divisional chart used to
                refine professional analysis. It can help assess professional
                strength, responsibility, visibility and the quality of career
                development.
              </p>

              <p>
                During a potential promotion period, the astrologer can examine
                whether the active Dasha planets and professional factors are
                also meaningfully activated in the D10.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the professional promise. D10 refines how that
                promise may express within career.
              </p>
            </div>
          </section>

          {/* TIMING */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The timing method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How can a promotion window be narrowed?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Promotion timing becomes more reliable when the interpretation is
              built in layers rather than from one transit or one planetary
              period.
            </p>

            <div className="mt-10 space-y-5">
              {timingLayers.map((layer) => (
                <div
                  key={layer.number}
                  className="grid gap-4 rounded-2xl border border-[#e3d5c5] bg-white p-6 md:grid-cols-[70px_1fr]"
                >
                  <div className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                    {layer.number}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{layer.title}</h3>

                    <p className="mt-3 leading-7 text-[#6a5d6e]">
                      {layer.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TRANSITS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter or Saturn transit alone give a promotion?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                It is usually more useful to view transit as an{" "}
                <strong>activation layer</strong> rather than a standalone
                promise.
              </p>

              <p>
                Jupiter may support expansion in one chart while Saturn may
                strengthen responsibility or structure in another. Rahu and Ketu
                can sometimes coincide with major shifts in professional
                direction or environment.
              </p>

              <p>
                But the same transit can produce different results for different
                people because natal promise and Dasha activation are not the
                same.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Transit can help activate a promotion period. It should not be
                treated as proof that promotion must occur.
              </p>
            </div>
          </section>

          {/* QUALITY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A critical distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Is every promotion actually an improvement?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Not necessarily. A promotion may bring a better title while also
                increasing workload, pressure, accountability or organisational
                risk.
              </p>

              <p>
                The astrologer should therefore separate the fact of advancement
                from the quality of that advancement.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {qualityFactors.map((factor) => (
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

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="font-semibold text-[#493b4d]">
                Advancement and benefit should be judged separately.
              </p>

              <p className="mt-3 leading-7 text-[#65586a]">
                A strong promotion period may still need to be evaluated in
                practical terms: compensation, role quality, authority, workload,
                stability and long-term career direction all matter.
              </p>
            </div>
          </section>

          {/* EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How the reasoning might work in practice
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope where the running Antardasha activates the
                  10th lord and also connects with the 11th house or its lord.
                </p>

                <p>
                  The D10 repeats a pattern of professional visibility and
                  increased responsibility, while a major transit begins
                  influencing the relevant career factors.
                </p>

                <p>
                  This creates a stronger hypothesis that the period supports
                  professional advancement rather than career activity alone.
                </p>

                <p>
                  If income-related factors also receive support, the astrologer
                  may have greater confidence that the advancement could include
                  a financial benefit.
                </p>

                <p>
                  Shorter Dasha levels and faster transits can then be examined
                  for a narrower period of activation.
                </p>

                <p className="font-semibold text-[#403344]">
                  The conclusion comes from convergence: career, gain,
                  recognition and timing factors support the same professional
                  story.
                </p>
              </div>
            </div>
          </section>

          {/* WHY PERIOD MAY PASS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why can a strong promotion period pass without a formal promotion?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A professional-growth period does not force an organisation to
                change a person's title on a specific date.
              </p>

              <p>
                The same activation may manifest as increased responsibility,
                visibility, leadership of an important project, stronger
                management trust, a salary adjustment, a new reporting line or
                preparation for a later promotion.
              </p>

              <p>
                Organisational budgets, promotion cycles, restructuring, manager
                decisions and company policy also influence how professional
                potential is expressed.
              </p>

              <p className="font-semibold text-[#47394b]">
                Astrology can describe a stronger period for advancement.
                Workplace decisions and real-world circumstances still shape the
                final outcome.
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when predicting promotion?
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

          {/* FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Sārathi framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Promotion prediction is the art of convergence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A useful promotion assessment should organise the evidence rather
                than depend on a single favourable placement.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → natal career promise → career and gain houses →
                house lords → planetary strength → Sambandha → Dasha → D10 →
                transit activation → narrower timing → quality of advancement.
              </p>

              <p>
                This framework helps distinguish genuine professional elevation
                from simple activity or movement.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* RELATED CAREER */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Career questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Explore related career questions
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href="/sarathi/learn/questions/when-will-i-get-a-job"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Career & Job
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I get a job?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how employment timing is studied through career houses,
                  Dasha, D10 and planetary transits.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/when-will-i-change-jobs"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Career & Job
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I change jobs?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand how career movement differs from promotion and how
                  job-change timing is assessed.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>
            </div>
          </section>

          {/* CONTINUE LEARNING */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">Continue learning</h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              Strengthen the concepts used in this article through the Sārathi
              Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the life areas represented by each Bhava.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how a house lord carries one life topic into another.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why activation and capacity are different questions.
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
                  Learn how professional and gain factors become connected.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Reading the D1 Birth Chart</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Bring houses, lords, planets and relationships together.
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
                  Understand how natal themes become activated over time.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the D10 refines professional analysis.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transit activation helps refine timing.
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
                  See how the complete prediction hierarchy comes together.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Your chart is different
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Career advancement depends on your own horoscope and timing.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Your promotion potential depends on how career, gain,
                recognition, planetary periods, divisional charts and current
                transits come together in your birth chart. Sārathi helps you
                explore that context in a structured way.
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
              should not be treated as a guarantee of promotion, salary
              increase, career advancement or any specific professional outcome,
              and it is not a substitute for professional career, financial or
              other expert advice.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}