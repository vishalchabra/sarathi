import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Why Is My Marriage Delayed? Marriage Delay in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies delayed marriage through the 7th house, 7th lord, planetary strength, Navamsa, Dashas and transits — without reducing delay to one planet or Dosha.",
  path: "/sarathi/learn/questions/why-is-my-marriage-delayed",
  keywords: [
    "Why Is My Marriage Delayed Astrology",
    "Marriage Delay Astrology",
    "Delayed Marriage Vedic Astrology",
    "Late Marriage Astrology",
    "7th House Marriage Delay",
    "7th Lord Marriage",
    "Saturn Marriage Delay",
    "Navamsa Marriage",
    "D9 Marriage",
    "Marriage Dasha",
    "Vedic Astrology Marriage",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Why Is My Marriage Delayed? How Vedic Astrology Studies Marriage Delay",
  description:
    "A practical guide to understanding how Vedic astrology studies delayed marriage through the birth chart, 7th house, planetary strength, Navamsa, Dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/why-is-my-marriage-delayed",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/why-is-my-marriage-delayed",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Marriage astrology",
    "Marriage delay",
    "7th house",
    "Navamsa",
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
      name: "Why Is My Marriage Delayed?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/why-is-my-marriage-delayed",
    },
  ],
};

const marriageFactors = [
  {
    title: "7th House",
    text: "The 7th house is central to marriage and committed partnership. Its Rashi, occupants, aspects and overall condition form an important part of the analysis.",
  },
  {
    title: "7th Lord",
    text: "The placement, dignity, Nakshatra, dispositor, aspects and associations of the 7th lord help show how the marriage agenda operates within the horoscope.",
  },
  {
    title: "Supporting Houses",
    text: "The 2nd house can contribute family formation themes, while the 11th can contribute fulfilment and materialisation. These are studied alongside the 7th rather than as automatic marriage combinations.",
  },
  {
    title: "Planetary Strength",
    text: "The capacity of relevant planets matters. A planet connected with marriage may be active, but its strength and condition help determine how easily its agenda can express.",
  },
  {
    title: "Navamsa — D9",
    text: "The Navamsa is an important divisional chart for refining marriage and partnership analysis. It should be interpreted after the D1 promise has been established.",
  },
  {
    title: "Dasha & Transit",
    text: "Planetary periods show when natal relationship themes become active, while transits can help create broader windows and narrower periods of manifestation.",
  },
];

const delayPatterns = [
  {
    title: "Later activation",
    text: "The horoscope may contain marriage potential, but the planetary periods capable of activating it may occur later in life.",
  },
  {
    title: "Repeated postponement",
    text: "A person may enter relationships or receive proposals, yet commitment or formalisation may repeatedly move forward and then stall.",
  },
  {
    title: "Greater selectivity",
    text: "Some combinations may coincide with a cautious, highly selective or responsibility-conscious approach to partnership, which can naturally lengthen the process.",
  },
  {
    title: "Competing life priorities",
    text: "Career, education, relocation, family responsibilities or other strongly activated areas of life may take precedence during certain periods.",
  },
  {
    title: "Relationship development before marriage",
    text: "A relationship may begin during one activation period while formal marriage requires a later convergence of stronger commitment and family-related factors.",
  },
  {
    title: "External circumstances",
    text: "Family expectations, geography, finances, social circumstances and personal decisions can affect when marriage actually occurs even during supportive astrological periods.",
  },
];

const distinctions = [
  {
    title: "Delay",
    text: "Marriage may occur later than expected, but the chart can still contain meaningful partnership potential.",
  },
  {
    title: "Difficulty",
    text: "Relationships may involve conflict, instability, mismatched expectations or repeated challenges. Difficulty does not automatically mean marriage will be late.",
  },
  {
    title: "Denial",
    text: "A conclusion that marriage is impossible is far stronger than identifying delay or difficulty and should not be casually inferred from one placement, aspect or Dosha.",
  },
];

