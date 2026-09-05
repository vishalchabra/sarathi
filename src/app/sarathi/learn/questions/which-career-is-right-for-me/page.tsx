import type { Metadata } from "next";
import Link from "next/link";
import { createSEO } from "@/lib/seo";
import TopNav from "../../../TopNav";

export const metadata: Metadata = createSEO({
  title: "Which Career Is Right for Me? Career Direction in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies career direction through the Lagna, 10th house, house lords, planetary strength, Nakshatras, D10, Dashas and repeated vocational themes.",
  path: "/sarathi/learn/questions/which-career-is-right-for-me",
  keywords: [
    "Which Career Is Right for Me Astrology",
    "Career Astrology",
    "Career Direction Vedic Astrology",
    "Best Career According to Astrology",
    "Profession Astrology",
    "10th House Career",
    "10th Lord Career",
    "D10 Career",
    "Dashamsa Career",
    "Career Dasha",
    "Vedic Astrology Career",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Which Career Is Right for Me? How Vedic Astrology Studies Career Direction",
  description:
    "A practical guide to understanding how Vedic astrology studies professional direction through the birth chart, planetary roles, career houses, Nakshatras, Dashamsa and planetary periods.",
  url: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-career-is-right-for-me",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.sarathiyourguide.com/sarathi/learn/questions/which-career-is-right-for-me",
  },
  publisher: {
    "@type": "Organization",
    name: "Sārathi",
    url: "https://www.sarathiyourguide.com",
  },
  about: [
    "Vedic astrology",
    "Career astrology",
    "Career direction",
    "Profession",
    "10th house",
    "Dashamsa",
    "Nakshatras",
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
      name: "Which Career Is Right for Me?",
      item: "https://www.sarathiyourguide.com/sarathi/learn/questions/which-career-is-right-for-me",
    },
  ],
};

const careerLayers = [
  {
    title: "Lagna & Lagna Lord",
    text: "The Lagna establishes the structure of the horoscope, while the Lagna lord helps describe how the person approaches life, develops capability and expresses their overall orientation.",
  },
  {
    title: "10th House",
    text: "The 10th house is central to profession, responsibility, public contribution, authority and the visible role a person performs in the world.",
  },
  {
    title: "10th Lord",
    text: "The placement and condition of the 10th lord can show where professional energy is directed and what other areas of life become connected with career.",
  },
  {
    title: "Planetary Strength",
    text: "Strongly placed planets may have greater capacity to express their significations, but strength alone does not tell us which profession someone must choose.",
  },
  {
    title: "Rashi & Nakshatra",
    text: "The Rashi describes the environment and manner in which a planet operates, while the Nakshatra can refine its motivation, pattern and mode of expression.",
  },
  {
    title: "Sambandha",
    text: "Connections between career factors and other houses or planets help reveal combinations of interests, skills, responsibilities and professional themes.",
  },
];

const planetThemes = [
  {
    planet: "Sun",
    themes:
      "Leadership, visibility, administration, authority, governance and roles where responsibility or recognition becomes important.",
  },
  {
    planet: "Moon",
    themes:
      "Public interaction, care, responsiveness, hospitality, changing environments and work requiring sensitivity to people or circumstances.",
  },
  {
    planet: "Mars",
    themes:
      "Action, engineering, technical execution, competition, operations, defence, physical initiative and problem-solving under pressure.",
  },
  {
    planet: "Mercury",
    themes:
      "Communication, commerce, analysis, calculation, writing, negotiation, technology, information and intellectual adaptability.",
  },
  {
    planet: "Jupiter",
    themes:
      "Teaching, counsel, knowledge, law, finance, guidance, strategy, ethics and roles involving judgement or expansion of understanding.",
  },
  {
    planet: "Venus",
    themes:
      "Design, aesthetics, relationships, negotiation, luxury, creativity, hospitality, comfort and work involving refinement or value creation.",
  },
  {
    planet: "Saturn",
    themes:
      "Structure, systems, administration, endurance, large organisations, regulation, operations and responsibilities requiring patience and consistency.",
  },
  {
    planet: "Rahu",
    themes:
      "Unconventional environments, foreign influences, technology, scale, disruption, ambition and areas that cross traditional boundaries.",
  },
  {
    planet: "Ketu",
    themes:
      "Specialisation, research, analysis, detachment, investigation, technical depth and work requiring concentration beyond conventional recognition.",
  },
];

