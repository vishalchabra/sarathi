import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Why Is Childbirth Delayed? Vedic Astrology Explained",
  description:
    "Learn how Vedic astrology traditionally studies delayed childbirth through the 5th house, 5th lord, Jupiter, D7 or Saptamsha, Dashas and transits — without confusing astrological delay with infertility.",
  path: "/sarathi/learn/questions/why-is-childbirth-delayed",
  keywords: [
    "Why Is Childbirth Delayed Astrology",
    "Delayed Childbirth Vedic Astrology",
    "Childbirth Delay in Kundli",
    "Santaan Delay Astrology",
    "5th House Childbirth Delay",
    "Jupiter Childbirth Astrology",
    "D7 Chart Childbirth",
    "Saptamsha Childbirth",
    "Childbirth Dasha",
    "Children Vedic Astrology",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Why Is Childbirth Delayed? What Vedic Astrology Can — and Cannot — Show",
  description:
    "A careful guide to how Vedic astrology traditionally studies delayed childbirth through natal promise, the 5th house, 5th lord, Jupiter, D7, Dashas and transits.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/why-is-childbirth-delayed",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/why-is-childbirth-delayed",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Delayed childbirth",
    "5th house",
    "5th lord",
    "Jupiter",
    "D7 chart",
    "Saptamsha",
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
      name: "Why Is Childbirth Delayed?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/why-is-childbirth-delayed",
    },
  ],
};

const distinctions = [
  {
    title: "Astrological Delay",
    text: "A traditional chart interpretation may suggest that children-related themes become more prominent later rather than earlier. This is a timing interpretation, not a medical diagnosis.",
  },
  {
    title: "Medical Fertility",
    text: "Fertility and reproductive health are medical matters. A horoscope cannot determine whether a person or couple has a fertility condition.",
  },
  {
    title: "Life Circumstances",
    text: "Career, relationships, finances, personal choice and other real-life circumstances may affect when someone chooses or is ready to have children.",
  },
  {
    title: "Denial",
    text: "A permanent conclusion is far stronger than a timing observation. Difficult placements or delayed periods should not casually be converted into predictions of childlessness.",
  },
];

const factors = [
  {
    title: "5th House",
    text: "The 5th house is the primary house traditionally associated with children. Its occupants, aspects and overall support form part of the natal enquiry.",
  },
  {
    title: "5th Lord",
    text: "The 5th lord carries the children-related agenda through the horoscope. Its placement, dignity, dispositor and relationships can modify the pattern.",
  },
  {
    title: "Jupiter",
    text: "Jupiter is an important natural significator for children in relevant Jyotish contexts, but it should never be used as a standalone fertility or childbirth indicator.",
  },
  {
    title: "Planetary Strength",
    text: "A planet may be relevant to children yet have different capacity depending on dignity, house placement, dispositor support and the wider chart.",
  },
  {
    title: "Sambandha",
    text: "Connections between the 5th house, 5th lord, Jupiter and other relevant factors can reveal how the children-related agenda is integrated into the horoscope.",
  },
  {
    title: "D7 / Saptamsha",
    text: "The D7 traditionally refines the progeny dimension after the D1 birth chart has first established the natal framework.",
  },
];

const delayQuestions = [
  {
    title: "Is there support in the D1?",
    text: "Begin with the natal chart rather than jumping immediately to difficult planets, Doshas or a divisional chart.",
  },
  {
    title: "Is the pattern truly difficult or simply slower?",
    text: "A chart can contain both supportive and challenging factors. The task is to judge their relative strength rather than label one placement as denial.",
  },
  {
    title: "What is the condition of the 5th lord?",
    text: "Placement, dignity, dispositor, aspects and Sambandha can help distinguish a capable factor from one requiring greater support.",
  },
  {
    title: "Does Jupiter support the theme?",
    text: "Jupiter adds a natural-signification layer, but its actual role depends on the individual horoscope.",
  },
  {
    title: "What does the D7 add?",
    text: "Saptamsha may repeat, refine or complicate the children-related pattern established in the D1.",
  },
  {
    title: "Is the current timing supportive?",
    text: "Sometimes the natal promise is present while the running Dasha does not yet strongly activate the children-related agenda.",
  },
];

