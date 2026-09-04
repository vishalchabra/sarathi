import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import TopNav from "../../../TopNav";

const canonicalUrl =
  "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-my-finances-improve";

export const metadata: Metadata = {
  title: "When Will My Finances Improve? Wealth Timing in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies financial improvement through the 2nd and 11th houses, planetary strength, Dasha, divisional charts, transits and convergence.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "When Will My Finances Improve? Wealth Timing in Vedic Astrology",
    description:
      "Understand how financial improvement is studied through the birth chart, Dasha, divisional charts and planetary transits.",
    url: canonicalUrl,
    type: "article",
  },
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #fffaf4 0%, #fffdf9 42%, #fff8ef 100%)",
  color: "#221535",
};

const containerStyle: React.CSSProperties = {
  width: "min(1120px, calc(100% - 40px))",
  margin: "0 auto",
};

const articleStyle: React.CSSProperties = {
  width: "min(880px, 100%)",
  margin: "0 auto",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#a55b42",
};

const h1Style: React.CSSProperties = {
  margin: "18px 0 20px",
  fontSize: "clamp(40px, 6vw, 68px)",
  lineHeight: 1.04,
  letterSpacing: "-0.035em",
  fontWeight: 650,
  color: "#1f1635",
};

const h2Style: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: "clamp(28px, 4vw, 40px)",
  lineHeight: 1.15,
  letterSpacing: "-0.025em",
  color: "#221535",
};

const h3Style: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 21,
  lineHeight: 1.3,
  color: "#241735",
};

const bodyStyle: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.85,
  color: "#5d4a60",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ead9c8",
  borderRadius: 20,
  background: "rgba(255,255,255,0.78)",
  padding: 28,
  boxShadow: "0 8px 28px rgba(68, 41, 31, 0.045)",
};

const highlightStyle: React.CSSProperties = {
  border: "1px solid #e5cbb3",
  borderRadius: 24,
  background: "#fff4e8",
  padding: "30px 32px",
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ padding: "56px 0" }}>
      {eyebrow ? <div style={eyebrowStyle}>{eyebrow}</div> : null}

      <h2 style={{ ...h2Style, marginTop: eyebrow ? 14 : 0 }}>{title}</h2>

      <div style={bodyStyle}>{children}</div>
    </section>
  );
}

function FactorCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 750,
          letterSpacing: "0.18em",
          color: "#a65d44",
          marginBottom: 12,
        }}
      >
        {number}
      </div>

      <h3 style={h3Style}>{title}</h3>

      <div
        style={{
          fontSize: 16.5,
          lineHeight: 1.75,
          color: "#675269",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function WhenWillMyFinancesImprovePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "When Will My Finances Improve? How Vedic Astrology Studies Wealth Timing",
    description:
      "A structured explanation of how financial improvement and wealth timing are studied in Vedic astrology through the birth chart, divisional charts, Dasha and transits.",
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    about: [
      "Vedic Astrology",
      "Wealth Astrology",
      "Financial Timing",
      "Vimshottari Dasha",
      "Planetary Transits",
      "Divisional Charts",
    ],
    publisher: {
      "@type": "Organization",
      name: "Sārathi",
      url: "https://www.sarathiyourguide.com",
    },
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
        name: "When Will My Finances Improve?",
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main style={pageStyle}>
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

      <TopNav />

      <header
        style={{
          padding: "82px 0 72px",
          borderBottom: "1px solid #eadfd4",
        }}
      >
        <div style={containerStyle}>
          <div style={articleStyle}>
            <div style={eyebrowStyle}>
              MONEY &amp; WEALTH · APPLIED ASTROLOGY
            </div>

            <h1 style={h1Style}>
              When Will My Finances Improve? How Vedic Astrology Studies Wealth
              Timing
            </h1>

            <p
              style={{
                ...bodyStyle,
                fontSize: 20,
                maxWidth: 820,
                margin: 0,
              }}
            >
              Financial improvement is not judged from one “wealth planet” or
              one lucky transit. Vedic astrology studies the chart&apos;s
              capacity to earn, retain and grow resources, then looks for
              planetary periods and transits that activate those financial
              themes.
            </p>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Link
                href="/sarathi/learn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #dec7b2",
                  borderRadius: 999,
                  padding: "11px 17px",
                  textDecoration: "none",
                  color: "#6e3248",
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 650,
                }}
              >
                ← Knowledge Centre
              </Link>

              <Link
                href="/sarathi/learn/astrology/predictive-astrology-event-timing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #dec7b2",
                  borderRadius: 999,
                  padding: "11px 17px",
                  textDecoration: "none",
                  color: "#6e3248",
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 650,
                }}
              >
                Learn Event Timing →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div style={containerStyle}>
        <article style={articleStyle}>
          <section style={{ padding: "54px 0 30px" }}>
            <div style={highlightStyle}>
              <div style={eyebrowStyle}>QUICK ANSWER</div>

              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 21,
                  lineHeight: 1.7,
                  color: "#3f2944",
                }}
              >
                <strong>
                  Finances are more likely to improve when the chart&apos;s
                  earning and gains factors are supported and the active Dasha
                  and transits simultaneously strengthen those financial
                  themes.
                </strong>
              </p>

              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: 17,
                  lineHeight: 1.8,
                  color: "#695269",
                }}
              >
                The 2nd and 11th houses are important, but income, career,
                business, opportunity, debt, assets and savings can involve
                different houses. A useful financial reading first identifies
                what kind of improvement is being asked about.
              </p>
            </div>
          </section>

          <Section
            eyebrow="DEFINE THE QUESTION"
            title="What does 'financial improvement' actually mean?"
          >
            <p>
              Financial improvement is not one single event.
            </p>

            <p>
              For one person it may mean getting a better salary. For another,
              it may mean business growth, clearing debt, building savings,
              receiving a bonus, creating a second income stream or finally
              seeing consistent cash flow.
            </p>

            <p>
              These are related outcomes, but they do not necessarily activate
              the same houses or planets.
            </p>

            <p>
              Good predictive work therefore begins by defining the financial
              event before trying to time it.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  display: "block",
                  fontSize: 22,
                  lineHeight: 1.55,
                  color: "#552b42",
                }}
              >
                “More money” is too broad a question. Salary growth, business
                profit, savings and debt relief are different astrological
                events.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="THE CORE FRAMEWORK"
            title="Which houses are important for money and wealth?"
          >
            <p>
              Financial analysis uses several houses because money can be
              earned, accumulated, gained, invested, borrowed or lost in
              different ways.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 18,
                marginTop: 30,
              }}
            >
              <FactorCard number="01" title="2nd House">
                The 2nd house is associated with accumulated resources,
                savings, family assets and the capacity to retain what is
                earned.
              </FactorCard>

              <FactorCard number="02" title="11th House">
                The 11th house is associated with gains, income, fulfilment and
                the realisation of outcomes.
              </FactorCard>

              <FactorCard number="03" title="10th House">
                The 10th house becomes important when financial improvement is
                linked to career, professional responsibility, status or work.
              </FactorCard>

              <FactorCard number="04" title="6th House">
                The 6th can become relevant to service, employment, loans,
                debts, repayment and financial obligations.
              </FactorCard>

              <FactorCard number="05" title="5th House">
                The 5th may become relevant in matters involving judgement,
                speculation, creativity or certain investment-related themes.
              </FactorCard>

              <FactorCard number="06" title="9th House">
                The 9th can contribute through opportunity, fortune,
                expansion, support and favourable circumstances depending on
                the horoscope.
              </FactorCard>
            </div>
          </Section>

          <Section
            eyebrow="2ND & 11TH HOUSES"
            title="Why the 2nd and 11th houses are central"
          >
            <p>
              The 2nd and 11th are often central to financial interpretation
              because they describe two different parts of the money story.
            </p>

            <p>
              The 11th helps us study gains and income. The 2nd helps us study
              accumulated resources and retention.
            </p>

            <p>
              A person can therefore earn well but struggle to accumulate.
              Another may have moderate income but strong financial discipline
              and asset retention.
            </p>

            <p>
              This is why “income” and “wealth” should not automatically be
              treated as the same thing.
            </p>

            <div
              style={{
                marginTop: 28,
                borderLeft: "4px solid #b5684c",
                padding: "6px 0 6px 22px",
                fontSize: 23,
                lineHeight: 1.6,
                color: "#4e2a43",
              }}
            >
              <strong>
                The 11th can show what comes in. The 2nd helps us understand
                what can be accumulated and retained.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="HOUSE LORDS"
            title="The house lord carries the financial agenda"
          >
            <p>
              Once the relevant houses have been identified, their lords become
              essential.
            </p>

            <p>
              Where is the 2nd lord placed? Where is the 11th lord placed? Are
              they strong? Do they connect with career, business, opportunity
              or difficult houses? Are they joined or influenced by supportive
              or challenging planets?
            </p>

            <p>
              These relationships help explain how financial themes operate in
              that particular horoscope.
            </p>

            <p>
              Two people can have the same Ascendant and still experience money
              very differently because their house lords occupy different
              houses, Rashis and planetary relationships.
            </p>
          </Section>

          <Section
            eyebrow="KARAKAS"
            title="Is Jupiter the planet of wealth?"
          >
            <p>
              Jupiter is traditionally associated with growth, abundance,
              wisdom and expansion, while Venus can signify comforts,
              resources and material enjoyment. Mercury may become important
              for trade, commerce and calculation, while other planets may
              carry financial significance through lordship and placement.
            </p>

            <p>
              But no planet should be labelled the universal “money planet.”
            </p>

            <p>
              A planet&apos;s natural significations are only one layer. Its
              functional role in the horoscope matters just as much.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                A natural karaka gives us vocabulary. The horoscope tells us
                whether that planet actually carries the financial story.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="SAMBANDHA"
            title="Financial strength often comes from connected houses"
          >
            <p>
              Money-related houses become more meaningful when their lords form
              relationships with one another.
            </p>

            <p>
              For example, connections between the 2nd and 11th lords can link
              accumulation with gains. A connection between the 10th and 11th
              may connect career with income. A relationship between the 5th
              and 11th can take on another meaning depending on the broader
              horoscope.
            </p>

            <p>
              These connections may arise through conjunction, aspect,
              exchange or other forms of Sambandha.
            </p>

            <p>
              The goal is not to count every possible wealth combination. The
              goal is to understand whether multiple parts of the chart are
              participating in one coherent financial theme.
            </p>
          </Section>

          <Section
            eyebrow="DHANA YOGAS"
            title="Do Dhana Yogas guarantee wealth?"
          >
            <p>
              Dhana Yogas traditionally describe combinations associated with
              financial potential, often through relationships between
              wealth-producing houses and their lords.
            </p>

            <p>
              But the presence of a named Yoga is not enough to predict riches.
            </p>

            <p>
              The planets forming the Yoga still need to be judged for
              lordship, dignity, placement, strength, aspects, divisional-chart
              support and Dasha activation.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                The name of the Yoga starts the analysis. It does not finish
                it.
              </strong>
            </div>

            <p style={{ marginTop: 28 }}>
              A weak or poorly activated combination may remain modest. A
              strongly supported combination activated by the right planetary
              periods may become much more visible.
            </p>

            <p>
              The correct question is therefore not simply “Do I have a Dhana
              Yoga?” but “How capable is this combination of giving results,
              and when is it active?”
            </p>
          </Section>

          <Section
            eyebrow="DIVISIONAL CHARTS"
            title="Which Vargas can refine financial analysis?"
          >
            <p>
              Divisional charts refine areas already promised in the natal
              horoscope. They should not be used to manufacture a financial
              promise that is absent from the D1.
            </p>

            <p>
              Depending on the question and tradition being followed, an
              astrologer may examine divisional charts connected with wealth,
              career or assets.
            </p>

            <p>
              The D10 can become particularly useful when financial improvement
              depends on career or professional growth. Other Vargas may be
              relevant to specific areas such as property, fortune or
              accumulated resources.
            </p>

            <div
              style={{
                marginTop: 26,
                padding: 30,
                borderRadius: 20,
                background: "#251a37",
                color: "#fff9f2",
                textAlign: "center",
                fontSize: 20,
                lineHeight: 1.9,
              }}
            >
              <strong>D1 establishes the promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Relevant Varga refines the topic</strong>
            </div>
          </Section>

          <Section
            eyebrow="DASHA"
            title="Vimshottari Dasha shows when financial themes become active"
          >
            <p>
              The natal chart shows financial capacity. Dasha helps us
              understand when particular parts of that capacity become more
              active.
            </p>

            <p>
              A financially supportive Mahadasha or Antardasha may involve the
              lords of the 2nd or 11th, planets placed in those houses, planets
              connected with career or business, or planets participating in
              meaningful wealth combinations.
            </p>

            <p>
              The exact planets will differ from chart to chart.
            </p>

            <div
              style={{
                margin: "26px 0",
                padding: "22px 26px",
                borderRadius: 18,
                border: "1px solid #e6d3c2",
                background: "#fff",
                color: "#5a3d56",
              }}
            >
              “Jupiter Dasha means financial growth.”
            </div>

            <p>
              This is too simplistic. Jupiter may carry strong wealth themes in
              one chart and a very different functional agenda in another.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Dasha activates the planet&apos;s natal responsibilities. It
                does not automatically activate its most favourable textbook
                meaning.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="TRANSITS"
            title="Can Jupiter transit improve finances?"
          >
            <p>
              Jupiter is often associated with growth and expansion, so its
              transits are naturally watched in financial analysis.
            </p>

            <p>
              But Jupiter&apos;s movement alone should not be treated as a
              guarantee of money.
            </p>

            <p>
              Its transit becomes more meaningful when it activates relevant
              financial houses, house lords, Dasha planets or natal
              combinations already connected with gains and resources.
            </p>

            <p>
              Saturn can be equally important because it may structure,
              consolidate, restrict or stabilise financial themes depending on
              the chart.
            </p>

            <p>
              Rahu, Ketu and faster planets may contribute additional
              activation within a broader window.
            </p>

            <div
              style={{
                marginTop: 28,
                borderLeft: "4px solid #b5684c",
                padding: "6px 0 6px 22px",
                fontSize: 22,
                lineHeight: 1.65,
                color: "#4e2a43",
              }}
            >
              <strong>
                A transit is most useful when it activates something the natal
                chart and Dasha have already made relevant.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="EVENT TYPE"
            title="Salary growth, business income and wealth are different events"
          >
            <p>
              One of the most important steps in financial prediction is
              identifying the source of the expected improvement.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 28,
              }}
            >
              <FactorCard number="A" title="Salary or promotion">
                Career houses, employment factors and gains may become more
                important when financial improvement depends on professional
                progression.
              </FactorCard>

              <FactorCard number="B" title="Business growth">
                Business, trade, partnerships, gains and professional factors
                may combine differently from salaried employment.
              </FactorCard>

              <FactorCard number="C" title="Savings & accumulation">
                The ability to retain and build resources may require a
                different emphasis from simply increasing gross income.
              </FactorCard>
            </div>

            <p style={{ marginTop: 28 }}>
              A chart may support one of these strongly while another develops
              more slowly.
            </p>
          </Section>

          <Section
            eyebrow="DEBT & OBLIGATIONS"
            title="Financial improvement can also mean reducing pressure"
          >
            <p>
              Not every positive financial period arrives as a dramatic rise in
              income.
            </p>

            <p>
              Sometimes improvement appears through clearing loans, reducing
              expenses, restructuring obligations, settling disputes or
              creating more predictable cash flow.
            </p>

            <p>
              In those cases, houses connected with debt, service and
              obligations may become important alongside wealth and gains.
            </p>

            <p>
              This distinction matters because the external result may look
              modest even though the person&apos;s financial position has
              materially improved.
            </p>
          </Section>

          <Section
            eyebrow="BROAD TO NARROW"
            title="How financial timing is narrowed"
          >
            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 28,
              }}
            >
              {[
                [
                  "1. Define the event",
                  "Clarify whether the question concerns salary, business, savings, debt, bonus, assets or another financial outcome.",
                ],
                [
                  "2. Establish natal promise",
                  "Study the relevant houses, lords, planets and financial combinations in D1.",
                ],
                [
                  "3. Assess capacity",
                  "Judge dignity, strength, placement, aspects and Sambandha.",
                ],
                [
                  "4. Refine with the relevant Varga",
                  "Use divisional charts appropriate to the specific financial question.",
                ],
                [
                  "5. Identify the active Dasha",
                  "Determine whether Mahadasha and Antardasha planets carry the required financial agenda.",
                ],
                [
                  "6. Build the transit window",
                  "Look for broader activation from slow-moving planets.",
                ],
                [
                  "7. Narrow the period",
                  "Use shorter activation only when the larger pattern already exists.",
                ],
                [
                  "8. Judge convergence",
                  "Increase confidence only when multiple independent layers support the same outcome.",
                ],
              ].map(([title, description]) => (
                <div
                  key={title}
                  style={{
                    padding: "19px 22px",
                    borderRadius: 15,
                    border: "1px solid #eadbce",
                    background: "rgba(255,255,255,.72)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#48253f",
                      marginBottom: 6,
                    }}
                  >
                    {title}
                  </strong>

                  <span
                    style={{
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: "#675369",
                    }}
                  >
                    {description}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            eyebrow="WORKED EXAMPLE"
            title="A hypothetical financial-improvement example"
          >
            <p>
              Imagine a horoscope in which the 2nd and 11th lords are reasonably
              strong and form a meaningful connection with the 10th house.
            </p>

            <p>
              The person&apos;s financial growth is therefore closely tied to
              career development.
            </p>

            <p>
              Now suppose the person enters an Antardasha of one of these
              connected planets while the D10 also supports professional
              progress.
            </p>

            <p>
              Jupiter begins to activate the relevant gains pattern, while
              Saturn simultaneously strengthens professional responsibility.
            </p>

            <p>
              A faster transit later activates the same planets during a
              shorter period.
            </p>

            <div
              style={{
                marginTop: 30,
                padding: 30,
                borderRadius: 20,
                background: "#251a37",
                color: "#fff9f2",
                textAlign: "center",
                fontSize: 19,
                lineHeight: 1.9,
              }}
            >
              <strong>Natal financial promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>career connection</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D10 support</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>transit window</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The final event might be a promotion, salary increase, better
              role or another professional development that improves income.
            </p>

            <p>
              The key point is that the financial result is explained by the
              specific mechanism visible in the horoscope rather than by a
              generic “wealth transit.”
            </p>
          </Section>

          <Section
            eyebrow="REAL LIFE"
            title="Why a favourable money period may not make someone rich"
          >
            <p>
              A supportive financial period does not guarantee dramatic wealth.
            </p>

            <p>
              The magnitude of the result depends on natal promise, planetary
              capacity, life circumstances, profession, opportunity, choices
              and the scale at which the horoscope is already operating.
            </p>

            <p>
              For one person, a strong period may correspond with a major
              business expansion. For another, the same level of astrological
              improvement may appear as better savings or relief from
              financial pressure.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Astrology can describe stronger financial conditions without
                turning every favourable period into a promise of riches.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="COMMON MISTAKES"
            title="Financial astrology shortcuts to avoid"
          >
            <div
              style={{
                display: "grid",
                gap: 16,
                marginTop: 10,
              }}
            >
              {[
                {
                  title: "Jupiter = money",
                  text: "Jupiter's natural significations do not replace its functional role in the natal horoscope.",
                },
                {
                  title: "Dhana Yoga = guaranteed wealth",
                  text: "A Yoga must be judged for strength, placement, support and timing before its practical capacity can be assessed.",
                },
                {
                  title: "11th house = complete wealth analysis",
                  text: "Gains, accumulated resources, profession, business, debt and assets can involve different houses.",
                },
                {
                  title: "High income = strong wealth",
                  text: "Earning and retaining money are different financial processes.",
                },
                {
                  title: "One transit creates prosperity",
                  text: "Transits become more useful when they activate relevant natal and Dasha factors.",
                },
                {
                  title: "Ignoring the source of income",
                  text: "Salary, business, investments and other income mechanisms should not automatically be timed in the same way.",
                },
                {
                  title: "Treating every gain as permanent",
                  text: "A temporary inflow and long-term financial stability are different outcomes.",
                },
                {
                  title: "Predicting magnitude without evidence",
                  text: "A supportive period may improve finances without implying exceptional wealth.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "22px 24px",
                    borderRadius: 17,
                    border: "1px solid #eadbce",
                    background: "#fff",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontSize: 17,
                      color: "#43233d",
                      marginBottom: 7,
                    }}
                  >
                    {item.title}
                  </strong>

                  <span
                    style={{
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: "#675369",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            eyebrow="THE SĀRATHI METHOD"
            title="A practical financial-timing workflow"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              {[
                "Define the exact financial outcome being studied.",
                "Identify the houses that correspond to that outcome.",
                "Study their lords, occupants and planetary relationships.",
                "Assess dignity, strength and overall financial capacity.",
                "Identify meaningful Dhana Yogas or financial Sambandha without treating them mechanically.",
                "Use the relevant divisional chart to refine the topic.",
                "Determine whether the active Mahadasha and Antardasha can deliver the required financial agenda.",
                "Build the broader transit window.",
                "Use faster transits only after the larger activation exists.",
                "Distinguish income growth from savings, assets and debt reduction.",
                "Judge the likely scale of the result from the full horoscope.",
                "State only the level of confidence and timing precision supported by convergence.",
              ].map((step, index) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "flex-start",
                    padding: "17px 20px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,.75)",
                    border: "1px solid #eadccf",
                  }}
                >
                  <div
                    style={{
                      minWidth: 34,
                      height: 34,
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fff1e2",
                      color: "#8e4a42",
                      fontWeight: 750,
                      fontSize: 13,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div
                    style={{
                      paddingTop: 4,
                      fontSize: 16.5,
                      lineHeight: 1.65,
                      color: "#625068",
                    }}
                  >
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            eyebrow="THE BIGGER PRINCIPLE"
            title="Financial prediction is also a problem of convergence"
          >
            <p>
              A single wealth combination can create potential, but prediction
              becomes stronger only when several independent layers reinforce
              the same financial story.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  display: "block",
                  fontSize: 23,
                  lineHeight: 1.65,
                  color: "#542b43",
                }}
              >
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The same principle applies to magnitude.
            </p>

            <p>
              The horoscope should support the size of the prediction as well
              as its timing.
            </p>
          </Section>

          <Section
            eyebrow="SUMMARY"
            title="So, when will my finances improve?"
          >
            <p>
              Vedic astrology approaches financial timing by first defining
              what kind of improvement is being studied.
            </p>

            <p>
              The relevant houses and lords are then assessed for promise and
              capacity, financial relationships and Yogas are examined, the
              appropriate divisional chart refines the topic, Dasha identifies
              the active planetary agenda and transits help narrow the period.
            </p>

            <div
              style={{
                marginTop: 28,
                padding: 30,
                borderRadius: 20,
                background: "#251a37",
                color: "#fff9f2",
                textAlign: "center",
                fontSize: 19,
                lineHeight: 1.9,
              }}
            >
              <strong>Define the financial event</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Natal promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Relevant Varga</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Transit window</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Convergence</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The purpose is not to label one date as “lucky.”
            </p>

            <p>
              It is to identify periods in which the horoscope shows a stronger
              capacity for the specific financial outcome being asked about.
            </p>
          </Section>

          <section
            style={{
              padding: "58px 0 70px",
              borderTop: "1px solid #eaded2",
            }}
          >
            <div style={eyebrowStyle}>CONTINUE LEARNING</div>

            <h2
              style={{
                ...h2Style,
                marginTop: 14,
              }}
            >
              Understand the techniques behind the answer
            </h2>

            <p style={bodyStyle}>
              Financial timing becomes clearer once you understand house
              lordship, planetary strength, Yogas, divisional charts, Dasha and
              transits.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 28,
              }}
            >
              <Link
                href="/sarathi/learn/astrology/12-houses-vedic-astrology"
                style={{
                  textDecoration: "none",
                  border: "1px solid #decab7",
                  borderRadius: 999,
                  padding: "12px 17px",
                  color: "#6d3348",
                  background: "#fff",
                  fontWeight: 650,
                  fontSize: 14,
                }}
              >
                The 12 Houses →
              </Link>

              <Link
                href="/sarathi/learn/astrology/house-lords-vedic-astrology"
                style={{
                  textDecoration: "none",
                  border: "1px solid #decab7",
                  borderRadius: 999,
                  padding: "12px 17px",
                  color: "#6d3348",
                  background: "#fff",
                  fontWeight: 650,
                  fontSize: 14,
                }}
              >
                House Lords →
              </Link>

              <Link
                href="/sarathi/learn/astrology/yogas-vedic-astrology"
                style={{
                  textDecoration: "none",
                  border: "1px solid #decab7",
                  borderRadius: 999,
                  padding: "12px 17px",
                  color: "#6d3348",
                  background: "#fff",
                  fontWeight: 650,
                  fontSize: 14,
                }}
              >
                Yogas →
              </Link>

              <Link
                href="/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology"
                style={{
                  textDecoration: "none",
                  border: "1px solid #decab7",
                  borderRadius: 999,
                  padding: "12px 17px",
                  color: "#6d3348",
                  background: "#fff",
                  fontWeight: 650,
                  fontSize: 14,
                }}
              >
                Vimshottari Dasha →
              </Link>

              <Link
                href="/sarathi/learn/astrology/transits-gochar-vedic-astrology"
                style={{
                  textDecoration: "none",
                  border: "1px solid #decab7",
                  borderRadius: 999,
                  padding: "12px 17px",
                  color: "#6d3348",
                  background: "#fff",
                  fontWeight: 650,
                  fontSize: 14,
                }}
              >
                Transits →
              </Link>
            </div>
          </section>

          <section
            style={{
              marginBottom: 70,
              padding: "42px 34px",
              borderRadius: 26,
              background: "#261a38",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#e6b491",
                marginBottom: 12,
              }}
            >
              SĀRATHI
            </div>

            <h2
              style={{
                margin: "0 0 15px",
                color: "#fffaf5",
                fontSize: "clamp(28px, 4vw, 39px)",
                lineHeight: 1.2,
              }}
            >
              Your financial timing is personal to your horoscope.
            </h2>

            <p
              style={{
                margin: 0,
                maxWidth: 700,
                fontSize: 17,
                lineHeight: 1.8,
                color: "#ded2e3",
              }}
            >
              Sārathi brings together the natal chart, planetary periods,
              divisional charts and transits to help you understand when
              financial conditions may become stronger and what part of the
              money story is actually being activated.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 26,
              }}
            >
              <Link
                href="/sarathi/individual"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "13px 20px",
                  borderRadius: 999,
                  background: "#fff7ef",
                  color: "#492740",
                  textDecoration: "none",
                  fontWeight: 750,
                }}
              >
                Explore Sārathi →
              </Link>

              <Link
                href="/sarathi/learn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "13px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.35)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 650,
                }}
              >
                Knowledge Centre →
              </Link>
            </div>
          </section>

          <footer
            style={{
              padding: "0 0 70px",
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "#8d7a89",
            }}
          >
            Educational note: This article explains traditional Jyotish
            principles for learning and interpretation. Different astrological
            traditions may vary in technique. Astrology describes patterns,
            tendencies and timing frameworks; it should not be treated as a
            guarantee of wealth, income, investment returns or any specific
            financial outcome.
          </footer>
        </article>
      </div>
    </main>
  );
}