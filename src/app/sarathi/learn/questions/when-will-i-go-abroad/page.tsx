import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "When Will I Go Abroad? Vedic Astrology Timing Explained",
  description:
    "Learn how Vedic astrology studies the timing of foreign travel through the birth chart, relevant houses and lords, planetary strength, Dashas and transits.",
  path: "/sarathi/learn/questions/when-will-i-go-abroad",
  keywords: [
    "When Will I Go Abroad",
    "Foreign Travel Astrology",
    "Foreign Travel in Kundli",
    "Videsh Yatra Yoga",
    "Foreign Travel Yoga",
    "12th House Foreign Travel",
    "9th House Foreign Travel",
    "Rahu Foreign Travel",
    "Foreign Travel Dasha",
    "Vedic Astrology Foreign Travel",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "When Will I Go Abroad? Vedic Astrology Timing Explained",
  description:
    "A structured guide to how Vedic astrology studies foreign-travel timing through natal promise, relevant houses, planetary periods and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-go-abroad",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-go-abroad",
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
      name: "When Will I Go Abroad?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-go-abroad",
    },
  ],
};

const travelTypes = [
  {
    title: "Shorter movement",
    text: "A journey away from the usual environment does not necessarily indicate long-term foreign residence.",
  },
  {
    title: "Long-distance travel",
    text: "Travel across substantial distance may become relevant without producing permanent relocation.",
  },
  {
    title: "Temporary foreign stay",
    text: "Study, projects, assignments or family circumstances may create a period of living abroad without permanent settlement.",
  },
  {
    title: "Repeated foreign travel",
    text: "Some charts may support recurring international movement rather than one permanent move.",
  },
  {
    title: "Relocation",
    text: "Moving one's centre of life away from the existing home requires a broader analysis than travel alone.",
  },
  {
    title: "Long-term settlement",
    text: "Establishing life abroad is a different question from simply travelling overseas.",
  },
];

const coreFactors = [
  {
    title: "3rd House",
    text: "The 3rd house is traditionally connected with movement, journeys and changes of immediate environment. Its relevance depends on the exact travel question.",
  },
  {
    title: "9th House",
    text: "The 9th house is strongly associated with long-distance journeys and therefore becomes important when studying significant travel away from the familiar environment.",
  },
  {
    title: "12th House",
    text: "The 12th house is traditionally associated with distant or foreign environments, separation from familiar surroundings and life away from one's usual base.",
  },
  {
    title: "4th House",
    text: "The 4th represents home, roots and one's established base. It becomes particularly important when the question moves from travel toward relocation or settlement.",
  },
  {
    title: "Relevant House Lords",
    text: "The lords of relevant houses show where travel-related themes are carried through the horoscope and what other life areas become connected with them.",
  },
  {
    title: "Rahu — Contextually",
    text: "Rahu is often associated with unfamiliar environments, crossing conventional boundaries and foreign influences, but Rahu alone does not promise foreign travel.",
  },
];

const reasons = [
  {
    title: "Career",
    text: "If employment drives the move, career houses and their connections with travel-related factors become relevant.",
  },
  {
    title: "Education",
    text: "Long-distance study requires the educational dimension to support the travel pattern rather than reading the 9th or 12th house alone.",
  },
  {
    title: "Marriage or Partnership",
    text: "A relationship may become the reason for relocation when partnership factors meaningfully connect with movement or foreign-residence indicators.",
  },
  {
    title: "Family",
    text: "Family circumstances may trigger a move even when career is not the primary cause.",
  },
  {
    title: "Business",
    text: "International business activity can activate foreign connections without necessarily producing permanent settlement.",
  },
  {
    title: "Lifestyle or Personal Choice",
    text: "Some periods may support a broader change of environment or way of life rather than a single externally imposed reason.",
  },
];

const timingLayers = [
  {
    title: "Natal Promise",
    text: "First establish whether foreign movement is meaningfully supported in the birth chart.",
  },
  {
    title: "Dasha Activation",
    text: "Then ask whether planets capable of delivering movement, travel or relocation are active through Mahadasha, Antardasha or finer periods.",
  },
  {
    title: "Transit Support",
    text: "Finally, use transits to refine an already active period and identify stronger windows of manifestation.",
  },
];