const careerQuestions = [
  {
    title: "What am I naturally suited to?",
    text: "This asks about recurring capabilities, temperament and vocational themes in the horoscope rather than a single job title.",
  },
  {
    title: "Which professional environment suits me?",
    text: "A person may perform the same function very differently in a corporation, entrepreneurial setting, public institution, consultancy or independent practice.",
  },
  {
    title: "Should I specialise or manage?",
    text: "Some charts repeatedly emphasise technical depth or expertise, while others show stronger themes of coordination, leadership, visibility or decision-making.",
  },
  {
    title: "Employment or independent work?",
    text: "This requires comparison of employment, professional autonomy, business and income factors rather than assuming one house automatically means entrepreneurship.",
  },
  {
    title: "Can my career direction change?",
    text: "Yes. Different Dashas can bring different parts of the natal professional promise to the foreground at different stages of life.",
  },
  {
    title: "What gives long-term professional fulfilment?",
    text: "Career suitability is not only about earning potential. Responsibility, interest, working style, recognition, stability and personal priorities also matter.",
  },
];

const interpretationSteps = [
  {
    number: "01",
    title: "Start with the whole person",
    text: "Study the Lagna, Lagna lord and overall chart structure before isolating career. Profession is expressed through the individual, not through the 10th house alone.",
  },
  {
    number: "02",
    title: "Study the 10th house",
    text: "Examine its Rashi, occupants, aspects and condition. This establishes an important part of the professional environment.",
  },
  {
    number: "03",
    title: "Follow the 10th lord",
    text: "Study where the 10th lord is placed, its dignity, Nakshatra, dispositor, aspects and associations. This helps connect profession with other areas of the horoscope.",
  },
  {
    number: "04",
    title: "Identify dominant planets",
    text: "Look for planets that repeatedly influence the Lagna, 10th house, 10th lord and other professional factors. Repetition matters more than an isolated natural signification.",
  },
  {
    number: "05",
    title: "Map Sambandha",
    text: "Planetary relationships can connect profession with communication, finance, creativity, service, research, travel, leadership, technology or other themes.",
  },
  {
    number: "06",
    title: "Add Rashi and Nakshatra",
    text: "These refine how the professional planets operate. They should add detail to an established interpretation rather than replace the basic house-and-lord framework.",
  },
  {
    number: "07",
    title: "Examine the D10",
    text: "Use the Dashamsa to refine professional expression, responsibility, status and development after the D1 career promise has been understood.",
  },
  {
    number: "08",
    title: "Look for repeated vocational themes",
    text: "If similar themes appear through several independent factors, confidence in the interpretation becomes stronger.",
  },
  {
    number: "09",
    title: "Use Dasha for life-stage emphasis",
    text: "Different planetary periods can activate different parts of the natal professional potential. Career direction may therefore evolve over time.",
  },
  {
    number: "10",
    title: "Translate themes into real occupations",
    text: "Only after synthesis should astrological themes be compared with actual industries, functions and working environments — alongside education, experience, opportunity and personal choice.",
  },
];

const commonMistakes = [
  "Choosing a profession from the 10th-house Rashi alone.",
  "Assuming the 10th lord automatically identifies one specific occupation.",
  "Using a planet's natural significations as a fixed list of careers.",
  "Ignoring the Lagna and overall temperament of the horoscope.",
  "Calling one strong planet the person's 'career planet' without studying its functional role.",
  "Reading the D10 independently from the D1.",
  "Assuming a strong Dasha means the person should completely change profession.",
  "Ignoring repeated themes across houses, lords, planets, Nakshatras and Vargas.",
  "Confusing career suitability with career timing.",
  "Treating astrology as a replacement for skills, qualifications, experience, opportunity or personal preference.",
];

