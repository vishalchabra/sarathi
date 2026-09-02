import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "When Will I Get a Job? Vedic Astrology Career Timing",
  description:
    "Learn how Vedic astrology studies job timing using the birth chart, career houses, D10, dashas and planetary transits. Understand the method behind predicting career opportunities.",
  path: "/sarathi/learn/questions/when-will-i-get-a-job",
  keywords: [
    "When Will I Get a Job Astrology",
    "Job Timing Astrology",
    "Career Astrology",
    "Vedic Astrology Career",
    "Job Change Astrology",
    "10th House Career",
    "D10 Chart Career",
    "Career Dasha",
    "Career Prediction Vedic Astrology",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "When Will I Get a Job? How Vedic Astrology Times Career Opportunities",
  description:
    "A practical guide to understanding how Vedic astrology studies job and career timing through the birth chart, career houses, divisional charts, dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-get-a-job",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-get-a-job",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Career astrology",
    "Job timing",
    "Dashas",
    "Planetary transits",
    "Dashamsa",
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
      name: "When Will I Get a Job?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-get-a-job",
    },
  ],
};

const careerFactors = [
  {
    title: "10th House",
    text: "The 10th house is one of the principal houses for profession, responsibility, public role, status and the work through which a person becomes visible in the world.",
  },
  {
    title: "6th House",
    text: "The 6th house has an important connection with service, employment, routines, competition and working within an organisational structure.",
  },
  {
    title: "2nd House",
    text: "The 2nd house contributes to livelihood, accumulated resources and the income that supports day-to-day life.",
  },
  {
    title: "11th House",
    text: "The 11th house relates to gains, fulfilment of objectives, professional networks and the material result of effort.",
  },
];

const timingLayers = [
  {
    number: "01",
    title: "Is employment promised in the chart?",
    text: "Before asking when an event will happen, the astrologer first studies the underlying career pattern. The 10th house, 10th lord, 6th house, relevant planets and their relationships help describe the nature and strength of professional life.",
  },
  {
    number: "02",
    title: "Which career houses are being activated?",
    text: "A job-related period often activates combinations involving houses such as the 2nd, 6th, 10th and 11th. The exact combination matters because joining a job, receiving a promotion, changing employers and starting a business are not identical events.",
  },
  {
    number: "03",
    title: "What does the running Dasha support?",
    text: "Mahadasha and Antardasha identify the planetary periods currently capable of delivering results. Their house ownership, placement, nakshatra, associations and dispositor relationships are studied rather than judging the planet by name alone.",
  },
  {
    number: "04",
    title: "What does the Dashamsa show?",
    text: "The D10 or Dashamsa is used as an important divisional chart for professional life. It can add depth to the career promise seen in the birth chart and help distinguish professional strength, role changes and periods of advancement.",
  },
  {
    number: "05",
    title: "Are transits activating the promise?",
    text: "Transits provide another layer of timing. Slow-moving planets such as Saturn and Jupiter are often studied carefully, while Rahu and Ketu may contribute to significant shifts, changes in direction or unusual circumstances.",
  },
  {
    number: "06",
    title: "Is there a narrower activation window?",
    text: "Once the broader period is supportive, faster transits and shorter planetary periods can help narrow the window. This is why event timing is usually a hierarchy rather than a single transit producing an event on its own.",
  },
];

const eventTypes = [
  {
    title: "First job",
    text: "The chart is examined for the beginning of professional activity and the transition from education or dependence into employment and earnings.",
  },
  {
    title: "Job change",
    text: "A change of employer generally requires both career activation and some indication of movement, separation from the existing pattern or a new professional environment.",
  },
  {
    title: "Promotion",
    text: "Promotion is not simply another job event. It involves advancement, authority, recognition, gains or expansion within the professional structure.",
  },
  {
    title: "Return after unemployment",
    text: "The astrologer studies whether a period of obstruction is ending and whether employment-related houses are beginning to receive stronger activation.",
  },
  {
    title: "Business instead of employment",
    text: "The same period that changes someone's professional life may not necessarily produce a salaried role. Entrepreneurship requires a different assessment of independence, commerce, risk and professional promise.",
  },
];

