import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    color: "#1f2937",
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  cover: {
    padding: 36,
    justifyContent: "center",
  },
  brand: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5b3f8c",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5b3f8c",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 8,
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
  },
  muted: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
  },
  box: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  bullet: {
    marginBottom: 4,
  },
  pageBreak: {
    marginTop: 20,
  },
});

function safeText(value: any, fallback = "Not available"): string {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map((v) => safeText(v, "")).filter(Boolean).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
function uniqueItems<T>(items?: T[]): T[] {
  if (!Array.isArray(items)) return [];
  return [...new Map(items.map(i => [JSON.stringify(i), i])).values()];
}
function lineText(item: any): string {
  if (!item) return "";

  if (typeof item === "string") return item;

  if (typeof item === "object") {
    const parts = [
      item.driver,
      item.meaning,
      item.howItShowsUp,
      item.label,
      item.text,
      item.summary,
      item.headline,
    ].filter(Boolean);

    return parts.join(" — ");
  }

  return String(item);
}

function Lines({ items }: { items?: any[] }) {
  if (!Array.isArray(items) || !items.length) return null;

  const seen = new Set<string>();

  return (
    <View>
      {items.map((item, index) => {
        const text = lineText(item).trim();
        if (!text) return null;

        const key = text.toLowerCase().replace(/\s+/g, " ");
        if (seen.has(key)) return null;
        seen.add(key);

        return (
          <Text key={index} style={styles.bullet}>
            • {text}
          </Text>
        );
      })}
    </View>
  );
}

export default function LifeReportPdf({
  report,
  profileName,
  dashaTimeline,
  monthlyInsights,
  weeklyInsights,
  dailyHighlights,
  transits,
  jobPrediction,
}: {
  report: any;
  profileName?: string;
  dashaTimeline?: any[] | null;
  monthlyInsights?: any[];
  weeklyInsights?: any[];
  dailyHighlights?: any[];
  transits?: any[];
  jobPrediction?: any;
  ascSign?: string;
moonSign?: string;
sunSign?: string;
}) {
  const name = profileName || report?.name || report?.chartName || "Sarathi User";
  const birthPlace =
  report?.placeName ||
  report?.birth?.placeName ||
  report?.birth?.place?.name ||
  "";
const overviewAsc =
  report?.ascSign ||
  report?.ascendant?.ascSign ||
  report?.raw?.ascSign ||
  "";

const overviewMoon =
  report?.moonSign ||
  report?.ascendant?.moonSign ||
  report?.raw?.moonSign ||
  "";

const overviewSun =
  report?.sunSign ||
  report?.raw?.sunSign ||
  "";

const overviewMoonNak =
  report?.moonNakshatraName ||
  report?.ascendant?.moonNakshatraName ||
  report?.panchang?.moonNakshatraName ||
  report?.raw?.moonNakshatraName ||
  "";
  const sunPlanet = Array.isArray(report?.planets)
  ? report.planets.find((p: any) => String(p?.name).toLowerCase() === "sun")
  : null;

const moonPlanet = Array.isArray(report?.planets)
  ? report.planets.find((p: any) => String(p?.name).toLowerCase() === "moon")
  : null;

const overviewSunFinal = overviewSun || sunPlanet?.sign || "";
const overviewMoonFinal = overviewMoon || moonPlanet?.sign || "";
  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.cover]}>
        <Text style={styles.brand}>Sarathi</Text>
        <Text style={styles.title}>Life Report</Text>

        <View style={styles.box}>
          <Text style={styles.text}>Prepared for: {safeText(name)}</Text>
          <Text style={styles.text}>Date of birth: {safeText(report?.birthDateISO)}</Text>
          <Text style={styles.text}>Time of birth: {safeText(report?.birthTime)}</Text>
          <Text style={styles.text}>Time zone: {safeText(report?.birthTz)}</Text>
          <Text style={styles.text}>
  Place of birth: {safeText(birthPlace)}
</Text>

<Text style={styles.muted}>
  Coordinates: {safeText(report?.birthLat)}, {safeText(report?.birthLon)}