const analysisSteps = [
  {
    number: "01",
    title: "Define what 'abroad' means",
    text: "Clarify whether the question concerns a holiday, business trip, education, employment, temporary residence, relocation or permanent settlement.",
  },
  {
    number: "02",
    title: "Start with the D1 birth chart",
    text: "Establish the natal pattern before using timing techniques.",
  },
  {
    number: "03",
    title: "Study the relevant travel houses",
    text: "Examine the 3rd, 9th and 12th according to the nature and distance of movement being studied.",
  },
  {
    number: "04",
    title: "Bring in the 4th for relocation",
    text: "When the question concerns leaving one's established home or changing the centre of life, study the 4th house and 4th lord as part of the framework.",
  },
  {
    number: "05",
    title: "Study the relevant house lords",
    text: "See where they are placed, what they connect with and whether those connections repeat the travel theme.",
  },
  {
    number: "06",
    title: "Identify the reason for travel",
    text: "Career, education, marriage, family and business require different supporting parts of the horoscope.",
  },
  {
    number: "07",
    title: "Judge planetary strength",
    text: "Relevant planets must have sufficient capacity to deliver their agendas; mere involvement is not enough.",
  },
  {
    number: "08",
    title: "Map Sambandha",
    text: "Look for meaningful relationships among travel houses, their lords and the houses describing the reason for movement.",
  },
  {
    number: "09",
    title: "Consider Rahu contextually",
    text: "Use Rahu as one possible foreign or unfamiliar-environment indicator without turning it into a universal foreign-travel formula.",
  },
  {
    number: "10",
    title: "Study the running Dasha",
    text: "Ask whether capable planets connected with movement or relocation are currently activated.",
  },
  {
    number: "11",
    title: "Add transit support",
    text: "Use major transits to refine the timing of a natal theme that is already active.",
  },
  {
    number: "12",
    title: "Judge the likely manifestation",
    text: "Conclude whether the convergence better supports travel, temporary residence, relocation or another form of movement rather than automatically calling every foreign indicator settlement.",
  },
];

const mistakes = [
  "Treating the 12th house alone as a guarantee of foreign travel.",
  "Assuming Rahu automatically means living abroad.",
  "Confusing a holiday or business trip with relocation.",
  "Confusing foreign travel with permanent settlement.",
  "Ignoring the 4th house when studying a change of home base.",
  "Ignoring why the person would move abroad.",
  "Reading house involvement without judging the strength of its lord.",
  "Using one Yoga as a guaranteed foreign move.",
  "Predicting travel from a transit alone.",
  "Ignoring the running Dasha.",
  "Assuming a favourable astrological period guarantees a visa or immigration approval.",
  "Predicting a specific country without sufficient astrological basis.",
];

