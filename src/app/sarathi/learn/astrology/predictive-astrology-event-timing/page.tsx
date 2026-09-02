import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Predictive Astrology & Event Timing in Vedic Astrology",
  description:
    "Learn how Vedic astrology builds an event prediction by combining the natal chart, relevant houses, planetary strength, Vargas, Vimshottari Dasha and transits through a structured method of convergence.",
  path: "/sarathi/learn/astrology/predictive-astrology-event-timing",
  keywords: [
    "Predictive Astrology Vedic Astrology",
    "Vedic Astrology Event Timing",
    "How to Predict Events in Astrology",
    "Vedic Astrology Prediction",
    "Dasha Transit Event Timing",
    "Career Timing Vedic Astrology",
    "Marriage Timing Vedic Astrology",
    "Jyotish Prediction Method",
    "Vedic Astrology Timing Techniques",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Predictive Astrology & Event Timing: How to Build a Vedic Astrology Prediction",
  description:
    "A structured guide to combining natal promise, houses, planetary strength, Vargas, Dashas and transits when studying the timing of an event.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/predictive-astrology-event-timing",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/predictive-astrology-event-timing",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Predictive astrology",
    "Event timing",
    "Vimshottari Dasha",
    "Planetary transits",
    "Divisional charts",
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
      name: "Predictive Astrology & Event Timing",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/predictive-astrology-event-timing",
    },
  ],
};

const predictionSteps = [
  {
    number: "01",
    title: "Define the exact question",
    text: "Convert a broad concern into a specific event. 'How is my career?' and 'When am I likely to get a new job?' require different levels of analysis.",
  },
  {
    number: "02",
    title: "Identify the houses required for the event",
    text: "Determine which houses must participate in the event instead of beginning with whichever planet or transit looks interesting.",
  },
  {
    number: "03",
    title: "Establish the natal promise",
    text: "Study the relevant houses, their lords, occupants, natural significators and the connections between them in the D1.",
  },
  {
    number: "04",
    title: "Assess planetary capacity",
    text: "Judge dignity, dispositor, combustion, retrogression and other relevant conditions of the planets carrying the event.",
  },
  {
    number: "05",
    title: "Map aspects and Sambandha",
    text: "Look for conjunctions, aspects, exchanges and other relationships that connect the houses required for the event.",
  },
  {
    number: "06",
    title: "Add the Nakshatra layer",
    text: "Study the Nakshatras and their lords to identify finer planetary connections and operating patterns.",
  },
  {
    number: "07",
    title: "Examine the relevant Varga",
    text: "Use the appropriate divisional chart to refine the theme already identified in the D1.",
  },
  {
    number: "08",
    title: "Find the active Dasha",
    text: "Ask whether the Mahadasha, Antardasha and, where useful, Pratyantardasha activate planets connected with the event.",
  },
  {
    number: "09",
    title: "Build the transit window",
    text: "Study whether slow-moving transits activate the relevant houses, house lords, natal planets or Dasha lords.",
  },
  {
    number: "10",
    title: "Narrow the timing",
    text: "Within a credible broader window, use finer Dasha levels and faster transits to examine shorter activation periods.",
  },
  {
    number: "11",
    title: "Judge the convergence",
    text: "Count how many independent layers support the same event and distinguish strong evidence from a single attractive combination.",
  },
  {
    number: "12",
    title: "State only what the evidence supports",
    text: "The specificity and confidence of the final interpretation should never exceed the strength of the astrological convergence.",
  },
];