const commonMistakes = [
  "Assuming a strong 10th house guarantees continuous career success.",
  "Predicting a new job only because Jupiter is transiting the 10th house.",
  "Judging a Mahadasha only from the natural meaning of its planet.",
  "Ignoring the house ownership and placement of the Dasha and Antardasha lords.",
  "Using the D10 without first understanding the promise of the birth chart.",
  "Treating promotion, job change, unemployment and business as the same event.",
  "Giving an exact date when the broader timing layers do not support a narrow window.",
];

export default function WhenWillIGetAJobPage() {
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

            <span className="text-[#4c3e50]">When will I get a job?</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Career & Job · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            When Will I Get a Job? How Vedic Astrology Times Career
            Opportunities
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Job timing in Vedic astrology is not determined by one house, one
            planet or one transit. A meaningful assessment brings together the
            career promise of the birth chart, relevant houses, divisional
            charts, planetary periods and transit activation.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              In traditional Vedic astrology, a stronger period for obtaining
              employment is usually identified when the running planetary
              periods support career-related houses and the broader promise of
              the chart, while relevant transits provide activation. The
              astrologer therefore asks not only{" "}
              <strong>“Is the 10th house strong?”</strong> but also{" "}
              <strong>
                “Which career factors are active now, and what type of career
                event can they produce?”
              </strong>
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHY NO SINGLE RULE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start here
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              There is no single “job planet.”
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Career questions are sometimes reduced to statements such as
                “look at the 10th house” or “Saturn gives employment.” Those
                principles may form part of an interpretation, but they are not
                sufficient by themselves.
              </p>

              <p>
                The same Saturn can produce very different professional results
                in two charts because its house ownership, placement, dignity,
                nakshatra, associations and planetary periods can be entirely
                different.
              </p>

              <p>
                This is why Sārathi approaches career timing as a sequence:
                first understand the chart&apos;s professional promise, then
                identify the planets currently activated, and only then study
                whether transits support manifestation.
              </p>
            </div>
          </section>

          {/* HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Career houses
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which houses are examined for employment?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Different schools of Jyotish can place different emphasis on
              individual factors, but employment analysis commonly involves a
              combination of houses rather than the 10th house alone.
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
                The important principle:
              </p>

              <p className="mt-3 leading-7 text-[#65586a]">
                A career event becomes more convincing when several relevant
                factors support the same theme. One isolated indication should
                rarely be treated as sufficient evidence.
              </p>
            </div>
          </section>

          {/* 10TH HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why is the 10th house so important?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 10th house is traditionally associated with karma in the
                sense of activity, responsibility and visible contribution. In
                career analysis it helps describe professional direction,
                status, authority and the nature of one&apos;s public role.
              </p>

              <p>
                But an astrologer does not stop at the sign occupying the 10th
                house. The condition of the <strong>10th lord</strong>, planets
                occupying or influencing the house, its dispositor and other
                relevant relationships must also be examined.
              </p>

              <p>
                A strong career house may indicate professional capacity, yet
                timing still depends on whether the relevant planetary factors
                are activated during the period being studied.
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Planetary periods
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Dasha tells us which planets have the opportunity to act.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In Vimshottari Dasha, life unfolds through nested planetary
                periods. The Mahadasha establishes the larger environment,
                while Antardasha and shorter sub-periods can refine which
                themes become active within it.
              </p>

              <p>
                For a career event, the astrologer studies whether the running
                Dasha planets connect meaningfully with professional houses,
                their lords or other relevant career factors.
              </p>

              <p>
                This is also why statements such as{" "}
                <strong>“Rahu Mahadasha gives career change”</strong> are too
                broad. Rahu&apos;s result depends on its position, nakshatra,
                dispositor, associations and the houses it activates in the
                individual chart.
              </p>
            </div>
          </section>

          {/* D10 */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What role does the D10 Dashamsa play?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Dashamsa, commonly called the D10, is an important
                divisional chart used for professional analysis. It adds
                another layer to the career indications contained in the
                natal chart.
              </p>

              <p>
                The D10 should not normally be used as a replacement for the
                main birth chart. The stronger approach is to first understand
                the professional promise in the D1 and then use the D10 to
                refine the assessment of career expression, professional
                strength and periods of change.
              </p>
            </div>
          </section>

          {/* TIMING HIERARCHY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The timing method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How an astrologer narrows a job opportunity window
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              A useful way to understand prediction is as a hierarchy. Each
              layer should strengthen or weaken the hypothesis created by the
              previous one.
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
              Can a transit alone give you a job?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Usually, it is more useful to treat a transit as an{" "}
                <strong>activation layer</strong> than as an isolated promise.
              </p>

              <p>
                For example, Jupiter moving through the 10th house may be
                supportive for professional development in one chart, while in
                another chart the running Dasha may be activating completely
                different themes.
              </p>

              <p>
                Stronger timing appears when the natal promise, running
                planetary periods and relevant transits begin pointing toward
                the same type of event.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Dasha without supportive activation may describe a theme that
                develops slowly. Transit without an underlying promise may
                create movement without producing the expected event. The
                combination matters.
              </p>
            </div>
          </section>

          {/* DIFFERENT EVENTS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Define the event
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “Career event” does not always mean “new job.”
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              One of the most important steps in prediction is defining the
              event precisely. Different professional developments can require
              different combinations.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {eventTypes.map((event) => (
                <div
                  key={event.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{event.title}</h3>

                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {event.text}
                  </p>
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
              How the reasoning might work in practice
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a chart where the running Antardasha lord has a
                  meaningful connection with the 6th and 10th houses, while the
                  Mahadasha lord supports gains or professional development.
                </p>

                <p>
                  The D10 also shows activation involving its professional
                  houses, and a major transit begins influencing the natal
                  career axis.
                </p>

                <p>
                  This creates a stronger hypothesis that professional movement
                  is possible during the broader period.
                </p>

                <p>
                  The astrologer may then examine shorter sub-periods and faster
                  transits to identify when that broader potential is more
                  likely to become active.
                </p>

                <p className="font-semibold text-[#403344]">
                  Notice what did not happen: no single planet was declared to
                  be “giving a job.” Several independent layers converged on
                  the same conclusion.
                </p>
              </div>
            </div>
          </section>

          {/* WHY TIMING MAY FAIL */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why can a favourable career period pass without a new job?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Astrology describes periods and tendencies within a larger life
                context. A period with professional potential does not mean
                that every person must receive an offer on a predetermined
                date.
              </p>

              <p>
                The same activation can sometimes manifest as an internal role
                change, increased responsibility, a new manager, a project,
                professional visibility, an interview process or the beginning
                of circumstances that later lead to a job change.
              </p>

              <p>
                External factors also matter. A person still needs to apply,
                interview, build relevant skills, respond to opportunities and
                make decisions.
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading career timing?
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

          {/* LEARNING TAKEAWAY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              What you should learn from this
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Prediction is the art of convergence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A useful prediction is rarely produced by memorising statements
                such as “Jupiter in the 10th gives career growth.”
              </p>

              <p>
                The real skill is learning how several layers of the chart
                interact:
              </p>

              <p className="font-semibold text-[#47394b]">
                Chart promise → relevant houses → planetary strength → Dasha →
                divisional chart → transit activation → event-specific timing.
              </p>

              <p>
                As you learn Vedic astrology, this hierarchy is far more useful
                than collecting hundreds of isolated placement meanings.
              </p>
            </div>
          </section>

          {/* NEXT LEARNING */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold">
              Continue learning
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#65586a]">
              This article introduced several concepts that will become
              individual lessons inside the Sārathi Knowledge Centre.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "The 10th House",
                "The 6th House",
                "How to Read a Dasha",
                "D10 Dashamsa",
                "Planetary Transits",
                "Career Event Timing",
              ].map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium"
                >
                  {topic} · Coming soon
                </span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Your chart is different
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                The method is universal. The interpretation is personal.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Your career timing depends on how these factors come together
                in your own birth chart, planetary periods and current
                transits. Sārathi helps you explore that context in a
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
              should not be treated as a guarantee of employment or as a
              substitute for professional career, financial or other expert
              advice.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}