const timingSteps = [
  {
    number: "01",
    title: "Define the actual question",
    text: "Is the concern that no relationship is forming, relationships are not becoming committed, proposals keep failing, or marriage is agreed but repeatedly postponed? These are different patterns.",
  },
  {
    number: "02",
    title: "Establish the D1 marriage promise",
    text: "Study the 7th house, 7th lord, relevant planets, supporting houses, aspects and Sambandha before making any conclusion about timing.",
  },
  {
    number: "03",
    title: "Judge planetary capacity",
    text: "Examine dignity, strength, placement, dispositor relationships and other relevant conditions. Activation alone does not tell us how smoothly a planet can deliver its agenda.",
  },
  {
    number: "04",
    title: "Look for repeated delay factors",
    text: "One difficult placement is not enough. A stronger delay hypothesis requires related indications to repeat through independent parts of the horoscope.",
  },
  {
    number: "05",
    title: "Examine the Navamsa",
    text: "Use the D9 to refine the relationship picture after establishing the D1 promise. Look for confirmation, modification and the strength of relevant marriage factors.",
  },
  {
    number: "06",
    title: "Study the running Dasha",
    text: "Ask whether the Mahadasha, Antardasha and shorter periods activate planets connected with marriage and whether those planets have the capacity to produce the relevant event.",
  },
  {
    number: "07",
    title: "Add transit activation",
    text: "Major transits can reinforce relevant natal and Dasha factors. They are more useful as activation layers than as standalone promises of marriage.",
  },
  {
    number: "08",
    title: "Separate relationship from marriage",
    text: "A period may support meeting someone or beginning a relationship without yet supporting formal marriage. Event type should be identified carefully.",
  },
  {
    number: "09",
    title: "Look for convergence",
    text: "Confidence becomes stronger when D1, D9, Dasha and transit factors independently support the same relationship or marriage theme.",
  },
  {
    number: "10",
    title: "State only what the evidence supports",
    text: "If the chart supports a broader favourable period rather than an exact date, the interpretation should remain at that level instead of creating false precision.",
  },
];

const commonMistakes = [
  "Assuming Saturn connected with the 7th house automatically means late marriage.",
  "Treating Manglik or Kuja Dosha as a standalone explanation for marriage delay.",
  "Assuming one difficult placement means marriage will not happen.",
  "Calling every relationship challenge a delay combination.",
  "Using Venus or Jupiter as universal marriage timers without studying their functional role in the individual chart.",
  "Reading the Navamsa independently from the D1 birth chart.",
  "Predicting marriage only because Jupiter is transiting the 7th house.",
  "Ignoring the running Dasha while focusing entirely on transits.",
  "Confusing the beginning of a relationship with the formalisation of marriage.",
  "Giving an exact marriage date when the chart only supports a broader period.",
];

const saturnQuestions = [
  {
    title: "What does Saturn rule?",
    text: "Its house lordship changes with the Ascendant, so its functional responsibility must be established before interpreting its involvement in marriage.",
  },
  {
    title: "Where is Saturn placed?",
    text: "Its house and Rashi placement help show where Saturn's responsibilities are being expressed.",
  },
  {
    title: "What does Saturn connect with?",
    text: "Aspects, conjunctions, dispositors and other forms of Sambandha determine whether and how Saturn becomes connected with the marriage agenda.",
  },
  {
    title: "Is Saturn actually active?",
    text: "A natal indication may remain background potential until relevant Dasha and transit periods bring it into stronger expression.",
  },
];

