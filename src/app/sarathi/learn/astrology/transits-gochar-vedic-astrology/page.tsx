import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Transits in Vedic Astrology: Gochar & Event Timing",
  description:
    "Learn how planetary transits or Gochar work in Vedic astrology, including transits from Lagna and Moon, Jupiter, Saturn, Rahu-Ketu, transit aspects and how transits combine with Dasha for timing.",
  path: "/sarathi/learn/astrology/transits-gochar-vedic-astrology",
  keywords: [
    "Transits Vedic Astrology",
    "Gochar Vedic Astrology",
    "Jupiter Transit",
    "Saturn Transit",
    "Rahu Ketu Transit",
    "Moon Transit Vedic Astrology",
    "Transit From Moon Sign",
    "Transit From Ascendant",
    "Double Transit Vedic Astrology",
    "Vedic Astrology Event Timing",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Transits in Vedic Astrology: How the Moving Sky Activates the Birth Chart",
  description:
    "A structured guide to Gochar, transit interpretation from Lagna and Moon, slow and fast planets, transit aspects and combining transits with Dasha and the natal chart.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/astrology/transits-gochar-vedic-astrology",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/astrology/transits-gochar-vedic-astrology",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Gochar",
    "Planetary transits",
    "Jupiter transit",
    "Saturn transit",
    "Rahu Ketu transit",
    "Event timing",
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
      name: "Transits",
      item:
        "https://www.sarathiyourguide.com/sarathi/learn/astrology/transits-gochar-vedic-astrology",
    },
  ],
};

const transitPlanets = [
  {
    planet: "Jupiter",
    pace: "Slow",
    role: "Longer activation window",
    text: "Jupiter remains in a Rashi for roughly a year, so its transit can create a broad period in which particular natal houses and planets receive sustained influence.",
  },
  {
    planet: "Saturn",
    pace: "Very slow",
    role: "Long structural period",
    text: "Saturn remains in a Rashi for roughly two and a half years and can create prolonged emphasis on particular houses, planets and responsibilities.",
  },
  {
    planet: "Rahu & Ketu",
    pace: "Slow",
    role: "Nodal activation",
    text: "The nodes remain across a sign axis for roughly eighteen months. Their transits can bring sustained emphasis to the houses and natal factors they contact.",
  },
  {
    planet: "Mars",
    pace: "Faster",
    role: "Shorter activation",
    text: "Mars usually creates shorter windows than Jupiter or Saturn, although retrograde periods can extend its stay in part of the zodiac.",
  },
  {
    planet: "Sun",
    pace: "Fast",
    role: "Monthly movement",
    text: "The Sun spends approximately one month in each Rashi and can help narrow broader timing periods.",
  },
  {
    planet: "Mercury & Venus",
    pace: "Fast",
    role: "Shorter refinement",
    text: "Their movement can provide shorter-term activation, while retrogression can make a particular zodiacal area relevant for longer.",
  },
  {
    planet: "Moon",
    pace: "Very fast",
    role: "Fine timing",
    text: "The Moon moves through the zodiac quickly and can be useful for studying short-lived activation inside an already supportive larger timing window.",
  },
];

const transitMethod = [
  {
    number: "01",
    title: "Define the event",
    text: "Do not begin with the transit. First identify what you are trying to time: job, marriage, property, travel or another specific event.",
  },
  {
    number: "02",
    title: "Establish the natal promise",
    text: "Identify the houses, lords, planets, aspects and Sambandha relevant to that event in D1.",
  },
  {
    number: "03",
    title: "Refine through the relevant Varga",
    text: "Where appropriate, examine the specialised divisional chart for repetition and additional context.",
  },
  {
    number: "04",
    title: "Check the active Dasha",
    text: "Ask whether the Mahadasha, Antardasha and finer periods activate planets connected with the event.",
  },
  {
    number: "05",
    title: "Study slow-moving transits",
    text: "Look at Jupiter, Saturn and the nodal axis for sustained activation of relevant houses, lords and natal planets.",
  },
  {
    number: "06",
    title: "Check transit aspects",
    text: "A transiting planet can influence a natal house or planet from another Rashi through its Drishti.",
  },
  {
    number: "07",
    title: "Look for convergence",
    text: "Timing becomes more persuasive when Dasha and several relevant transit factors point toward the same natal theme.",
  },
  {
    number: "08",
    title: "Use faster planets to refine",
    text: "Once the larger window exists, the Sun, Mars, Mercury, Venus and especially the Moon can help study shorter activation periods.",
  },
];