</Text>
        </View>

        <Text style={styles.muted}>
          Generated by Sarathi. This report is for reflective and guidance purposes.
        </Text>
      </Page>

     <Page size="A4" style={styles.page}>
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Overview</Text>

    <View style={styles.box}>
      <Text style={styles.text}>Ascendant: {safeText(overviewAsc)}</Text>
      <Text style={styles.text}>Moon Sign: {safeText(overviewMoonFinal)}</Text>
      <Text style={styles.text}>Sun Sign: {safeText(overviewSunFinal)}</Text>
      <Text style={styles.text}>Moon Nakshatra: {safeText(overviewMoonNak)}</Text>
    </View>
  </View>

  {Array.isArray(report?.overviewSummary) && report.overviewSummary.length ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Life Overview Summary</Text>
      <Lines items={report.overviewSummary} />
    </View>
  ) : null}

  {report?.coreLifePattern ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Core Life Pattern</Text>
      <View style={styles.box}>
        <Text style={styles.subTitle}>
          {safeText(report.coreLifePattern.title)}
        </Text>
        <Text style={styles.text}>
          {safeText(report.coreLifePattern.text)}
        </Text>
      </View>
    </View>
  ) : null}

  {report?.naturalStrength ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Natural Strength</Text>
      <Text style={styles.text}>{safeText(report.naturalStrength)}</Text>
    </View>
  ) : null}

  {report?.hiddenPattern ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hidden Pattern</Text>
      <Text style={styles.text}>{safeText(report.hiddenPattern)}</Text>
    </View>
  ) : null}

  {report?.lifePressureZone ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Life Pressure Zone</Text>
      <Text style={styles.text}>{safeText(report.lifePressureZone)}</Text>
    </View>
  ) : null}

  {Array.isArray(report?.planets) && report.planets.length ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Planetary Placements</Text>

      <View style={styles.box}>
        {report.planets.map((p: any, i: number) => (
          <View key={i} style={{ marginBottom: 6 }}>
            <Text style={styles.subTitle}>{safeText(p.name)}</Text>
            <Text style={styles.text}>
              {safeText(p.sign, "")}
              {p.house ? ` - House ${p.house}` : ""}
              {p.nakshatra ? ` - ${p.nakshatra}` : ""}
            </Text>
            {p.note ? (
              <Text style={styles.muted}>{safeText(p.note)}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  ) : null}
<Text
  fixed
  style={{
    position: "absolute",
    bottom: 18,
    right: 36,
    fontSize: 8,
    color: "#6b7280",
  }}
  render={({ pageNumber, totalPages }) =>
    `Page ${pageNumber} of ${totalPages}`
  }
/>
</Page>

      <Page size="A4" style={styles.page}>
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Life Phases</Text>

    {report?.activePeriods ? (
      <View style={styles.box}>
        <Text style={styles.subTitle}>Current Active Periods</Text>

        {report.activePeriods.mahadasha ? (
          <Text style={styles.text}>
            Mahadasha: {safeText(report.activePeriods.mahadasha.lord)} —{" "}
            {safeText(report.activePeriods.mahadasha.start)} to{" "}
            {safeText(report.activePeriods.mahadasha.end)}
          </Text>
        ) : null}

        {report.activePeriods.antardasha ? (
          <Text style={styles.text}>
            Antardasha: {safeText(report.activePeriods.antardasha.subLord)} —{" "}
            {safeText(report.activePeriods.antardasha.start)} to{" "}
            {safeText(report.activePeriods.antardasha.end)}
          </Text>
        ) : null}

        {report.activePeriods.pratyantardasha ? (
          <Text style={styles.text}>
            Pratyantardasha: {safeText(report.activePeriods.pratyantardasha.lord)} —{" "}
            {safeText(report.activePeriods.pratyantardasha.start)} to{" "}
            {safeText(report.activePeriods.pratyantardasha.end)}
          </Text>
        ) : null}
      </View>
    ) : null}

    {Array.isArray(report?.lifeMilestones) && report.lifeMilestones.length ? (
        report.lifeMilestones
    .filter((m: any) => {
      const startYear = Number(String(m.periodStart || "").slice(0, 4));
      return !Number.isFinite(startYear) || startYear <= 2065;
    })
    .map((m: any, i: number) => (
        <View key={i} style={styles.box}>
          <Text style={styles.subTitle}>{safeText(m.label)}</Text>
          <Text style={styles.muted}>
            {safeText(m.periodStart)} to {safeText(m.periodEnd)}
          </Text>
          <Text style={styles.text}>{safeText(m.drivers)}</Text>
          <Lines items={m.themes} />
        </View>
      ))
    ) : (
      <Text style={styles.text}>Life phase details were not available in this report.</Text>
    )}
  </View>

  {Array.isArray(dashaTimeline) && dashaTimeline.length ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dasha Timeline Snapshot</Text>

      {dashaTimeline
        .filter((d: any) => {
          const label = String(d?.label || d?.lord || d?.planet || "").toLowerCase();
          const start = String(d?.startISO || d?.start || "");
          const end = String(d?.endISO || d?.end || "");

          // Keep only major periods if the data has level/type
          const level = String(d?.level || d?.type || "").toLowerCase();
          if (level && !["md", "mahadasha", "major"].includes(level)) return false;

          // Avoid absurd far-future rows
          const year = Number(start.slice(0, 4));
          if (Number.isFinite(year) && year > 2070) return false;

          return !!label || !!start || !!end;
        })
        .slice(0, 12)
        .map((d: any, i: number) => (
          <Text key={i} style={styles.text}>
            {safeText(d.label || d.lord || d.planet)}{" "}
            {safeText(d.startISO || d.start)} - {safeText(d.endISO || d.end)}
          </Text>
        ))}
    </View>
  ) : null}
  <Text
  fixed
  style={{
    position: "absolute",
    bottom: 18,
    right: 36,
    fontSize: 8,
    color: "#6b7280",
  }}
  render={({ pageNumber, totalPages }) =>
    `Page ${pageNumber} of ${totalPages}`
  }
/>
</Page>

      <Page size="A4" style={styles.page}>
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Now & Near Future</Text>

    {report?.nowNearFuture?.headline || report?.nowPlan?.headline ? (
      <View style={styles.box}>
        <Text style={styles.subTitle}>Current Headline</Text>
        <Text style={styles.text}>
          {safeText(report?.nowNearFuture?.headline || report?.nowPlan?.headline)}
        </Text>
      </View>
    ) : null}

    {Array.isArray(report?.nowNearFuture?.astroDrivers) &&
    report.nowNearFuture.astroDrivers.length ? (
      <View style={styles.box}>
        <Text style={styles.subTitle}>Why This Is Active</Text>
        <Lines items={report.nowNearFuture.astroDrivers} />
      </View>
    ) : null}
  </View>

  {Array.isArray(monthlyInsights) && monthlyInsights.length ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Monthly Insights</Text>
      {monthlyInsights.map((m: any, i: number) => (
        <View key={i} style={styles.box}>
          <Text style={styles.subTitle}>{safeText(m.label)}</Text>
          <Text style={styles.text}>{safeText(m.text)}</Text>
        </View>
      ))}
    </View>
  ) : null}
  <Text
  fixed
  style={{
    position: "absolute",
    bottom: 18,
    right: 36,
    fontSize: 8,
    color: "#6b7280",
  }}
  render={({ pageNumber, totalPages }) =>
    `Page ${pageNumber} of ${totalPages}`
  }
/>
</Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Full Guidance</Text>

  {report?.fullGuidanceV2 ? (
    <View>
      {report.fullGuidanceV2?.realityCheck ? (
        <View style={styles.box}>
          <Text style={styles.subTitle}>Current Phase</Text>
          <Text style={styles.text}>
            {safeText(report.fullGuidanceV2.realityCheck.currentPhase)}
          </Text>
          <Text style={styles.text}>
            {safeText(report.fullGuidanceV2.realityCheck.mainTheme)}
          </Text>
          <Text style={styles.text}>
            Win move: {safeText(report.fullGuidanceV2.realityCheck.winMove)}
          </Text>
          <Text style={styles.text}>
            Drain to cut: {safeText(report.fullGuidanceV2.realityCheck.drainToCut)}
          </Text>
        </View>
      ) : null}

      {Array.isArray(report.fullGuidanceV2?.domains)
        ? report.fullGuidanceV2.domains.map((d: any, i: number) => (
            <View key={`domain-${i}`} style={styles.box}>
              <Text style={styles.subTitle}>
                {safeText(d.domain)} — Score {safeText(d.score)} ({safeText(d.confidence)})
              </Text>
              <Text style={styles.text}>{safeText(d.headline)}</Text>
              <Lines items={d.whyTop2} />
              <Text style={styles.text}>
                Lever: {safeText(d.scoreBreakdown?.lever)}
              </Text>
              <Lines items={d.scoreBreakdown?.risks} />
            </View>
          ))
        : null}

      {Array.isArray(report.fullGuidanceV2?.next14d) &&
      report.fullGuidanceV2.next14d.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next 14 Days</Text>
          {report.fullGuidanceV2.next14d.map((w: any, i: number) => (
            <View key={`next14-${i}`} style={styles.box}>
              <Text style={styles.subTitle}>
                {safeText(w.domain)} — {safeText(w.fromISO)} to {safeText(w.toISO)}
              </Text>
              <Text style={styles.text}>{safeText(w.headline)}</Text>
              <Lines items={w.why} />
              <Lines items={w.mostLikelySign} />
              <Text style={styles.subTitle}>Do</Text>
              <Lines items={w.do} />
              <Text style={styles.subTitle}>Avoid</Text>
              <Lines items={w.avoid} />
              <Text style={styles.text}>
                Outcome if done: {safeText(w.outcomeIfDone)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {Array.isArray(report.fullGuidanceV2?.next30d) &&
      report.fullGuidanceV2.next30d.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next 30 Days</Text>
          {report.fullGuidanceV2.next30d.map((w: any, i: number) => (
            <View key={`next30-${i}`} style={styles.box}>
              <Text style={styles.subTitle}>
                {safeText(w.domain)} — {safeText(w.fromISO)} to {safeText(w.toISO)}
              </Text>
              <Text style={styles.text}>{safeText(w.headline)}</Text>
              <Lines items={w.why} />
              <Lines items={w.mostLikelySign} />
              <Text style={styles.subTitle}>Do</Text>
              <Lines items={w.do} />
              <Text style={styles.subTitle}>Avoid</Text>
              <Lines items={w.avoid} />
              <Text style={styles.text}>
                Outcome if done: {safeText(w.outcomeIfDone)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {Array.isArray(report.fullGuidanceV2?.next60d) &&
      report.fullGuidanceV2.next60d.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next 60 Days</Text>
          {report.fullGuidanceV2.next60d.map((w: any, i: number) => (
            <View key={`next60-${i}`} style={styles.box}>
              <Text style={styles.subTitle}>
                {safeText(w.domain)} — {safeText(w.fromISO)} to {safeText(w.toISO)}
              </Text>
              <Text style={styles.text}>{safeText(w.headline)}</Text>
              <Lines items={w.why} />
              <Lines items={w.mostLikelySign} />
              <Text style={styles.subTitle}>Do</Text>
              <Lines items={w.do} />
              <Text style={styles.subTitle}>Avoid</Text>
              <Lines items={w.avoid} />
              <Text style={styles.text}>
                Outcome if done: {safeText(w.outcomeIfDone)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {Array.isArray(report.fullGuidanceV2?.next90d) &&
      report.fullGuidanceV2.next90d.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next 90 Days</Text>
          {report.fullGuidanceV2.next90d.map((w: any, i: number) => (
            <View key={`next90-${i}`} style={styles.box}>
              <Text style={styles.subTitle}>
                {safeText(w.domain)} — {safeText(w.fromISO)} to {safeText(w.toISO)}
              </Text>
              <Text style={styles.text}>{safeText(w.headline)}</Text>
              <Lines items={w.why} />
              <Lines items={w.mostLikelySign} />
              <Text style={styles.subTitle}>Do</Text>
              <Lines items={w.do} />
              <Text style={styles.subTitle}>Avoid</Text>
              <Lines items={w.avoid} />
              <Text style={styles.text}>
                Outcome if done: {safeText(w.outcomeIfDone)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {report.fullGuidanceV2?.currentLife ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Life Pattern</Text>
          <View style={styles.box}>
            <Text style={styles.subTitle}>
              {safeText(report.fullGuidanceV2.currentLife.title)}
            </Text>
            <Text style={styles.text}>
              {safeText(report.fullGuidanceV2.currentLife.overview)}
            </Text>
            <Text style={styles.text}>
              {safeText(report.fullGuidanceV2.currentLife.lifeSummary)}
            </Text>
            <Text style={styles.text}>
              Mind state: {safeText(report.fullGuidanceV2.currentLife.mindState)}
            </Text>
            <Text style={styles.text}>
              Phase truth: {safeText(report.fullGuidanceV2.currentLife.phaseTruth)}
            </Text>
            <Text style={styles.text}>
              One decision: {safeText(report.fullGuidanceV2.currentLife.oneDecision)}
            </Text>
            <Text style={styles.text}>
              Biggest mistake: {safeText(report.fullGuidanceV2.currentLife.biggestMistake)}
            </Text>
          </View>

          {Array.isArray(report.fullGuidanceV2.currentLife.areas)
            ? report.fullGuidanceV2.currentLife.areas.map((a: any, i: number) => (
                <View key={`area-${i}`} style={styles.box}>
                  <Text style={styles.subTitle}>{safeText(a.domain)}</Text>
                  <Text style={styles.text}>{safeText(a.what)}</Text>
                  <Text style={styles.text}>How it feels: {safeText(a.feel)}</Text>
                  <Lines items={a.events} />
                  <Text style={styles.text}>Lever: {safeText(a.lever)}</Text>
                </View>
              ))
            : null}
        </View>
      ) : null}

      {report.fullGuidanceV2?.strategicFocus ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategic Focus</Text>
          <View style={styles.box}>
            <Text style={styles.subTitle}>
              {safeText(report.fullGuidanceV2.strategicFocus.title)}
            </Text>
            <Text style={styles.text}>
              {safeText(report.fullGuidanceV2.strategicFocus.text)}
            </Text>
            <Lines items={report.fullGuidanceV2.strategicFocus.bullets} />
          </View>
        </View>
      ) : null}

      {report.fullGuidanceV2?.remedies ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remedies</Text>

          <View style={styles.box}>
            <Text style={styles.subTitle}>Immediate</Text>
            <Lines items={uniqueItems(report.fullGuidanceV2.remedies.immediate)} />

            <Text style={styles.subTitle}>30-Day Stabilizer</Text>
            <Lines items={report.fullGuidanceV2.remedies.stabilizer30d} />

            <Text style={styles.subTitle}>Spiritual</Text>
            <Lines items={report.fullGuidanceV2.remedies.spiritual} />

            <Text style={styles.subTitle}>Avoid</Text>
            <Lines items={report.fullGuidanceV2.remedies.avoid} />
          </View>
        </View>
      ) : null}

      {Array.isArray(report.fullGuidanceV2?.weeklyPlaybook) &&
      report.fullGuidanceV2.weeklyPlaybook.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Playbook</Text>
          {report.fullGuidanceV2.weeklyPlaybook.map((w: any, i: number) => (
            <View key={`weekly-${i}`} style={styles.box}>
              <Text style={styles.subTitle}>
                Week {safeText(w.week)} — {safeText(w.range)}
              </Text>
              <Text style={styles.text}>{safeText(w.domain)}</Text>
              <Text style={styles.text}>{safeText(w.headline)}</Text>
              <Text style={styles.text}>Focus: {safeText(w.focus)}</Text>
              <Text style={styles.text}>Action: {safeText(w.action)}</Text>
              <Text style={styles.text}>Avoid: {safeText(w.avoid)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {report.fullGuidanceV2?.advisorMemo ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advisor Memo</Text>
          <View style={styles.box}>
            <Text style={styles.subTitle}>Opportunities</Text>
            <Lines items={report.fullGuidanceV2.advisorMemo.opportunity} />

            <Text style={styles.subTitle}>Risks</Text>
            <Lines items={report.fullGuidanceV2.advisorMemo.risks} />

            <Text style={styles.subTitle}>Control Levers</Text>
            <Lines items={report.fullGuidanceV2.advisorMemo.controlLevers} />

            <Text style={styles.subTitle}>Non-Negotiables</Text>
            <Lines items={report.fullGuidanceV2.advisorMemo.nonNegotiables} />
          </View>
        </View>
      ) : null}
    </View>
  ) : report?.fullPlan ? (
    <Text style={styles.text}>{safeText(report.fullPlan)}</Text>
  ) : report?.plan ? (
    <Text style={styles.text}>{safeText(report.plan)}</Text>
  ) : (
    <Text style={styles.text}>Full guidance was not available in this report.</Text>
  )}
</View>
        {Array.isArray(weeklyInsights) && weeklyInsights.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Insights</Text>
            {weeklyInsights.map((w: any, i: number) => (
              <View key={i} style={styles.box}>
                <Text style={styles.subTitle}>{safeText(w.label)}</Text>
                <Text style={styles.text}>{safeText(w.text)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {Array.isArray(dailyHighlights) && dailyHighlights.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Highlights</Text>
            {dailyHighlights.slice(0, 10).map((d: any, i: number) => (
              <Text key={i} style={styles.text}>
                {safeText(d.dateISO || d.label)} - {safeText(d.text || d.summary)}
              </Text>
            ))}
          </View>
        ) : null}
        <Text
  fixed
  style={{
    position: "absolute",
    bottom: 18,
    right: 36,
    fontSize: 8,
    color: "#6b7280",
  }}
  render={({ pageNumber, totalPages }) =>
    `Page ${pageNumber} of ${totalPages}`
  }
/>
      </Page>
    </Document>
  );
}