import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import TopNav from "../../../TopNav";

const canonicalUrl =
  "https://www.sarathiyourguide.com/sarathi/learn/questions/will-i-settle-abroad";

export const metadata: Metadata = {
  title: "Will I Settle Abroad? Foreign Settlement in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies foreign travel and settlement through the 3rd, 9th and 12th houses, Rahu, Dasha, transits and chart convergence.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Will I Settle Abroad? Foreign Settlement in Vedic Astrology",
    description:
      "Understand how foreign travel, relocation and settlement are studied through the birth chart, planetary periods and transits.",
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

export default function WillISettleAbroadPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Will I Settle Abroad? How Vedic Astrology Studies Foreign Travel and Settlement",
    description:
      "A structured explanation of how foreign travel, relocation and settlement are studied in Vedic astrology through the birth chart, Dasha and transits.",
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    about: [
      "Vedic Astrology",
      "Foreign Settlement",
      "Foreign Travel",
      "Relocation",
      "Twelfth House",
      "Vimshottari Dasha",
      "Planetary Transits",
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
        name: "Will I Settle Abroad?",
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
              FOREIGN TRAVEL &amp; SETTLEMENT · APPLIED ASTROLOGY
            </div>

            <h1 style={h1Style}>
              Will I Settle Abroad? How Vedic Astrology Studies Foreign Travel
              and Settlement
            </h1>

            <p
              style={{
                ...bodyStyle,
                fontSize: 20,
                maxWidth: 820,
                margin: 0,
              }}
            >
              Foreign travel and permanent settlement are not the same
              astrological event. Vedic astrology studies the houses of
              movement, long-distance journeys and life away from the familiar
              environment, then examines which planetary periods and transits
              activate those themes.
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
                  Foreign settlement becomes more plausible when the natal
                  horoscope contains a meaningful connection between travel,
                  relocation and life-away-from-home factors, and those factors
                  are activated by Dasha and transits.
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
                The 3rd, 9th and 12th houses can all participate, but they do
                not mean the same thing. The 4th house and its lord also become
                important when the question concerns leaving the homeland or
                establishing residence elsewhere.
              </p>
            </div>
          </section>

          <Section
            eyebrow="DEFINE THE EVENT"
            title="Travel, relocation and settlement must be separated"
          >
            <p>
              A foreign-country indication does not automatically mean
              permanent settlement abroad.
            </p>

            <p>
              Someone may travel frequently for work, study overseas, live
              abroad for several years, relocate temporarily, obtain residency
              in another country or permanently establish their life away from
              their birthplace.
            </p>

            <p>
              These experiences may share some astrological indicators while
              still representing different event types.
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
                Foreign travel is an event. Foreign residence is a condition.
                Permanent settlement is a longer-term life pattern.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="THE CORE FRAMEWORK"
            title="Which houses are studied for foreign movement?"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 18,
                marginTop: 30,
              }}
            >
              <FactorCard number="01" title="3rd House">
                The 3rd can represent movement, journeys, initiative and
                change of immediate environment. It may participate in
                relocation patterns depending on the chart.
              </FactorCard>

              <FactorCard number="02" title="9th House">
                The 9th is strongly associated with long-distance journeys,
                distant places, higher learning and experiences beyond the
                familiar environment.
              </FactorCard>

              <FactorCard number="03" title="12th House">
                The 12th is particularly important for residence away from the
                familiar environment, foreign lands, separation and life beyond
                one&apos;s usual setting.
              </FactorCard>

              <FactorCard number="04" title="4th House">
                The 4th represents home, residence, roots and homeland.
                Connections between the 4th and travel or separation houses can
                become important in relocation analysis.
              </FactorCard>

              <FactorCard number="05" title="Rahu">
                Rahu is traditionally associated with the unfamiliar,
                unconventional and foreign environments, but its actual role
                depends on lordship, placement and connections.
              </FactorCard>

              <FactorCard number="06" title="Relevant Dasha">
                The planetary period must activate the movement or settlement
                pattern already present in the natal horoscope.
              </FactorCard>
            </div>
          </Section>

          <Section
            eyebrow="3RD · 9TH · 12TH"
            title="Why these three houses should not be treated as identical"
          >
            <p>
              One of the most common shortcuts in foreign-settlement astrology
              is to combine the 3rd, 9th and 12th houses into one generic
              “foreign travel” formula.
            </p>

            <p>
              A more useful approach is to understand the role each house is
              playing.
            </p>

            <p>
              The 3rd can show movement and change of environment. The 9th is
              strongly connected with long-distance movement and distant
              experiences. The 12th can signify life away from one&apos;s
              familiar environment and therefore becomes especially important
              when the question moves from travel to residence.
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
                A journey and a permanent change of home are related themes —
                but they are not the same event.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="THE 4TH HOUSE"
            title="Settlement also requires us to study home and roots"
          >
            <p>
              Permanent settlement is not only about travelling far away. It is
              also about establishing a new home.
            </p>

            <p>
              This makes the 4th house and 4th lord important in any serious
              analysis of relocation or settlement.
            </p>

            <p>
              We may study whether the 4th lord connects with the 9th, 12th or
              other movement-related factors, whether the 4th itself receives
              influences connected with displacement or travel, and whether the
              active planetary periods bring these themes together.
            </p>

            <p>
              This helps distinguish someone who travels frequently while
              remaining rooted at home from someone whose life genuinely shifts
              toward another country.
            </p>
          </Section>

          <Section
            eyebrow="RAHU"
            title="Does Rahu guarantee foreign settlement?"
          >
            <p>
              Rahu is often associated with foreign environments, unfamiliar
              cultures, crossing boundaries and experiences outside the
              conventional setting.
            </p>

            <p>
              That makes it relevant to many foreign-travel and relocation
              questions.
            </p>

            <p>
              But Rahu by itself does not guarantee foreign settlement.
            </p>

            <p>
              Its placement, house lordship, dispositor, Nakshatra, aspects and
              connections determine whether the foreign theme is actually
              strong in a particular horoscope.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Rahu can strengthen a foreign theme. It does not replace the
                rest of the chart.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="HOUSE LORDS & SAMBANDHA"
            title="Connections between houses create the relocation story"
          >
            <p>
              Foreign settlement becomes more interesting when the lords of
              movement, long-distance travel, residence and separation form
              meaningful relationships.
            </p>

            <p>
              For example, a connection between the 4th and 12th lords may link
              home with life away from the familiar environment. A relationship
              between the 9th and 12th may strengthen distant or international
              themes.
            </p>

            <p>
              The Lagna lord can also become important because permanent
              settlement changes the person&apos;s lived environment rather
              than merely creating an isolated journey.
            </p>

            <p>
              Conjunction, aspect, exchange and other forms of Sambandha can all
              participate.
            </p>

            <p>
              The question is not how many “foreign combinations” can be
              counted. It is whether the chart tells one coherent movement and
              residence story.
            </p>
          </Section>

          <Section
            eyebrow="CAUSE OF MOVEMENT"
            title="Why is the person going abroad?"
          >
            <p>
              The reason for foreign movement matters because the event often
              involves another life domain.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 28,
              }}
            >
              <FactorCard number="A" title="Career">
                If relocation happens through a job or professional transfer,
                the 10th, 6th and relevant career planets may join the foreign
                movement pattern.
              </FactorCard>

              <FactorCard number="B" title="Education">
                Higher education abroad may bring the 5th, 9th and educational
                factors into stronger focus.
              </FactorCard>

              <FactorCard number="C" title="Marriage">
                If settlement follows marriage or partnership, the 7th house
                and relationship factors may become part of the same
                relocation story.
              </FactorCard>
            </div>

            <p style={{ marginTop: 28 }}>
              This is why the same 9th- or 12th-house activation can manifest
              very differently for different people.
            </p>
          </Section>

          <Section
            eyebrow="DASHA"
            title="Dasha shows when the foreign-movement agenda becomes active"
          >
            <p>
              The natal chart establishes whether foreign travel or settlement
              is meaningfully supported. Vimshottari Dasha then helps identify
              periods when the relevant planets become active.
            </p>

            <p>
              Depending on the horoscope, this may involve the lords of the 3rd,
              9th or 12th, the 4th lord, Rahu, planets placed in travel-related
              houses, or planets connecting the cause of relocation with the
              foreign-movement pattern.
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
              “Rahu Dasha means you will move abroad.”
            </div>

            <p>
              This is too mechanical. Rahu can activate many different themes.
              It becomes relevant to settlement only when its natal role
              genuinely connects with foreign movement or residence.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                The Dasha does not invent a foreign-settlement promise. It
                activates what the natal chart already contains.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="TRANSITS"
            title="How are transits used to narrow foreign-settlement timing?"
          >
            <p>
              Slow-moving planets can help create broader windows in which
              movement, relocation and settlement themes become stronger.
            </p>

            <p>
              Jupiter and Saturn may become relevant when they activate travel
              houses, the 4th house, important lords, Rahu or the active Dasha
              planets.
            </p>

            <p>
              Rahu and Ketu can also become significant when the nodal axis
              activates the home-versus-away theme or other relevant natal
              factors.
            </p>

            <p>
              Faster planets can then refine timing inside the broader window
              where appropriate.
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
                Transit activation becomes meaningful when it reinforces the
                same movement pattern already visible in the natal chart and
                Dasha.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="EVENT TYPE"
            title="Foreign travel, relocation and settlement require different evidence"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 28,
              }}
            >
              <FactorCard number="A" title="Foreign travel">
                A journey abroad may require a lighter travel activation and
                does not necessarily imply a change of home.
              </FactorCard>

              <FactorCard number="B" title="Living abroad">
                Residence in another country usually requires stronger
                involvement of home, separation and longer-duration factors.
              </FactorCard>

              <FactorCard number="C" title="Permanent settlement">
                A lasting change of base should show broader convergence than a
                short trip or temporary relocation.
              </FactorCard>
            </div>

            <p style={{ marginTop: 28 }}>
              The more permanent the predicted outcome, the stronger and more
              repeated the supporting evidence should be.
            </p>
          </Section>

          <Section
            eyebrow="BROAD TO NARROW"
            title="How foreign-settlement timing is narrowed"
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
                  "Clarify whether the question concerns travel, study, temporary relocation, long-term residence or permanent settlement.",
                ],
                [
                  "2. Establish natal promise",
                  "Study the 3rd, 9th, 12th and 4th houses and their lords according to the exact question.",
                ],
                [
                  "3. Assess Rahu and key planets",
                  "Judge their placement, dignity, dispositors, aspects and relationships.",
                ],
                [
                  "4. Identify the reason for movement",
                  "Connect career, education, marriage or another life domain where relevant.",
                ],
                [
                  "5. Map Sambandha",
                  "Look for genuine relationships between home, movement and foreign-environment factors.",
                ],
                [
                  "6. Identify the active Dasha",
                  "Determine whether Mahadasha and Antardasha planets can deliver the movement or settlement theme.",
                ],
                [
                  "7. Build the transit window",
                  "Look for broader activation from slow-moving planets and the nodes.",
                ],
                [
                  "8. Judge permanence and convergence",
                  "Require stronger evidence for permanent settlement than for a short journey.",
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
            title="A hypothetical foreign-settlement example"
          >
            <p>
              Imagine a horoscope in which the 4th lord is meaningfully
              connected with the 12th lord, while the 9th house also receives
              support from an important natal planet.
            </p>

            <p>
              Rahu participates in the same pattern rather than acting as an
              isolated foreign indicator.
            </p>

            <p>
              The person then enters an Antardasha of a planet connecting the
              4th and 12th themes.
            </p>

            <p>
              At the same time, a career-related factor becomes active,
              creating a practical reason for relocation.
            </p>

            <p>
              Jupiter and Saturn then reinforce the relevant natal houses
              through transit.
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
              <strong>Natal relocation promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>reason for movement</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>slow-transit support</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>settlement window</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              This creates a stronger case for meaningful relocation than
              simply seeing Rahu in the 12th or Jupiter transiting the 9th.
            </p>
          </Section>

          <Section
            eyebrow="REAL LIFE"
            title="Why a strong foreign period may not become permanent settlement"
          >
            <p>
              A strong foreign theme can manifest without becoming permanent.
            </p>

            <p>
              A visa may be temporary. A job contract may end. The person may
              choose to return home. Family obligations may change the plan.
              Immigration rules may prevent long-term residence.
            </p>

            <p>
              The same period may still manifest through extensive foreign
              travel, international work, study or a temporary relocation.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Astrology can show a stronger foreign-environment theme without
                guaranteeing immigration approval or permanent residency.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="COMMON MISTAKES"
            title="Foreign-settlement astrology shortcuts to avoid"
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
                  title: "12th house = permanent settlement abroad",
                  text: "The 12th can describe life away from the familiar environment, but permanent settlement requires a wider pattern.",
                },
                {
                  title: "Rahu = foreign country",
                  text: "Rahu may support unfamiliar or foreign themes, but its actual role depends on the horoscope.",
                },
                {
                  title: "9th house activation means migration",
                  text: "The 9th can indicate long-distance travel without changing the person's permanent residence.",
                },
                {
                  title: "Ignoring the 4th house",
                  text: "Permanent relocation also changes home, residence and roots, making the 4th important.",
                },
                {
                  title: "Treating travel and settlement as identical",
                  text: "Short journeys, long-term residence and permanent settlement require different levels of evidence.",
                },
                {
                  title: "Ignoring the reason for relocation",
                  text: "Career, education and marriage can each create a different route to foreign movement.",
                },
                {
                  title: "One transit guarantees migration",
                  text: "Transits should reinforce an existing natal and Dasha pattern.",
                },
                {
                  title: "Predicting immigration approval",
                  text: "Astrology cannot guarantee visa, residency or citizenship decisions made by legal authorities.",
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
            title="A practical foreign-settlement workflow"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              {[
                "Define whether the question is travel, relocation, residence or permanent settlement.",
                "Examine the 3rd, 9th and 12th houses according to the event.",
                "Study the 4th house and 4th lord where change of residence is involved.",
                "Assess Rahu and other relevant planets in context.",
                "Identify the practical reason for foreign movement.",
                "Map Sambandha between movement, home and the relevant life domain.",
                "Determine whether the active Mahadasha and Antardasha can deliver the event.",
                "Build the broader transit window.",
                "Use shorter activation only after the larger pattern is established.",
                "Distinguish travel from long-term residence.",
                "Require stronger convergence before predicting permanent settlement.",
                "State only the level of permanence and timing supported by the evidence.",
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
            title="Permanent settlement requires stronger convergence"
          >
            <p>
              A single travel indicator can be enough to describe movement.
              Permanent settlement is a larger claim.
            </p>

            <p>
              Confidence increases when the horoscope repeatedly connects
              distant places, separation from the familiar home, change of
              residence, the reason for relocation, Dasha activation and
              transit support.
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
                The bigger the predicted life change, the stronger the
                convergence should be.
              </strong>
            </div>

            <p style={{ marginTop: 28 }}>
              This is the difference between seeing a foreign theme and making a
              defensible prediction about relocation.
            </p>
          </Section>

          <Section
            eyebrow="SUMMARY"
            title="So, will I settle abroad?"
          >
            <p>
              Vedic astrology approaches foreign settlement by distinguishing
              between travel, relocation and a genuine long-term change of
              residence.
            </p>

            <p>
              The 3rd, 9th and 12th houses contribute different movement
              themes, while the 4th becomes important when home and roots
              change. Rahu can strengthen foreign or unfamiliar themes, but
              only within the context of the complete horoscope.
            </p>

            <p>
              Dasha then shows when the relevant natal agenda becomes active,
              and transits help narrow the period.
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
              <strong>Define the movement</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Natal promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>home + foreign connection</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>transit window</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>convergence</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The purpose is not to turn one foreign indicator into a promise
              of permanent migration.
            </p>

            <p>
              It is to understand whether the horoscope supports movement, what
              form that movement is likely to take, and when those conditions
              become meaningfully stronger.
            </p>
          </Section>

          <section
            style={{
              padding: "58px 0 70px",
              borderTop: "1px solid #eaded2",
            }}
          >
            <div style={eyebrowStyle}>CONTINUE LEARNING</div>

            <h2 style={{ ...h2Style, marginTop: 14 }}>
              Understand the techniques behind the answer
            </h2>

            <p style={bodyStyle}>
              Foreign-settlement timing becomes clearer once you understand
              houses, lordship, planetary relationships, Dasha and transits.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 28,
              }}
            >
              {[
                [
                  "The 12 Houses →",
                  "/sarathi/learn/astrology/12-houses-vedic-astrology",
                ],
                [
                  "House Lords →",
                  "/sarathi/learn/astrology/house-lords-vedic-astrology",
                ],
                [
                  "Aspects & Sambandha →",
                  "/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology",
                ],
                [
                  "Vimshottari Dasha →",
                  "/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology",
                ],
                [
                  "Transits →",
                  "/sarathi/learn/astrology/transits-gochar-vedic-astrology",
                ],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
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
                  {label}
                </Link>
              ))}
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
              Your foreign-settlement timing is personal to your horoscope.
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
              Sārathi brings together natal promise, planetary periods and
              transits to help you understand whether the chart is showing
              travel, relocation or a more lasting change of residence.
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
            tendencies and timing frameworks; it cannot guarantee visa
            approval, immigration status, residency, citizenship or a specific
            relocation outcome.
          </footer>
        </article>
      </div>
    </main>
  );
}