const eventExamples = [
  {
    event: "New job",
    houses: "10th · 6th · 2nd · 11th",
    note: "Profession, employment/service, income and gains are commonly examined together.",
  },
  {
    event: "Promotion",
    houses: "10th · 11th · 2nd",
    note: "Professional status, achievement/gains and remuneration can become important, with the wider chart determining the form of advancement.",
  },
  {
    event: "Marriage",
    houses: "7th · 2nd · 11th",
    note: "Partnership, family formation and fulfilment of the relationship event are commonly examined together.",
  },
  {
    event: "Property",
    houses: "4th · 2nd · 11th",
    note: "Home/property, financial resources and acquisition or fulfilment can form part of the analysis.",
  },
  {
    event: "Children",
    houses: "5th · 2nd · 11th",
    note: "The 5th is central, while family and fulfilment factors can support the event analysis.",
  },
  {
    event: "Foreign movement",
    houses: "3rd · 9th · 12th",
    note: "Movement, long-distance journeys and residence away from the familiar environment may be examined, with the exact combination depending on the question.",
  },
];

const confidenceLevels = [
  {
    level: "Possible",
    text: "One or two relevant indicators exist, but the theme is not strongly repeated.",
  },
  {
    level: "Supported",
    text: "Several natal factors connect with the event and the relevant Varga provides additional support.",
  },
  {
    level: "Activated",
    text: "The natal theme is supported and the active Dasha involves planets carrying that event.",
  },
  {
    level: "Timing window",
    text: "Dasha activation is accompanied by relevant slow-moving transit convergence.",
  },
  {
    level: "Narrower activation",
    text: "Finer Dasha levels and shorter transits reinforce the already established broader window.",
  },
];

