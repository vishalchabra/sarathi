export function buildPropertyFacts(report: any) {
  const facts: string[] = [];

  const dasha = report?.activePeriods || {};
  const md = String(dasha?.mahadasha?.lord || "");
  const ad = String(dasha?.antardasha?.subLord || "");
  const pd = String(dasha?.pratyantardasha?.lord || "");

  const dashaText = `${md} ${ad} ${pd}`.toLowerCase();

  const topTransits = Array.isArray(report?.topTransits) ? report.topTransits : [];
  const timeline = Array.isArray(report?.timeline) ? report.timeline : [];

  // --- dasha signals ---
  if (/venus|moon/.test(dashaText)) {
    facts.push("Dasha supports home, comfort, settlement, or property themes");
  }

 if (/rahu/.test(dashaText)) {
  facts.push("Dasha can create restlessness around home, place, or living setup, pushing change rather than passivity.");
}

  if (/mars|saturn|mercury/.test(dashaText)) {
    facts.push("Dasha supports execution, paperwork, structured action, or decision pressure");
  }

  if (/jupiter|venus/.test(dashaText)) {
  facts.push("Dasha supports property progress, comfort, settlement, or formal movement in home matters");
}

  // --- transit signals ---
  for (const tr of topTransits) {
    const txt = `${tr.title || ""} ${tr.description || ""} ${tr.category || ""}`.toLowerCase();

    if (
      txt.includes("property") ||
      txt.includes("home") ||
      txt.includes("settlement") ||
      txt.includes("living situation")
    ) {
      facts.push("Transit activating property or home themes");
    }

    if (
      txt.includes("relocation") ||
      txt.includes("movement") ||
      txt.includes("foreign") ||
      txt.includes("change of place")
    ) {
      facts.push("Transit indicates relocation or movement");
    }

    if (
      txt.includes("documents") ||
      txt.includes("paperwork") ||
      txt.includes("finance") ||
      txt.includes("loan") ||
      txt.includes("negotiation")
    ) {
      facts.push("Transit supports execution through documents, finance, or negotiation");
    }

    if (
      txt.includes("closure") ||
      txt.includes("finalize") ||
      txt.includes("ownership") ||
      txt.includes("registration")
    ) {
      facts.push("Transit supports closure or formal completion");
    }
  }

  // --- timeline signals ---
  for (const w of timeline) {
    const txt = `${w.label || ""} ${w.blurb || ""} ${(w.highlights || []).join(" ")}`.toLowerCase();

    if (
      txt.includes("property") ||
      txt.includes("house") ||
      txt.includes("home") ||
      txt.includes("real estate")
    ) {
      facts.push("Timeline supports property themes");
    }

    if (
      txt.includes("move") ||
      txt.includes("relocation") ||
      txt.includes("foreign") ||
      txt.includes("change of place")
    ) {
      facts.push("Timeline supports relocation themes");
    }
  }

  return Array.from(new Set(facts));
}