export default function WhichCareerIsRightForMePage() {
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
            <span>Career & Job</span>
            <span>›</span>
            <span className="text-[#4c3e50]">
              Which career is right for me?
            </span>
          </nav>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b5a79]">
            Career & Job · Vedic Astrology
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Which Career Is Right for Me? How Vedic Astrology Studies Career
            Direction
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-9 text-[#65586a]">
            Career direction in Vedic astrology is not found by assigning one
            profession to one planet. A meaningful interpretation looks for
            repeated vocational themes across the Lagna, 10th house, house
            lords, planetary strength, Rashis, Nakshatras, Sambandha and the
            D10.
          </p>

          <div className="mt-10 rounded-2xl border border-[#dfd0bf] bg-white p-7 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Quick answer
            </p>

            <p className="mt-4 text-lg leading-8 text-[#4f4353]">
              Vedic astrology is better suited to identifying{" "}
              <strong>professional themes, abilities and working styles</strong>{" "}
              than declaring that one exact occupation is destined for you. The
              strongest career interpretation comes from patterns that repeat
              through several independent parts of the horoscope.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 pb-24">
          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Start here
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              There is rarely one single “correct career” hidden in a chart.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A horoscope can contain several professional capabilities at the
                same time. One person may show strong analytical,
                communication and leadership themes, for example. Those themes
                could be expressed through banking, consulting, technology,
                management or many other real-world occupations.
              </p>

              <p>
                Astrology therefore works more usefully by identifying the
                underlying professional pattern first and translating it into
                practical career possibilities afterwards.
              </p>

              <p className="font-semibold text-[#47394b]">
                Do not begin with a job title. Begin with the repeated
                professional themes in the horoscope.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              The chart layers
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What does Vedic astrology examine for career direction?
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {careerLayers.map((layer) => (
                <div
                  key={layer.title}
                  className="rounded-2xl border border-[#e3d5c5] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold">{layer.title}</h3>
                  <p className="mt-3 leading-7 text-[#6a5d6e]">
                    {layer.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why is the 10th house important?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 10th house is one of the central houses for understanding
                profession, responsibility, public role, contribution and
                status.
              </p>

              <p>
                But simply seeing a Rashi or planet in the 10th house does not
                produce a complete profession.
              </p>

              <p>
                The astrologer also studies the 10th lord, planets influencing
                the house, the condition of those planets and how professional
                factors connect with the rest of the horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                The 10th house starts the professional enquiry. It does not
                finish it.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Natural significations
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Do planets indicate different types of work?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65586a]">
              Each Graha carries natural significations that can contribute to
              professional interpretation. These are themes, not fixed career
              prescriptions.
            </p>

            <div className="mt-9 space-y-4">
              {planetThemes.map((item) => (
                <div
                  key={item.planet}
                  className="grid gap-3 rounded-2xl border border-[#e3d5c5] bg-white p-6 md:grid-cols-[120px_1fr]"
                >
                  <h3 className="text-xl font-semibold">{item.planet}</h3>
                  <p className="leading-7 text-[#6a5d6e]">{item.themes}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#f4ece3] p-7">
              <p className="font-semibold text-[#493b4d]">
                Do not memorise a planet as a profession.
              </p>
              <p className="mt-3 leading-7 text-[#65586a]">
                Mercury does not automatically make someone an accountant,
                Venus does not automatically make someone a designer, and Mars
                does not automatically make someone an engineer. The whole
                horoscope determines how a planetary theme is expressed.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Why does the 10th lord matter?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The 10th lord carries the agenda of the 10th house into the
                house where it is placed.
              </p>

              <p>
                This can connect profession with other areas of life such as
                finance, communication, education, creativity, foreign
                environments, partnerships, research or service.
              </p>

              <p>
                Its dignity, strength, Nakshatra, dispositor, aspects and
                Sambandha add further layers.
              </p>

              <p className="font-semibold text-[#47394b]">
                House lordship tells us what responsibility a planet carries.
                Natural signification tells us the vocabulary it brings.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Planetary relationships
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Sambandha helps turn isolated clues into a professional pattern.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A chart may contain many individual professional clues.
                Sambandha helps show which planetary agendas are actually
                connected.
              </p>

              <p>
                For example, repeated connections between career,
                communication and gains may create a different professional
                pattern from repeated connections between career, research and
                technical factors.
              </p>

              <p>
                The goal is not to force these combinations into a job title.
                The goal is to understand the underlying pattern.
              </p>

              <p className="font-semibold text-[#47394b]">
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Refinement
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What do Rashi and Nakshatra add?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Rashi helps describe the environment, style and manner in
                which a professional planet operates.
              </p>

              <p>
                Nakshatra can refine the planet further by adding another layer
                of motivation, behaviour and operating pattern.
              </p>

              <p>
                These layers are most useful after the astrologer has already
                established what responsibility the planet carries through
                house lordship and placement.
              </p>

              <p className="font-semibold text-[#47394b]">
                Rashi and Nakshatra refine the interpretation. They should not
                replace the basic chart structure.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Dashamsa
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              How does the D10 help with career direction?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                The Dashamsa or D10 is an important divisional chart for
                refining professional analysis.
              </p>

              <p>
                It can provide additional context about professional
                expression, responsibility, development, authority and how
                career themes mature.
              </p>

              <p>
                It should not be used to invent a career direction that is
                unsupported by the main birth chart.
              </p>

              <p className="font-semibold text-[#47394b]">
                D1 establishes the professional promise. D10 refines the
                professional dimension.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              A better question
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Career direction involves more than choosing an industry.
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {careerQuestions.map((item) => (
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

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Direction versus timing
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              The birth chart shows the pattern. Dasha helps show when parts of
              that pattern become prominent.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A person does not necessarily express every professional
                potential in the horoscope at the same time.
              </p>

              <p>
                Different Mahadashas and Antardashas can activate different
                planets, houses and professional relationships. This can explain
                why someone's career emphasis changes across different life
                stages.
              </p>

              <p>
                One period may emphasise technical expertise. Another may
                increase management responsibility, entrepreneurship, foreign
                exposure, consulting or some other part of the natal pattern.
              </p>

              <p className="font-semibold text-[#47394b]">
                Dasha does not create a profession that does not exist in the
                natal framework. It activates parts of the professional agenda
                already present.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Interpretation method
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              A structured way to study career direction
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
              How repeated themes can reveal professional direction
            </h2>

            <div className="mt-7 rounded-3xl bg-[#f4ece3] p-7 md:p-9">
              <div className="space-y-5 text-lg leading-8 text-[#5e5162]">
                <p>
                  Imagine a horoscope where Mercury repeatedly influences the
                  Lagna, 10th house and 10th lord.
                </p>

                <p>
                  The same professional factors connect with houses associated
                  with commerce and gains, while the D10 again strengthens
                  Mercury-related themes.
                </p>

                <p>
                  It would be reasonable to investigate professional directions
                  involving communication, analysis, information, commerce,
                  negotiation or intellectual adaptability.
                </p>

                <p>
                  But the astrologer should still not jump directly to a title
                  such as accountant, banker, writer or software professional.
                  The rest of the horoscope must refine the pattern.
                </p>

                <p className="font-semibold text-[#403344]">
                  Astrology identifies the recurring professional language. Real
                  life determines which occupation becomes the most suitable
                  expression of that language.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Can the “right career” change over time?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                Yes. A horoscope may support several related professional
                expressions, and different periods can bring different parts of
                that potential forward.
              </p>

              <p>
                Career development also depends on education, experience,
                opportunity, economic conditions, family responsibilities and
                personal decisions.
              </p>

              <p>
                Someone may therefore begin in one function, move into
                management later and eventually become a consultant or
                entrepreneur without contradicting the underlying professional
                themes of the horoscope.
              </p>

              <p className="font-semibold text-[#47394b]">
                A career path can evolve while the deeper vocational pattern
                remains recognisable.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Common mistakes
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What should you avoid when reading career direction?
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
              Career interpretation is the organisation of repeated evidence.
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8 text-[#65586a]">
              <p>
                A useful career reading moves from the broad chart structure
                toward increasingly specific professional themes.
              </p>

              <p className="font-semibold text-[#47394b]">
                Lagna → 10th house → 10th lord → planetary strength → Rashi →
                Sambandha → Nakshatra → D10 → repeated vocational themes →
                Dasha → practical career possibilities.
              </p>

              <p>
                This prevents one placement from being turned into an absolute
                career prediction.
              </p>

              <p className="font-semibold text-[#47394b]">
                Interpretation is not the accumulation of meanings. It is the
                organisation of meanings.
              </p>
            </div>
          </section>

          <section className="border-t border-[#eadfce] py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6d58]">
              Career questions
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Explore career timing next
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Link
                href="/sarathi/learn/questions/when-will-i-get-a-job"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">
                  When will I get a job?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how employment timing is studied.
                </p>
                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/when-will-i-change-jobs"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">
                  When will I change jobs?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Understand how career movement is timed.
                </p>
                <p className="mt-5 font-semibold text-[#6b315c]">
                  Read the guide →
                </p>
              </Link>

              <Link
                href="/sarathi/learn/questions/when-will-i-get-promoted"
                className="rounded-2xl border border-[#e3d5c5] bg-white p-6 transition hover:border-[#b994a9]"
              >
                <h3 className="text-xl font-semibold">
                  When will I get promoted?
                </h3>
                <p className="mt-3 leading-7 text-[#6a5d6e]">
                  Learn how professional advancement is assessed.
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
              Build the concepts used in career analysis through the Sārathi
              Vedic Astrology Foundations curriculum.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                href="/sarathi/learn/astrology/9-grahas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">The 9 Grahas</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn the natural significations of each Graha.
                </p>
              </Link>

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
                  Understand how the 10th lord carries the career agenda.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Planetary Strength & Dignity</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Learn how planetary capacity is assessed.
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
                  See how separate professional themes become connected.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/nakshatras-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Nakshatras</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Add a finer operating layer to planetary interpretation.
                </p>
              </Link>

              <Link
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
                className="rounded-2xl border border-[#dccdbc] bg-white p-5 hover:border-[#b994a9]"
              >
                <p className="font-semibold">Divisional Charts</p>
                <p className="mt-2 text-sm leading-6 text-[#6a5d6e]">
                  Understand how the D10 refines professional analysis.
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
                  Learn why different career themes emerge at different stages.
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t border-[#eadfce] pt-14">
            <div className="rounded-3xl bg-[#4b2744] px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead1b3]">
                Your professional pattern is personal
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
                Career direction comes from the way your own chart factors work
                together.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-[#eadfe8]">
                Sārathi helps you explore your birth chart, planetary periods
                and professional themes through a structured Vedic astrology
                framework — without reducing your career to one planet or one
                placement.
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
              cannot determine that one profession is objectively right for
              you, guarantee career success or replace education, professional
              career advice, financial considerations or your own judgement and
              choices.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}