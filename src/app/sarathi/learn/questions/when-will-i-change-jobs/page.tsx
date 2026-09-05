import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "When Will I Change Jobs? Job Change Timing in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies job change timing through career houses, the 10th lord, D10, dashas, transits and the convergence of multiple chart factors.",
  path: "/sarathi/learn/questions/when-will-i-change-jobs",
  keywords: [
    "When Will I Change Jobs Astrology",
    "Job Change Astrology",
    "Career Change Astrology",
    "Job Change Timing Vedic Astrology",
    "New Job Astrology",
    "Career Timing Astrology",
    "10th House Career",
    "D10 Career",
    "Career Dasha",
    "Vedic Astrology Job Change",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "When Will I Change Jobs? How Vedic Astrology Studies Career Change",
  description:
    "A practical guide to understanding how Vedic astrology studies job changes through the birth chart, career houses, planetary periods, Dashamsa and planetary transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-change-jobs",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-change-jobs",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Career astrology",
    "Job change",
    "Career timing",
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
      name: "When Will I Change Jobs?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-change-jobs",
    },
  ],
};

const careerFactors = [
  {
    title: "10th House",
    text: "The 10th house is central to profession, responsibility, status, authority and the direction of one's visible work. It helps establish the professional field in which change is taking place.",
  },
  {
    title: "6th House",
    text: "The 6th house is important for employment, service, workplace routines, competition and functioning within an organisational structure. It can become especially relevant when the question concerns salaried employment.",
  },
  {
    title: "2nd House",
    text: "The 2nd house contributes to livelihood, accumulated resources and financial continuity. It helps distinguish a professional move from a move that also improves income or security.",
  },
  {
    title: "11th House",
    text: "The 11th house relates to gains, fulfilment, professional networks and the result obtained from one's efforts. Its involvement can help assess whether movement is accompanied by improvement.",
  },
];

const eventTypes = [
  {
    title: "Change of employer",
    text: "This is the clearest form of job change: leaving one organisation and entering another. The chart should show professional activation together with a meaningful indication of movement or change in the existing pattern.",
  },
  {
    title: "Internal role change",
    text: "A person may remain with the same employer while moving into a different team, function, location or area of responsibility. This can fulfil a career-change period without producing a new company.",
  },
  {
    title: "Promotion",
    text: "Promotion is movement within the professional structure, but it is not identical to changing jobs. Recognition, authority, gains and status become more important when judging advancement.",
  },
  {
    title: "Industry or career shift",
    text: "A deeper professional transition may involve a different type of work rather than simply a new employer. In such cases the astrologer studies whether the chart supports a broader change of professional direction.",
  },
  {
    title: "Employment to business",
    text: "A strong professional transition may sometimes move a person away from salaried employment toward independent work, partnership or entrepreneurship. That requires a different assessment from an ordinary job change.",
  },
  {
    title: "Relocation for work",
    text: "A professional change may also involve another city or country. In that case career factors need to be studied together with houses and planets connected with movement, residence and foreign environments.",
  },
];

const timingLayers = [
  {
    number: "01",
    title: "Define the exact professional event",
    text: "Begin by deciding whether the question is about changing employer, promotion, resignation, internal movement, career redirection, business or relocation. These are related themes, but they are not astrologically identical events.",
  },
  {
    number: "02",
    title: "Establish the natal career promise",
    text: "Study the 10th house, 10th lord, 6th house, relevant planets, aspects and Sambandha in the birth chart. Before timing change, the astrologer first needs to understand how professional life is structured in the horoscope.",
  },
  {
    number: "03",
    title: "Identify the houses connected with movement",
    text: "Career houses show the professional theme, while other chart factors can show movement away from an existing pattern, entry into a new environment, gains, income changes or relocation. The complete combination matters more than one isolated house.",
  },
  {
    number: "04",
    title: "Judge the active Dasha",
    text: "Mahadasha, Antardasha and shorter planetary periods show which natal planets currently have the opportunity to deliver results. Their lordship, placement, strength, nakshatra, associations and dispositors must be studied in the individual chart.",
  },
  {
    number: "05",
    title: "Use the D10 to refine the professional story",
    text: "The Dashamsa can add depth to professional analysis and help confirm whether the active period is strongly connected with career movement, responsibility, status or change. It should refine the D1 rather than replace it.",
  },
  {
    number: "06",
    title: "Add slow-moving transit activation",
    text: "Jupiter, Saturn and the nodal axis can create broader periods of professional activation when they interact meaningfully with natal career factors. Their role is assessed together with the Dasha rather than as standalone predictions.",
  },
  {
    number: "07",
    title: "Narrow the window",
    text: "Once the broader period is supportive, shorter sub-periods and faster transits can help concentrate the timing. A narrower window should emerge only when the larger timing layers already support the event.",
  },
  {
    number: "08",
    title: "Judge whether the change also represents improvement",
    text: "Professional movement and professional gain are separate questions. The astrologer should assess whether income, status, fulfilment and stability are also supported before describing the change as an advancement.",
  },
];

