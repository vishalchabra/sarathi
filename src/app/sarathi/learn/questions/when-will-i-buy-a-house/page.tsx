import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import TopNav from "../../../TopNav";

const canonicalUrl =
  "https://www.sarathiyourguide.com/sarathi/learn/questions/when-will-i-buy-a-house";

export const metadata: Metadata = {
  title: "When Will I Buy a House? Property Timing in Vedic Astrology",
  description:
    "Learn how Vedic astrology studies property purchase timing through the 4th house, Mars, house lords, Dasha, divisional charts, transits and convergence.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "When Will I Buy a House? Property Timing in Vedic Astrology",
    description:
      "Understand how property and home ownership are studied through the birth chart, Dasha, divisional charts and planetary transits.",
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

export default function WhenWillIBuyAHousePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "When Will I Buy a House? How Vedic Astrology Studies Property Timing",
    description:
      "A structured explanation of how property purchase and home ownership are studied in Vedic astrology through the birth chart, divisional charts, Dasha and transits.",
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    about: [
      "Vedic Astrology",
      "Property Astrology",
      "Home Ownership",
      "Fourth House",
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
        name: "When Will I Buy a House?",
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
              PROPERTY &amp; HOME · APPLIED ASTROLOGY
            </div>

            <h1 style={h1Style}>
              When Will I Buy a House? How Vedic Astrology Studies Property
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
              Buying a home is not timed from the 4th house alone. Vedic
              astrology studies the natal promise for property, the planets
              connected with home and assets, the financial ability to complete
              the purchase, and the Dasha and transit periods that activate
              those factors together.
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
                  A property purchase becomes more likely when the horoscope
                  supports home or asset acquisition and the active Dasha and
                  transits simultaneously activate the relevant property and
                  financial factors.
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
                The 4th house is central, but the 4th lord, Mars, financial
                houses, the D4 Chaturthamsa, planetary periods and transits all
                help build the complete picture.
              </p>
            </div>
          </section>

          <Section
            eyebrow="DEFINE THE EVENT"
            title="Buying, building, moving and owning are not the same question"
          >
            <p>
              “When will I buy a house?” is more specific than “What does my
              chart say about property?”
            </p>

            <p>
              A person may buy a completed home, purchase land, construct a
              property, inherit a family asset, invest in real estate, move into
              a new residence or sell one property before acquiring another.
            </p>

            <p>
              These events share a property theme, but their astrological
              mechanisms can differ.
            </p>

            <p>
              Prediction therefore begins by defining the exact event rather
              than assuming every 4th-house activation means a house purchase.
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
                Property activation can mean acquisition, construction,
                relocation, inheritance or change of residence. The event must
                be identified before it is timed.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="THE CORE FRAMEWORK"
            title="Which parts of the horoscope are studied for property?"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 18,
                marginTop: 30,
              }}
            >
              <FactorCard number="01" title="4th House">
                The 4th house is central to home, residence, property,
                domestic stability and immovable assets.
              </FactorCard>

              <FactorCard number="02" title="4th Lord">
                The placement and condition of the 4th lord show where the
                property agenda travels and what other areas of life become
                connected with it.
              </FactorCard>

              <FactorCard number="03" title="Mars">
                Mars is traditionally associated with land and immovable
                property and may become an important natural significator in
                property analysis.
              </FactorCard>

              <FactorCard number="04" title="2nd House">
                Accumulated resources and financial capacity can become
                important when a property purchase requires savings or family
                assets.
              </FactorCard>

              <FactorCard number="05" title="11th House">
                The 11th can support gains, fulfilment and the realisation of a
                desired acquisition.
              </FactorCard>

              <FactorCard number="06" title="D4 · Chaturthamsa">
                The D4 is traditionally used to refine matters connected with
                property, residence and fixed assets after the D1 promise has
                been established.
              </FactorCard>
            </div>
          </Section>

          <Section
            eyebrow="THE 4TH HOUSE"
            title="Why the 4th house is central — but not sufficient"
          >
            <p>
              The 4th house is the natural starting point for property
              analysis, but identifying the house is only the first step.
            </p>

            <p>
              We also study the Rashi occupying the 4th, planets placed there,
              aspects to the house, the location and strength of the 4th lord,
              and the relationships that lord forms elsewhere in the chart.
            </p>

            <p>
              A 4th lord connected with financial or gains houses can create a
              very different property story from one connected with movement,
              inheritance or expenditure.
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
                The 4th house identifies the property theme. The 4th lord helps
                explain how that theme operates in the person&apos;s life.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="MARS"
            title="Does strong Mars mean property ownership?"
          >
            <p>
              Mars is traditionally connected with land, construction and
              immovable property, which makes it relevant to many property
              questions.
            </p>

            <p>
              But Mars cannot be interpreted in isolation.
            </p>

            <p>
              Its lordship, placement, dignity, aspects and relationship with
              the 4th house or 4th lord determine how relevant it actually is
              in a particular horoscope.
            </p>

            <p>
              A strong Mars may support the property story in one chart while
              representing a very different life agenda in another.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Natural karakatwa tells us what a planet can signify. Lordship
                and chart context tell us what it is actually doing.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="FINANCIAL CAPACITY"
            title="A property promise and the ability to fund it must meet"
          >
            <p>
              A house purchase is both a property event and, for most people, a
              significant financial event.
            </p>

            <p>
              This means the 4th house cannot always be studied separately from
              accumulated resources, gains, income, loans and expenditure.
            </p>

            <p>
              The 2nd and 11th may support the financial side of acquisition,
              while the 6th can become relevant where borrowing or mortgage
              obligations are involved. The 12th may become important when a
              major outflow or expenditure accompanies the purchase.
            </p>

            <p>
              These houses should be interpreted according to the actual
              mechanism of the transaction rather than combined mechanically.
            </p>
          </Section>

          <Section
            eyebrow="SAMBANDHA"
            title="Connections reveal how the property event may happen"
          >
            <p>
              Suppose the 4th lord connects with the 11th lord. That may link
              property with gains or fulfilment.
            </p>

            <p>
              A connection with the 2nd can bring accumulated resources into
              the story. A relationship with the 6th may become relevant where
              financing or debt is involved.
            </p>

            <p>
              A connection with the 9th can introduce another type of
              supportive circumstance, while links with the 8th may require us
              to consider inheritance, joint resources or other transformations
              depending on the complete horoscope.
            </p>

            <p>
              Conjunctions, aspects, exchanges and other forms of Sambandha
              therefore help us move from “property is indicated” to “how might
              this property event actually manifest?”
            </p>
          </Section>

          <Section
            eyebrow="D4 · CHATURTHAMSA"
            title="What does the D4 add to property analysis?"
          >
            <p>
              The Chaturthamsa, or D4, is traditionally used to refine matters
              connected with property, residence and fixed assets.
            </p>

            <p>
              But the same principle that applies to every divisional chart
              applies here:
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
              <strong>D4 refines the property dimension</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The D4 can help us study whether important property planets retain
              support, how the property theme develops and which planets become
              especially relevant to residence and assets.
            </p>

            <p>
              It should not be used to override a contradictory natal picture
              or to manufacture a property promise that has no foundation in
              the D1.
            </p>
          </Section>

          <Section
            eyebrow="DASHA"
            title="Dasha tells us when the property agenda becomes active"
          >
            <p>
              Once the natal property structure is understood, Vimshottari
              Dasha helps identify periods in which that structure can become
              more active.
            </p>

            <p>
              A property-supportive Mahadasha or Antardasha may involve the 4th
              lord, a planet occupying the 4th, Mars, a planet strongly
              connected with the 4th lord, or planets linking property with
              finance and gains.
            </p>

            <p>
              The relevant planets depend on the individual horoscope.
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
              “Mars Dasha means you will buy property.”
            </div>

            <p>
              That shortcut ignores Mars&apos;s actual role in the horoscope.
              The period becomes meaningful only if Mars carries a genuine
              property agenda in that chart.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                The Dasha planet must be capable of delivering the event being
                predicted.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="TRANSITS"
            title="How do transits help time a property purchase?"
          >
            <p>
              Slow-moving transits can create broader periods in which property
              themes become more active.
            </p>

            <p>
              Jupiter and Saturn may become important when they influence the
              4th house, 4th lord, relevant Dasha planets or other property
              factors already established in the natal chart.
            </p>

            <p>
              Rahu and Ketu can also participate depending on the horoscope and
              the nature of the event, particularly where relocation,
              unfamiliar environments or significant changes of residence are
              involved.
            </p>

            <p>
              Faster planets can then help refine a broader period, but they
              should not be used to create a property prediction by themselves.
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
                Transit timing works best when it activates a property promise
                that the natal chart and Dasha have already made relevant.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="EVENT TYPE"
            title="Purchase, construction and relocation require different judgement"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 28,
              }}
            >
              <FactorCard number="A" title="Buying a property">
                Acquisition requires a property indication together with the
                resources, financing or gains necessary to complete it.
              </FactorCard>

              <FactorCard number="B" title="Building a home">
                Construction can bring Mars, land, expenditure and the
                development of property into greater prominence.
              </FactorCard>

              <FactorCard number="C" title="Changing residence">
                A strong 4th-house activation may sometimes manifest as moving
                home rather than purchasing property.
              </FactorCard>
            </div>

            <p style={{ marginTop: 28 }}>
              This distinction prevents a common predictive mistake: seeing a
              residence-related activation and automatically calling it a
              property purchase.
            </p>
          </Section>

          <Section
            eyebrow="BROAD TO NARROW"
            title="How property timing is narrowed"
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
                  "1. Define the property event",
                  "Clarify whether the question concerns purchase, land, construction, relocation, inheritance or another property outcome.",
                ],
                [
                  "2. Establish natal promise",
                  "Study the 4th house, 4th lord, Mars and relevant supporting houses.",
                ],
                [
                  "3. Assess capacity",
                  "Judge dignity, strength, aspects, placement and Sambandha.",
                ],
                [
                  "4. Check financial support",
                  "Determine whether the horoscope supports the financial mechanism required for the acquisition.",
                ],
                [
                  "5. Refine through D4",
                  "Use Chaturthamsa to deepen the property analysis without replacing D1.",
                ],
                [
                  "6. Identify the active Dasha",
                  "Determine whether Mahadasha and Antardasha planets can deliver the property agenda.",
                ],
                [
                  "7. Build the transit window",
                  "Look for broader activation of relevant houses, lords and Dasha planets.",
                ],
                [
                  "8. Judge convergence",
                  "Increase confidence only when independent layers support the same property event.",
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
            title="A hypothetical property-purchase example"
          >
            <p>
              Imagine a horoscope in which the 4th lord is reasonably strong
              and forms a meaningful relationship with the 11th lord.
            </p>

            <p>
              The 2nd house also supports accumulated resources, while the D4
              reinforces the important property planets.
            </p>

            <p>
              The person then enters an Antardasha of a planet connected with
              both the 4th house and gains.
            </p>

            <p>
              During this period, Jupiter begins activating the property
              pattern while Saturn simultaneously connects with another
              relevant natal factor.
            </p>

            <p>
              A shorter transit later activates the same configuration.
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
              <strong>Natal property promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>financial capacity</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D4 support</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>transit window</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              This creates a much stronger case for property acquisition than
              simply observing that Jupiter is transiting the 4th house.
            </p>
          </Section>

          <Section
            eyebrow="REAL LIFE"
            title="Why a strong property period may pass without a purchase"
          >
            <p>
              A supportive astrological period does not remove practical
              circumstances.
            </p>

            <p>
              Financing may not be available. The person may decide that prices
              are unsuitable. Family priorities may change. A planned purchase
              may become a rental move, renovation or relocation instead.
            </p>

            <p>
              The astrological theme can therefore become active without
              manifesting in the exact form originally expected.
            </p>

            <div style={{ ...highlightStyle, marginTop: 28 }}>
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                Astrology can identify a stronger property window. It cannot
                replace affordability, financing, legal due diligence or
                personal choice.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="COMMON MISTAKES"
            title="Property astrology shortcuts to avoid"
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
                  title: "4th house activation = house purchase",
                  text: "The same house can describe residence, domestic change, property, vehicles or other 4th-house matters depending on context.",
                },
                {
                  title: "Mars Dasha = property",
                  text: "Mars must carry a relevant property agenda in the individual horoscope.",
                },
                {
                  title: "Jupiter in the 4th guarantees a home",
                  text: "A transit should support an existing natal and Dasha pattern rather than act as a standalone guarantee.",
                },
                {
                  title: "Ignoring the financial side",
                  text: "Property acquisition usually requires both an asset indication and a workable financial mechanism.",
                },
                {
                  title: "Reading D4 without D1",
                  text: "The Chaturthamsa refines property matters promised in the natal chart; it does not replace D1.",
                },
                {
                  title: "Confusing relocation with ownership",
                  text: "A change of residence can strongly activate the 4th without creating a property purchase.",
                },
                {
                  title: "Ignoring debt or financing",
                  text: "Where a mortgage or loan is central to the transaction, the relevant obligation factors also need to be studied.",
                },
                {
                  title: "Predicting an exact date too early",
                  text: "Begin with the larger Dasha and transit window and narrow only when convergence supports greater precision.",
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
            title="A practical property-timing workflow"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              {[
                "Define the exact property event being studied.",
                "Examine the 4th house, its occupants and aspects.",
                "Study the 4th lord: placement, dignity, strength and relationships.",
                "Assess Mars and other relevant planets in context.",
                "Identify the financial mechanism behind the acquisition.",
                "Map Sambandha between property, finance and gains factors.",
                "Use D4 to refine the D1 property promise.",
                "Determine whether the active Mahadasha and Antardasha can deliver the event.",
                "Build the broader transit window.",
                "Use shorter activation only after the larger pattern exists.",
                "Distinguish acquisition from construction, relocation or inheritance.",
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
            title="Property timing is a problem of convergence"
          >
            <p>
              The strongest property predictions are not built from one transit
              or one house.
            </p>

            <p>
              Confidence increases when the natal property promise, financial
              capacity, D4, Dasha and transits independently reinforce the same
              event.
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
          </Section>

          <Section
            eyebrow="SUMMARY"
            title="So, when will I buy a house?"
          >
            <p>
              Vedic astrology begins with the natal promise for property rather
              than jumping immediately to a transit date.
            </p>

            <p>
              The 4th house and 4th lord establish the core property story.
              Mars and supporting financial houses add context. D4 refines the
              property dimension, Dasha identifies periods capable of
              delivering the event and transits help narrow the window.
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
              <strong>Property promise</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>financial capacity</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>D4 refinement</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>transit window</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>convergence</strong>
            </div>

            <p style={{ marginTop: 28 }}>
              The purpose is not to promise a house because one favourable
              planet changes signs.
            </p>

            <p>
              It is to identify periods when the different layers required for
              a genuine property event become meaningfully stronger together.
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
              Property timing becomes clearer once you understand houses,
              lordship, divisional charts, Dasha and transits.
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
              Your property timing is personal to your horoscope.
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
              Sārathi brings together natal promise, planetary periods,
              divisional charts and transits to help you understand when
              property-related conditions may become stronger and what kind of
              property event the horoscope is actually activating.
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
            guarantee of property purchase, financial approval, investment
            performance or a specific transaction date.
          </footer>
        </article>
      </div>
    </main>
  );
}