export default function WhyIsMyMarriageDelayedPage() {
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

            <span>Marriage & Relationships</span>

            <span>›</span>

            <span className="text-[#4c3e50]">
              Why is my marriage delayed?
            </span>
          </nav>
        </div>

        {/* HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Marriage & Relationships · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Why Is My Marriage Delayed? How Vedic Astrology Studies Marriage
            Delay
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Delayed marriage is one of the most frequently simplified topics in
            astrology. A responsible Vedic analysis does not blame one planet,
            one Dosha or one difficult placement. It studies whether a pattern
            of later activation repeats across the birth chart, Navamsa, Dasha
            and timing layers.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              In Vedic astrology, marriage delay is better understood as a{" "}
              <strong>repeated timing pattern</strong> than as the result of one
              supposedly difficult planet. The 7th house and lord, supporting
              relationship factors, planetary strength, Navamsa and running
              Dashas are studied together. Most importantly,{" "}
              <strong>delay, difficulty and denial are not the same thing.</strong>
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          {/* FIRST PRINCIPLE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              First principle
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Delay is not the same as denial.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Someone may marry later than family, society or personal
                expectations suggest and still have a meaningful marriage
                promise in the horoscope.
              </p>

              <p>
                Similarly, a difficult relationship pattern does not
                automatically mean late marriage, and late marriage does not
                automatically mean an unhappy partnership.
              </p>

              <p>
                These conclusions must be separated before interpretation
                begins.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {distinctions.map((item) => (
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
                Delay, difficulty and denial are not interchangeable concepts.
              </p>
            </div>
          </section>

          {/* FACTORS */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Marriage factors
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does Vedic astrology examine for marriage delay?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              The analysis begins with the marriage promise itself. Only then
              does it ask whether the chart repeatedly points toward earlier,
              later or more complicated manifestation.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {marriageFactors.map((factor) => (
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

          {/* 7TH HOUSE */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Does a difficult 7th house mean late marriage?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Not automatically. The 7th house is central to marriage, but no
                single occupant or aspect should be converted directly into a
                timing conclusion.
              </p>

              <p>
                The astrologer studies the 7th house together with its lord,
                planetary strength, aspects, Sambandha, relevant supporting
                houses, the Navamsa and planetary periods.
              </p>

              <p>
                A challenging influence may describe responsibility, caution,
                conflict, unusual circumstances or another relationship theme.
                Whether it actually contributes to later marriage requires
                confirmation elsewhere.
              </p>

              <p className="font-semibold text-[#47394b]">
                One difficult placement is an observation. Repetition turns it
                into a stronger hypothesis.
              </p>
            </div>
          </section>

          {/* SATURN */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A common belief
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does Saturn always delay marriage?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Saturn is traditionally associated with time, responsibility,
                structure, endurance and maturity, which is one reason it is
                frequently connected with the idea of delay.
              </p>

              <p>
                But saying{" "}
                <strong>“Saturn in the 7th means late marriage”</strong> is too
                mechanical. Saturn's role changes according to the Ascendant,
                house lordship, placement, dignity, aspects, associations and
                planetary periods.
              </p>

              <p>
                Its involvement may coincide with seriousness, commitment,
                responsibility, caution or a need for maturity. Delay is only
                one possible expression and requires supporting evidence.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {saturnQuestions.map((item) => (
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

          {/* MANGLIK */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Another common shortcut
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does Manglik Dosha automatically delay marriage?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Manglik or Kuja Dosha is frequently treated online as a
                standalone explanation for marriage problems or delay. That is
                an oversimplification.
              </p>

              <p>
                Mars must be interpreted within the complete horoscope,
                including its functional role, dignity, aspects, associations
                and the strength of the broader marriage pattern.
              </p>

              <p>
                Traditional approaches also contain different rules,
                exceptions and cancellation considerations, so a single
                checklist should not replace complete chart analysis.
              </p>

              <p className="font-semibold text-[#47394b]">
                A Dosha label should begin further analysis — not end it.
              </p>
            </div>
          </section>

          {/* WHAT DELAY CAN LOOK LIKE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Real-life expression
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What can a delayed-marriage pattern actually look like?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {delayPatterns.map((pattern) => (
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

          {/* D9 */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Navamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What role does the D9 play?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Navamsa or D9 is an important divisional chart used to
                refine marriage and partnership analysis.
              </p>

              <p>
                It can help confirm, strengthen or modify themes already visible
                in the D1. The condition of relevant planets and relationship
                factors in the D9 adds depth to the interpretation.
              </p>

              <p>
                It should not be used to declare marriage delay when the main
                birth chart has not first been properly studied.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the promise. D9 refines the marriage dimension.
              </p>
            </div>
          </section>

          {/* DASHA */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Sometimes the issue is not weak marriage promise — but later
              activation.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A horoscope can contain meaningful marriage potential while the
                Dashas capable of strongly activating that potential arrive
                later.
              </p>

              <p>
                Mahadasha establishes the larger planetary environment.
                Antardasha and shorter sub-periods can bring more specific
                relationship factors into focus.
              </p>

              <p>
                This is why two people with apparently similar natal marriage
                combinations may marry at very different ages.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natal promise and event timing are separate questions. Both must
                be answered.
              </p>
            </div>
          </section>

          {/* TRANSITS */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter transit the 7th house end a marriage delay?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A supportive Jupiter transit may become relevant when it
                activates important marriage factors, but it should not be
                treated as an automatic marriage trigger.
              </p>

              <p>
                Saturn and the lunar nodes may also become important depending
                on the natal horoscope and active Dasha.
              </p>

              <p>
                Transit is most useful when it reinforces an event already
                supported by the natal chart and planetary periods.
              </p>

              <p className="font-semibold text-[#47394b]">
                Natal promise → Dasha activation → transit support is stronger
                reasoning than transit alone.
              </p>
            </div>
          </section>

          {/* TIMING METHOD */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should marriage delay actually be analysed?
            </h2>

            <div className="mt-10 space-y-5">
              {timingSteps.map((step) => (
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
              How later activation might appear in practice
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope where the D1 contains a viable marriage
                  promise but also shows repeated themes of caution,
                  responsibility or later maturation around partnership.
                </p>

                <p>
                  The Navamsa continues the relationship potential rather than
                  contradicting it, but the earlier Dashas do not strongly
                  activate the relevant marriage factors.
                </p>

                <p>
                  A later Antardasha begins connecting the 7th house, its lord
                  and supporting family or fulfilment factors. Major transits
                  then reinforce the same natal pattern.
                </p>

                <p>
                  The interpretation would be very different from saying,
                  “Marriage is denied.”
                </p>

                <p className="font-semibold text-[#403344]">
                  The stronger conclusion may simply be that the marriage
                  promise becomes easier to activate at a later stage.
                </p>
              </div>
            </div>
          </section>

          {/* FREE WILL */}
          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Astrology is not the only reason people marry later.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Education, career priorities, family circumstances, geography,
                finances, personal expectations, social environment and the
                availability of a compatible partner all influence real-world
                marriage timing.
              </p>

              <p>
                People also make choices. Someone may decline a suitable
                proposal, end a relationship, postpone commitment or simply
                decide that marriage is not currently a priority.
              </p>

              <p className="font-semibold text-[#47394b]">
                Astrology can describe timing and relationship potential. Human
                choices and circumstances influence how that potential is
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
              What should you avoid when interpreting marriage delay?
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
              Do not diagnose delay from one placement.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Marriage-delay analysis should move from the overall promise
                toward increasingly specific timing evidence.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → D1 marriage promise → 7th house → 7th lord →
                supporting houses → planetary strength → Sambandha → D9 → Dasha
                → transit activation → convergence → timing window.
              </p>

              <p>
                This keeps the interpretation focused on evidence rather than
                fear-producing labels.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          {/* RELATED MARRIAGE */}
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Marriage & Relationships
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Understand marriage timing next
            </h2>

            <div className="mt-8">
              <Link
                href="/sarathi/learn/questions/when-will-i-get-married"
                className="block rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Marriage & Relationships
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I get married?
                </h3>

                <p className="mt-3 max-w-2xl leading-7 text-[#6a5d6e]">
                  Learn how Vedic astrology studies marriage timing through the
                  birth chart, Navamsa, planetary periods and transits.
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
              Build the concepts used in marriage analysis through the Sārathi
              Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the 7th house within the complete Bhava framework.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the 7th lord carries the partnership agenda.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why activation and capacity are separate questions.
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
                  Learn how relationship factors connect within the horoscope.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the role of the Navamsa in marriage analysis.
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
                  Learn how natal relationship themes become active over time.
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
                  See how promise, Dasha and transit are brought together.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Your relationship timing is personal
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Marriage timing depends on how your own chart factors come
                together.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you explore your birth chart, planetary periods,
                divisional charts and current timing through a structured Vedic
                astrology framework — without reducing your relationship story
                to one planet or one Dosha.
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
              cannot guarantee marriage, determine that marriage is impossible,
              establish a compulsory marriage age or replace personal judgement,
              relationship counselling, legal advice or other professional
              support.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}