const commonMistakes = [
  "Assuming any activation of the 10th house means a change of employer.",
  "Predicting job change simply because Rahu is active.",
  "Treating Saturn as a planet that automatically creates career problems.",
  "Assuming the 10th lord Dasha must produce a new job.",
  "Using a favourable Jupiter transit as a standalone prediction.",
  "Reading the D10 without first establishing the professional promise in the D1.",
  "Treating promotion, resignation, internal transfer and change of employer as the same event.",
  "Assuming that professional movement automatically means better salary or greater stability.",
  "Giving an exact date when the broader Dasha and transit structure does not support a narrow window.",
  "Using a difficult transit as a reason to resign without considering real-world circumstances.",
];

const improvementFactors = [
  {
    title: "Movement",
    text: "Does the period genuinely show a shift away from the existing professional pattern?",
  },
  {
    title: "Income",
    text: "Are gain and livelihood factors supportive enough to suggest better financial conditions?",
  },
  {
    title: "Status",
    text: "Is there evidence of greater authority, recognition or professional visibility?",
  },
  {
    title: "Stability",
    text: "Does the chart support continuity after the move, or does the period remain unsettled?",
  },
];

export default function WhenWillIChangeJobsPage() {
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

            <span className="text-[#4c3e50]">When will I change jobs?</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Career & Job · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            When Will I Change Jobs? How Vedic Astrology Studies Career Change
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Job change in Vedic astrology is not identified from one planet or
            one transit. A meaningful assessment studies the professional
            promise of the birth chart, the type of change being considered,
            the active planetary periods, the D10 and the convergence of
            relevant transits.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              In traditional Vedic astrology, a stronger period for job change
              is usually considered when the running Dasha activates relevant
              career factors and the birth chart supports professional movement,
              while divisional charts and transits reinforce the same theme.
              The important question is not simply{" "}
              <strong>“Is career activated?”</strong> but{" "}
              <strong>
                “What kind of professional event is being activated?”
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
              A career activation is not automatically a job change.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Professional life can become strongly activated without a person
                leaving their employer. The same period might produce a new
                manager, a promotion, an internal transfer, greater
                responsibility, relocation or the beginning of a search for a
                different role.
              </p>

              <p>
                This is why the first task is not to search for a universal
                “job-change combination.” The astrologer should first identify
                what type of professional movement the chart is capable of
                expressing.
              </p>

              <p className="font-semibold text-[#47394b]">
                Define the event before attempting to time the event.
              </p>
            </div>
          </section>

          {/* DEFINE EVENT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the event
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What do you actually mean by “change jobs”?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              These professional developments may look similar from the outside,
              but they can require different combinations within the horoscope.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {eventTypes.map((event) => (
                <div
                  key={event.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{event.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">{event.text}</p>
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
              Which houses matter when studying job change?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Employment analysis usually begins with the same core professional
              houses used for career assessment. The important difference is
              that job-change analysis must also establish evidence of movement
              away from the existing pattern.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {careerFactors.map((factor) => (
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
                Do not memorise this as a formula.
              </p>

              <p className="mt-3 leading-7 text-[#65586a]">
                The houses above describe important professional themes. Job
                change becomes more convincing when these factors connect with
                indicators of movement, transition, separation from an existing
                pattern or entry into a new professional environment.
              </p>
            </div>
          </section>

          {/* 10TH LORD */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why is the 10th lord especially important?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 10th house describes the professional field, while the{" "}
                <strong>10th lord</strong> carries that professional agenda into
                another part of the horoscope.
              </p>

              <p>
                Its placement, dignity, nakshatra, dispositor, aspects and
                associations can show how professional matters connect with
                other areas of life.
              </p>

              <p>
                When the 10th lord becomes active through Dasha, the result is
                not automatically a job change. The event depends on the complete
                network of houses and planets that the 10th lord represents in
                that particular chart.
              </p>
            </div>
          </section>

          {/* SAMBANDHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Planetary connection
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Sambandha helps show how career themes connect.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In predictive work, isolated houses are less useful than the
                relationships between them. Sambandha helps show how planets
                carrying different house agendas become linked.
              </p>

              <p>
                For example, professional factors may connect with employment,
                gains, livelihood, movement or relocation. When several relevant
                themes connect repeatedly, the hypothesis of professional change
                becomes stronger.
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
              Dasha tells us when the natal career story becomes active.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Vimshottari Dasha provides a hierarchy of planetary periods:
                Mahadasha establishes the wider background, Antardasha refines
                the active themes, and Pratyantardasha can help narrow them
                further.
              </p>

              <p>
                For job change, the astrologer studies whether the running
                planets meaningfully activate career and movement-related
                factors in the individual horoscope.
              </p>

              <p>
                This is why statements such as{" "}
                <strong>“Rahu Dasha causes job change”</strong> or{" "}
                <strong>“Saturn Dasha means career difficulty”</strong> are too
                broad. A planet gives results according to its actual role in
                the chart.
              </p>

              <p className="font-semibold text-[#47394b]">
                The Dasha does not invent a professional event. It activates the
                natal agenda already contained in the horoscope.
              </p>
            </div>
          </section>

          {/* D10 */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What can the D10 Dashamsa add?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The D10 or Dashamsa is an important divisional chart for studying
                professional life. It can help refine the career themes
                established in the main birth chart.
              </p>

              <p>
                If a job-change period appears promising in the D1, the D10 can
                be examined for repeated activation involving professional
                houses, their lords, the D10 Lagna and the planets operating
                through the running Dasha.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the professional promise. D10 refines the
                professional dimension.
              </p>

              <p>
                The D10 should therefore not be used as a separate horoscope that
                overrides the D1.
              </p>
            </div>
          </section>

          {/* TIMING */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The timing method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How can a job-change window be narrowed?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A stronger prediction develops layer by layer. Each stage should
              either strengthen or weaken the professional-change hypothesis.
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
              Can a transit alone make you change jobs?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                It is usually more useful to treat transit as an{" "}
                <strong>activation layer</strong> rather than a standalone
                promise.
              </p>

              <p>
                Jupiter, Saturn, Rahu and Ketu can help define broader periods of
                professional movement when they interact meaningfully with natal
                career factors. Faster planets may later help refine the timing.
              </p>

              <p>
                But the same transit can produce very different results for two
                people because their natal chart and running Dasha are different.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Transit activation does not create an event that the natal chart
                and active planetary periods do not support.
              </p>
            </div>
          </section>

          {/* BETTER OR JUST DIFFERENT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A critical distinction
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does job change also mean a better job?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Not necessarily. A chart may strongly support professional
                movement without showing equivalent improvement in salary,
                designation, authority or stability.
              </p>

              <p>
                This is why Sārathi separates the question{" "}
                <strong>“Will there be a change?”</strong> from{" "}
                <strong>“Will the change improve my circumstances?”</strong>
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {improvementFactors.map((factor) => (
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
                Movement and improvement should be judged separately.
              </p>

              <p className="mt-3 leading-7 text-[#65586a]">
                A strong job-change period can still require careful practical
                evaluation of compensation, role quality, location, stability
                and long-term career direction.
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
                  Imagine a horoscope in which the running Antardasha strongly
                  activates the 10th house and its lord, while also connecting
                  with factors showing movement away from an existing
                  professional pattern.
                </p>

                <p>
                  The D10 repeats the professional activation, while a
                  slow-moving transit begins influencing the same career axis.
                </p>

                <p>
                  At this stage, the astrologer may reasonably conclude that a
                  period of professional movement is developing.
                </p>

                <p>
                  Suppose the 11th and 2nd houses are also strongly supported.
                  That adds evidence that the movement may be accompanied by
                  gains or improved financial conditions.
                </p>

                <p>
                  Shorter sub-periods and faster transits can then be examined to
                  determine whether the broader period contains a narrower
                  activation window.
                </p>

                <p className="font-semibold text-[#403344]">
                  Notice the distinction: first establish movement, then assess
                  whether the same period also supports improvement.
                </p>
              </div>
            </div>
          </section>

          {/* WHY PERIOD MAY PASS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why can a strong job-change period pass without a new employer?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Astrology describes periods of activation within a larger life
                context. It does not remove human choice or practical
                circumstances.
              </p>

              <p>
                A professional-change period may instead manifest as an internal
                role, restructuring, new reporting line, promotion, interview
                process, relocation discussion or increased responsibility.
              </p>

              <p>
                A person may also receive an opportunity and decline it because
                of compensation, family responsibilities, visa limitations,
                location, stability or personal preference.
              </p>

              <p>
                The person still needs to search, apply, interview, develop
                relevant skills and decide whether an opportunity is appropriate.
              </p>

              <p className="font-semibold text-[#47394b]">
                Astrology describes timing and potential. Human decisions and
                real-world circumstances influence how that potential is
                expressed.
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when predicting job change?
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
              Prediction is the art of convergence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Job-change prediction should not be reduced to one house, one
                transit or one planetary period.
              </p>

              <p>
                A more disciplined approach is to organise the evidence in a
                sequence:
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → natal career promise → relevant houses → house
                lords → strength → Sambandha → Dasha → D10 → transit activation
                → narrower window → event type → quality of outcome.
              </p>

              <p>
                The stronger the convergence between independent layers, the
                greater the confidence in the interpretation.
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
                  Understand why activation alone is not enough.
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
                  Learn how chart factors form meaningful relationships.
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
                  Understand how Gochar helps activate and refine timing.
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
                  See how the complete timing hierarchy comes together.
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
                Career movement is personal to your horoscope and timing.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Your professional timing depends on how career houses, planetary
                periods, divisional charts and current transits come together in
                your own birth chart. Sārathi helps you explore that context in a
                structured way.
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
              should not be treated as a guarantee of job change, promotion,
              income improvement or any specific career outcome, and it is not a
              substitute for professional career, financial or other expert
              advice.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}