const faqItems = [
  {
    question: "Which house shows foreign travel in Vedic astrology?",
    answer:
      "The 9th and 12th houses are important in traditional foreign-travel analysis, while the 3rd may also become relevant to movement and journeys. The exact hierarchy depends on the type of travel being studied.",
  },
  {
    question: "Does the 12th house guarantee foreign travel?",
    answer:
      "No. The 12th house has several meanings and should be interpreted with its lord, planetary influences, strength, Dashas and the wider horoscope.",
  },
  {
    question: "Does Rahu mean I will go abroad?",
    answer:
      "Not automatically. Rahu may be relevant to foreign, unfamiliar or unconventional environments in some charts, but it cannot independently guarantee foreign travel.",
  },
  {
    question: "How is the timing of foreign travel studied?",
    answer:
      "A structured approach first establishes natal promise, then studies relevant planetary periods and finally uses transits to refine stronger timing windows.",
  },
  {
    question: "Can astrology tell whether my visa will be approved?",
    answer:
      "Astrology cannot guarantee a visa, residency permit, permanent residency or citizenship decision. These outcomes depend on legal, administrative and personal circumstances.",
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

export default function WhenWillIGoAbroadPage() {
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
            <span className="text-[#4c3e50]">When will I go abroad?</span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Foreign Travel & Settlement · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            When Will I Go Abroad? How Vedic Astrology Studies Foreign-Travel
            Timing
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Foreign travel is not read from one house, one planet or one
            transit. A structured Vedic astrology analysis first asks what
            kind of movement the chart supports, why the person may travel,
            which planets can deliver it and when those planets become active.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The key distinction
            </p>

            <p className="mt-4 text-2xl font-semibold text-[#47394b]">
              Going abroad ≠ living abroad ≠ settling abroad.
            </p>

            <p className="mt-4 leading-7 text-[#65586a]">
              A chart may support foreign travel without permanent relocation,
              or a period of residence abroad without lifelong settlement.
              Define the event before trying to time it.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does “going abroad” actually mean?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Before looking at houses or Dashas, identify the event. Foreign
              movement can manifest in several very different ways.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {travelTypes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-[#47394b]">
              Do not memorise “foreign Yoga” as a prediction. First define the
              type of foreign experience you are trying to explain.
            </p>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Natal framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which houses are studied for foreign travel?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Different houses describe different parts of movement. Their
              relevance changes according to the exact question.
            </p>

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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Cause matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why are you going abroad?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Two people may travel abroad during the same broad planetary
                period for completely different reasons.
              </p>

              <p>
                One may receive an overseas job. Another may study abroad.
                Another may relocate after marriage.
              </p>

              <p className="font-semibold text-[#47394b]">
                The movement houses describe the journey. The rest of the chart
                helps explain why the journey happens.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{reason.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {reason.text}
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
              Does Rahu indicate foreign travel?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Rahu is frequently associated in modern Jyotish interpretation
                with unfamiliar environments, foreign influences, crossing
                boundaries and experiences outside established norms.
              </p>

              <p>
                That makes Rahu relevant in some foreign-travel charts. It does
                not make Rahu a standalone foreign-travel promise.
              </p>

              <p>
                Its house, dispositor, lordships, relationships, strength and
                Dasha activation must still fit the wider chart.
              </p>

              <p className="font-semibold text-[#47394b]">
                Rahu may strengthen a foreign theme. Rahu alone does not create
                the entire story.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Strength & connection
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why aren't house connections enough?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A planet can be relevant to foreign movement without having
                equal capacity to produce a major relocation event.
              </p>

              <p>
                That is why dignity, placement, dispositor support and
                Sambandha matter.
              </p>

              <p>
                Repeated connections among travel houses, their lords and the
                reason for movement create more confidence than one isolated
                placement.
              </p>

              <p className="font-semibold text-[#47394b]">
                Relevance tells us what a planet is connected to. Strength
                helps us judge what it can deliver.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How is the timing of foreign travel studied?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {timingLayers.map((layer, index) => (
                <div
                  key={layer.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">{layer.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {layer.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-[#47394b]">
              Natal promise → Dasha activation → transit support.
            </p>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Which Dasha can take you abroad?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                There is no single Mahadasha that sends everyone abroad.
              </p>

              <p>
                A Dasha becomes relevant when its planet is capable of
                activating the chart's movement, travel or relocation pattern.
                This may happen through house lordship, placement, Sambandha or
                other meaningful natal relationships.
              </p>

              <p>
                Mahadasha gives the broader planetary period. Antardasha and
                finer periods can narrow the activation.
              </p>

              <p className="font-semibold text-[#47394b]">
                The name of the Dasha is less important than what that planet
                actually represents in the individual horoscope.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can a Jupiter or Saturn transit send you abroad?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>Not by itself.</p>

              <p>
                Major transits can activate or reinforce natal travel-related
                factors and therefore become useful for timing.
              </p>

              <p>
                But millions of people experience the same broad transit
                without experiencing the same event.
              </p>

              <p>
                A transit becomes more meaningful when it supports a natal
                promise that is already active through Dasha.
              </p>

              <p className="font-semibold text-[#47394b]">
                Transit is a trigger and timing layer — not a substitute for
                natal promise.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A 12-step method for studying foreign-travel timing
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
              Example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why a foreign-travel indication does not automatically mean
              settlement
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope with a strong connection between the 9th
                  and 12th houses.
                </p>

                <p>
                  During the Dasha of a connected planet, the person receives a
                  six-month overseas work assignment.
                </p>

                <p>
                  The foreign-movement theme manifests clearly. But after the
                  assignment, the person returns home.
                </p>

                <p>
                  A later period may activate the 4th house, relocation factors
                  and career indicators together, creating a very different
                  possibility: moving the centre of life abroad.
                </p>

                <p className="font-semibold text-[#403344]">
                  The first event confirms foreign travel. It does not prove
                  permanent settlement.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when predicting foreign travel?
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
              Foreign travel becomes clearer when the same story repeats.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Instead of searching for one foreign-travel placement, organise
                the chart around the event you are actually trying to time.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → D1 promise → movement houses → relevant house
                lords → reason for travel → planetary strength → Sambandha →
                repetition → Dasha → transit activation → likely
                manifestation.
              </p>

              <p>
                This helps distinguish a foreign journey from temporary
                residence, relocation and long-term settlement.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Frequently asked questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Foreign travel in Vedic astrology
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
              Travel and settlement are different questions.
            </h2>

            <div className="mt-8">
              <Link
                href="/sarathi/learn/questions/will-i-settle-abroad"
                className="block rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Long-term settlement
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Will I settle abroad?
                </h3>

                <p className="mt-3 max-w-2xl leading-7 text-[#6a5d6e]">
                  Learn how Vedic astrology distinguishes foreign travel from
                  residence, relocation and longer-term settlement.
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
              Build the principles behind foreign-travel timing through the
              Sārathi Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how different Bhavas describe different forms of
                  movement and life experience.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how travel-related house lords carry their agendas
                  through the chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Separate planetary relevance from the capacity to deliver.
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
                  Understand how movement and purpose-related factors connect.
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
                  Learn how natal travel themes become active in time.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transits refine an active travel period.
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
                  Bring natal promise, planetary strength, Dasha and transit
                  together into a structured timing framework.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Understand your timing
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Foreign travel is not one placement. It is a story built
                across the chart and activated through time.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi brings houses, house lords, planetary strength,
                relationships, Dashas and transits together through a
                structured Vedic astrology framework.
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
              framework for reflection and guidance. Astrology cannot
              guarantee travel, relocation, visa approval, residency,
              permanent residency or citizenship. Immigration and travel
              outcomes depend on legal, administrative, financial and personal
              circumstances.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}