const timingLayers = [
  {
    title: "Natal Promise",
    text: "First determine what the D1 actually supports. Timing should not be used to manufacture a conclusion.",
  },
  {
    title: "Strength & Support",
    text: "Judge the condition of the 5th house, 5th lord, Jupiter and other relevant factors.",
  },
  {
    title: "D7 Refinement",
    text: "Use Saptamsha to refine the children-related dimension after the D1 has been understood.",
  },
  {
    title: "Dasha Activation",
    text: "Planetary periods help identify when children-related natal agendas become more prominent.",
  },
  {
    title: "Transit Support",
    text: "Transits can reinforce an active period and help narrow a broader timing window.",
  },
];

const steps = [
  {
    number: "01",
    title: "Define what 'delay' means",
    text: "Clarify whether the concern is about personal timing, difficulty conceiving, postponement by choice, repeated interruption or another situation. Astrology should not convert a medical concern into a chart diagnosis.",
  },
  {
    number: "02",
    title: "Begin with the D1",
    text: "Study the overall natal promise before interpreting any individual difficult placement.",
  },
  {
    number: "03",
    title: "Examine the 5th house",
    text: "Study occupants, aspects and the wider condition of the house traditionally associated with children.",
  },
  {
    number: "04",
    title: "Examine the 5th lord",
    text: "Assess its placement, dignity, dispositor, relationships and capacity to carry its agenda.",
  },
  {
    number: "05",
    title: "Study Jupiter contextually",
    text: "Use Jupiter as a natural significator without treating it as a universal guarantee or cause of difficulty.",
  },
  {
    number: "06",
    title: "Judge strength rather than labels",
    text: "A difficult association should be weighed against supportive factors elsewhere in the chart.",
  },
  {
    number: "07",
    title: "Map Sambandha",
    text: "Look for meaningful connections involving the children-related houses and planets rather than relying on one isolated placement.",
  },
  {
    number: "08",
    title: "Look for repetition",
    text: "Repeated independent indications carry more interpretive weight than a single challenging factor.",
  },
  {
    number: "09",
    title: "Examine the D7",
    text: "Use Saptamsha to refine the natal picture rather than overturning the D1 from one divisional placement.",
  },
  {
    number: "10",
    title: "Study the running Dasha",
    text: "Determine whether capable children-related factors are active now or whether another life agenda dominates the period.",
  },
  {
    number: "11",
    title: "Add transit support",
    text: "Use major transits to refine an already active period rather than predicting childbirth from Jupiter or Saturn alone.",
  },
  {
    number: "12",
    title: "Keep astrology within its limits",
    text: "Describe astrological support, complexity or timing without diagnosing fertility, promising conception or predicting a medical outcome.",
  },
];

const mistakes = [
  "Treating a difficult 5th house as proof of infertility.",
  "Assuming Saturn connected with the 5th house automatically denies children.",
  "Assuming Rahu or Ketu causes childlessness.",
  "Treating Jupiter as a universal guarantee of childbirth.",
  "Calling one difficult combination a permanent denial.",
  "Using the D7 without first understanding the D1.",
  "Predicting childbirth from Jupiter transit alone.",
  "Ignoring the running Dasha.",
  "Treating delay, infertility and denial as interchangeable.",
  "Diagnosing reproductive health through astrology.",
  "Predicting the sex or gender of a future child.",
  "Using fear-based Dosha language without whole-chart analysis.",
];

