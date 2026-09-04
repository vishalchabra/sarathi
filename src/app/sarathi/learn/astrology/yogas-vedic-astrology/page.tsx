import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import TopNav from "../../../TopNav";

const canonicalUrl =
  "https://www.sarathiyourguide.com/sarathi/learn/astrology/yogas-vedic-astrology";

export const metadata: Metadata = {
  title: "Yogas in Vedic Astrology: How Planetary Combinations Work",
  description:
    "Learn what Yogas mean in Vedic astrology, how planetary combinations are formed, why strength and lordship matter, and how Raja Yoga, Dhana Yoga, Gaja Kesari Yoga, Neecha Bhanga and other Yogas should be interpreted.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Yogas in Vedic Astrology: How Planetary Combinations Work",
    description:
      "Understand how Yogas are formed and how their actual strength depends on lordship, dignity, houses, divisional charts, Dasha activation and the wider horoscope.",
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

function PrincipleCard({
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

function YogaCard({
  title,
  summary,
  caution,
}: {
  title: string;
  summary: string;
  caution: string;
}) {
  return (
    <div style={cardStyle}>
      <h3 style={h3Style}>{title}</h3>

      <p
        style={{
          margin: "0 0 14px",
          fontSize: 16.5,
          lineHeight: 1.72,
          color: "#675269",
        }}
      >
        {summary}
      </p>

      <div
        style={{
          paddingTop: 14,
          borderTop: "1px solid #eee0d3",
          fontSize: 14.5,
          lineHeight: 1.65,
          color: "#8b6470",
        }}
      >
        <strong style={{ color: "#6f3046" }}>Interpret carefully:</strong>{" "}
        {caution}
      </div>
    </div>
  );
}

export default function YogasVedicAstrologyPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Yogas in Vedic Astrology: How Planetary Combinations Work",
    description:
      "A practical guide to understanding and evaluating Yogas in a Vedic horoscope.",
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    about: [
      "Vedic Astrology",
      "Jyotish",
      "Yogas",
      "Raja Yoga",
      "Dhana Yoga",
      "Planetary Combinations",
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
        name: "Yogas in Vedic Astrology",
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
          borderBottom: "1px solid #eadfD4",
        }}
      >
        <div style={containerStyle}>
          <div style={articleStyle}>
            <div style={eyebrowStyle}>EXPLORE THE LIBRARY · YOGAS</div>

            <h1 style={h1Style}>
              Yogas in Vedic Astrology: How Planetary Combinations Actually
              Work
            </h1>

            <p
              style={{
                ...bodyStyle,
                fontSize: 20,
                maxWidth: 820,
                margin: 0,
              }}
            >
              A Yoga is a meaningful relationship between astrological factors
              in a horoscope. But merely finding a named Yoga does not mean its
              promised result will automatically appear. The real work is
              judging whether the combination is strong, relevant and capable
              of becoming active.
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
                href="/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology"
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
                Review Sambandha →
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
                  A Yoga is not a guaranteed prediction. It is a combination
                  whose potential must be judged within the entire horoscope.
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
                Lordship, placement, dignity, planetary strength, aspects,
                house relationships, relevant divisional charts and planetary
                periods all influence whether a Yoga becomes significant.
              </p>
            </div>
          </section>

          <Section
            eyebrow="THE BASIC IDEA"
            title="What does the word Yoga mean in Jyotish?"
          >
            <p>
              In Sanskrit, <em>Yoga</em> broadly refers to a union,
              relationship or combination.
            </p>

            <p>
              In Jyotish, the term is used for particular configurations of
              planets, houses, house lords or other chart factors that are
              traditionally associated with a recognisable pattern of results.
            </p>

            <p>
              Some Yogas are connected with authority. Some with prosperity,
              learning, reputation, difficulty, reversals, spiritual
              inclination or unusual life circumstances.
            </p>

            <p>
              But a Yoga should never be read as an isolated label attached to
              a horoscope.
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 30,
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: "#552b42",
                }}
              >
                The combination creates a possibility. The horoscope tells us
                how much of that possibility can actually manifest.
              </strong>
            </div>
          </Section>

          <Section
            eyebrow="A COMMON MISUNDERSTANDING"
            title="A Yoga is not the same thing as a conjunction"
          >
            <p>
              Two planets sitting together form a conjunction, but not every
              conjunction constitutes a named classical Yoga.
            </p>

            <p>
              A Yoga may arise through conjunction, mutual aspect, exchange of
              signs, house lord relationships or another precisely defined
              condition.
            </p>

            <p>
              This is why simply spotting two planets beside one another is not
              enough.
            </p>

            <p>
              The astrologer first asks:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 24,
              }}
            >
              <PrincipleCard number="01" title="What is the exact rule?">
                Does the chart genuinely satisfy the stated conditions of the
                Yoga?
              </PrincipleCard>

              <PrincipleCard number="02" title="Which planets are involved?">
                What houses do they rule and what functions do they carry for
                this Lagna?
              </PrincipleCard>

              <PrincipleCard number="03" title="How strong are they?">
                A weak or severely compromised participant may not express the
                combination in the same way as a strong one.
              </PrincipleCard>
            </div>
          </Section>

          <Section
            eyebrow="THE CENTRAL PRINCIPLE"
            title="Why the same Yoga can produce very different results"
          >
            <p>
              Two people can technically possess the same named Yoga and still
              experience very different lives.
            </p>

            <p>
              That is because the Yoga does not exist outside the horoscope.
              Every planet participating in it has a specific functional role,
              strength, placement and relationship with the rest of the chart.
            </p>

            <p>
              Imagine that two horoscopes both contain a wealth-related
              combination. In one chart the participating planets may be
              strong, well placed, supported in the relevant divisional chart
              and activated by Dasha. In another, the same planets may be weak,
              afflicted or connected with difficult houses.
            </p>

            <p>The label may be the same. The capacity is not.</p>

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
                Do not ask only, “Is the Yoga present?” Ask, “How capable is
                this Yoga of giving results?”
              </strong>
            </div>
          </Section>

          {/* HOW TO JUDGE */}
          <Section
            eyebrow="THE SĀRATHI METHOD"
            title="How to evaluate a Yoga systematically"
          >
            <p>
              Instead of stopping after identifying the name of a Yoga, move
              through the following layers.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 18,
                marginTop: 30,
              }}
            >
              <PrincipleCard number="01" title="Begin with the Lagna">
                The Lagna determines functional lordship. The same planet does
                not carry the same house responsibilities in every horoscope.
              </PrincipleCard>

              <PrincipleCard number="02" title="Confirm the exact formation">
                Check whether every condition required for the Yoga is actually
                satisfied rather than relying on a simplified description.
              </PrincipleCard>

              <PrincipleCard number="03" title="Study house lordship">
                Identify which houses the participating planets rule. Their
                functional responsibilities shape what the combination can
                represent.
              </PrincipleCard>

              <PrincipleCard number="04" title="Judge placement">
                Examine the houses and Rashis occupied by the planets and what
                areas of life those placements connect.
              </PrincipleCard>

              <PrincipleCard number="05" title="Assess dignity and strength">
                Own sign, exaltation, debilitation and other strength factors
                help indicate how effectively a planet can operate.
              </PrincipleCard>

              <PrincipleCard number="06" title="Examine aspects & Sambandha">
                Other planets may support, redirect, modify or complicate the
                combination.
              </PrincipleCard>

              <PrincipleCard number="07" title="Check the relevant Varga">
                A divisional chart can refine whether the underlying promise is
                supported in the particular area of life being studied.
              </PrincipleCard>

              <PrincipleCard number="08" title="Look for Dasha activation">
                Even a meaningful natal combination may remain relatively quiet
                until participating or connected planets become active.
              </PrincipleCard>

              <PrincipleCard number="09" title="Add transit timing">
                Transits may help activate an already relevant natal and Dasha
                pattern. They should not be treated as the source of the Yoga.
              </PrincipleCard>

              <PrincipleCard number="10" title="Return to the whole chart">
                The final judgement must agree with the larger horoscope rather
                than contradicting it.
              </PrincipleCard>
            </div>
          </Section>

          <Section
            eyebrow="IMPORTANT DISTINCTION"
            title="Presence, strength and activation are three different questions"
          >
            <p>
              A useful way to avoid over-predicting from Yogas is to separate
              three stages.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 18,
                marginTop: 28,
              }}
            >
              <PrincipleCard number="A" title="Is it present?">
                Does the horoscope actually fulfil the classical or traditional
                conditions of the combination?
              </PrincipleCard>

              <PrincipleCard number="B" title="Is it strong?">
                Are the participating planets capable of supporting the meaning
                attributed to the Yoga?
              </PrincipleCard>

              <PrincipleCard number="C" title="Is it active?">
                Is the current planetary period bringing the participating
                planets or their connected houses into focus?
              </PrincipleCard>
            </div>

            <p style={{ marginTop: 30 }}>
              These questions are related, but they should not be collapsed
              into one.
            </p>

            <p>
              A Yoga can be present but weak. It can be strong but not currently
              activated. It can also become especially noticeable during a
              planetary period closely connected with its participants.
            </p>
          </Section>

          {/* FAMILIES */}
          <Section
            eyebrow="MAJOR FAMILIES OF YOGAS"
            title="Important Yoga categories you will encounter"
          >
            <p>
              Classical Jyotish contains a very large number of named Yogas.
              Rather than attempting to memorise them all immediately, it is
              more useful to understand the major families.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 18,
                marginTop: 32,
              }}
            >
              <YogaCard
                title="Raja Yogas"
                summary="Raja Yogas are broadly associated with combinations that can support status, authority, achievement, responsibility or elevated circumstances. Relationships involving Kendra and Trikona lords are especially important in many Parashari interpretations."
                caution="Do not translate every Raja Yoga directly into fame or political power. Its expression must fit the houses, planets, strength and actual life context."
              />

              <YogaCard
                title="Dhana Yogas"
                summary="Dhana Yogas are wealth-related combinations involving houses and lords connected with resources, gains, fortune and accumulation. The 2nd and 11th houses are important, while relationships with houses such as the 5th and 9th may strengthen wealth-producing patterns."
                caution="A Dhana Yoga does not guarantee extraordinary wealth. Income, accumulation, expenses, profession and Dasha activation must still be examined."
              />

              <YogaCard
                title="Dharma-Karmadhipati Yoga"
                summary="A meaningful relationship between the lords of the 9th house of Dharma and the 10th house of Karma is traditionally regarded as significant for the interaction between fortune, purpose, responsibility and action."
                caution="The actual result depends on the specific Lagna, placement, strength and nature of the relationship."
              />

              <YogaCard
                title="Panch Mahapurusha Yogas"
                summary="These important Yogas involve Mars, Mercury, Jupiter, Venus or Saturn occupying a Kendra in its own sign or sign of exaltation. The five forms are Ruchaka, Bhadra, Hamsa, Malavya and Shasha."
                caution="The planetary condition and wider horoscope determine how prominently the qualities of the Yoga appear."
              />

              <YogaCard
                title="Gaja Kesari Yoga"
                summary="Gaja Kesari Yoga is traditionally associated with the relationship of Jupiter and the Moon when Jupiter occupies a Kendra from the Moon. It is often connected with learning, judgement, reputation and support."
                caution="Simply finding Jupiter four, seven or ten houses away from the Moon is not enough to declare exceptional results. Strength and modification matter."
              />

              <YogaCard
                title="Neecha Bhanga Raja Yoga"
                summary="Neecha Bhanga principles examine circumstances in which the debilitation of a planet may be cancelled or substantially modified. Under particular conditions, a difficult planetary state can operate very differently from a simple debilitated reading."
                caution="Cancellation of debilitation does not automatically mean the planet becomes equivalent to a perfectly exalted planet. Classical conditions and overall strength must be judged carefully."
              />

              <YogaCard
                title="Viparita Raja Yogas"
                summary="Viparita Raja Yoga principles involve particular relationships among Dusthana lords and houses, traditionally associated with improvement, advantage or reversal arising through challenging circumstances."
                caution="These Yogas should not be reduced to the slogan that difficult houses always produce success. Exact formation and planetary context are essential."
              />

              <YogaCard
                title="Exchange or Parivartana"
                summary="When two planets occupy one another's signs, they form an exchange relationship. This strongly connects the houses ruled and occupied by those planets."
                caution="An exchange does not automatically become beneficial. The houses being exchanged and the condition of both lords determine the story."
              />
            </div>
          </Section>

          {/* PANCH MAHAPURUSHA */}
          <Section
            eyebrow="A CLOSER LOOK"
            title="The five Panch Mahapurusha Yogas"
          >
            <p>
              Panch Mahapurusha means the five great-person combinations. They
              are formed through one of five visible planets when the required
              dignity and angular placement conditions are met.
            </p>

            <div
              style={{
                overflowX: "auto",
                marginTop: 28,
                border: "1px solid #e8d7c8",
                borderRadius: 18,
                background: "#fff",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 660,
                  fontSize: 15.5,
                }}
              >
                <thead>
                  <tr style={{ background: "#fff4e9" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 16,
                        borderBottom: "1px solid #e8d7c8",
                      }}
                    >
                      Yoga
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 16,
                        borderBottom: "1px solid #e8d7c8",
                      }}
                    >
                      Planet
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 16,
                        borderBottom: "1px solid #e8d7c8",
                      }}
                    >
                      Traditional association
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["Ruchaka", "Mars", "Courage, initiative, command"],
                    ["Bhadra", "Mercury", "Intellect, communication, skill"],
                    ["Hamsa", "Jupiter", "Wisdom, counsel, ethics, learning"],
                    ["Malavya", "Venus", "Comfort, refinement, relationships"],
                    ["Shasha", "Saturn", "Authority, endurance, organisation"],
                  ].map(([yoga, planet, meaning]) => (
                    <tr key={yoga}>
                      <td
                        style={{
                          padding: 16,
                          borderBottom: "1px solid #f0e5da",
                          color: "#4b2942",
                          fontWeight: 700,
                        }}
                      >
                        {yoga}
                      </td>
                      <td
                        style={{
                          padding: 16,
                          borderBottom: "1px solid #f0e5da",
                          color: "#655168",
                        }}
                      >
                        {planet}
                      </td>
                      <td
                        style={{
                          padding: 16,
                          borderBottom: "1px solid #f0e5da",
                          color: "#655168",
                        }}
                      >
                        {meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: 24 }}>
              These descriptions are themes, not ready-made predictions. A
              strong Mars does not create the same profession or life
              circumstances in every horoscope, just as a strong Saturn does
              not produce one universal result.
            </p>

            <p>
              The Yoga must still be integrated with the houses the planet
              rules, where it is placed and what the rest of the chart is
              saying.
            </p>
          </Section>

          {/* WORKED EXAMPLE */}
          <Section
            eyebrow="WORKED EXAMPLE"
            title="Why identifying the Yoga is only the beginning"
          >
            <p>
              Consider a hypothetical horoscope in which the 9th lord and 10th
              lord form a strong relationship.
            </p>

            <p>
              Someone may immediately label it a powerful
              Dharma-Karmadhipati-type connection and predict professional
              success.
            </p>

            <p>A systematic reading goes further.</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
                marginTop: 26,
              }}
            >
              {[
                [
                  "1. Confirm the relationship",
                  "Are the 9th and 10th lords actually conjunct, mutually aspecting, exchanging signs or otherwise forming the relevant relationship?",
                ],
                [
                  "2. Judge the planets",
                  "What are their dignity, strength and functional roles for this Lagna?",
                ],
                [
                  "3. Examine placement",
                  "Which houses contain them? Their placement may change where and how the combination operates.",
                ],
                [
                  "4. Study additional influence",
                  "Are other planets aspecting or joining them? Do those influences support or complicate the pattern?",
                ],
                [
                  "5. Examine D10",
                  "If the question concerns profession, does the Dashamsha support the career promise seen in D1?",
                ],
                [
                  "6. Check the Dasha",
                  "Are one or both participating planets active through Mahadasha, Antardasha or another relevant timing layer?",
                ],
                [
                  "7. Add transit activation",
                  "Do current transits activate the relevant planets, houses or lords during the period under consideration?",
                ],
              ].map(([title, description]) => (
                <div
                  key={title}
                  style={{
                    padding: "19px 22px",
                    borderRadius: 15,
                    border: "1px solid #eadbce",
                    background: "rgba(255,255,255,.7)",
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

            <div
              style={{
                ...highlightStyle,
                marginTop: 30,
              }}
            >
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
          </Section>

          {/* DASHA */}
          <Section
            eyebrow="TIMING"
            title="When does a Yoga actually become noticeable?"
          >
            <p>
              A natal Yoga exists as part of the birth chart, but its themes may
              become more visible during planetary periods connected with the
              planets forming it.
            </p>

            <p>
              Suppose Jupiter and Venus form an important combination. A period
              involving Jupiter, Venus or a strongly connected planet may bring
              the underlying promise into greater focus.
            </p>

            <p>
              This does not mean that every Dasha of a Yoga-forming planet must
              produce the textbook result.
            </p>

            <p>
              The same planet may simultaneously rule several houses, occupy
              another house, receive aspects and carry different responsibilities
              in divisional charts.
            </p>

            <p>Timing therefore follows the hierarchy already taught in the Foundations:</p>

            <div
              style={{
                marginTop: 26,
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
              <strong>Yoga strength</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Relevant Varga</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Dasha activation</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Transit support</strong>
              <span style={{ opacity: 0.6 }}> → </span>
              <strong>Manifestation</strong>
            </div>
          </Section>

          {/* MODIFICATION */}
          <Section
            eyebrow="CONTEXT MATTERS"
            title="Yogas can be strengthened, weakened or modified"
          >
            <p>
              Astrology rarely operates through a single isolated condition.
            </p>

            <p>
              A Yoga-forming planet may simultaneously receive support from
              another benefic influence, suffer affliction, become involved
              with Dusthana houses, gain strength through dignity or be
              reinforced by repetition elsewhere in the chart.
            </p>

            <p>
              Therefore it is often more useful to think in terms of
              <strong> modification</strong> rather than a binary
              present-versus-absent approach.
            </p>

            <p>
              The question becomes:
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 24,
              }}
            >
              <strong
                style={{
                  fontSize: 22,
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                What is the final condition of this combination after the rest
                of the horoscope has interacted with it?
              </strong>
            </div>
          </Section>

          {/* MISTAKES */}
          <Section
            eyebrow="COMMON MISTAKES"
            title="How Yogas are often misread"
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
                  title: "Searching the chart for impressive names",
                  text: "A horoscope should not become a treasure hunt for Raja Yogas. Begin with the life question and the chart structure.",
                },
                {
                  title: "Assuming presence equals result",
                  text: "The existence of a combination does not reveal its strength, timing or final expression.",
                },
                {
                  title: "Ignoring the Lagna",
                  text: "Functional lordship changes with the Ascendant. The planets involved must be interpreted through their actual roles in that horoscope.",
                },
                {
                  title: "Ignoring planetary strength",
                  text: "A technically formed combination can operate very differently depending on the condition of its participating planets.",
                },
                {
                  title: "Treating every Raja Yoga as fame",
                  text: "Elevation is relative to the person's context. Responsibility, professional progress, authority or recognition can manifest at many scales.",
                },
                {
                  title: "Treating Dhana Yoga as guaranteed riches",
                  text: "Wealth requires a broader assessment of income, accumulation, profession, gains, expenditure and timing.",
                },
                {
                  title: "Ignoring Dasha",
                  text: "A powerful natal combination may remain background potential until relevant planetary periods activate it.",
                },
                {
                  title: "Counting the same evidence repeatedly",
                  text: "One planetary relationship described under several different Yoga names does not automatically become several independent confirmations.",
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

          {/* REPEATED EVIDENCE */}
          <Section
            eyebrow="PREDICTIVE DISCIPLINE"
            title="Do not count the same Yoga several times"
          >
            <p>
              A single planetary relationship can sometimes satisfy more than
              one named rule.
            </p>

            <p>
              That does not necessarily mean you have discovered several
              independent promises.
            </p>

            <p>
              This distinction matters because prediction becomes stronger when
              <strong> independent astrological factors</strong> point toward
              the same theme.
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
                  lineHeight: 1.6,
                  color: "#542b43",
                }}
              >
                One indication creates a possibility. Repeated independent
                indications create confidence.
              </strong>
            </div>
          </Section>

          {/* PRACTICAL METHOD */}
          <Section
            eyebrow="PRACTICAL METHOD"
            title="A 9-step checklist for reading any Yoga"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              {[
                "Identify the exact classical or traditional rule.",
                "Confirm that the horoscope genuinely fulfils the rule.",
                "Identify the participating planets and their functional lordships.",
                "Examine the houses and Rashis in which the combination operates.",
                "Judge dignity, strength and other important planetary conditions.",
                "Study aspects, conjunctions and wider Sambandha.",
                "Check whether the relevant divisional chart reinforces the theme.",
                "Determine whether the participating planets are activated by Dasha.",
                "Only then use transits to refine when the combination may become more visible.",
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

          {/* FRAMEWORK */}
          <Section
            eyebrow="PUTTING IT TOGETHER"
            title="Where Yogas fit into the complete Sārathi framework"
          >
            <p>
              Yogas are important, but they form only one layer of chart
              interpretation.
            </p>

            <div
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              {[
                ["Graha", "Who"],
                ["Bhava", "Where in life"],
                ["Rashi", "How"],
                ["Lagna", "Assigns roles"],
                ["Lordship", "What is connected"],
                ["Strength", "Capacity"],
                ["Aspects", "Influence"],
                ["Sambandha", "Relationship"],
                ["Nakshatra", "Finer expression"],
                ["Yoga", "Meaningful combination"],
                ["Varga", "Specialised refinement"],
                ["Dasha", "Activation"],
                ["Transit", "Moving timing environment"],
                ["Convergence", "Strength of prediction"],
              ].map(([term, meaning]) => (
                <div
                  key={term}
                  style={{
                    padding: "17px 18px",
                    border: "1px solid #eadbcd",
                    borderRadius: 14,
                    background: "rgba(255,255,255,.72)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#4b2942",
                      marginBottom: 4,
                    }}
                  >
                    {term}
                  </strong>

                  <span
                    style={{
                      color: "#766275",
                      fontSize: 14.5,
                    }}
                  >
                    {meaning}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* SUMMARY */}
          <Section eyebrow="KEY TAKEAWAY" title="What should you remember?">
            <p>
              Yogas are one of the most fascinating parts of Vedic astrology,
              but they are also among the easiest concepts to oversimplify.
            </p>

            <p>
              Learning the name of a Yoga is useful. Learning why it works,
              what modifies it, how strong it is and when it becomes active is
              far more important.
            </p>

            <div
              style={{
                ...highlightStyle,
                marginTop: 28,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  lineHeight: 1.75,
                  color: "#4e2942",
                }}
              >
                <strong>
                  Yoga formation → functional lordship → planetary strength →
                  chart context → Varga support → Dasha activation → transit
                  timing → final synthesis.
                </strong>
              </div>
            </div>

            <p style={{ marginTop: 28 }}>
              Do not memorise a Yoga as a prediction.
            </p>

            <p>
              Understand it as one piece of evidence within a much larger
              astrological sentence.
            </p>

            <div
              style={{
                marginTop: 30,
                borderLeft: "4px solid #aa6049",
                padding: "5px 0 5px 22px",
                fontSize: 23,
                lineHeight: 1.6,
                color: "#4d2942",
              }}
            >
              <strong>
                The planet gives us the vocabulary. The chart gives us the
                sentence.
              </strong>
            </div>
          </Section>

          {/* CONTINUE */}
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
              Build on the concept
            </h2>

            <p style={bodyStyle}>
              If some of the terms used on this page are still new, revisit
              the relevant Foundation lessons before trying to judge Yogas in a
              complete horoscope.
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
                href="/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology"
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
                Planetary Strength →
              </Link>

              <Link
                href="/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology"
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
                Aspects & Sambandha →
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
              Learn the rule. Then learn how to judge it.
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
              Sārathi approaches Vedic astrology through structured chart
              interpretation, planetary timing and convergence rather than
              isolated combinations or fear-based conclusions.
            </p>

            <div style={{ marginTop: 26 }}>
              <Link
                href="/sarathi/learn"
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
                Explore the Knowledge Centre →
              </Link>
            </div>
          </section>

          {/* DISCLAIMER */}
          <footer
            style={{
              padding: "0 0 70px",
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "#8d7a89",
            }}
          >
            Educational note: This page explains traditional Jyotish concepts
            for learning and interpretation. Classical texts and astrological
            traditions can differ in their definitions and application of
            specific Yogas. A complete horoscope should be judged as a whole
            rather than through a single combination.
          </footer>
        </article>
      </div>
    </main>
  );
}