import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import TopNav from "../../../TopNav";

const canonicalUrl =
  "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-get-married";

export const metadata: Metadata = {
  title: "When Will I Get Married? Marriage Timing in Vedic Astrology",
  description:
    "Learn how Vedic astrology approaches marriage timing through the 7th house, house lords, planetary periods, Navamsa, transits and the convergence of multiple chart factors.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "When Will I Get Married? Marriage Timing in Vedic Astrology",
    description:
      "Understand how marriage timing is studied through the birth chart, Navamsa, Vimshottari Dasha and planetary transits.",
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

export default function WhenWillIGetMarriedPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "When Will I Get Married? How Vedic Astrology Times Marriage",
    description:
      "A structured explanation of how marriage timing is studied in Vedic astrology using the birth chart, Navamsa, Dasha and transits.",
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    about: [
      "Vedic Astrology",
      "Marriage Astrology",
      "Marriage Timing",
      "Navamsa",
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
        name: "When Will I Get Married?",
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

      {/* HERO */}
      <header
        style={{
          padding: "82px 0 72px",
          borderBottom: "1px solid #eadfd4",
        }}
      >
        <div style={containerStyle}>
          <div style={articleStyle}>
            <div style={eyebrowStyle}>
              MARRIAGE &amp; RELATIONSHIPS · APPLIED ASTROLOGY
            </div>

            <h1 style={h1Style}>
              When Will I Get Married? How Vedic Astrology Times Marriage
            </h1>

            <p
              style={{
                ...bodyStyle,
                fontSize: 20,
                maxWidth: 820,
                margin: 0,
              }}
            >
              Marriage timing is not determined by one planet, one house or one
              transit. Vedic astrology studies whether the horoscope supports
              marriage, which planetary periods activate the relevant
              relationship factors, and when transits help bring that promise
              into focus.
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
          {/* QUICK ANSWER */}
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
                  Marriage becomes more likely when the natal promise for
                  partnership is supported and the planetary periods and
                  transits simultaneously activate relevant marriage factors.
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
                The 7th house and 7th lord are central, but they are not read
                alone. Supporting houses, planetary relationships, Venus and
                other relevant karakas, the Navamsa, Vimshottari Dasha and
                transits all contribute to the final judgement.
              </p>
            </div>
          </section>

          <Section
            eyebrow="START WITH THE QUESTION"
            title="Marriage timing begins before we look at a date"
          >
            <p>
              “When will I get married?” sounds like a timing question, but
              good predictive work begins with the natal horoscope.
            </p>

            <p>
              Before trying to identify a year or a month, we first need to
              understand the chart&apos;s relationship structure.
            </p>

            <p>
              Does the horoscope support partnership clearly? Which planets
              carry the marriage agenda? Is the pattern straightforward, or
              are there factors suggesting that commitment may require more
              time, maturity or particular circumstances?
            </p>

            <p>
              Only after establishing the underlying promise should we move
              into Dasha and transit timing.
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 28,
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: 22,
                  lineHeight: 1.55,
                  color: "#552b42",
                }}
              >
                Timing cannot create a marriage promise that the natal chart
                itself does not support.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="THE CORE FRAMEWORK"
            title="Which parts of the birth chart are studied for marriage?"
          >
            <p>
              Marriage analysis is built from several connected factors rather
              than one isolated indicator.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 18,
                marginTop: 30,
              }}
            >
              <FactorCard number="01" title="7th House">
                The 7th house is the principal house of committed partnership
                and marriage. Its condition establishes an important part of
                the relationship story.
              </FactorCard>

              <FactorCard number="02" title="7th Lord">
                The lord of the 7th carries the partnership agenda elsewhere in
                the horoscope. Its house, Rashi, dignity and relationships are
                therefore essential.
              </FactorCard>

              <FactorCard number="03" title="2nd House">
                The 2nd house can contribute to the formation and continuity
                of family life and is often studied as a supporting factor in
                marriage-related analysis.
              </FactorCard>

              <FactorCard number="04" title="11th House">
                The 11th is associated with gains and fulfilment of desires and
                may support the realisation of an event promised elsewhere in
                the chart.
              </FactorCard>

              <FactorCard number="05" title="Relevant Karakas">
                Venus is an important natural relationship and marriage
                significator. Traditional analysis may also consider other
                relevant karakas according to the method being used.
              </FactorCard>

              <FactorCard number="06" title="Navamsa · D9">
                The Navamsa is an important divisional chart for examining
                marriage and the deeper condition of planetary promise, but it
                should refine the D1 rather than replace it.
              </FactorCard>
            </div>
          </Section>

          <Section
            eyebrow="THE 7TH HOUSE"
            title="Why the 7th house matters — and why it is not enough"
          >
            <p>
              The 7th house is naturally the first place many people look when
              studying marriage.
            </p>

            <p>
              But saying “the 7th house represents marriage” is only the
              beginning.
            </p>

            <p>
              A useful analysis asks which Rashi occupies the 7th, where its
              lord is placed, what dignity that lord has, which planets occupy
              or aspect the house, and how the 7th lord connects with other
              relevant houses and planets.
            </p>

            <p>
              For example, a strong 7th lord connected with supportive houses
              tells a different story from a 7th lord carrying several
              competing or difficult influences.
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
                The house tells us the topic. The house lord tells us where
                that topic travels in the horoscope.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="VENUS & KARAKAS"
            title="Is Venus the planet of marriage?"
          >
            <p>
              Venus is one of the most important natural significators for
              relationships, attraction, affection, harmony and partnership.
              Its condition can therefore contribute meaningfully to marriage
              analysis.
            </p>

            <p>
              But Venus alone cannot answer “when will I marry?”
            </p>

            <p>
              A strong Venus does not automatically promise an early marriage,
              and a challenged Venus does not automatically deny marriage.
              Venus has to be interpreted within the person&apos;s complete
              horoscope.
            </p>

            <p>
              Different Jyotish traditions may also use additional
              relationship significators and gender-specific karaka rules.
              These can add information, but they should not replace the
              fundamental analysis of the 7th house, its lord and the wider
              chart.
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 28,
              }}
            >
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                There is no single “marriage planet” that can be read in
                isolation.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="PLANETARY RELATIONSHIPS"
            title="Aspects and Sambandha connect the marriage story"
          >
            <p>
              Once the main marriage factors have been identified, the next
              question is how they relate to one another.
            </p>

            <p>
              Is the 7th lord connected with the Lagna lord? Does it relate to
              the 2nd or 11th lord? Is Venus involved? Are important planets
              joined by conjunction, aspect, exchange or another form of
              Sambandha?
            </p>

            <p>
              These connections can reveal whether different parts of the
              horoscope are participating in the same relationship theme.
            </p>

            <p>
              They can also show why two charts with apparently similar 7th
              houses may behave differently.
            </p>

            <p>
              The goal is not to accumulate as many marriage indicators as
              possible. It is to identify whether independent chart factors
              converge around the same story.
            </p>
          </Section>

          <Section
            eyebrow="NAVAMSA"
            title="What does the D9 Navamsa add to marriage analysis?"
          >
            <p>
              The Navamsa, or D9, is one of the most important divisional
              charts in Jyotish and is commonly examined in marriage analysis.
            </p>

            <p>
              But a frequent mistake is to treat the D9 as a second independent
              birth chart and allow it to override everything visible in the
              D1.
            </p>

            <p>
              A more disciplined approach is:
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
              <strong>D9 refines the promise</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              We can study whether important marriage planets retain strength,
              improve, weaken or form meaningful relationships in the Navamsa.
              The D9 can therefore deepen our understanding of what is already
              indicated in the natal chart.
            </p>

            <p>
              It should not be used to manufacture a marriage indication that
              has no foundation in the D1.
            </p>
          </Section>

          <Section
            eyebrow="DASHA"
            title="Vimshottari Dasha tells us which natal agendas are active"
          >
            <p>
              Once the marriage promise has been understood, timing becomes
              more focused.
            </p>

            <p>
              In Vimshottari Dasha, the Mahadasha and Antardasha planets bring
              their natal responsibilities into greater prominence.
            </p>

            <p>
              A marriage-supportive period may involve the 7th lord, a planet
              placed in or strongly connected with the 7th, Venus, planets
              connected with supporting houses, or other planets carrying a
              clear relationship agenda in that particular horoscope.
            </p>

            <p>
              This is why there is no universal rule such as:
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
              “Venus Dasha means marriage.”
            </div>

            <p>
              Venus may be strongly connected with marriage in one horoscope
              and carry a very different functional agenda in another.
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 28,
              }}
            >
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                A Dasha does not give a planet a new identity. It activates the
                agenda that planet already carries in the natal chart.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="TRANSITS"
            title="Can Jupiter or Saturn transit predict marriage?"
          >
            <p>
              Jupiter and Saturn are frequently studied when narrowing broader
              marriage windows because their slower movement can create
              sustained periods of activation.
            </p>

            <p>
              But neither planet should be treated as a standalone marriage
              trigger.
            </p>

            <p>
              A Jupiter transit affecting the 7th house, 7th lord, Venus or
              another relevant factor may be meaningful when the natal chart
              and Dasha already support marriage.
            </p>

            <p>
              Saturn can also become important through its transit influence,
              particularly when it activates relevant houses, lords or natal
              planets.
            </p>

            <p>
              Rahu and Ketu, as well as faster-moving planets, can sometimes
              contribute additional activation depending on the chart and
              timing method.
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
                A transit becomes more meaningful when it activates something
                that is already relevant in the natal chart and planetary
                period.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="BROAD TO NARROW"
            title="How marriage timing is narrowed"
          >
            <p>
              Predictive timing is usually more reliable when we move from
              larger periods toward smaller activation windows instead of
              trying to guess a single date immediately.
            </p>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 28,
              }}
            >
              {[
                [
                  "1. Natal promise",
                  "Establish the marriage and partnership structure in D1.",
                ],
                [
                  "2. Navamsa refinement",
                  "Examine whether D9 supports and refines the natal relationship promise.",
                ],
                [
                  "3. Mahadasha",
                  "Identify the larger planetary chapter currently active.",
                ],
                [
                  "4. Antardasha",
                  "Determine whether the sub-period creates a stronger marriage connection.",
                ],
                [
                  "5. Slow transits",
                  "Look for sustained activation from planets such as Jupiter and Saturn.",
                ],
                [
                  "6. Faster activation",
                  "Use shorter transits only after the broader timing window has been established.",
                ],
                [
                  "7. Convergence",
                  "Judge whether several independent layers are pointing toward the same event.",
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
            eyebrow="DELAY"
            title="Can astrology show delayed marriage?"
          >
            <p>
              A horoscope can contain factors traditionally associated with a
              slower development of partnership or a need for greater maturity
              before commitment.
            </p>

            <p>
              But one placement should never be turned into a verdict.
            </p>

            <p>
              Saturn influencing the 7th, for example, is sometimes described
              casually as “late marriage.” That is too simplistic.
            </p>

            <p>
              Saturn can signify delay, responsibility, seriousness,
              endurance, structure or maturity depending on its lordship,
              strength, placement and relationships. Its influence has to be
              interpreted as part of the whole chart.
            </p>

            <p>
              Likewise, a challenged 7th lord does not by itself mean marriage
              denial.
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 28,
              }}
            >
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Delay, difficulty and denial are not interchangeable concepts.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="WORKED EXAMPLE"
            title="A hypothetical marriage-timing example"
          >
            <p>
              Imagine a horoscope in which the natal chart contains a viable
              marriage promise.
            </p>

            <p>
              The 7th lord is reasonably strong and forms a meaningful
              relationship with a planet connected to the 2nd or 11th house.
              Venus also participates in the relationship pattern.
            </p>

            <p>
              The Navamsa supports the important planets rather than
              contradicting the broader D1 picture.
            </p>

            <p>
              Now suppose the person enters an Antardasha of a planet strongly
              connected with the 7th house and Venus.
            </p>

            <p>
              During that period, Jupiter begins activating the relevant
              marriage factors while Saturn simultaneously connects with
              another important relationship point.
            </p>

            <p>
              A faster planet later activates the same pattern during a shorter
              window.
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
              <strong>Natal marriage promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D9 support</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>slow-transit window</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>faster trigger</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              None of these factors alone proves marriage.
            </p>

            <p>
              Together, however, they create a stronger predictive case because
              independent layers of the horoscope are converging on the same
              theme.
            </p>
          </Section>

          <Section
            eyebrow="EVENT TYPE"
            title="Meeting someone, engagement and marriage are not the same event"
          >
            <p>
              Another important predictive distinction is the type of event
              being timed.
            </p>

            <p>
              A relationship may begin during one planetary period, become
              serious during another and formalise into marriage later.
            </p>

            <p>
              Therefore an astrologer should not automatically label every
              relationship activation as marriage.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 28,
              }}
            >
              <FactorCard number="A" title="Relationship begins">
                Attraction, meeting someone or entering a relationship may
                activate one part of the partnership story.
              </FactorCard>

              <FactorCard number="B" title="Commitment develops">
                A relationship becoming serious can involve a stronger
                connection with partnership, family and fulfilment factors.
              </FactorCard>

              <FactorCard number="C" title="Marriage formalises">
                Formal marriage requires the chart and timing to support the
                specific event rather than only general relationship activity.
              </FactorCard>
            </div>

            <p style={{ marginTop: 28 }}>
              The more specific the prediction, the more specific the
              astrological evidence should be.
            </p>
          </Section>

          <Section
            eyebrow="REAL LIFE"
            title="Why a favourable marriage period may pass without a wedding"
          >
            <p>
              Astrology describes timing and tendencies within a real human
              life. It does not remove circumstances, choices or opportunity.
            </p>

            <p>
              A relationship-supportive period can become active while someone
              is not seeking a partner, is already committed to another life
              priority, has not met a suitable person or consciously chooses
              not to marry.
            </p>

            <p>
              The same planetary period may then express through greater
              attention to relationships, negotiations, partnerships or
              decisions about commitment rather than a wedding itself.
            </p>

            <p>
              This is one reason responsible timing should describe the
              strength and nature of a window rather than treating every
              astrological activation as an unavoidable event.
            </p>
          </Section>

          <Section
            eyebrow="COMMON MISTAKES"
            title="Marriage astrology shortcuts to avoid"
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
                  title: "7th house = complete marriage prediction",
                  text: "The 7th is central, but its lord, supporting houses, karakas, aspects, D9 and timing layers all matter.",
                },
                {
                  title: "Venus Dasha means marriage",
                  text: "A planetary period must be interpreted through the planet's actual natal role rather than its natural karakatwa alone.",
                },
                {
                  title: "Jupiter entering the 7th guarantees marriage",
                  text: "A transit should activate an existing natal and Dasha pattern. It is not a standalone guarantee.",
                },
                {
                  title: "Saturn means late marriage",
                  text: "Saturn's influence depends on lordship, strength, placement, aspects and the wider horoscope.",
                },
                {
                  title: "A difficult placement means marriage denial",
                  text: "Difficulty, delay, adjustment and denial are different judgements and should not be collapsed into one conclusion.",
                },
                {
                  title: "Reading D9 without D1",
                  text: "Navamsa refines the natal chart. It should not be used as an independent replacement horoscope.",
                },
                {
                  title: "Predicting an exact date too early",
                  text: "Begin with the broad Dasha and transit window. Narrow timing only when convergence justifies greater precision.",
                },
                {
                  title: "Ignoring the person's real circumstances",
                  text: "Astrological timing operates within choices, opportunities, relationships and the person's actual life context.",
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
            title="A practical marriage-timing workflow"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              {[
                "Define the exact question: relationship, engagement or marriage.",
                "Examine the 7th house and its occupants.",
                "Study the 7th lord: placement, dignity, aspects and relationships.",
                "Add supporting houses such as the 2nd and 11th where relevant.",
                "Assess Venus and other relevant relationship significators in context.",
                "Map aspects, conjunctions and Sambandha between the key factors.",
                "Use the Navamsa to refine the D1 promise.",
                "Identify Mahadasha and Antardasha planets capable of activating marriage.",
                "Build the broader transit window using relevant slow-moving planets.",
                "Use faster activation only after the larger window exists.",
                "Distinguish between meeting, commitment and formal marriage.",
                "State only the level of timing precision supported by convergence.",
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
            title="Marriage timing is a problem of convergence"
          >
            <p>
              No single house, planet, Yoga, Dasha or transit should carry the
              entire prediction.
            </p>

            <p>
              Confidence increases when independent layers of the horoscope
              repeatedly support the same event.
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 28,
              }}
            >
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
              And even when convergence is strong, the language of prediction
              should remain proportionate to the evidence.
            </p>

            <p>
              A strong six-month window may sometimes be defensible. A specific
              day may not be.
            </p>

            <p>
              Precision is valuable only when the horoscope supports
              precision.
            </p>
          </Section>

          <Section eyebrow="SUMMARY" title="So, when will I get married?">
            <p>
              Vedic astrology does not answer that question responsibly by
              finding one marriage placement and attaching an age to it.
            </p>

            <p>
              A structured analysis begins with the natal promise, studies the
              7th house and 7th lord, incorporates supporting houses and
              relationship significators, refines the picture through the
              Navamsa, identifies an appropriate Dasha and then looks for
              transit activation.
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
              <strong>Natal promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Marriage factors</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D9 refinement</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Transit window</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Convergence</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The purpose is not to force certainty from the chart.
            </p>

            <p>
              It is to identify periods in which the astrological evidence for
              marriage becomes meaningfully stronger.
            </p>
          </Section>

          {/* CONTINUE LEARNING */}
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
              Marriage timing becomes easier to understand once you know how
              house lords, divisional charts, planetary periods and transits
              work together.
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
                href="/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology"
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
                Divisional Charts →
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

          {/* CTA */}
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
              Your marriage timing is personal to your horoscope.
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
              Sārathi brings together birth-chart promise, planetary periods,
              divisional charts and transits to help you understand timing
              through the complete horoscope rather than a single placement.
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
            guarantee of a specific relationship outcome or date.
          </footer>
        </article>
      </div>
    </main>
  );
}