export default function TransitsGocharPage() {
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
            <span className="text-[#4c3e50]">Transits</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Lesson 12 · Timing
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Transits: How the Moving Sky Interacts With the Birth Chart
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            The planets continue moving after birth. Gochar studies how their
            current positions interact with the natal horoscope and with the
            planetary periods already operating.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The twelfth principle to remember
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              <strong>
                A transit is most meaningful when it activates something that
                is already relevant in the natal chart and planetary period.
              </strong>
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* WHAT IS GOCHAR */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the concept
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What is Gochar?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                <strong>Gochar</strong> refers to the movement or transit of the
                grahas through the zodiac after birth.
              </p>

              <p>
                Your natal chart is calculated for one particular moment. The
                planets do not remain at those positions.
              </p>

              <p>
                As they continue moving, they pass through different Rashis and
                houses relative to your natal chart and form changing
                relationships with natal planets.
              </p>

              <p>
                Transit analysis studies these changing relationships.
              </p>
            </div>
          </section>

          {/* TRANSIT IS NOT NATAL */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Two different layers
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Natal placement and transit are not the same thing.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Natal chart
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  Your underlying structure
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Shows the houses planets rule, where they are placed, their
                  dignity, aspects, Sambandha and the themes they carry
                  throughout life.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  Transit chart
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  The current planetary environment
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Shows where the moving planets are now and how they are
                  interacting with the natal structure.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                The transit changes. The natal responsibilities of your planets
                remain rooted in the birth chart.
              </p>
            </div>
          </section>

          {/* WHY SAME TRANSIT DIFFERS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Personalisation
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why doesn&apos;t the same transit produce the same event for
              everyone?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Jupiter may be transiting Gemini for millions of people at the
                same time.
              </p>

              <p>
                But Gemini falls in a different house depending on the
                Ascendant, and each person has different natal planets, house
                lords and Dasha periods.
              </p>

              <p>
                One person may be running a career-linked Dasha. Another may be
                running a period strongly connected with relationships. A third
                may have neither theme prominently activated.
              </p>

              <p>
                The same sky therefore interacts with different natal
                structures.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                A transit is universal. Its interaction with your horoscope is
                personal.
              </p>
            </div>
          </section>

          {/* LAGNA VS MOON */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Reference points
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Should transits be read from Lagna or from the Moon?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Traditional transit analysis frequently examines planetary
                movement relative to the natal Moon, while chart-specific
                predictive work also studies transits through houses from the
                Lagna and their contact with natal planets and house lords.
              </p>

              <p>
                These are not mutually exclusive approaches.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  From Lagna
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  House-specific activation
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  Shows which natal houses the moving planets occupy and
                  aspect, making it especially useful when studying specific
                  areas of life.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3d5c5] bg-white p-7">
                <p className="text-sm font-semibold text-[#9a6d58]">
                  From natal Moon
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Traditional Gochar reference
                </h3>

                <p className="mt-4 leading-7 text-[#65586a]">
                  The Moon is an important reference point in classical transit
                  analysis and is used in several traditional Gochar
                  frameworks.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                For event analysis, avoid reducing Gochar to a single reference
                point. Study the relevant natal houses, planets and the Moon
                within the larger timing framework.
              </p>
            </div>
          </section>

          {/* SPEED */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Different clocks
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Slow planets create broad windows. Faster planets can refine
              them.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Not every transit should be given the same timing weight.
              Planetary speed helps determine how long an activation remains
              relevant.
            </p>

            <div className="mt-10 space-y-5">
              {transitPlanets.map((item) => (
                <div
                  key={item.planet}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <div className="grid gap-4 md:grid-cols-[150px_130px_1fr]">
                    <div>
                      <h3 className="text-xl font-semibold">{item.planet}</h3>
                      <p className="mt-1 text-sm text-[#9a6d58]">
                        {item.pace}
                      </p>
                    </div>

                    <p className="font-medium text-[#4b2744]">{item.role}</p>

                    <p className="leading-7 text-[#65586a]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TRANSIT THROUGH HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Layer one
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Which natal house is the planet transiting?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A moving planet occupies a Rashi, and that Rashi corresponds to
                a natal house from the Ascendant.
              </p>

              <p>
                If Jupiter enters the natal 10th house, professional matters may
                receive greater emphasis during that broad period.
              </p>

              <p>
                But this does <strong>not</strong> mean:
              </p>

              <p className="font-semibold text-[#493b4d]">
                “Jupiter in the 10th = promotion.”
              </p>

              <p>
                We still need to know whether career is supported in the natal
                chart, whether the relevant Dasha is active and what Jupiter is
                actually contacting.
              </p>
            </div>
          </section>

          {/* ASPECTS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Layer two
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A transiting planet can activate a house without occupying it.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Graha Drishti principles learned in Lesson 7 also matter in
                transit analysis.
              </p>

              <p>
                Jupiter has its 5th, 7th and 9th aspects. Saturn has its 3rd,
                7th and 10th aspects. Mars has its 4th, 7th and 8th aspects.
                The other visible grahas use the 7th aspect in the foundational
                Parashari framework.
              </p>

              <p>
                Therefore a slow-moving planet may influence several natal
                houses while remaining in one Rashi.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                In transit analysis ask both: “Where is the planet?” and “What
                is it aspecting?”
              </p>
            </div>
          </section>

          {/* NATAL PLANETS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Layer three
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Is the transit contacting an important natal planet?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                House transit is only one layer.
              </p>

              <p>
                A moving planet may conjoin or aspect a natal planet that rules
                important houses.
              </p>

              <p>
                Suppose natal Mercury rules the 10th house.
              </p>

              <p>
                A significant slow-moving transit influencing natal Mercury can
                therefore become relevant to career analysis even if the
                transiting planet is not physically occupying the 10th house.
              </p>

              <p>
                This is why transit interpretation requires the natal chart.
              </p>
            </div>
          </section>

          {/* DASHA LORD TRANSIT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A powerful connection
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Pay attention when transits activate the planets already running
              in Dasha.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose Mercury is operating as Mahadasha or Antardasha lord.
              </p>

              <p>
                Mercury&apos;s natal responsibilities are already temporally
                active.
              </p>

              <p>
                If Jupiter or Saturn now forms an important transit connection
                with natal Mercury, one of the planets already active in the
                Dasha hierarchy is receiving additional stimulation.
              </p>

              <p>
                This kind of convergence is usually more meaningful than
                reading the transit in isolation.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                Dasha tells us which natal planets have the microphone.
                Transits can tell us when something begins interacting strongly
                with them.
              </p>
            </div>
          </section>

          {/* JUPITER */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Jupiter in transit
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Jupiter can create a broad activation window.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Because Jupiter moves relatively slowly, its house placement
                and aspects can remain relevant for months.
              </p>

              <p>
                Jupiter is often associated with growth, knowledge, guidance,
                expansion and opportunity, but these natural significations do
                not replace chart-specific analysis.
              </p>

              <p>
                We should examine which natal houses Jupiter occupies and
                aspects, which natal planets it contacts and whether those
                factors are relevant to the active Dasha.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                “Jupiter is transiting a favourable house” is the beginning of
                an analysis, not the conclusion.
              </p>
            </div>
          </section>

          {/* SATURN */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Saturn in transit
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Saturn creates long periods of emphasis, responsibility and
              restructuring.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Saturn&apos;s slow movement means its influence over a natal
                area can persist for a substantial period.
              </p>

              <p>
                It is therefore particularly important to examine the houses it
                occupies and aspects and the natal planets it contacts.
              </p>

              <p>
                But Saturn transit should not automatically be translated as
                delay, loss or suffering.
              </p>

              <p>
                Depending on the natal chart and Dasha, Saturn&apos;s activation
                can also correspond with responsibility, consolidation,
                commitment, sustained effort or structural change.
              </p>
            </div>
          </section>

          {/* RAHU KETU */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Rahu and Ketu
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The nodal axis can keep two areas of the horoscope active
              together.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Rahu and Ketu always occupy opposite sides of the zodiacal
                axis.
              </p>

              <p>
                Their transit therefore places sustained emphasis on two
                opposing houses from the Lagna and Moon.
              </p>

              <p>
                Their interpretation should consider the houses occupied, their
                sign dispositors, contacts with natal planets and the active
                Dasha.
              </p>

              <p>
                Different Jyotish traditions use different rules for nodal
                aspects, so those rules should not be presented as though one
                approach is universally accepted.
              </p>
            </div>
          </section>

          {/* RETROGRADE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Retrograde motion
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Why can the same transit become relevant more than once?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                From the Earth&apos;s perspective, planets can appear to slow,
                stop and move backward through part of the zodiac before
                resuming direct motion.
              </p>

              <p>
                A planet may therefore cross the same natal degree more than
                once.
              </p>

              <p>
                This can extend an activation window or create several passes
                over the same natal planet or sensitive degree.
              </p>

              <p>
                Retrogression should therefore be studied as part of the
                transit&apos;s timing pattern rather than reduced to a simple
                rule that retrograde planets are automatically negative.
              </p>
            </div>
          </section>

          {/* DOUBLE TRANSIT */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Convergence
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What astrologers sometimes call the “double transit” principle
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                In predictive practice, some astrologers give particular
                importance to periods when both Jupiter and Saturn influence a
                house, its lord or other factors relevant to the event.
              </p>

              <p>
                The logic is not that Jupiter and Saturn automatically create
                an event together.
              </p>

              <p>
                Rather, two major slow-moving planets are simultaneously
                activating the same natal theme.
              </p>

              <p>
                This can become more persuasive when the relevant houses are
                already supported by the natal chart and activated by Dasha.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Double transit is a convergence technique — not a standalone
                guarantee.
              </p>
            </div>
          </section>

          {/* FAST PLANETS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Narrowing the window
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Faster planets can help refine a broader period.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Suppose the natal chart supports a career development, the
                relevant Dasha is operating and Jupiter and Saturn create a
                broader supportive activation.
              </p>

              <p>
                That may still describe a window lasting several months.
              </p>

              <p>
                Faster planets can help us study smaller periods inside that
                window.
              </p>

              <p>
                Mars, Sun, Mercury and Venus may activate relevant houses,
                house lords or Dasha planets for shorter durations.
              </p>

              <p>
                The Moon moves much faster and can be examined for very
                short-lived activation.
              </p>
            </div>
          </section>

          {/* MOON */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Fine timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The Moon can act as a short-term timing layer.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Moon moves through the zodiac rapidly, spending roughly two
                and a quarter days in a Rashi and approximately one day in a
                Nakshatra on average.
              </p>

              <p>
                Because of this speed, the Moon can help examine individual
                days within a broader event window.
              </p>

              <p>
                For example, we may examine whether the Moon is transiting a
                relevant house, contacting an active Dasha planet, passing over
                an important natal degree or moving through a relevant
                Nakshatra.
              </p>

              <p>
                But a Moon transit should not be expected to create a major
                event when the larger natal and Dasha structure is absent.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="text-lg font-semibold leading-8 text-[#493b4d]">
                A fast trigger becomes more meaningful when a larger timing
                window already exists.
              </p>
            </div>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Worked example
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How could we study a possible job opportunity?
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Suppose the D1 contains a clear relationship between the{" "}
                  <strong>10th, 6th and 11th houses</strong>.
                </p>

                <p>
                  The D10 repeats professional strength.
                </p>

                <p>
                  The current Mahadasha and Antardasha lords are connected with
                  those career houses.
                </p>

                <p>
                  We now have natal support, divisional reinforcement and Dasha
                  activation.
                </p>

                <p>
                  Suppose transiting Jupiter begins influencing the 10th house
                  or 10th lord.
                </p>

                <p>
                  Saturn simultaneously influences another relevant career
                  factor.
                </p>

                <p>
                  This can create a broader period in which career developments
                  become more plausible.
                </p>

                <p>
                  We can then examine faster planets and the Moon for shorter
                  periods of additional activation.
                </p>

                <p className="font-semibold text-[#403344]">
                  Notice what we did not do: we never said “Jupiter transits the
                  10th, therefore a job will arrive.”
                </p>
              </div>
            </div>
          </section>

          {/* METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A practical method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should you analyse a transit for an event?
            </h2>

            <div className="mt-10 space-y-5">
              {transitMethod.map((step) => (
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

          {/* EVENT WINDOW */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Think in windows before thinking in dates.
            </h2>

            <div className="mt-8 space-y-4">
              {[
                [
                  "Natal chart",
                  "Is the event or theme structurally supported?",
                ],
                [
                  "Relevant Varga",
                  "Does the specialised chart reinforce or qualify the theme?",
                ],
                [
                  "Mahadasha",
                  "Is a planet carrying the relevant agenda broadly active?",
                ],
                [
                  "Antardasha",
                  "Does a second planet narrow and strengthen the event connection?",
                ],
                [
                  "Pratyantardasha",
                  "Can the planetary-period hierarchy be narrowed further?",
                ],
                [
                  "Slow transits",
                  "Do Jupiter, Saturn or the nodes create a broader external activation window?",
                ],
                [
                  "Fast transits",
                  "Do faster planets reinforce the same theme within that window?",
                ],
                [
                  "Moon",
                  "Does the Moon provide a short-lived activation on a particular day or small cluster of days?",
                ],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="grid gap-3 rounded-2xl border border-[#e4d8ca] bg-white p-6 md:grid-cols-[150px_1fr]"
                >
                  <p className="font-semibold text-[#8b5a79]">{title}</p>
                  <p className="leading-7 text-[#65586a]">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                The more independent timing layers converge on the same natal
                theme, the more meaningful the window becomes.
              </p>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common beginner mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading transits?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Do not predict an event from one transit alone.",
                "Do not assume Jupiter automatically gives a favourable event wherever it transits.",
                "Do not assume Saturn automatically causes loss or delay.",
                "Do not study only the house occupied by a transiting planet; check its aspects too.",
                "Do not ignore contacts with natal house lords and Dasha planets.",
                "Do not use generic Moon-sign transit statements as a substitute for the full natal chart.",
                "Do not ignore retrograde passes over important natal degrees.",
                "Do not treat Rahu and Ketu transits as universally disruptive.",
                "Do not use the Moon as a standalone predictor of major events.",
                "Do not search for an exact date before establishing a credible broader window.",
                "Do not confuse a supportive transit environment with a guaranteed outcome.",
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

          {/* FULL FRAMEWORK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The predictive framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              We can now connect structure and time.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Natal promise",
                  text: "What does the D1 structurally support?",
                },
                {
                  number: "02",
                  title: "Varga refinement",
                  text: "Does the relevant specialised chart repeat or qualify the theme?",
                },
                {
                  number: "03",
                  title: "Dasha activation",
                  text: "Are planets connected with that theme currently active?",
                },
                {
                  number: "04",
                  title: "Transit window",
                  text: "Are moving planets now activating the relevant houses, lords or natal planets?",
                },
                {
                  number: "05",
                  title: "Fine trigger",
                  text: "Do faster planets and the Moon narrow the broader window?",
                },
                {
                  number: "06",
                  title: "Synthesis",
                  text: "How many independent layers are pointing toward the same event theme?",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <p className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                    {item.number}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[#65586a]">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SUMMARY */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Lesson 12 summary
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you remember?
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Gochar studies the current movement of planets through the zodiac.",
                "The same transit does not produce the same result for everyone because natal charts and Dashas differ.",
                "Transits can be examined from the Lagna, natal Moon and through direct contact with natal planets and house lords.",
                "Slow-moving planets create broader activation windows.",
                "Faster planets can help refine those windows.",
                "A planet can activate a natal house through occupation or aspect.",
                "Transit contacts with active Dasha planets can be especially relevant.",
                "Jupiter should not automatically be treated as favourable and Saturn should not automatically be treated as difficult.",
                "Rahu and Ketu should be interpreted through their axis, dispositors, associations and the larger timing context.",
                "Retrograde motion can produce repeated contacts with important natal degrees.",
                "The double-transit principle is a convergence technique rather than a standalone prediction rule.",
                "The Moon can provide a fine timing layer inside an already meaningful broader window.",
                "The strongest timing arguments come from convergence between natal structure, Varga, Dasha and transit.",
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
              Lesson 13 — Predictive Astrology & Event Timing
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              We have now learned the individual layers.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              Next we will put them together.
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#65586a]">
              We will start with a real-life question, identify the houses
              required for that event, test the natal promise, identify the
              active Dasha, examine the relevant Varga, build a transit window
              and then decide how specific the prediction can responsibly
              become.
            </p>

            <div className="mt-7">
              <span className="rounded-full border border-[#dccdbc] bg-white px-5 py-3 text-sm font-medium">
                Lesson 13 · Coming next
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Timing is built in layers
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                A transit is not the prediction. It is one part of the timing
                argument.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                In the final foundational lesson, we will combine everything
                learned so far into a disciplined method for predicting
                specific events.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  ← Lesson 11: Divisional Charts
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