const faqItems = [
  {
    question: "Can astrology explain why childbirth is delayed?",
    answer:
      "Vedic astrology can traditionally be used to study whether children-related themes appear more or less supported during particular periods. It cannot identify a medical cause of delayed conception or diagnose fertility.",
  },
  {
    question: "Does Saturn in the 5th house delay childbirth?",
    answer:
      "Not automatically. Saturn's role depends on house lordship, dignity, aspects, conjunctions, the 5th lord, wider chart support, D7 and timing. One Saturn placement should not decide the conclusion.",
  },
  {
    question: "Does a difficult 5th house mean I cannot have children?",
    answer:
      "No. A difficult 5th-house pattern is not a medical fertility diagnosis and should not automatically be interpreted as permanent denial of children.",
  },
  {
    question: "Which chart is used to study childbirth?",
    answer:
      "The D1 birth chart establishes the natal foundation. The D7, or Saptamsha, is traditionally used to refine the children and progeny dimension. Dashas and transits then add timing layers.",
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

export default function ChildbirthDelayPage() {
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
            <span>Children & Family</span>
            <span>›</span>
            <span className="text-[#4c3e50]">
              Why Is Childbirth Delayed?
            </span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Children & Family · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Why Is Childbirth Delayed? What Vedic Astrology Can — and Cannot —
            Show
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Delayed childbirth is one of the areas where astrological language
            needs particular care. A difficult 5th house, Saturn, Rahu, Ketu or
            one challenging Yoga should never be turned into a diagnosis of
            infertility or a prediction of childlessness.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The most important distinction
            </p>

            <p className="mt-4 text-2xl font-semibold leading-9 text-[#4f4353]">
              Delay ≠ infertility ≠ denial.
            </p>

            <p className="mt-4 text-lg leading-8 text-[#65586a]">
              Astrology may traditionally be used to study periods of stronger
              or weaker children-related activation. It cannot diagnose
              fertility, identify a medical cause of difficulty conceiving or
              guarantee childbirth.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start with the question
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does “childbirth is delayed” actually mean?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Several very different situations can sit behind the same
              question. They should not be collapsed into one astrological
              conclusion.
            </p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {distinctions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Traditional framework
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does Vedic astrology examine for childbirth timing?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {factors.map((factor) => (
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
              Can a difficult 5th house cause delayed childbirth?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 5th house is central to the traditional study of children,
                so its condition matters.
              </p>

              <p>
                But “difficult” is not a complete interpretation. The 5th house
                may receive both supportive and challenging influences, and its
                lord may be considerably stronger than the house appears at
                first glance.
              </p>

              <p>
                The D7 and timing periods may add further support or
                complexity.
              </p>

              <p className="font-semibold text-[#47394b]">
                A difficult 5th house is a factor to investigate — not a
                diagnosis and not an automatic denial.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A common misconception
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Does Saturn automatically delay childbirth?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>No.</p>

              <p>
                Saturn is frequently associated with delay in simplified
                astrology content, but that association cannot replace
                chart-specific analysis.
              </p>

              <p>
                Saturn may be supportive, challenging or mixed depending on the
                Ascendant, houses it rules, placement, dignity, aspects,
                conjunctions and the wider chart.
              </p>

              <p>
                Even when Saturn contributes to a slower process, that is still
                not equivalent to a medical fertility condition or permanent
                denial.
              </p>

              <p className="font-semibold text-[#47394b]">
                Never turn a planetary stereotype into a life prediction.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              What about Rahu and Ketu?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Rahu and Ketu are also frequently blamed for children-related
                difficulties when they influence the 5th house.
              </p>

              <p>
                That is too simplistic.
              </p>

              <p>
                Their role depends on placement, dispositor, conjunctions,
                aspects, house lordship of connected planets, Dasha activation
                and the wider pattern.
              </p>

              <p className="font-semibold text-[#47394b]">
                Rahu or Ketu connected with the 5th house does not by itself
                mean infertility, miscarriage or childlessness.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Whole-chart judgement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Six questions help separate delay from an exaggerated conclusion.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {delayQuestions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              D7 / Saptamsha
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does the D7 add?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Saptamsha is traditionally used to refine the children and
                progeny dimension.
              </p>

              <p>
                But one difficult placement in the D7 should not overturn an
                otherwise supportive D1, just as one favourable D7 placement
                should not be used to ignore the natal chart.
              </p>

              <p>
                The two charts should be read hierarchically and together.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the foundation. D7 refines it.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Timing hierarchy
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Sometimes the issue is timing rather than absence of promise.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {timingLayers.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-[#6b315c] bg-[#f6eee6] p-7">
              <p className="text-lg font-medium leading-8 text-[#493b4d]">
                Natal promise → strength → D7 refinement → Dasha activation →
                transit support → timing window
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can the wrong Dasha create the appearance of delay?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A horoscope may contain supportive children-related factors
                without those factors being strongly activated during every
                period of life.
              </p>

              <p>
                One Dasha may place greater emphasis on education, career,
                relocation, relationships or another agenda.
              </p>

              <p>
                A later period may activate the 5th lord, Jupiter or other
                capable factors more directly.
              </p>

              <p className="font-semibold text-[#47394b]">
                Lack of activation now is not the same as absence of natal
                potential.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can Jupiter transit predict when the delay will end?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>Not by itself.</p>

              <p>
                Jupiter can become an important timing factor when it activates
                the 5th house, 5th lord or other relevant natal points.
              </p>

              <p>
                But the same transit occurs for many people who do not
                experience the same event.
              </p>

              <p>
                Stronger astrological timing requires convergence between the
                natal chart, D7, active Dasha and supportive transits.
              </p>

              <p className="font-semibold text-[#47394b]">
                Transit refines an active promise. It should not manufacture
                one.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Structured method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How should a childbirth-delay question actually be analysed?
            </h2>

            <div className="mt-10 space-y-5">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-4 rounded-2xl border border-[#e3d5c5] bg-white p-6 md:grid-cols-[70px_1fr]"
                >
                  <div className="text-sm font-bold tracking-[0.18em] text-[#9a6d58]">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-3 leading-7 text-[#6a5d6e]">{step.text}</p>
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
              Why one difficult factor should not become a prediction of denial
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope where Saturn influences the 5th house.
                  Reading that factor alone might tempt someone to declare
                  “delay.”
                </p>

                <p>
                  But suppose the 5th lord is strong, Jupiter offers meaningful
                  support and the D7 repeats several favourable
                  children-related indications.
                </p>

                <p>
                  The current Dasha does not strongly activate those factors,
                  while a later Dasha does.
                </p>

                <p className="font-semibold text-[#403344]">
                  The complete picture is very different from “Saturn means no
                  children.” The chart may instead describe a supportive theme
                  whose stronger activation occurs later.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should be avoided in childbirth-delay astrology?
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
              Study support, complexity and timing — not fear.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A careful interpretation asks what the horoscope actually
                supports before deciding whether a period appears earlier,
                later or more complex.
              </p>

              <p className="font-semibold text-[#47394b]">
                Exact question → D1 promise → 5th house → 5th lord → Jupiter
                contextually → planetary strength → Sambandha → repetition →
                D7 → Dasha → transit activation → supported timing conclusion.
              </p>

              <p>
                Astrology should never turn uncertainty about children into
                fear through one placement or one planetary stereotype.
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
              Childbirth delay questions
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
              Children & Family
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Continue exploring children-related questions
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href="/sarathi/learn/questions/santaan-yoga-in-kundli"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Natal Potential
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Do I have Santaan Yoga in my Kundli?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand how the 5th house, 5th lord, Jupiter and D7 are
                  studied together.
                </p>

                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/when-will-i-have-a-child"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a6d58]">
                  Timing
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  When will I have a child?
                </h3>

                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how planetary periods and transits are used to study
                  children-related timing.
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
              Build the chart-reading principles behind this analysis through
              the Sārathi Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 12 Houses</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand the 5th house within the complete Bhava framework.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">House Lords & Lordship</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how the 5th lord carries its agenda through the chart.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand why relevance and strength are separate questions.
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
                  Learn how children-related factors become connected.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand Saptamsha and why the D1 remains the foundation.
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
                  Learn how natal agendas become active over time.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Transits</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how transits refine an active timing period.
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
                  Bring natal promise, strength, Dasha and transit together.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Clarity without fear
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                A difficult placement should never become a frightening
                conclusion about children.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi approaches children-related questions through the whole
                chart — separating natal potential, planetary strength and
                timing while respecting the limits of astrology.
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
              framework for reflection and guidance. Astrology cannot diagnose
              fertility, infertility, reproductive conditions, pregnancy
              complications or any medical cause of difficulty conceiving, and
              it cannot guarantee conception, pregnancy or childbirth. If you
              have concerns about fertility, conception or reproductive health,
              please consult a qualified healthcare professional.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}