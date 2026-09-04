import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import TopNav from "../../../TopNav";

const canonicalUrl =
  "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-have-a-child";

export const metadata: Metadata = {
  title: "When Will I Have a Child? Childbirth Timing in Vedic Astrology",
  description:
    "Learn how Vedic astrology traditionally studies child-related timing through the 5th house, 5th lord, Jupiter, Saptamsa, Dasha, transits and convergence.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "When Will I Have a Child? Childbirth Timing in Vedic Astrology",
    description:
      "Understand how child-related timing is traditionally studied through the birth chart, Saptamsa, Vimshottari Dasha and planetary transits.",
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

export default function WhenWillIHaveAChildPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "When Will I Have a Child? How Vedic Astrology Studies Child-Related Timing",
    description:
      "A structured educational explanation of how child-related timing is traditionally studied in Vedic astrology through the birth chart, Saptamsa, Dasha and transits.",
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    about: [
      "Vedic Astrology",
      "Children in Vedic Astrology",
      "Fifth House",
      "Saptamsa",
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
        name: "When Will I Have a Child?",
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
              CHILDREN &amp; FAMILY · APPLIED ASTROLOGY
            </div>

            <h1 style={h1Style}>
              When Will I Have a Child? How Vedic Astrology Studies
              Child-Related Timing
            </h1>

            <p
              style={{
                ...bodyStyle,
                fontSize: 20,
                maxWidth: 820,
                margin: 0,
              }}
            >
              In Jyotish, questions about children are traditionally studied
              through several connected layers of the horoscope rather than one
              planet or placement. The 5th house and its lord are central, with
              Jupiter, the Saptamsa, planetary periods and transits adding
              further context.
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
                  Traditional Vedic astrology looks for periods when
                  child-related factors in the natal chart are supported by the
                  active Dasha, Saptamsa and relevant transits.
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
                This is an astrological timing framework, not a medical
                assessment of fertility or reproductive health. Astrology
                should not be used to diagnose infertility, predict pregnancy
                complications or replace medical advice.
              </p>
            </div>
          </section>

          <Section
            eyebrow="BEGIN WITH THE QUESTION"
            title="Child-related astrology needs especially careful interpretation"
          >
            <p>
              Questions about children can carry enormous emotional weight.
              That makes precision of language just as important as precision
              of technique.
            </p>

            <p>
              Astrology can traditionally be used to study periods in which
              child and family themes become more prominent. It cannot
              determine a person&apos;s medical fertility status.
            </p>

            <p>
              A chart should therefore not be used to make frightening
              declarations such as “you cannot have children” or to infer a
              medical condition from a difficult planetary placement.
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
                Astrological timing and medical fertility assessment answer
                different questions.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="THE CORE FRAMEWORK"
            title="Which parts of the horoscope are studied for children?"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 18,
                marginTop: 30,
              }}
            >
              <FactorCard number="01" title="5th House">
                The 5th house is the principal house traditionally associated
                with children and progeny. It forms the starting point of the
                analysis.
              </FactorCard>

              <FactorCard number="02" title="5th Lord">
                The placement, dignity, strength and relationships of the 5th
                lord show how the child-related agenda operates elsewhere in
                the horoscope.
              </FactorCard>

              <FactorCard number="03" title="Jupiter">
                Jupiter is traditionally regarded as an important natural
                significator for children, growth and expansion, but must be
                judged in the context of the individual chart.
              </FactorCard>

              <FactorCard number="04" title="2nd House">
                The 2nd house may support themes of family expansion and the
                development of the family unit.
              </FactorCard>

              <FactorCard number="05" title="11th House">
                The 11th can contribute as a house of gains, fulfilment and
                realisation of an outcome promised elsewhere.
              </FactorCard>

              <FactorCard number="06" title="D7 · Saptamsa">
                The Saptamsa is the divisional chart traditionally used to
                refine matters concerning children after the D1 has been
                studied.
              </FactorCard>
            </div>
          </Section>

          <Section
            eyebrow="THE 5TH HOUSE"
            title="Why the 5th house is central — and why it is not enough"
          >
            <p>
              The 5th house is the natural starting point for questions about
              children, but identifying the house is not the same as completing
              the analysis.
            </p>

            <p>
              We study the Rashi occupying the 5th, planets placed there,
              aspects to the house, and most importantly the condition and
              placement of the 5th lord.
            </p>

            <p>
              We then examine whether the 5th house and lord connect with other
              relevant family and fulfilment factors.
            </p>

            <p>
              One difficult influence on the 5th should never be converted
              automatically into a prediction of denial.
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
                The 5th house identifies the topic. The whole horoscope tells
                us how that topic is supported, challenged and activated.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="JUPITER"
            title="Is Jupiter the planet of children?"
          >
            <p>
              Jupiter is traditionally an important putra karaka and is widely
              examined in questions concerning children.
            </p>

            <p>
              But Jupiter alone cannot answer whether or when someone will have
              a child.
            </p>

            <p>
              Its natural significations must be combined with its functional
              lordship, placement, dignity, aspects and relationships in the
              individual horoscope.
            </p>

            <p>
              A strong Jupiter can support the broader child-related picture,
              but it does not replace analysis of the 5th house, 5th lord,
              Saptamsa and timing periods.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Natural karakatwa contributes meaning. It does not replace the
                horoscope.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="SAMBANDHA"
            title="Connections help reveal the wider family story"
          >
            <p>
              Once the principal child-related factors are identified, we look
              at how they connect.
            </p>

            <p>
              Does the 5th lord relate to the Lagna lord? Is there a connection
              with Jupiter? Do the 2nd or 11th lords participate? Are important
              planets joined through conjunction, aspect, exchange or another
              form of Sambandha?
            </p>

            <p>
              These relationships can strengthen a coherent theme when
              independent factors repeatedly point toward family expansion.
            </p>

            <p>
              But repetition should be genuine. The same planetary
              relationship described three different ways is still one piece
              of evidence, not three.
            </p>
          </Section>

          <Section
            eyebrow="D7 · SAPTAMSA"
            title="What does the Saptamsa add?"
          >
            <p>
              The Saptamsa, or D7, is traditionally associated with children
              and progeny and can add an important specialised layer to the
              analysis.
            </p>

            <p>
              As with every divisional chart, it should be used in the correct
              hierarchy:
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
              <strong>D1 establishes the natal promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D7 refines the child-related dimension</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              Important planets can then be studied in the D7 to understand how
              the child-related theme is reinforced or qualified.
            </p>

            <p>
              The D7 should not be treated as an independent horoscope that can
              override the D1.
            </p>
          </Section>

          <Section
            eyebrow="DASHA"
            title="Dasha shows when child-related themes become more active"
          >
            <p>
              Once the natal framework has been established, Vimshottari Dasha
              helps identify periods when relevant planets become active.
            </p>

            <p>
              Depending on the horoscope, these may include the 5th lord,
              planets placed in or strongly influencing the 5th, Jupiter, the
              lords of supporting houses or planets that become important in
              the Saptamsa.
            </p>

            <p>
              There is no universal planetary period that guarantees a child.
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
              “Jupiter Dasha means childbirth.”
            </div>

            <p>
              That statement ignores Jupiter&apos;s actual natal role and the
              rest of the horoscope.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                The active Dasha must connect meaningfully with the
                child-related promise already present in the chart.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="TRANSITS"
            title="How are transits used in child-related timing?"
          >
            <p>
              Jupiter is frequently watched because of its traditional
              association with children, growth and expansion. Saturn may also
              become important when it activates relevant natal houses, lords
              or Dasha planets.
            </p>

            <p>
              But a Jupiter transit should not be converted into a standalone
              pregnancy prediction.
            </p>

            <p>
              Slow transits are more useful when they reinforce child-related
              factors that the natal chart and active Dasha have already made
              relevant.
            </p>

            <p>
              Faster planetary movement may then help narrow a broader period
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
                Transit activation is a timing layer, not a medical prediction.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="EVENT TYPE"
            title="Family planning, conception and childbirth are not one event"
          >
            <p>
              Another important distinction is what exactly the astrologer is
              attempting to time.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 28,
              }}
            >
              <FactorCard number="A" title="Family planning">
                A period may bring greater focus on children, family decisions
                or the intention to expand the family.
              </FactorCard>

              <FactorCard number="B" title="Child-related development">
                A broader child-related window may coincide with important
                developments concerning children or family life without
                identifying a medical event.
              </FactorCard>

              <FactorCard number="C" title="Childbirth">
                If childbirth itself is being studied, the evidence should be
                more specific and the language appropriately cautious.
              </FactorCard>
            </div>

            <p style={{ marginTop: 28 }}>
              Astrology should not be used to determine whether conception has
              occurred. Pregnancy is established medically.
            </p>
          </Section>

          <Section
            eyebrow="DELAY & DIFFICULTY"
            title="A difficult 5th house does not equal infertility"
          >
            <p>
              This is one of the most important distinctions in responsible
              child-related astrology.
            </p>

            <p>
              Saturn, the nodes or other challenging influences involving the
              5th house may traditionally be interpreted in many ways depending
              on lordship, dignity, strength, aspects and the wider horoscope.
            </p>

            <p>
              They may describe delay, responsibility, worry, unusual
              circumstances, a different path to parenthood or other
              child-related experiences.
            </p>

            <p>
              They cannot diagnose infertility.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  display: "block",
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Delay, difficulty and medical infertility are not
                interchangeable conclusions.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="BROAD TO NARROW"
            title="How child-related timing is approached"
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
                  "1. Define the question",
                  "Clarify whether the person is asking about family expansion, child-related timing or another family event.",
                ],
                [
                  "2. Establish the natal framework",
                  "Study the 5th house, 5th lord, Jupiter and relevant supporting factors.",
                ],
                [
                  "3. Assess planetary capacity",
                  "Judge dignity, strength, aspects, placement and Sambandha.",
                ],
                [
                  "4. Refine through D7",
                  "Use the Saptamsa to deepen the child-related analysis without replacing D1.",
                ],
                [
                  "5. Identify the active Dasha",
                  "Determine whether Mahadasha and Antardasha planets carry the relevant child-related agenda.",
                ],
                [
                  "6. Build the broader transit window",
                  "Look for sustained activation of the relevant natal and Dasha factors.",
                ],
                [
                  "7. Narrow only when justified",
                  "Use shorter timing layers only after a broader supportive period has been established.",
                ],
                [
                  "8. Judge convergence",
                  "Increase confidence only when independent astrological layers support the same theme.",
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
            title="A hypothetical child-related timing example"
          >
            <p>
              Imagine a horoscope in which the 5th lord is reasonably strong
              and forms a supportive relationship with Jupiter and a family
              factor.
            </p>

            <p>
              The Saptamsa also reinforces the relevant planets.
            </p>

            <p>
              The person then enters an Antardasha of a planet closely
              connected with the 5th-house pattern.
            </p>

            <p>
              During the same broader period, Jupiter and Saturn activate
              relevant natal factors through transit.
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
              <strong>Natal child-related promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D7 support</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>slow-transit support</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>convergence</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              Astrologically, this may be interpreted as a stronger
              child-related period.
            </p>

            <p>
              It should not be converted into a statement that conception is
              medically certain or that pregnancy will necessarily occur on a
              particular date.
            </p>
          </Section>

          <Section
            eyebrow="REAL LIFE"
            title="Why a supportive period may manifest differently"
          >
            <p>
              Astrology operates within real circumstances, personal choices
              and medical realities.
            </p>

            <p>
              A strong child-related period may coincide with decisions about
              starting a family, fertility treatment, adoption discussions,
              responsibilities involving an existing child or another
              significant development in family life.
            </p>

            <p>
              This is why the astrologer should interpret the theme first and
              avoid forcing every activation into one predetermined outcome.
            </p>
          </Section>

          <Section
            eyebrow="COMMON MISTAKES"
            title="Child-related astrology shortcuts to avoid"
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
                  title: "5th house = complete prediction",
                  text: "The 5th is central, but its lord, Jupiter, supporting factors, D7, Dasha and transits all contribute.",
                },
                {
                  title: "Jupiter Dasha guarantees a child",
                  text: "Jupiter must be interpreted through its actual natal role and relationship with the child-related factors.",
                },
                {
                  title: "Jupiter transit means pregnancy",
                  text: "A transit is an astrological timing factor, not evidence that conception has occurred.",
                },
                {
                  title: "Saturn on the 5th means no children",
                  text: "One influence cannot support such a conclusion and cannot diagnose a medical condition.",
                },
                {
                  title: "A challenged 5th lord means infertility",
                  text: "Astrological difficulty is not a medical diagnosis.",
                },
                {
                  title: "Reading D7 without D1",
                  text: "Saptamsa refines the natal promise; it should not replace the birth chart.",
                },
                {
                  title: "Predicting complications astrologically",
                  text: "Health concerns during pregnancy require qualified medical assessment rather than astrological diagnosis.",
                },
                {
                  title: "Giving certainty where none exists",
                  text: "Sensitive predictions should remain proportionate to the astrological evidence and clear about their limits.",
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
            title="A responsible child-related timing workflow"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              {[
                "Define the exact child or family question.",
                "Examine the 5th house, its occupants and aspects.",
                "Study the 5th lord: placement, dignity, strength and relationships.",
                "Assess Jupiter and other relevant factors in context.",
                "Map Sambandha between child, family and fulfilment factors.",
                "Use D7 to refine the D1 child-related promise.",
                "Determine whether the active Mahadasha and Antardasha can activate the theme.",
                "Build the broader transit window.",
                "Narrow timing only when independent layers converge.",
                "Separate astrological timing from medical fertility assessment.",
                "Avoid converting difficulty or delay into medical conclusions.",
                "State only what the astrological evidence can reasonably support.",
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
            title="Convergence matters — certainty still has limits"
          >
            <p>
              As with other predictive questions, confidence increases when
              independent layers of the horoscope repeatedly support the same
              theme.
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
              But stronger astrological convergence does not transform
              astrology into a medical test.
            </p>

            <p>
              The boundary between astrological interpretation and medical
              assessment should remain clear.
            </p>
          </Section>

          <Section
            eyebrow="SUMMARY"
            title="So, when will I have a child?"
          >
            <p>
              Traditional Jyotish approaches this question by first studying
              the natal child-related framework rather than jumping directly to
              a transit.
            </p>

            <p>
              The 5th house and 5th lord establish the core theme. Jupiter and
              supporting houses add context. The D7 refines the child-related
              dimension, Dasha identifies periods of activation and transits
              help narrow broader windows.
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
              <strong>Natal framework</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>5th-house factors</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D7 refinement</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>transit window</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>convergence</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The result is an astrological timing framework — not a diagnosis
              of fertility and not a guarantee of conception or childbirth.
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
              Child-related timing becomes clearer once you understand houses,
              lordship, divisional charts, planetary periods and transits.
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
                  "Divisional Charts →",
                  "/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology",
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
              Child-related timing is personal to the complete horoscope.
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
              divisional charts and transits to help you understand
              child-related timing through the complete horoscope rather than
              one placement.
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
            traditions may vary in technique. Astrology is not a medical
            fertility assessment and cannot diagnose infertility, establish
            pregnancy or predict medical outcomes. Questions about fertility,
            conception, pregnancy or reproductive health should be discussed
            with an appropriately qualified healthcare professional.
          </footer>
        </article>
      </div>
    </main>
  );
}