export default function PredictiveAstrologyEventTimingPage() {
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
              Predictive Astrology & Event Timing
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 13 · Predictive Synthesis
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Predictive Astrology & Event Timing: How the Pieces Come Together
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Prediction is not the act of finding one powerful placement, one
            Dasha or one transit. It is the process of testing whether several
            independent astrological layers converge on the same event.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The thirteenth principle to remember
            </p>

            <p className="mt-4 text-2xl font-semibold leading-9 text-[#4f4353]">
              Prediction is not one rule. It is convergence.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT PREDICTION MEANS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What are we actually doing when we predict an event?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Until now, we have studied the individual components of
                Jyotish.
              </p>

              <p>
                We learned what planets represent, what houses govern, how
                Rashis modify expression, how lordship connects life areas and
                how dignity affects planetary capacity.
              </p>

              <p>
                We then added aspects, Sambandha, Nakshatras, divisional charts,
                Dashas and transits.
              </p>

              <p>
                Predictive astrology begins when we stop reading those
                components independently and ask whether they are describing
                the <strong>same event</strong>.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The purpose of synthesis is not to collect more indications. It
                is to discover which indications belong to the same story.
              </p>
            </div>
          </section>

          {/* QUESTION FIRST */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Step zero
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Begin with the question — not with the planets.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                One of the easiest ways to become lost in a horoscope is to
                begin interpreting everything visible in the chart.
              </p>

              <p>
                Predictive work becomes clearer when the question is defined
                first.
              </p>

              <p>
                “Tell me about my career” is broad.
              </p>

              <p>
                “When am I likely to get a new job?” is event-specific.
              </p>

              <p>
                “Will I be promoted in my current organisation?” is more
                specific again.
              </p>

              <p>
                Each question tells us what astrological evidence we need to
                look for.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                The clearer the question, the more disciplined the chart
                analysis can become.
              </p>
            </div>
          </section>

          {/* EVENT HOUSES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Build the event signature
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which houses need to participate?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Major events usually involve more than one house. The exact
              combination depends on the event and the interpretive tradition,
              so these should be treated as working frameworks rather than
              mechanical formulas.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {eventExamples.map((item) => (
                <div
                  key={item.event}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                    {item.event}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold">{item.houses}</h3>

                  <p className="mt-4 leading-7 text-[#65586a]">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Do not memorise house combinations as guaranteed predictions.
                They tell us where to investigate.
              </p>
            </div>
          </section>

          {/* NATAL PROMISE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The foundation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              First ask whether the natal chart supports the event.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Once the relevant houses are identified, study their lords,
                occupants, natural significators and relationships.
              </p>

              <p>
                Suppose we are studying a new job.
              </p>

              <p>
                We may begin with the 10th, 6th, 2nd and 11th houses.
              </p>

              <p>
                Now ask whether their lords connect through placement,
                conjunction, aspect, exchange, dispositor or other meaningful
                Sambandha.
              </p>

              <p>
                A single connection is an indication.
              </p>

              <p>
                Several independent connections pointing toward the same theme
                create stronger evidence.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* STRENGTH */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Capacity
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A connection tells us that a theme exists. Strength helps tell us
              how effectively the planets can carry it.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                After identifying the relevant planets, assess their condition.
              </p>

              <p>
                Consider Rashi dignity, dispositor, combustion, retrogression,
                aspects, conjunctions and other relevant strength factors.
              </p>

              <p>
                But remember the distinction from Lesson 6:
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-xl font-semibold leading-8 text-[#493b4d]">
                Strength tells us capacity — not morality.
              </p>
            </div>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#65586a]">
              A strong planet can strongly deliver the houses it is responsible
              for. Whether that expression is easy, difficult or mixed depends
              on the complete chart.
            </p>
          </section>

          {/* ASPECTS SAMBANDHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Connections
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Now map aspects and Sambandha.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A planet does not need to occupy an event house to become part
                of that event.
              </p>

              <p>
                It may aspect the house, aspect its lord, exchange signs with
                another relevant lord or form another relationship with the
                planets carrying the event.
              </p>

              <p>
                This is where seemingly separate areas of the chart begin to
                form a network.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Aspect
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Influence from elsewhere
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Shows which planets influence a house or planet without
                  occupying the same location.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-6">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Sambandha
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Relationship between agendas
                </h3>
                <p className="mt-3 leading-7 text-[#65586a]">
                  Helps identify which planetary and house responsibilities are
                  actually talking to one another.
                </p>
              </div>
            </div>
          </section>

          {/* NAKSHATRA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Finer connections
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Nakshatra can reveal another planetary link.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A planet&apos;s Nakshatra lord adds another dispositional
                relationship to the interpretation.
              </p>

              <p>
                If a career-relevant planet occupies the Nakshatra of another
                planet strongly connected with career houses, that relationship
                may reinforce the professional theme.
              </p>

              <p>
                But Nakshatra symbolism should refine the existing chart logic,
                not replace it.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The Rashi gives the broader environment. The Nakshatra gives a
                more specific operating pattern within that environment.
              </p>
            </div>
          </section>

          {/* VARGA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Refine the topic
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does the relevant divisional chart repeat the theme?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Once the D1 promise has been established, move to the relevant
                Varga.
              </p>

              <p>
                For career, this may involve D10. For marriage, D9 becomes
                especially important. For children, D7 can provide another
                layer.
              </p>

              <p>
                We are not looking for an unrelated prediction from the Varga.
              </p>

              <p>
                We are asking whether the specialised chart reinforces,
                modifies or qualifies the theme already visible in D1.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                D1 establishes the main promise. The relevant Varga refines
                that promise.
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Add time
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Is the event&apos;s planetary network active through Dasha?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A natal chart can contain many themes that are not equally
                active at every moment.
              </p>

              <p>
                Vimshottari Dasha helps us determine which planetary agendas
                are receiving greater temporal emphasis.
              </p>

              <p>
                For an event to become more compelling, we look for Mahadasha,
                Antardasha or finer-period lords that participate in the event
                network identified earlier.
              </p>

              <p>
                If the Dasha planets have little meaningful relationship with
                the event houses, confidence in immediate manifestation should
                usually be lower.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                First judge the Dasha lord in the natal chart. Then judge the
                period.
              </p>
            </div>
          </section>

          {/* TRANSIT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Build the window
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do the transits activate the same event network?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Once the natal promise and Dasha activation exist, examine the
                moving planets.
              </p>

              <p>
                Are Jupiter or Saturn occupying or aspecting the relevant
                houses?
              </p>

              <p>
                Are they contacting the relevant house lords?
              </p>

              <p>
                Are they influencing the planets already active through Dasha?
              </p>

              <p>
                Does the nodal axis add another relevant activation?
              </p>

              <p>
                When several slow-moving factors converge, a broader event
                window can become more meaningful.
              </p>
            </div>
          </section>

          {/* BROAD TO NARROW */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Broad to narrow
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do not jump from a two-year transit to one exact day.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Predictive timing works more logically when progressively narrowed.
            </p>

            <div className="mt-9 space-y-4">
              {[
                ["Natal promise", "Lifetime structural possibility"],
                ["Mahadasha", "Broad life chapter"],
                ["Antardasha", "More specific planetary interaction"],
                ["Pratyantardasha", "Narrower planetary-period window"],
                ["Jupiter / Saturn / Nodes", "Broader transit activation"],
                ["Mars / Sun / Mercury / Venus", "Shorter transit refinement"],
                ["Moon", "Very short activation layer"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="grid gap-3 rounded-2xl border border-[#e4d8ca] bg-white p-6 md:grid-cols-[210px_1fr]"
                >
                  <p className="font-semibold text-[#8b5a79]">{title}</p>
                  <p className="leading-7 text-[#65586a]">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                First establish a credible window. Only then ask whether the
                evidence supports narrowing it further.
              </p>
            </div>
          </section>

          {/* FULL JOB EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Full worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              “When will I get a new job?”
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Let us apply the entire framework to one hypothetical chart.
            </p>

            <div className="mt-8 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-6 text-lg leading-8 text-[#5e5162]">
                <div>
                  <p className="font-semibold text-[#403344]">
                    1. Define the event
                  </p>
                  <p className="mt-2">
                    The question concerns obtaining a new job rather than
                    general career direction.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    2. Identify the houses
                  </p>
                  <p className="mt-2">
                    We begin by examining the 10th, 6th, 2nd and 11th houses
                    and their lords.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    3. Establish natal connection
                  </p>
                  <p className="mt-2">
                    Suppose the 10th lord is connected with the 6th lord, while
                    the 11th lord also influences the 10th house. The career,
                    employment and gains houses are beginning to form one
                    network.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    4. Assess the planets
                  </p>
                  <p className="mt-2">
                    We examine the condition, dignity, dispositors, aspects and
                    Nakshatras of the planets carrying this network.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    5. Check the D10
                  </p>
                  <p className="mt-2">
                    Suppose D10 again shows strong professional connections
                    involving the same key planets. The career theme has
                    repeated.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    6. Check the Dasha
                  </p>
                  <p className="mt-2">
                    Suppose the Mahadasha lord participates in the 10th-house
                    network and the Antardasha lord connects with the 6th and
                    11th houses. The job theme is now temporally activated.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    7. Build the transit window
                  </p>
                  <p className="mt-2">
                    Suppose Jupiter begins influencing the 10th lord while
                    Saturn simultaneously influences another planet in the
                    employment network.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    8. Narrow the window
                  </p>
                  <p className="mt-2">
                    A finer Dasha period begins, Mars or the Sun activates a
                    relevant career factor and the Moon later crosses an
                    important natal or transit-sensitive point.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#403344]">
                    9. Make the judgement
                  </p>
                  <p className="mt-2">
                    We now have several independent layers pointing toward
                    career movement during the same period.
                  </p>
                </div>

                <p className="font-semibold text-[#403344]">
                  That is very different from saying: “Jupiter is in your 10th
                  house, so you will get a job.”
                </p>
              </div>
            </div>
          </section>

          {/* EVENT TYPE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              An important refinement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Career activation does not automatically mean “new job.”
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the 10th house and its lord are strongly activated.
              </p>

              <p>
                That tells us professional matters are important — but the
                manifestation could take several forms.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                "New employment",
                "Promotion",
                "Internal role change",
                "Increased responsibility",
                "Recognition",
                "Resignation",
                "Professional training",
                "Business or independent work",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#e4d8ca] bg-white p-5 font-medium text-[#5c4e60]"
                >
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#65586a]">
              To distinguish between these possibilities, we need to study
              which additional houses and planetary relationships are
              participating.
            </p>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                First identify the theme. Then identify the event type.
              </p>
            </div>
          </section>

          {/* CONFIDENCE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Confidence
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Not every chart supports the same level of certainty.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Predictive confidence should increase only as independent
              evidence accumulates.
            </p>

            <div className="mt-10 space-y-5">
              {confidenceLevels.map((item, index) => (
                <div
                  key={item.level}
                  className="grid gap-4 rounded-2xl border border-[#e3d5c5] bg-white p-6 md:grid-cols-[70px_160px_1fr]"
                >
                  <p className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="font-semibold text-[#4b2744]">
                    {item.level}
                  </h3>

                  <p className="leading-7 text-[#65586a]">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Specificity should be earned by convergence.
              </p>
            </div>
          </section>

          {/* WHEN NOT TO PREDICT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Discipline matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Sometimes the correct prediction is a wider window.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Astrology does not always provide equally strong evidence for a
                specific day or even a specific month.
              </p>

              <p>
                If the natal and Dasha evidence is strong but the shorter
                timing factors are mixed, the responsible conclusion may be a
                broader period.
              </p>

              <p>
                If the Dasha itself is only moderately connected with the
                event, confidence should be reduced further.
              </p>

              <p>
                Narrowing a prediction beyond what the evidence supports may
                sound impressive, but it weakens the methodology.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-xl font-semibold leading-8 text-[#493b4d]">
                Precision is valuable only when the chart supports precision.
              </p>
            </div>
          </section>

          {/* FULL METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The complete method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The Sārathi foundational prediction workflow
            </h2>

            <div className="mt-10 space-y-5">
              {predictionSteps.map((step) => (
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

          {/* FORMULA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Bring everything together
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              From question to prediction
            </h2>

            <div className="mt-8 rounded-3xl bg-[#4b2744] p-8 text-white md:p-10">
              <div className="space-y-4 text-lg font-medium leading-8">
                <p>Question</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Relevant Houses</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Natal Promise</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Planetary Strength</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Aspects & Sambandha</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Nakshatra</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Relevant Varga</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Dasha Activation</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Transit Window</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p>Finer Trigger</p>
                <p className="text-[#d9bfa8]">↓</p>
                <p className="text-2xl font-semibold text-white">
                  Final Judgement
                </p>
              </div>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common predictive mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Do not begin with the transit before defining the event.",
                "Do not predict from one house or one planet alone.",
                "Do not treat natural karakatwa as a guaranteed event.",
                "Do not ignore house lordship.",
                "Do not ignore aspects and Sambandha.",
                "Do not use Nakshatra symbolism without the broader chart structure.",
                "Do not read a Varga independently of D1.",
                "Do not label an entire Mahadasha good or bad.",
                "Do not assume an active Dasha guarantees one particular manifestation.",
                "Do not predict from Jupiter or Saturn transit alone.",
                "Do not use the Moon as a standalone trigger for a major event.",
                "Do not confuse activation of a life area with confirmation of a specific event.",
                "Do not force an exact date when the evidence supports only a wider period.",
                "Do not increase confidence merely because several techniques repeat the same underlying factor rather than providing genuinely independent support.",
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

          {/* INDEPENDENT EVIDENCE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A deeper point
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Repetition is strongest when the evidence is genuinely
              independent.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the 10th lord occupies the 11th house.
              </p>

              <p>
                Saying “the 10th connects with the 11th” and then “the 11th
                contains the 10th lord” does not give us two independent
                indications. They describe the same relationship.
              </p>

              <p>
                Stronger convergence occurs when separate layers reinforce the
                theme — for example, natal lordship, an independent aspect, D10
                repetition, Dasha activation and a relevant transit.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Do not count the same astrological fact several times simply
                because it can be described in several ways.
              </p>
            </div>
          </section>

          {/* FREE WILL */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Interpretation, not fatalism
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Timing does not remove context or choice.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A period may show strong professional activation, but real-life
                manifestation still occurs within the person&apos;s
                circumstances, decisions and available opportunities.
              </p>

              <p>
                Two people can therefore experience similar astrological themes
                through different external events.
              </p>

              <p>
                The purpose of predictive work is not to remove uncertainty
                from life. It is to identify periods and themes that appear
                more strongly activated within the astrological framework.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Astrology can describe timing and tendencies without turning
                possibility into inevitability.
              </p>
            </div>
          </section>

          {/* SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 13 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Prediction begins with a clearly defined question.",
                "Each event has a set of relevant houses and planetary factors that should be investigated.",
                "The D1 establishes the natal structure and underlying promise.",
                "Planetary strength helps assess how effectively relevant planets can carry their responsibilities.",
                "Aspects and Sambandha show how different house agendas become connected.",
                "Nakshatras can refine planetary expression and reveal additional planetary links.",
                "The relevant Varga should refine the D1 rather than replace it.",
                "Dasha identifies which natal planetary agendas are temporally active.",
                "Slow transits can create broader activation windows.",
                "Finer Dasha levels and faster transits can help narrow an already credible window.",
                "Activation of a theme is not automatically confirmation of one specific event.",
                "Convergence is strongest when independent astrological layers support the same conclusion.",
                "Predictive confidence should determine how specific the final interpretation becomes.",
                "A broader honest window is better than unsupported precision.",
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

          {/* FOUNDATION COMPLETE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Foundations complete
            </p>

            <h2 className="mt-3 max-w-4xl text-3xl font-semibold md:text-4xl">
              You now have the framework needed to begin reading a horoscope
              systematically.
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#65586a]">
              The first thirteen lessons were designed to build one layer upon
              another rather than teach disconnected astrological facts.
            </p>

            <div className="mt-9 rounded-3xl border border-[#dfd0bf] bg-white p-7 md:p-9">
              <p className="text-xl font-semibold text-[#4b2744]">
                The complete foundational model
              </p>

              <p className="mt-5 text-lg leading-9 text-[#5f5263]">
                Graha tells us <strong>who</strong>.
                <br />
                Bhava tells us <strong>where in life</strong>.
                <br />
                Rashi tells us <strong>how</strong>.
                <br />
                Lagna assigns the <strong>roles</strong>.
                <br />
                Lordship tells us <strong>what is connected</strong>.
                <br />
                Strength tells us <strong>capacity</strong>.
                <br />
                Aspects show <strong>influence</strong>.
                <br />
                Sambandha shows <strong>relationships between agendas</strong>.
                <br />
                Nakshatra adds <strong>finer expression</strong>.
                <br />
                D1 establishes the <strong>main promise</strong>.
                <br />
                Varga provides <strong>specialised refinement</strong>.
                <br />
                Dasha provides <strong>activation</strong>.
                <br />
                Transit provides the <strong>moving timing environment</strong>.
                <br />
                Convergence determines the{" "}
                <strong>strength of the prediction</strong>.
              </p>
            </div>
          </section>

          {/* WHERE NEXT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Where learning goes next
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Foundations are complete. Advanced Jyotish can now make sense.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              From here, deeper topics such as Yogas, Avasthas, Shadbala,
              Arudha, Upapada, Ashtakavarga, advanced Nakshatra analysis,
              specialised Vargas and other predictive techniques can be studied
              without losing the basic chart hierarchy.
            </p>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              But advanced techniques should add precision to the foundation —
              not replace it.
            </p>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                The foundation is complete
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                The chart gives us clues. Prediction comes from discovering
                which clues belong to the same story.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Return to these foundations whenever an interpretation becomes
                complicated. More techniques do not automatically create more
                accuracy. Better synthesis does.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 12: Transits
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